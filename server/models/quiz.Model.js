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

export const getActiveQuizzes = async (userId) => {
  const [rows] = await pool.query(`
    SELECT q.id, q.title, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.xp_reward, q.created_by, u.name as created_by_name
    FROM surprise_quizzes q
    JOIN users u ON u.id = q.created_by
    WHERE q.active = TRUE
      AND NOT EXISTS (SELECT 1 FROM quiz_answers WHERE quiz_id = q.id AND user_id = ?)
    ORDER BY q.created_at DESC
  `, [userId])
  return rows
}

export const submitQuizAnswer = async (quizId, userId, answer) => {
  const [[quiz]] = await pool.query('SELECT correct, xp_reward, created_by FROM surprise_quizzes WHERE id = ?', [quizId])
  if (!quiz) throw new Error('Quiz not found')

  const [[existing]] = await pool.query(
    'SELECT id FROM quiz_answers WHERE quiz_id = ? AND user_id = ?',
    [quizId, userId]
  )
  if (existing) throw new Error('Already answered')

  const isCorrect = quiz.correct.toLowerCase() === answer.toLowerCase()

  await pool.query(
    'INSERT INTO quiz_answers (quiz_id, user_id, answer, correct) VALUES (?, ?, ?, ?)',
    [quizId, userId, answer, isCorrect]
  )

  return { correct: isCorrect, xp: isCorrect ? quiz.xp_reward : 0, given_by: quiz.created_by }
}

