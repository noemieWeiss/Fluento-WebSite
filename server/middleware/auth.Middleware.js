import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import { isRouteAllowed } from '../models/routePermission.Model.js'

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - no token provided' })
  }

  const token = authHeader.split(' ')[1]
  let user
  try {
    user = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }

  req.user = user

  const fullPath = req.baseUrl + req.path
  const allowed = await isRouteAllowed(fullPath, user.role).catch(() => {
    console.warn(`Route permission check failed for ${fullPath}, allowing access`)
    return true
  })

  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  next()
}
