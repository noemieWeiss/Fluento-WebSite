import pool from '../config/db.js';
import { createUserPassword } from './password.Model.js';
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.status, r.name AS role
     FROM users u
     LEFT JOIN roles_to_users rtu ON rtu.user_id = u.id
     LEFT JOIN roles r ON r.id = rtu.role_id
     WHERE u.email = ?`,
    [email]
  );
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

export const getAdminUsers = async () => {
  const [rows] = await pool.query(`
    SELECT
      u.id, u.name, u.email, u.created_at, u.status,
      GROUP_CONCAT(DISTINCT lang.name ORDER BY lang.name SEPARATOR ', ') AS languages,
      COUNT(DISTINCT up.lesson_id) AS lessonsCompleted,
      COALESCE(SUM(up.score), 0) AS totalXP
    FROM users u
    JOIN roles_to_users rtu ON rtu.user_id = u.id
    JOIN roles r ON r.id = rtu.role_id
    LEFT JOIN user_languages ul ON ul.user_id = u.id
    LEFT JOIN languages lang ON lang.id = ul.language_id
    LEFT JOIN user_progress up ON up.user_id = u.id AND up.completed = TRUE
    WHERE r.name != 'admin'
    GROUP BY u.id, u.name, u.email, u.created_at, u.status
    ORDER BY u.created_at DESC
  `)
  return rows
}

export const updateUser = async (id, { name, email, status }) => {
  await pool.query(
    'UPDATE users SET name = ?, email = ?, status = ? WHERE id = ?',
    [name, email, status, id]
  )
}

export const deleteUserById = async (id) => {
  await pool.query('DELETE FROM user_progress WHERE user_id = ?', [id])
  await pool.query('DELETE FROM user_languages WHERE user_id = ?', [id])
  await pool.query('DELETE FROM passwords WHERE user_id = ?', [id])
  await pool.query('DELETE FROM users WHERE id = ?', [id])
}

export const createUserWithPassword = async ({ name, email, password }) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  const userId = result.insertId;
  await createUserPassword(userId, password);
  const [[studentRole]] = await pool.query('SELECT id FROM roles WHERE name = ?', ['student']);
  if (studentRole) {
    await pool.query('INSERT INTO roles_to_users (user_id, role_id) VALUES (?, ?)', [userId, studentRole.id]);
  }
  return { id: userId, name, email, role: 'student' };
};
