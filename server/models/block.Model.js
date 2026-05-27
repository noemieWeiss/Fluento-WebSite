import pool from '../config/db.js'

export const blockUser = async (blockerId, blockedId) => {
  await pool.query(
    'INSERT INTO blocks (blocker_id, blocked_id) VALUES (?, ?)',
    [blockerId, blockedId]
  )
}

export const isAlreadyBlocked = async (blockerId, blockedId) => {
  const [rows] = await pool.query(
    'SELECT 1 FROM blocks WHERE blocker_id = ? AND blocked_id = ?',
    [blockerId, blockedId]
  )
  return rows.length > 0
}
