import pool from '../config/db.js';

export const getPasswordByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT password_hash FROM passwords WHERE user_id = ?', [userId]);
  return rows[0]?.password;
};

export const updatePassword = async (userId, newPassword) => {
  await pool.query('UPDATE passwords SET password_hash = ? WHERE user_id = ?', [newPassword, userId]);
};
