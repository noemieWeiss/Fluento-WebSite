import pool from '../config/db.js';

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
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO users ( name, email) VALUES ( ?, ?)',
      [name, email]
    );
    const userId = result.insertId;
    await conn.query('INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)', [userId, password]);
    await conn.commit();
    return { id: userId, name, email };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
