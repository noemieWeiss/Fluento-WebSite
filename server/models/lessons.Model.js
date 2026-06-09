import pool from '../config/db.js'

export const getLevelsByLanguage = async (languageId) => {
  const [levels] = await pool.query(`
    SELECT lv.id, lv.level_number, lv.title,
      COUNT(DISTINCT l.id) AS lesson_count
    FROM levels lv
    LEFT JOIN lessons l ON l.level_id = lv.id
    WHERE lv.language_id = ?
    GROUP BY lv.id, lv.level_number, lv.title
    ORDER BY lv.level_number
  `, [languageId])
  return levels
}

export const getLessonsByLevel = async (levelId, userId) => {
  const [lessons] = await pool.query(`
    SELECT l.id, l.lesson_number, l.title,
      up.completed, up.score
    FROM lessons l
    LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
    WHERE l.level_id = ?
    ORDER BY l.lesson_number
  `, [userId, levelId])
  return lessons
}
