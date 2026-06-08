import pool from '../config/db.js'

export const getAllLevels = async () => {
  const [rows] = await pool.query(`
    SELECT lv.id, lv.level_number, lv.title, lv.language_id,
           lang.name AS language, lang.flag_emoji
    FROM levels lv
    JOIN languages lang ON lang.id = lv.language_id
    ORDER BY lang.name, lv.level_number
  `)
  return rows
}

export const createLevel = async ({ language_id, level_number, title }) => {
  const [result] = await pool.query(
    'INSERT INTO levels (language_id, level_number, title) VALUES (?, ?, ?)',
    [language_id, level_number, title]
  )
  return { id: result.insertId, language_id, level_number, title }
}

export const updateLevel = async (id, { title, level_number }) => {
  await pool.query(
    'UPDATE levels SET title = ?, level_number = ? WHERE id = ?',
    [title, level_number, id]
  )
}

export const deleteLevel = async (id) => {
  await pool.query('DELETE FROM levels WHERE id = ?', [id])
}
