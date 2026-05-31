import pool from '../config/db.js';
import { createUserPassword } from './password.Model.js';
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, name, email FROM users');
  return rows;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const createUserWithPassword = async ({ name, email, password }) => {
  const [result] = await pool.query(
    'INSERT INTO users ( name, email) VALUES ( ?, ?)',
    [name, email]
  );
  const userId = result.insertId;
  await createUserPassword(userId, password);
  return { id: userId, name, email };
};
