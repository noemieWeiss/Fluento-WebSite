const express = require('express')
const router = express.Router()
const { getLevels, getLessonWords, getLevelSummary } = require('../controllers/lessonController')
const { authMiddleware } = require('../middleware/authMiddleware')

router.get('/levels/:languageId',       authMiddleware, getLevels)
router.get('/:lessonId/words',          authMiddleware, getLessonWords)
router.get('/level/:levelId/summary',   authMiddleware, getLevelSummary)

module.exports = router
