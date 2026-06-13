import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.Middleware.js'
import { auditLog } from '../middleware/auditLog.Middleware.js'
import { getStats }                                                  from '../controllers/stats.Controller.js'
import { getUsers, updateUserHandler, deleteUserHandler, createAdminHandler } from '../controllers/user.Controller.js'
import { getLanguages, createLanguageHandler, updateLanguageHandler, deleteLanguageHandler } from '../controllers/language.Controller.js'
import { getLevels, createLevelHandler, updateLevelHandler, deleteLevelHandler }             from '../controllers/level.Controller.js'
import { getLessons, createLessonHandler, updateLessonHandler, deleteLessonHandler } from '../controllers/adminLesson.Controller.js'
import { getWordsHandler, createWordHandler, updateWordHandler, deleteWordHandler }  from '../controllers/word.Controller.js'
import { getAuditLogsHandler }                                        from '../controllers/auditLog.Controller.js'

const router = Router()
router.use(authMiddleware)
router.use(auditLog)

router.get('/stats', getStats)

router.get('/users',        getUsers)
router.post('/users/admin', createAdminHandler)
router.put('/users/:id',    updateUserHandler)
router.delete('/users/:id', deleteUserHandler)

router.get('/languages',        getLanguages)
router.post('/languages',       createLanguageHandler)
router.put('/languages/:id',    updateLanguageHandler)
router.delete('/languages/:id', deleteLanguageHandler)

router.get('/levels',        getLevels)
router.post('/levels',       createLevelHandler)
router.put('/levels/:id',    updateLevelHandler)
router.delete('/levels/:id', deleteLevelHandler)

router.get('/lessons',        getLessons)
router.post('/lessons',       createLessonHandler)
router.put('/lessons/:id',    updateLessonHandler)
router.delete('/lessons/:id', deleteLessonHandler)

router.get('/lessons/:lessonId/words',            getWordsHandler)
router.post('/lessons/:lessonId/words',           createWordHandler)
router.put('/lessons/:lessonId/words/:wordId',    updateWordHandler)
router.delete('/lessons/:lessonId/words/:wordId', deleteWordHandler)

router.get('/audit-logs', getAuditLogsHandler)

export default router
