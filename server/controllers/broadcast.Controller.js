import { asyncHandler } from '../utils/helpers.js'
import {
  findActiveBroadcasts, findAllBroadcasts, createBroadcast,
  updateBroadcast, deactivateBroadcast, deleteBroadcast,
} from '../models/broadcast.Model.js'

export const getActiveBroadcasts = asyncHandler(async (req, res) =>
  res.json(await findActiveBroadcasts())
)

export const getAllBroadcasts = asyncHandler(async (req, res) =>
  res.json(await findAllBroadcasts())
)

export const createBroadcastHandler = asyncHandler(async (req, res) => {
  const { message, expires_at } = req.body
  if (!message?.trim()) return res.status(400).json({ message: 'Message is required' })
  const id = await createBroadcast({ message: message.trim(), createdBy: req.user.id, expiresAt: expires_at })
  res.status(201).json({ id, message: 'Broadcast created' })
})

export const updateBroadcastHandler = asyncHandler(async (req, res) => {
  await updateBroadcast(req.params.id, req.body)
  res.json({ message: 'Broadcast updated' })
})

export const deactivateBroadcastHandler = asyncHandler(async (req, res) => {
  await deactivateBroadcast(req.params.id)
  res.json({ message: 'Broadcast deactivated' })
})

export const deleteBroadcastHandler = asyncHandler(async (req, res) => {
  await deleteBroadcast(req.params.id)
  res.json({ message: 'Broadcast deleted' })
})
