import pool from '../config/db.js'

export const getLessonProgress = async (userId, lessonId) => {
  const [[progress]] = await pool.query(
    'SELECT id, score, completed, completed_at FROM user_progress WHERE user_id = ? AND lesson_id = ?',
    [userId, lessonId]
  )
  return progress
}

export const getClassProgress = async (userId, lessonId) => {
  const [classes] = await pool.query(
    'SELECT class_number, completed, completed_at FROM user_class_progress WHERE user_id = ? AND lesson_id = ? ORDER BY class_number',
    [userId, lessonId]
  )
  return classes
}

export const saveClassProgress = async (userId, lessonId, classNumber) => {
  await pool.query(
    'INSERT INTO user_class_progress (user_id, lesson_id, class_number, completed, completed_at) VALUES (?, ?, ?, TRUE, NOW()) ON DUPLICATE KEY UPDATE completed = TRUE, completed_at = NOW()',
    [userId, lessonId, classNumber]
  )
}

export const createLessonProgress = async (userId, lessonId, score) => {
  const [result] = await pool.query(
    'INSERT INTO user_progress (user_id, lesson_id, score, completed, completed_at) VALUES (?, ?, ?, TRUE, NOW())',
    [userId, lessonId, score]
  )
  return result.insertId
}

export const updateLessonProgress = async (progressId, score) => {
  await pool.query(
    'UPDATE user_progress SET score = ?, completed = TRUE, completed_at = NOW() WHERE id = ?',
    [score, progressId]
  )
}

