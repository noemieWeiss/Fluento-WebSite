import pool from '../config/db.js'

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id

    const [[{ totalLessons }]] = await pool.query(
      'SELECT COUNT(*) AS totalLessons FROM user_progress WHERE user_id = ? AND completed = TRUE',
      [userId]
    )

    const [[{ totalXP }]] = await pool.query(
      'SELECT COALESCE(SUM(score), 0) AS totalXP FROM user_progress WHERE user_id = ? AND completed = TRUE',
      [userId]
    )

    const [[{ attemptCount }]] = await pool.query(
      'SELECT COUNT(*) AS attemptCount FROM user_progress WHERE user_id = ?',
      [userId]
    )

    const [[{ successCount }]] = await pool.query(
      'SELECT COUNT(*) AS successCount FROM user_progress WHERE user_id = ? AND completed = TRUE',
      [userId]
    )

    const successRate = attemptCount > 0
      ? Math.round((successCount / attemptCount) * 100)
      : 0

    const [weeklyActivity] = await pool.query(`
      SELECT
        DATE(completed_at) AS day,
        COUNT(*) AS completions
      FROM user_progress
      WHERE user_id = ?
        AND completed = TRUE
        AND completed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(completed_at)
      ORDER BY day ASC
    `, [userId])

    const [upcomingLessons] = await pool.query(`
      SELECT
        l.id,
        l.title,
        l.lesson_number,
        lv.title AS level,
        lv.id AS level_id,
        lang.name AS language,
        lang.flag_emoji,
        COALESCE(up.completed, FALSE) AS isCompleted
      FROM lessons l
      JOIN levels lv ON lv.id = l.level_id
      JOIN languages lang ON lang.id = lv.language_id
      LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
      WHERE l.id IN (
        SELECT MIN(l2.id) FROM lessons l2
        JOIN levels lv2 ON lv2.id = l2.level_id
        LEFT JOIN user_progress up2 ON up2.lesson_id = l2.id AND up2.user_id = ?
        WHERE up2.id IS NULL
        GROUP BY lv2.id
        LIMIT 3
      )
      ORDER BY lang.name, lv.level_number
    `, [userId, userId])

    res.json({
      kpi: { totalLessons, totalXP, successRate },
      weeklyActivity,
      upcomingLessons
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id

    const [progress] = await pool.query(`
      SELECT
        l.id,
        l.title,
        l.lesson_number,
        lv.title AS level,
        lv.level_number,
        lang.name AS language,
        lang.flag_emoji,
        up.completed,
        up.score,
        up.completed_at,
        up.attempts
      FROM lessons l
      JOIN levels lv ON lv.id = l.level_id
      JOIN languages lang ON lang.id = lv.language_id
      LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
      ORDER BY lang.name, lv.level_number, l.lesson_number
    `, [userId])

    res.json(progress)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getLessons = async (req, res) => {
  try {
    const userId = req.user.id

    const [lessons] = await pool.query(`
      SELECT
        l.id,
        l.title,
        l.lesson_number,
        lv.title AS level,
        lv.id AS level_id,
        lang.name AS language,
        lang.flag_emoji,
        COALESCE(up.completed, FALSE) AS isCompleted,
        COALESCE(up.score, 0) AS score,
        COALESCE(up.attempts, 0) AS attempts
      FROM lessons l
      JOIN levels lv ON lv.id = l.level_id
      JOIN languages lang ON lang.id = lv.language_id
      LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
      ORDER BY lang.name, lv.level_number, l.lesson_number
    `, [userId])

    res.json(lessons)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
