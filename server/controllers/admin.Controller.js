import pool from '../config/db.js'

export const getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query(
      'SELECT COUNT(*) AS totalUsers FROM users'
    )

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const [[{ activeToday }]] = await pool.query(
      'SELECT COUNT(DISTINCT user_id) AS activeToday FROM user_progress WHERE completed_at >= ?',
      [todayStart]
    )

    const [[{ totalCompleted, totalAttempts }]] = await pool.query(
      'SELECT COUNT(*) AS totalCompleted, COUNT(*) AS totalAttempts FROM user_progress'
    )
    const [[{ successCount }]] = await pool.query(
      'SELECT COUNT(*) AS successCount FROM user_progress WHERE completed = TRUE'
    )
    const [[{ attemptCount }]] = await pool.query(
      'SELECT COUNT(*) AS attemptCount FROM user_progress'
    )
    const successRate = attemptCount > 0
      ? Math.round((successCount / attemptCount) * 100)
      : 0

    const [weeklyActivity] = await pool.query(`
      SELECT
        DATE(completed_at) AS day,
        COUNT(*) AS completions
      FROM user_progress
      WHERE completed = TRUE
        AND completed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(completed_at)
      ORDER BY day ASC
    `)

    const [hardestLessons] = await pool.query(`
      SELECT
        l.id,
        l.title AS lesson,
        lv.title AS level,
        lang.name AS language,
        COUNT(up.id) AS attempts,
        SUM(CASE WHEN up.completed = FALSE THEN 1 ELSE 0 END) AS failures,
        ROUND(AVG(up.score), 1) AS avgScore
      FROM user_progress up
      JOIN lessons l ON l.id = up.lesson_id
      JOIN levels lv ON lv.id = l.level_id
      JOIN languages lang ON lang.id = lv.language_id
      GROUP BY l.id, l.title, lv.title, lang.name
      HAVING attempts > 0
      ORDER BY failures DESC, avgScore ASC
      LIMIT 5
    `)

    res.json({
      kpi: { totalUsers, activeToday, successRate },
      weeklyActivity,
      hardestLessons
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT
        u.id, u.name, u.email, u.created_at,
        u.status,
        GROUP_CONCAT(DISTINCT lang.name ORDER BY lang.name SEPARATOR ', ') AS languages,
        COUNT(DISTINCT up.lesson_id) AS lessonsCompleted,
        COALESCE(SUM(up.score), 0) AS totalXP
      FROM users u
      LEFT JOIN user_languages ul ON ul.user_id = u.id
      LEFT JOIN languages lang ON lang.id = ul.language_id
      LEFT JOIN user_progress up ON up.user_id = u.id AND up.completed = TRUE
      WHERE u.role != 'admin'
      GROUP BY u.id, u.name, u.email, u.created_at, u.status
      ORDER BY u.created_at DESC
    `)
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, status } = req.body
    await pool.query(
      'UPDATE users SET name = ?, email = ?, status = ? WHERE id = ?',
      [name, email, status, id]
    )
    res.json({ message: 'User updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM user_progress WHERE user_id = ?', [id])
    await pool.query('DELETE FROM user_languages WHERE user_id = ?', [id])
    await pool.query('DELETE FROM passwords WHERE user_id = ?', [id])
    await pool.query('DELETE FROM users WHERE id = ?', [id])
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getLevels = async (req, res) => {
  try {
    const [levels] = await pool.query(`
      SELECT lv.id, lv.level_number, lv.title, lang.name AS language, lang.flag_emoji
      FROM levels lv
      JOIN languages lang ON lang.id = lv.language_id
      ORDER BY lang.name, lv.level_number
    `)
    res.json(levels)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getLessons = async (req, res) => {
  try {
    const [lessons] = await pool.query(`
      SELECT
        l.id, l.title, l.lesson_number,
        lv.title AS level, lv.id AS level_id,
        lang.name AS language, lang.flag_emoji
      FROM lessons l
      JOIN levels lv ON lv.id = l.level_id
      JOIN languages lang ON lang.id = lv.language_id
      ORDER BY lang.name, lv.level_number, l.lesson_number
    `)
    res.json(lessons)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createLesson = async (req, res) => {
  try {
    const { level_id, lesson_number, title } = req.body
    const [result] = await pool.query(
      'INSERT INTO lessons (level_id, lesson_number, title) VALUES (?, ?, ?)',
      [level_id, lesson_number, title]
    )
    res.status(201).json({ id: result.insertId, level_id, lesson_number, title })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM user_progress WHERE lesson_id = ?', [id])
    await pool.query('DELETE FROM words WHERE lesson_id = ?', [id])
    await pool.query('DELETE FROM lessons WHERE id = ?', [id])
    res.json({ message: 'Lesson deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params
    const { title, lesson_number } = req.body
    await pool.query(
      'UPDATE lessons SET title = ?, lesson_number = ? WHERE id = ?',
      [title, lesson_number, id]
    )
    res.json({ message: 'Lesson updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
