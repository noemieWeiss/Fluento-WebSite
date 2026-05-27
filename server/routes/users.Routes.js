import { Router } from 'express';
import { getUsers, getUser, createUser, blockUser, changePassword } from '../controllers/users.Controller.js';
import { authMiddleware } from '../middleware/auth.Middleware.js';

const router = Router();

// Public
router.post('/', createUser);

// Protected
router.get('/', authMiddleware, getUsers);
router.post('/block', authMiddleware, blockUser);
router.get('/:id', authMiddleware, getUser);
router.put('/:id/password', authMiddleware, changePassword);

export default router;
