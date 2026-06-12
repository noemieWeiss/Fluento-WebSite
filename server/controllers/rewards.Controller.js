import { asyncHandler } from '../utils/helpers.js'
import { addXP, getXPHistoryByUser, resetUserStreak } from '../models/xp.Model.js'
import { getAllBadges, createBadge, getBadgesByUser, findUserBadge, awardBadge, removeBadge } from '../models/badge.Model.js'
import { createWarning, getAllWarnings, getWarningsByUser } from '../models/warning.Model.js'
import { getAllQuizzes, createQuiz, findQuizById, setQuizActive, getActiveQuizzes, submitQuizAnswer } from '../models/quiz.Model.js'
import { getStudentById, getProgressByUser, getLeaderboard } from '../models/studentProfile.Model.js'

export const giveXP = asyncHandler(async (req, res) => {
  const { user_id, amount, reason } = req.body
  if (!user_id || !amount || !reason)
    return res.status(400).json({ message: 'user_id, amount and reason required' })
  const newXP = await addXP(user_id, amount, reason, req.user.id)
  res.json({ message: 'XP updated', newXP })
})

export const getXPHistory  = asyncHandler(async (req, res) => res.json(await getXPHistoryByUser(req.params.userId)))
export const resetStreak   = asyncHandler(async (req, res) => { await resetUserStreak(req.params.userId); res.json({ message: 'Streak reset' }) })

export const getBadges     = asyncHandler(async (req, res) => res.json(await getAllBadges()))

export const createBadgeHandler = asyncHandler(async (req, res) =>
  res.status(201).json(await createBadge({ ...req.body, createdBy: req.user.id }))
)

export const giveBadge = asyncHandler(async (req, res) => {
  const { user_id, badge_id } = req.body
  const { alreadyHas } = await awardBadge(user_id, badge_id, req.user.id)
  if (alreadyHas) return res.status(409).json({ message: 'User already has this badge' })
  res.json({ message: 'Badge awarded' })
})

export const revokeBadge = async (req, res) => {
  try {
    await removeBadge(req.params.userId, req.params.badgeId)
    res.json({ message: 'Badge revoked' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const getUserBadges = async (req, res) => {
  try {
    res.json(await getBadgesByUser(req.params.userId))
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Warnings ─────────────────────────────────────────────────────────────────

export const sendWarning = async (req, res) => {
  try {
    const { user_id, message } = req.body
    if (!user_id || !message)
      return res.status(400).json({ message: 'user_id and message required' })
    await createWarning(user_id, message, req.user.id)
    res.json({ message: 'Warning sent' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const getWarningsHandler = async (req, res) => {
  try {
    res.json(await getAllWarnings())
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Surprise Quizzes ─────────────────────────────────────────────────────────

export const getQuizzes = async (req, res) => {
  try {
    res.json(await getAllQuizzes())
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const createQuizHandler = async (req, res) => {
  try {
    const result = await createQuiz({ ...req.body, createdBy: req.user.id })
    res.status(201).json({ id: result.id, message: 'Quiz created' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const toggleQuiz = async (req, res) => {
  try {
    const quiz = await findQuizById(req.params.id)
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
    await setQuizActive(req.params.id, !quiz.active)
    res.json({ active: !quiz.active })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const getActiveQuizzesHandler = async (req, res) => {
  try {
    res.json(await getActiveQuizzes())
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const submitQuizAnswerHandler = async (req, res) => {
  try {
    const { quizId, answer } = req.body
    const userId = req.user.id
    
    if (!quizId || !answer) return res.status(400).json({ message: 'Quiz ID and answer required' })
    
    const result = await submitQuizAnswer(quizId, userId, answer)
    
    if (result.correct && result.xp > 0) {
      await addXP(userId, result.xp, 'Surprise Quiz', result.given_by)
    }
    
    res.json(result)
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export const getLeaderboardHandler = async (req, res) => {
  try {
    res.json(await getLeaderboard())
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Student Profile ──────────────────────────────────────────────────────────

export const getStudentProfile = async (req, res) => {
  try {
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
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}
