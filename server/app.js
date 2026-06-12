import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { fileURLToPath } from 'url'
import path from 'path'

import authRoutes     from './routes/auth.Routes.js'
import userRoutes     from './routes/users.Routes.js'
import languageRoutes from './routes/languages.Routes.js'
import lessonRoutes   from './routes/lessons.Routes.js'
import progressRoutes from './routes/progress.Routes.js'
import adminRoutes    from './routes/admin.Routes.js'
import studentRoutes  from './routes/student.Routes.js'
import rewardsRoutes  from './routes/rewards.Routes.js'
import { logger }       from './middleware/logger.js'
import { errorHandler } from './middleware/error.Handler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(logger)
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/auth',      authRoutes)
app.use('/api/users',     userRoutes)
app.use('/api/languages', languageRoutes)
app.use('/api/lessons',   lessonRoutes)
app.use('/api/progress',  progressRoutes)
app.use('/api/admin',     adminRoutes)
app.use('/api/student',   studentRoutes)
app.use('/api/rewards',   rewardsRoutes)

if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '../client/dist')
  app.use(express.static(clientBuild))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'))
  })
}

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
