import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import { loginUser } from '../services/auth.Service.js'
import { asyncHandler } from '../utils/helpers.js'
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await loginUser(email, password)
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ ...user, token })
})
