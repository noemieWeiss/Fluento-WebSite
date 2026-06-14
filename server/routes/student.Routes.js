import { Router } from 'express'
import { getStats, getProgress, getLessons, getWarnings, markWarningSeen, getLanguages, getBadges, getXPHistory } from '../controllers/student.Controller.js'
import { getActiveQuizzesHandler, submitQuizAnswerHandler } from '../controllers/quiz.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/stats',          getStats)
router.get('/progress',       getProgress)
router.get('/lessons',        getLessons)
router.get('/warnings',       getWarnings)
router.put('/warnings/:id/seen', markWarningSeen)
router.get('/quizzes',        getActiveQuizzesHandler)
router.post('/quizzes/answer', submitQuizAnswerHandler)
router.get('/languages',      getLanguages)
router.get('/badges',         getBadges)
router.get('/xp-history',     getXPHistory)

export default router
