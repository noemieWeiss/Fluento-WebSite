import pool from '../config/db.js'

export const getStudentStats = async (userId) => {
  const [[{ totalLessons }]] = await pool.query(
    'SELECT COUNT(*) AS totalLessons FROM user_progress WHERE user_id = ? AND completed = TRUE',
    [userId]
  )

  const [[{ totalXP }]] = await pool.query(
    'SELECT COALESCE(xp, 0) AS totalXP FROM student_profiles WHERE user_id = ?',
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

  const successRate = attemptCount > 0 ? Math.round((successCount / attemptCount) * 100) : 0

  return { totalLessons, totalXP, successRate }
}

export const getWeeklyActivity = async (userId) => {
  const [rows] = await pool.query(`
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
  return rows
}

export const getUpcomingLessons = async (userId) => {
  const [lessons] = await pool.query(`
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
    JOIN user_languages ul ON ul.language_id = lang.id AND ul.user_id = ?
    LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
    WHERE up.id IS NULL OR up.completed = FALSE
    ORDER BY lang.name, lv.level_number, l.lesson_number
    LIMIT 3
  `, [userId, userId])
  return lessons
}

export const getStudentLessons = async (userId) => {
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
      COALESCE(up.score, 0) AS score
    FROM lessons l
    JOIN levels lv ON lv.id = l.level_id
    JOIN languages lang ON lang.id = lv.language_id
    JOIN user_languages ul ON ul.language_id = lang.id AND ul.user_id = ?
    LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
    ORDER BY lang.name, lv.level_number, l.lesson_number
  `, [userId, userId])
  return lessons
}

export const getStudentProgress = async (userId) => {
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
      up.completed_at
    FROM lessons l
    JOIN levels lv ON lv.id = l.level_id
    JOIN languages lang ON lang.id = lv.language_id
    LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
    ORDER BY lang.name, lv.level_number, l.lesson_number
  `, [userId])
  return progress
}

export const countUserLanguages = async (userId) => {
  const [[{ count }]] = await pool.query(
    'SELECT COUNT(*) as count FROM user_languages WHERE user_id = ?',
    [userId]
  )
  return count
}

export const getUserLanguagesDebug = async (userId) => {
  const [languages] = await pool.query(
    'SELECT l.id, l.name FROM user_languages ul JOIN languages l ON l.id = ul.language_id WHERE ul.user_id = ?',
    [userId]
  )
  return languages
}

export const hasChosenLanguages = async (userId) => {
  const count = await countUserLanguages(userId)
  return count > 0
}

export const getStudentProfile = async (userId) => {
  const [[existing]] = await pool.query(
    'SELECT id FROM student_profiles WHERE user_id = ?',
    [userId]
  )
  return existing
}

export const createStudentProfile = async (userId) => {
  await pool.query(
    'INSERT INTO student_profiles (user_id, xp, streak, last_active) VALUES (?, 0, 0, NOW())',
    [userId]
  )
}
