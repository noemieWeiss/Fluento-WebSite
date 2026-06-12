import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.Middleware.js'
import { auditLog } from '../middleware/auditLog.Middleware.js'
import {
  getActiveBroadcasts, getAllBroadcasts,
  createBroadcastHandler, updateBroadcastHandler,
  deactivateBroadcastHandler, deleteBroadcastHandler,
} from '../controllers/broadcast.Controller.js'

const router = Router()
router.use(authMiddleware)

router.get('/active', getActiveBroadcasts)

router.use(auditLog)
router.get('/',                 getAllBroadcasts)
router.post('/',                createBroadcastHandler)
router.put('/:id',              updateBroadcastHandler)
router.patch('/:id/deactivate', deactivateBroadcastHandler)
router.delete('/:id',           deleteBroadcastHandler)

export default router
