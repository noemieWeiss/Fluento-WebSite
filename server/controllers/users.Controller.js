import { getAllUsers, getUserById, createUserWithPassword } from '../models/user.Model.js'
import { verifyUserPassword, updatePassword } from '../models/password.Model.js'
import { validatePassword } from '../utils/helpers.js'
import { asyncHandler } from '../utils/helpers.js'
export const getUsers = asyncHandler(async (req, res) => {
  res.json(await getAllUsers())
})

export const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
})

export const createUser = asyncHandler(async (req, res) => {
  const { password } = req.body
  const err = validatePassword(password)
  if (err) return res.status(400).json({ message: err })
  const user = await createUserWithPassword(req.body)
  res.status(201).json(user)
})

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const userId = req.params.id

  if (String(req.user.id) !== String(userId))
    return res.status(403).json({ message: 'Forbidden' })
  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: 'currentPassword and newPassword are required' })

  const err = validatePassword(newPassword)
  if (err) return res.status(400).json({ message: err })

  const matches = await verifyUserPassword(userId, currentPassword)
  if (!matches) return res.status(400).json({ message: 'Current password is incorrect' })

  await updatePassword(userId, newPassword)
  res.status(200).json({ message: 'Password changed successfully' })
})
