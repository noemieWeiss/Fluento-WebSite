const express = require('express')
const router = express.Router()
const { getLanguages, chooseLanguage } = require('../controllers/lessonController')
const { authMiddleware } = require('../middleware/authMiddleware')

router.get('/',       getLanguages)
router.post('/choose', authMiddleware, chooseLanguage)

module.exports = router
