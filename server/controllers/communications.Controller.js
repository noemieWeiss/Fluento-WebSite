import { asyncHandler } from '../utils/helpers.js'
import { createWarning, getAllWarnings, getWarningsByUser } from '../models/warning.Model.js'
import { getAllQuizzes, createQuiz, findQuizById, setQuizActive } from '../models/quiz.Model.js'
import { getBadgesByUser } from '../models/badge.Model.js'
import { getXPHistoryByUser } from '../models/xp.Model.js'
import { getStudentById, getProgressByUser } from '../models/studentProfile.Model.js'

export const sendWarning = asyncHandler(async (req, res) => {
  const { user_id, message } = req.body
  if (!user_id || !message)
    return res.status(400).json({ message: 'user_id and message required' })
  await createWarning(user_id, message, req.user.id)
  res.json({ message: 'Warning sent' })
})

export const getWarningsHandler = asyncHandler(async (req, res) => res.json(await getAllWarnings()))

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

export const getStudentProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const user = await getStudentById(userId)
  if (!user) return res.status(404).json({ message: 'User not found' })
  const [progress, badges, xpHistory, warnings] = await Promise.all([
    getProgressByUser(userId),
    getBadgesByUser(userId),
    getXPHistoryByUser(userId),
    getWarningsByUser(userId),
  ])
  res.json({ user, progress, badges, xpHistory, warnings })
})
