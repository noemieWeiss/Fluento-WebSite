const express = require('express')
const router = express.Router()
const { saveProgress, getProgress } = require('../controllers/progressController')
const { authMiddleware } = require('../middleware/authMiddleware')

router.post('/', authMiddleware, saveProgress)
router.get('/',  authMiddleware, getProgress)

module.exports = router
