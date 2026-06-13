import { Router } from 'express'
import { getUsers, getUser, createUser, changePassword } from '../controllers/users.Controller.js'
import { blockUser } from '../controllers/block.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'

const router = Router()

router.post('/', createUser)

router.get('/',              authMiddleware, getUsers)
router.get('/:id',           authMiddleware, getUser)
router.put('/:id/password',  authMiddleware, changePassword)
router.post('/block',        authMiddleware, blockUser)

export default router
