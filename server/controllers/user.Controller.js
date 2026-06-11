import { asyncHandler } from '../utils/helpers.js'
import { getAdminUsers, updateUser, deleteUserById } from '../models/user.Model.js'

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
