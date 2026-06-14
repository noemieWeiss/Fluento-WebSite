import { asyncHandler, validatePassword } from '../utils/helpers.js'
import { getAdminUsers, updateUser, deleteUserById, createAdminUser } from '../models/user.Model.js'

export const getUsers = asyncHandler(async (req, res) => {
  res.json(await getAdminUsers())
})

export const updateUserHandler = asyncHandler(async (req, res) => {
  await updateUser(req.params.id, req.body)
  res.json({ message: 'User updated' })
})

export const deleteUserHandler = asyncHandler(async (req, res) => {
  await deleteUserById(req.params.id)
  res.json({ message: 'User deleted' })
})

export const createAdminHandler = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ message: 'name, email and password are required' })
  const pwErr = validatePassword(password)
  if (pwErr) return res.status(400).json({ message: pwErr })
  try {
    const admin = await createAdminUser({ name, email, password })
    res.status(201).json(admin)
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Email already exists' })
    throw err
  }
})
