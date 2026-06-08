import pool from '../config/db.js'

export const getAllLanguages = async () => {
  const [rows] = await pool.query('SELECT id, name, code, flag_emoji FROM languages ORDER BY name')
  return rows
}

export const createLanguage = async ({ name, code, flag_emoji }) => {
  const [result] = await pool.query(
    'INSERT INTO languages (name, code, flag_emoji) VALUES (?, ?, ?)',
    [name, code, flag_emoji || null]
  )
  return { id: result.insertId, name, code, flag_emoji }
}

export const updateLanguage = async (id, { name, code, flag_emoji }) => {
  await pool.query(
    'UPDATE languages SET name = ?, code = ?, flag_emoji = ? WHERE id = ?',
    [name, code, flag_emoji || null, id]
  )
}

export const deleteLanguage = async (id) => {
  await pool.query('DELETE FROM languages WHERE id = ?', [id])
}
