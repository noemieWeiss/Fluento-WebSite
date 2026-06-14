import pool from '../config/db.js'

export const findActiveBroadcasts = async () => {
  const [rows] = await pool.execute(
    `SELECT sb.*, u.name AS created_by_name
     FROM system_broadcasts sb
     LEFT JOIN users u ON u.id = sb.created_by
     WHERE sb.is_active = TRUE AND (sb.expires_at IS NULL OR sb.expires_at > NOW())
     ORDER BY sb.created_at DESC`
  )
  return rows
}

export const findAllBroadcasts = async () => {
  const [rows] = await pool.execute(
    `SELECT sb.*, u.name AS created_by_name
     FROM system_broadcasts sb
     JOIN users u ON u.id = sb.created_by
     ORDER BY sb.created_at DESC`
  )
  return rows
}

export const createBroadcast = async ({ message, createdBy, expiresAt }) => {
  const [result] = await pool.execute(
    'INSERT INTO system_broadcasts (message, created_by, expires_at) VALUES (?, ?, ?)',
    [message, createdBy, expiresAt || null]
  )
  return result.insertId
}

export const updateBroadcast = async (id, { message, is_active, expires_at }) => {
  await pool.execute(
    'UPDATE system_broadcasts SET message=?, is_active=?, expires_at=? WHERE id=?',
    [message, is_active, expires_at || null, id]
  )
}

export const deactivateBroadcast = async (id) => {
  await pool.execute('UPDATE system_broadcasts SET is_active=FALSE WHERE id=?', [id])
}

export const deleteBroadcast = async (id) => {
  await pool.execute('DELETE FROM system_broadcasts WHERE id=?', [id])
}
