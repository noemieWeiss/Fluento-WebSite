import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.Middleware.js'
import { auditLog } from '../middleware/auditLog.Middleware.js'
import { giveXP, getXPHistory, resetStreak, getLeaderboardHandler } from '../controllers/xp.Controller.js'
import { getBadges, getUserBadges, createBadgeHandler, giveBadge, revokeBadge } from '../controllers/badge.Controller.js'
import { sendWarning, getWarningsHandler } from '../controllers/warning.Controller.js'
import { getQuizzes, createQuizHandler, toggleQuiz } from '../controllers/quiz.Controller.js'
import { getStudentProfile } from '../controllers/student.Controller.js'

const router = Router()
router.use(authMiddleware)
router.use(auditLog)

router.post('/xp',                    giveXP)
router.get('/xp/:userId',             getXPHistory)
router.put('/streak/:userId/reset',   resetStreak)

router.get('/badges',                     getBadges)
router.post('/badges',                    createBadgeHandler)
router.post('/badges/give',               giveBadge)
router.delete('/badges/:userId/:badgeId', revokeBadge)
router.get('/badges/:userId',             getUserBadges)

router.post('/warnings', sendWarning)
router.get('/warnings',  getWarningsHandler)

router.get('/quizzes',            getQuizzes)
router.post('/quizzes',           createQuizHandler)
router.put('/quizzes/:id/toggle', toggleQuiz)

router.get('/leaderboard',      getLeaderboardHandler)
router.get('/students/:userId', getStudentProfile)

export default router
