import pool from '../config/db.js'

export const getAllBadges = async () => {
  const [rows] = await pool.query('SELECT * FROM badges ORDER BY id')
  return rows
}

export const createBadge = async ({ name, emoji, description, createdBy }) => {
  const [result] = await pool.query(
    'INSERT INTO badges (name, emoji, description, created_by) VALUES (?,?,?,?)',
    [name, emoji, description, createdBy]
  )
  return { id: result.insertId, name, emoji, description }
}

export const getBadgesByUser = async (userId) => {
  const [rows] = await pool.query(`
    SELECT b.*, ub.given_at
    FROM user_badges ub
    JOIN badges b ON b.id = ub.badge_id
    WHERE ub.user_id = ?
    ORDER BY ub.given_at DESC
  `, [userId])
  return rows
}

export const findUserBadge = async (userId, badgeId) => {
  const [[row]] = await pool.query(
    'SELECT id FROM user_badges WHERE user_id=? AND badge_id=?',
    [userId, badgeId]
  )
  return row || null
}

export const awardBadge = async (userId, badgeId, adminId) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [[existing]] = await conn.query(
      'SELECT id FROM user_badges WHERE user_id=? AND badge_id=? FOR UPDATE',
      [userId, badgeId]
    )
    if (existing) {
      await conn.rollback()
      return { alreadyHas: true }
    }
    await conn.query(
      'INSERT INTO user_badges (user_id, badge_id, given_by) VALUES (?,?,?)',
      [userId, badgeId, adminId]
    )
    await conn.commit()
    return { alreadyHas: false }
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

export const removeBadge = async (userId, badgeId) => {
  await pool.query('DELETE FROM user_badges WHERE user_id=? AND badge_id=?', [userId, badgeId])
}
