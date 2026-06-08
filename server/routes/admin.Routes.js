import { Router } from 'express'
import {
  getStats,
  getUsers, updateUserHandler, deleteUserHandler,
  getLanguagesHandler, createLanguageHandler, updateLanguageHandler, deleteLanguageHandler,
  getLevelsHandler, createLevelHandler, updateLevelHandler, deleteLevelHandler,
  getLessonsHandler, createLessonHandler, updateLessonHandler, deleteLessonHandler,
  getWordsHandler, createWordHandler, updateWordHandler, deleteWordHandler,
} from '../controllers/admin.Controller.js'
import { authMiddleware } from '../middleware/auth.Middleware.js'

const router = Router()
router.use(authMiddleware)

router.get('/stats',        getStats)

router.get('/users',        getUsers)
router.put('/users/:id',    updateUserHandler)
router.delete('/users/:id', deleteUserHandler)

router.get('/languages',         getLanguagesHandler)
router.post('/languages',        createLanguageHandler)
router.put('/languages/:id',     updateLanguageHandler)
router.delete('/languages/:id',  deleteLanguageHandler)

router.get('/levels',          getLevelsHandler)
router.post('/levels',         createLevelHandler)
router.put('/levels/:id',      updateLevelHandler)
router.delete('/levels/:id',   deleteLevelHandler)

router.get('/lessons',         getLessonsHandler)
router.post('/lessons',        createLessonHandler)
router.put('/lessons/:id',     updateLessonHandler)
router.delete('/lessons/:id',  deleteLessonHandler)

router.get('/lessons/:lessonId/words',            getWordsHandler)
router.post('/lessons/:lessonId/words',           createWordHandler)
router.put('/lessons/:lessonId/words/:wordId',    updateWordHandler)
router.delete('/lessons/:lessonId/words/:wordId', deleteWordHandler)

export default router
