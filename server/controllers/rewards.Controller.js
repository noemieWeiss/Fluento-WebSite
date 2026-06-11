import { asyncHandler } from '../utils/helpers.js'
import { addXP, getXPHistoryByUser, resetUserStreak } from '../models/xp.Model.js'
import { getAllBadges, createBadge, getBadgesByUser, awardBadge, removeBadge } from '../models/badge.Model.js'
import { getLeaderboard } from '../models/studentProfile.Model.js'

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
export const getUserBadges = asyncHandler(async (req, res) => res.json(await getBadgesByUser(req.params.userId)))

export const createBadgeHandler = asyncHandler(async (req, res) =>
  res.status(201).json(await createBadge({ ...req.body, createdBy: req.user.id }))
)

export const giveBadge = asyncHandler(async (req, res) => {
  const { user_id, badge_id } = req.body
  const { alreadyHas } = await awardBadge(user_id, badge_id, req.user.id)
  if (alreadyHas) return res.status(409).json({ message: 'User already has this badge' })
  res.json({ message: 'Badge awarded' })
})

export const revokeBadge = asyncHandler(async (req, res) => {
  await removeBadge(req.params.userId, req.params.badgeId)
  res.json({ message: 'Badge revoked' })
})

export const getLeaderboardHandler = asyncHandler(async (req, res) => res.json(await getLeaderboard()))
