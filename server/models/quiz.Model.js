import pool from '../config/db.js'

export const getAllQuizzes = async () => {
  const [rows] = await pool.query(`
    SELECT q.*, u.name AS created_by_name,
      (SELECT COUNT(*) FROM quiz_answers WHERE quiz_id = q.id) AS total_answers,
      (SELECT COUNT(*) FROM quiz_answers WHERE quiz_id = q.id AND correct = TRUE) AS correct_answers
    FROM surprise_quizzes q
    JOIN users u ON u.id = q.created_by
    ORDER BY q.created_at DESC
  `)
  return rows
}

export const createQuiz = async ({ title, question, option_a, option_b, option_c, option_d, correct, xp_reward, createdBy }) => {
  const [result] = await pool.query(
    'INSERT INTO surprise_quizzes (title,question,option_a,option_b,option_c,option_d,correct,xp_reward,created_by) VALUES (?,?,?,?,?,?,?,?,?)',
    [title, question, option_a, option_b, option_c, option_d, correct, xp_reward ?? 20, createdBy]
  )
  return { id: result.insertId }
}

export const findQuizById = async (id) => {
  const [[row]] = await pool.query('SELECT active FROM surprise_quizzes WHERE id=?', [id])
  return row || null
}

export const setQuizActive = async (id, active) => {
  await pool.query('UPDATE surprise_quizzes SET active=? WHERE id=?', [active, id])
}
