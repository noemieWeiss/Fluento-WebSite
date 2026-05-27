const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes     = require('./routes/auth')
const languageRoutes = require('./routes/languages')
const lessonRoutes   = require('./routes/lessons')
const progressRoutes = require('./routes/progress')
const adminRoutes    = require('./routes/admin')

const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/api/auth',      authRoutes)
app.use('/api/languages', languageRoutes)
app.use('/api/lessons',   lessonRoutes)
app.use('/api/progress',  progressRoutes)
app.use('/api/admin',     adminRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
