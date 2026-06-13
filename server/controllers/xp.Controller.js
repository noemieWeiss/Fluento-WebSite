import { asyncHandler } from '../utils/helpers.js'
import { addXP, getXPHistoryByUser, resetUserStreak } from '../models/xp.Model.js'
import { getLeaderboard } from '../models/studentProfile.Model.js'

export const giveXP = asyncHandler(async (req, res) => {
  const { user_id, amount, reason } = req.body
  if (!user_id || !amount || !reason)
    return res.status(400).json({ message: 'user_id, amount and reason required' })
  const newXP = await addXP(user_id, amount, reason, req.user.id)
  res.json({ message: 'XP updated', newXP })
})

export const getXPHistory = asyncHandler(async (req, res) => res.json(await getXPHistoryByUser(req.params.userId)))

export const resetStreak = asyncHandler(async (req, res) => {
  await resetUserStreak(req.params.userId)
  res.json({ message: 'Streak reset' })
})

export const getLeaderboardHandler = asyncHandler(async (req, res) => res.json(await getLeaderboard()))
