import { Router } from 'express'
import { getStats, getUsers, updateUser, deleteUser, getLessons, createLesson, updateLesson, getLevels, deleteLesson } from '../controllers/admin.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'
import { adminMiddleware } from '../middleware/admin.Middleware.js'

const router = Router()

router.use(authMiddleware, adminMiddleware)

router.get('/stats',        getStats)
router.get('/users',        getUsers)
router.put('/users/:id',    updateUser)
router.delete('/users/:id', deleteUser)
router.get('/levels',          getLevels)
router.get('/lessons',         getLessons)
router.post('/lessons',        createLesson)
router.put('/lessons/:id',     updateLesson)
router.delete('/lessons/:id',  deleteLesson)

export default router
