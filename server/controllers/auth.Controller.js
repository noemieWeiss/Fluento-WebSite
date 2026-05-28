import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import { loginUser } from '../services/auth.Service.js'
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await loginUser(email, password)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ ...user, token })
  } catch (err) { next(err) }
}
