import { Router } from 'express'
import { getLanguages, chooseLanguage } from '../controllers/lesson.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'

const router = Router()

router.get('/',        getLanguages)
router.post('/choose', authMiddleware, chooseLanguage)

export default router
