import pool from '../config/db.js'

export const getKpi = async () => {
  const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users')

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const [[{ activeToday }]] = await pool.query(
    'SELECT COUNT(DISTINCT user_id) AS activeToday FROM user_progress WHERE completed_at >= ?',
    [todayStart]
  )

  const [[{ successCount }]] = await pool.query(
    'SELECT COUNT(*) AS successCount FROM user_progress WHERE completed = TRUE'
  )
  const [[{ attemptCount }]] = await pool.query(
    'SELECT COUNT(*) AS attemptCount FROM user_progress'
  )
  const successRate = attemptCount > 0 ? Math.round((successCount / attemptCount) * 100) : 0

  return { totalUsers, activeToday, successRate }
}

export const getWeeklyActivity = async () => {
  const [rows] = await pool.query(`
    SELECT DATE(completed_at) AS day, COUNT(*) AS completions
    FROM user_progress
    WHERE completed = TRUE AND completed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE(completed_at)
    ORDER BY day ASC
  `)
  return rows
}

export const getHardestLessons = async () => {
  const [rows] = await pool.query(`
    SELECT
      l.id, l.title AS lesson,
      lv.title AS level,
      lang.name AS language,
      COUNT(up.id) AS attempts,
      SUM(CASE WHEN up.completed = FALSE THEN 1 ELSE 0 END) AS failures,
      ROUND(AVG(up.score), 1) AS avgScore
    FROM user_progress up
    JOIN lessons l    ON l.id  = up.lesson_id
    JOIN levels lv    ON lv.id = l.level_id
    JOIN languages lang ON lang.id = lv.language_id
    GROUP BY l.id, l.title, lv.title, lang.name
    HAVING attempts > 0
    ORDER BY failures DESC, avgScore ASC
    LIMIT 5
  `)
  return rows
}
