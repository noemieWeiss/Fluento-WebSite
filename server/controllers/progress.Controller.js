import pool from '../config/db.js'

export const saveProgress = async (req, res) => {
  try {
    const { lessonId, score, completed } = req.body
    const userId = req.user.id

    if (!lessonId) return res.status(400).json({ message: 'lessonId is required' })

    const [[existing]] = await pool.query(
      'SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?',
      [userId, lessonId]
    )

    if (existing) {
      await pool.query(
        'UPDATE user_progress SET score = ?, completed = ?, completed_at = ? WHERE user_id = ? AND lesson_id = ?',
        [score ?? 0, completed ?? false, completed ? new Date() : null, userId, lessonId]
      )
    } else {
      await pool.query(
        'INSERT INTO user_progress (user_id, lesson_id, score, completed, completed_at) VALUES (?, ?, ?, ?, ?)',
        [userId, lessonId, score ?? 0, completed ?? false, completed ? new Date() : null]
      )
    }

    if (completed) {
      await pool.query(
        'UPDATE student_profiles SET last_active = NOW(), streak = streak + 1 WHERE user_id = ?',
        [userId]
      )
    }

    res.json({ message: 'Progress saved' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id

    const [rows] = await pool.query(`
      SELECT up.lesson_id, up.score, up.completed, up.completed_at,
        l.title AS lesson_title, l.lesson_number,
        lv.title AS level_title, lv.level_number, lv.language_id,
        lang.name AS language, lang.flag_emoji
      FROM user_progress up
      JOIN lessons l ON l.id = up.lesson_id
      JOIN levels lv ON lv.id = l.level_id
      JOIN languages lang ON lang.id = lv.language_id
      WHERE up.user_id = ?
      ORDER BY lang.name, lv.level_number, l.lesson_number
    `, [userId])

    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
