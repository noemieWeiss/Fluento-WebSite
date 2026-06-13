import { asyncHandler } from '../utils/helpers.js'
import { getAllQuizzes, createQuiz, findQuizById, setQuizActive, getActiveQuizzes, submitQuizAnswer } from '../models/quiz.Model.js'
import { addXP } from '../models/xp.Model.js'

export const getQuizzes = asyncHandler(async (req, res) => res.json(await getAllQuizzes()))

export const createQuizHandler = asyncHandler(async (req, res) => {
  const result = await createQuiz({ ...req.body, createdBy: req.user.id })
  res.status(201).json({ id: result.id, message: 'Quiz created' })
})

export const toggleQuiz = asyncHandler(async (req, res) => {
  const quiz = await findQuizById(req.params.id)
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
  await setQuizActive(req.params.id, !quiz.active)
  res.json({ active: !quiz.active })
})

export const getActiveQuizzesHandler = asyncHandler(async (req, res) => res.json(await getActiveQuizzes(req.user.id)))

export const submitQuizAnswerHandler = asyncHandler(async (req, res) => {
  const { quizId, answer } = req.body
  if (!quizId || !answer) return res.status(400).json({ message: 'Quiz ID and answer required' })

  let result
  try {
    result = await submitQuizAnswer(quizId, req.user.id, answer)
  } catch (err) {
    if (err.message === 'Already answered') return res.status(409).json({ message: 'You already answered this quiz' })
    throw err
  }

  if (result.correct && result.xp > 0) {
    await addXP(req.user.id, result.xp, 'Surprise Quiz', result.given_by)
  }

  res.json(result)
})
