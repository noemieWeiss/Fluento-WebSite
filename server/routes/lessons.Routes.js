import { Router } from 'express'
import { getLevels, getLessonWords, getLessonClasses, getLevelSummary } from '../controllers/lesson.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'

const router = Router()

router.get('/levels/:languageId', authMiddleware, getLevels)
router.get('/:lessonId/words', authMiddleware, getLessonWords)
router.get('/:lessonId/classes', authMiddleware, getLessonClasses)
router.get('/level/:levelId/summary', authMiddleware, getLevelSummary)

export default router
