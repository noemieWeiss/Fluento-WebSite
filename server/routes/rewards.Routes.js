import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.Middleware.js'
import { adminMiddleware } from '../middleware/admin.Middleware.js'
import {
  giveXP, getXPHistory, resetStreak,
  getBadges, createBadge, giveBadge, revokeBadge, getUserBadges,
  sendWarning, getWarnings,
  getQuizzes, createQuiz, toggleQuiz,
  getLeaderboard, getStudentProfile
} from '../controllers/rewards.Controller.js'

const router = Router()
router.use(authMiddleware, adminMiddleware)

router.post('/xp',                    giveXP)
router.get('/xp/:userId',             getXPHistory)
router.put('/streak/:userId/reset',   resetStreak)

router.get('/badges',                 getBadges)
router.post('/badges',                createBadge)
router.post('/badges/give',           giveBadge)
router.delete('/badges/:userId/:badgeId', revokeBadge)
router.get('/badges/:userId',         getUserBadges)

router.post('/warnings',              sendWarning)
router.get('/warnings',               getWarnings)

router.get('/quizzes',                getQuizzes)
router.post('/quizzes',               createQuiz)
router.put('/quizzes/:id/toggle',     toggleQuiz)

router.get('/leaderboard',            getLeaderboard)
router.get('/students/:userId',       getStudentProfile)

export default router
