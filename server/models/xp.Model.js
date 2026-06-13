import pool from '../config/db.js'

export const addXP = async (userId, amount, reason, adminId) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    await conn.query('UPDATE student_profiles SET xp = xp + ? WHERE user_id = ?', [amount, userId])
    await conn.query(
      'INSERT INTO xp_transactions (user_id, amount, reason, given_by) VALUES (?,?,?,?)',
      [userId, amount, reason, adminId]
    )
    await conn.commit()
    const [[profile]] = await conn.query('SELECT xp FROM student_profiles WHERE user_id = ?', [userId])
    return profile.xp
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
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

export const updateStudentXP = async (userId, xpToAdd) => {
  await pool.query(
    'UPDATE student_profiles SET xp = xp + ?, last_active = NOW() WHERE user_id = ?',
    [xpToAdd, userId]
  )
}
