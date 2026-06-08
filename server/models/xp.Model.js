import pool from '../config/db.js'

export const addXP = async (userId, amount, reason, adminId) => {
  await pool.query('UPDATE student_profiles SET xp = xp + ? WHERE user_id = ?', [amount, userId])
  await pool.query(
    'INSERT INTO xp_transactions (user_id, amount, reason, given_by) VALUES (?,?,?,?)',
    [userId, amount, reason, adminId]
  )
  const [[profile]] = await pool.query('SELECT xp FROM student_profiles WHERE user_id = ?', [userId])
  return profile.xp
}

export const getXPHistoryByUser = async (userId) => {
  const [rows] = await pool.query(`
    SELECT xt.*, u.name AS given_by_name
    FROM xp_transactions xt
    JOIN users u ON u.id = xt.given_by
    WHERE xt.user_id = ?
    ORDER BY xt.created_at DESC
    LIMIT 50
  `, [userId])
  return rows
}

export const resetUserStreak = async (userId) => {
  await pool.query('UPDATE student_profiles SET streak = 0 WHERE user_id = ?', [userId])
}
