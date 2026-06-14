import { Router } from 'express'
import { getStats, getProgress, getLessons, getWarnings, markWarningSeen } from '../controllers/student.Controller.js'
import { getActiveQuizzesHandler, submitQuizAnswerHandler } from '../controllers/quiz.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'
import { getUserLanguages } from '../models/userLanguages.Model.js'
import { getBadgesByUser } from '../models/badge.Model.js'
import { getXPHistoryByUser } from '../models/xp.Model.js'

const router = Router()

router.use(authMiddleware)

router.get('/stats',     getStats)
router.get('/progress',  getProgress)
router.get('/lessons',   getLessons)
router.get('/warnings',  getWarnings)
router.put('/warnings/:id/seen', markWarningSeen)
router.get('/quizzes',   getActiveQuizzesHandler)
router.post('/quizzes/answer', submitQuizAnswerHandler)
router.get('/languages', async (req, res) => {
  try {
    const languages = await getUserLanguages(req.user.id)
    res.json(languages)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/badges', async (req, res) => {
  try {
    const badges = await getBadgesByUser(req.user.id)
    res.json(badges)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/xp-history', async (req, res) => {
  try {
    const history = await getXPHistoryByUser(req.user.id)
    res.json(history)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
