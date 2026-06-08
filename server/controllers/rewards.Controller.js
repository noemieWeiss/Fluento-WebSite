import { addXP, getXPHistoryByUser, resetUserStreak } from '../models/xp.Model.js'
import { getAllBadges, createBadge, getBadgesByUser, findUserBadge, awardBadge, removeBadge } from '../models/badge.Model.js'
import { createWarning, getAllWarnings, getWarningsByUser } from '../models/warning.Model.js'
import { getAllQuizzes, createQuiz, findQuizById, setQuizActive } from '../models/quiz.Model.js'
import { getStudentById, getProgressByUser, getLeaderboard } from '../models/studentProfile.Model.js'

// ─── XP ───────────────────────────────────────────────────────────────────────

export const giveXP = async (req, res) => {
  try {
    const { user_id, amount, reason } = req.body
    if (!user_id || !amount || !reason)
      return res.status(400).json({ message: 'user_id, amount and reason required' })
    const newXP = await addXP(user_id, amount, reason, req.user.id)
    res.json({ message: 'XP updated', newXP })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const getXPHistory = async (req, res) => {
  try {
    res.json(await getXPHistoryByUser(req.params.userId))
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const resetStreak = async (req, res) => {
  try {
    await resetUserStreak(req.params.userId)
    res.json({ message: 'Streak reset' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export const getBadges = async (req, res) => {
  try {
    res.json(await getAllBadges())
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const createBadgeHandler = async (req, res) => {
  try {
    res.status(201).json(await createBadge({ ...req.body, createdBy: req.user.id }))
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

export const giveBadge = async (req, res) => {
  try {
    const { user_id, badge_id } = req.body
    const exists = await findUserBadge(user_id, badge_id)
    if (exists) return res.status(409).json({ message: 'User already has this badge' })
    await awardBadge(user_id, badge_id, req.user.id)
    res.json({ message: 'Badge awarded' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
}

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
