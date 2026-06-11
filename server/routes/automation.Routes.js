import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.Middleware.js'
import { auditLog } from '../middleware/auditLog.Middleware.js'
import {
  getRules, createRuleHandler, updateRuleHandler,
  toggleRuleHandler, deleteRuleHandler,
} from '../controllers/automation.Controller.js'

const router = Router()
router.use(authMiddleware)
router.use(auditLog)

router.get('/',            getRules)
router.post('/',           createRuleHandler)
router.put('/:id',         updateRuleHandler)
router.patch('/:id/toggle', toggleRuleHandler)
router.delete('/:id',      deleteRuleHandler)

export default router
