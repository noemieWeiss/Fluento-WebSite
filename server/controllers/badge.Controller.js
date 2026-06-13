import { asyncHandler } from '../utils/helpers.js'
import { getAllBadges, createBadge, getBadgesByUser, awardBadge, removeBadge } from '../models/badge.Model.js'

export const getBadges = asyncHandler(async (req, res) => res.json(await getAllBadges()))

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

export const getUserBadges = asyncHandler(async (req, res) => res.json(await getBadgesByUser(req.params.userId)))
