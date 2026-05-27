import { Router } from 'express'
import { saveProgress, getProgress } from '../controllers/progress.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'

const router = Router()

router.post('/', authMiddleware, saveProgress)
router.get('/',  authMiddleware, getProgress)

export default router
