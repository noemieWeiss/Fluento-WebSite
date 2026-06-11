import pool from '../config/db.js'

export const getAllLessons = async () => {
  const [rows] = await pool.query(`
    SELECT l.id, l.title, l.lesson_number,
           lv.title AS level, lv.id AS level_id,
           lang.name AS language, lang.flag_emoji
    FROM lessons l
    JOIN levels lv ON lv.id = l.level_id
    JOIN languages lang ON lang.id = lv.language_id
    ORDER BY lang.name, lv.level_number, l.lesson_number
  `)
  return rows
}

export const createLesson = async ({ level_id, lesson_number, title }) => {
  const [result] = await pool.query(
    'INSERT INTO lessons (level_id, lesson_number, title) VALUES (?, ?, ?)',
    [level_id, lesson_number, title]
  )
  return { id: result.insertId, level_id, lesson_number, title }
}

export const updateLesson = async (id, { title, lesson_number }) => {
  await pool.query(
    'UPDATE lessons SET title = ?, lesson_number = ? WHERE id = ?',
    [title, lesson_number, id]
  )
}

export const deleteLesson = async (id) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    await conn.query('DELETE FROM user_progress WHERE lesson_id = ?', [id])
    await conn.query('DELETE FROM user_class_progress WHERE lesson_id = ?', [id])
    await conn.query('DELETE FROM words WHERE lesson_id = ?', [id])
    await conn.query('DELETE FROM lessons WHERE id = ?', [id])
    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
