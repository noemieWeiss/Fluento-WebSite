import { getAllUsers, getUserById, createUserWithPassword } from '../models/user.Model.js'
import { verifyUserPassword, updatePassword } from '../models/password.Model.js'
import { validatePassword } from '../utils/helpers.js'

export const getUsers = async (req, res, next) => {
  try {
    res.json(await getAllUsers())
  } catch (err) { next(err) }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) { next(err) }
}

export const createUser = async (req, res, next) => {
  try {
    const { password } = req.body
    const err = validatePassword(password)
    if (err) return res.status(400).json({ message: err })
    const user = await createUserWithPassword(req.body)
    res.status(201).json(user)
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Email already exists' })
    next(err)
  }
}

export const changePassword = async (req, res, next) => {
  try {
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
  } catch (err) { next(err) }
}
