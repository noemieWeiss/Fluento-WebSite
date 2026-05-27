const express = require('express')
const router = express.Router()
const { getStats, getUsers, updateUser, deleteUser, getLessons, createLesson, updateLesson } = require('../controllers/adminController')
const { authMiddleware } = require('../middleware/authMiddleware')
const { adminMiddleware } = require('../middleware/adminMiddleware')

router.use(authMiddleware, adminMiddleware)

router.get('/stats',          getStats)
router.get('/users',          getUsers)
router.put('/users/:id',      updateUser)
router.delete('/users/:id',   deleteUser)
router.get('/lessons',        getLessons)
router.post('/lessons',       createLesson)
router.put('/lessons/:id',    updateLesson)

module.exports = router
