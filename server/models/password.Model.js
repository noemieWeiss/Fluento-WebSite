import pool from '../config/db.js';
import bcrypt from 'bcrypt';
export const getPasswordByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT password_hash FROM passwords WHERE user_id = ?', [userId]);
  return rows[0]?.password_hash;
};
export const createUserPassword = async (userId, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)', [userId, passwordHash]);

};
export const updatePassword = async (userId, newPassword) => {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE passwords SET password_hash = ? WHERE user_id = ?', [passwordHash, userId]);
};
export const verifyPassword = async (plainPassword, hash) => {
  return bcrypt.compare(plainPassword, hash);
};