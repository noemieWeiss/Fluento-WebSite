import pool from '../config/db.js'

export const getUserLanguages = async (userId) => {
  const [rows] = await pool.query(`
    SELECT l.id, l.name, l.code, l.flag_emoji
    FROM user_languages ul
    JOIN languages l ON l.id = ul.language_id
    WHERE ul.user_id = ?
  `, [userId])
  return rows
}

export const hasUserLanguage = async (userId, languageId) => {
  const [[existing]] = await pool.query(
    'SELECT id FROM user_languages WHERE user_id = ? AND language_id = ?',
    [userId, languageId]
  )
  return !!existing
}

export const addUserLanguage = async (userId, languageId) => {
  await pool.query(
    'INSERT INTO user_languages (user_id, language_id) VALUES (?, ?)',
    [userId, languageId]
  )
}
