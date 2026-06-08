import { Router } from 'express'
import { getStats, getProgress, getLessons } from '../controllers/student.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'
import { studentMiddleware } from '../middleware/student.Middleware.js'

const router = Router()

router.use(authMiddleware, studentMiddleware)

router.get('/stats',     getStats)
router.get('/progress',  getProgress)
router.get('/lessons',   getLessons)

export default router
