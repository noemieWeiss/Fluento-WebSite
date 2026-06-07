import pool from '../config/db.js'

// ─── XP ───────────────────────────────────────────────────────────────────────

export const giveXP = async (req, res) => {
  try {
    const adminId = req.user.id
    const { user_id, amount, reason } = req.body
    if (!user_id || !amount || !reason)
      return res.status(400).json({ message: 'user_id, amount and reason required' })

    await pool.query('UPDATE users SET xp = xp + ? WHERE id = ?', [amount, user_id])
    await pool.query(
      'INSERT INTO xp_transactions (user_id, amount, reason, given_by) VALUES (?,?,?,?)',
      [user_id, amount, reason, adminId]
    )
    const [[user]] = await pool.query('SELECT xp FROM users WHERE id = ?', [user_id])
    res.json({ message: 'XP updated', newXP: user.xp })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const getXPHistory = async (req, res) => {
  try {
    const { userId } = req.params
    const [rows] = await pool.query(`
      SELECT xt.*, u.name AS given_by_name
      FROM xp_transactions xt
      JOIN users u ON u.id = xt.given_by
      WHERE xt.user_id = ?
      ORDER BY xt.created_at DESC
      LIMIT 50
    `, [userId])
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const resetStreak = async (req, res) => {
  try {
    const { userId } = req.params
    await pool.query('UPDATE users SET streak = 0 WHERE id = ?', [userId])
    res.json({ message: 'Streak reset' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export const getBadges = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM badges ORDER BY id')
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const createBadge = async (req, res) => {
  try {
    const { name, emoji, description } = req.body
    const [result] = await pool.query(
      'INSERT INTO badges (name, emoji, description, created_by) VALUES (?,?,?,?)',
      [name, emoji, description, req.user.id]
    )
    res.status(201).json({ id: result.insertId, name, emoji, description })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const giveBadge = async (req, res) => {
  try {
    const { user_id, badge_id } = req.body
    const [[exists]] = await pool.query(
      'SELECT id FROM user_badges WHERE user_id=? AND badge_id=?', [user_id, badge_id]
    )
    if (exists) return res.status(409).json({ message: 'User already has this badge' })
    await pool.query(
      'INSERT INTO user_badges (user_id, badge_id, given_by) VALUES (?,?,?)',
      [user_id, badge_id, req.user.id]
    )
    res.json({ message: 'Badge awarded' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const revokeBadge = async (req, res) => {
  try {
    const { userId, badgeId } = req.params
    await pool.query('DELETE FROM user_badges WHERE user_id=? AND badge_id=?', [userId, badgeId])
    res.json({ message: 'Badge revoked' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params
    const [rows] = await pool.query(`
      SELECT b.*, ub.given_at
      FROM user_badges ub
      JOIN badges b ON b.id = ub.badge_id
      WHERE ub.user_id = ?
      ORDER BY ub.given_at DESC
    `, [userId])
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Warnings ────────────────────────────────────────────────────────────────

export const sendWarning = async (req, res) => {
  try {
    const { user_id, message } = req.body
    if (!user_id || !message)
      return res.status(400).json({ message: 'user_id and message required' })
    await pool.query(
      'INSERT INTO warnings (user_id, message, given_by) VALUES (?,?,?)',
      [user_id, message, req.user.id]
    )
    res.json({ message: 'Warning sent' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const getWarnings = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT w.*, u.name AS student_name, a.name AS admin_name
      FROM warnings w
      JOIN users u ON u.id = w.user_id
      JOIN users a ON a.id = w.given_by
      ORDER BY w.created_at DESC
    `)
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Surprise Quizzes ────────────────────────────────────────────────────────

export const getQuizzes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT q.*, u.name AS created_by_name,
        (SELECT COUNT(*) FROM quiz_answers WHERE quiz_id = q.id) AS total_answers,
        (SELECT COUNT(*) FROM quiz_answers WHERE quiz_id = q.id AND correct = TRUE) AS correct_answers
      FROM surprise_quizzes q
      JOIN users u ON u.id = q.created_by
      ORDER BY q.created_at DESC
    `)
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const createQuiz = async (req, res) => {
  try {
    const { title, question, option_a, option_b, option_c, option_d, correct, xp_reward } = req.body
    const [result] = await pool.query(
      'INSERT INTO surprise_quizzes (title,question,option_a,option_b,option_c,option_d,correct,xp_reward,created_by) VALUES (?,?,?,?,?,?,?,?,?)',
      [title, question, option_a, option_b, option_c, option_d, correct, xp_reward ?? 20, req.user.id]
    )
    res.status(201).json({ id: result.insertId, message: 'Quiz created' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const toggleQuiz = async (req, res) => {
  try {
    const { id } = req.params
    const [[quiz]] = await pool.query('SELECT active FROM surprise_quizzes WHERE id=?', [id])
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
    await pool.query('UPDATE surprise_quizzes SET active=? WHERE id=?', [!quiz.active, id])
    res.json({ active: !quiz.active })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export const getLeaderboard = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.name, u.xp, u.streak, u.status,
        GROUP_CONCAT(DISTINCT lang.name ORDER BY lang.name SEPARATOR ', ') AS languages,
        COUNT(DISTINCT ub.badge_id) AS badge_count,
        COUNT(DISTINCT up.lesson_id) AS lessons_completed
      FROM users u
      LEFT JOIN user_languages ul ON ul.user_id = u.id
      LEFT JOIN languages lang ON lang.id = ul.language_id
      LEFT JOIN user_badges ub ON ub.user_id = u.id
      LEFT JOIN user_progress up ON up.user_id = u.id AND up.completed = TRUE
      WHERE u.role = 'student'
      GROUP BY u.id, u.name, u.xp, u.streak, u.status
      ORDER BY u.xp DESC
      LIMIT 20
    `)
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Student Profile (impersonate view) ──────────────────────────────────────

export const getStudentProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const [[user]] = await pool.query(`
      SELECT u.id, u.name, u.email, u.xp, u.streak, u.status, u.last_active, u.created_at,
        GROUP_CONCAT(DISTINCT lang.name ORDER BY lang.name SEPARATOR ', ') AS languages
      FROM users u
      LEFT JOIN user_languages ul ON ul.user_id = u.id
      LEFT JOIN languages lang ON lang.id = ul.language_id
      WHERE u.id = ?
      GROUP BY u.id
    `, [userId])
    if (!user) return res.status(404).json({ message: 'User not found' })

    const [progress] = await pool.query(`
      SELECT up.*, l.title AS lesson, lv.title AS level, lang.name AS language, lang.flag_emoji
      FROM user_progress up
      JOIN lessons l ON l.id = up.lesson_id
      JOIN levels lv ON lv.id = l.level_id
      JOIN languages lang ON lang.id = lv.language_id
      WHERE up.user_id = ?
      ORDER BY lang.name, lv.level_number, l.lesson_number
    `, [userId])

    const [badges] = await pool.query(`
      SELECT b.*, ub.given_at
      FROM user_badges ub JOIN badges b ON b.id = ub.badge_id
      WHERE ub.user_id = ?
    `, [userId])

    const [xpHistory] = await pool.query(`
      SELECT xt.amount, xt.reason, xt.created_at, u.name AS given_by_name
      FROM xp_transactions xt JOIN users u ON u.id = xt.given_by
      WHERE xt.user_id = ? ORDER BY xt.created_at DESC LIMIT 10
    `, [userId])

    const [warnings] = await pool.query(
      'SELECT * FROM warnings WHERE user_id = ? ORDER BY created_at DESC', [userId]
    )

    res.json({ user, progress, badges, xpHistory, warnings })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}
