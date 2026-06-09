import { Router } from 'express'
import { getProgress, saveClass, completeLesson } from '../controllers/progress.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'

const router = Router()

router.get('/lessons/:lessonId', authMiddleware, getProgress)
router.post('/lessons/:lessonId/classes/:classNumber', authMiddleware, saveClass)
router.post('/lessons/:lessonId/complete', authMiddleware, completeLesson)

export default router
