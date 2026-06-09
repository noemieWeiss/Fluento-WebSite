import { Router } from 'express'
import { getStats, getProgress, getLessons } from '../controllers/student.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'
import { studentMiddleware } from '../middleware/student.Middleware.js'
import { getUserLanguages } from '../models/userLanguages.Model.js'

const router = Router()

router.use(authMiddleware, studentMiddleware)

router.get('/stats',     getStats)
router.get('/progress',  getProgress)
router.get('/lessons',   getLessons)
router.get('/languages', async (req, res) => {
  try {
    const languages = await getUserLanguages(req.user.id)
    res.json(languages)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
