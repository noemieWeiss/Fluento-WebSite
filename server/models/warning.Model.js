import pool from '../config/db.js'

export const createWarning = async (userId, message, adminId) => {
  await pool.query(
    'INSERT INTO warnings (user_id, message, given_by) VALUES (?,?,?)',
    [userId, message, adminId]
  )
}

export const getAllWarnings = async () => {
  const [rows] = await pool.query(`
    SELECT w.*, u.name AS student_name, a.name AS admin_name
    FROM warnings w
    JOIN users u ON u.id = w.user_id
    JOIN users a ON a.id = w.given_by
    ORDER BY w.created_at DESC
  `)
  return rows
}

export const getWarningsByUser = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM warnings WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  )
  return rows
}
