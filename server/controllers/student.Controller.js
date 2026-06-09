import { 
  getStudentStats, 
  getWeeklyActivity, 
  getUpcomingLessons, 
  getStudentLessons,
  getStudentProgress,
  countUserLanguages,
  getUserLanguagesDebug
} from '../models/student.Model.js'

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id
    console.log('getStats called for user:', userId)

    const langCount = await countUserLanguages(userId)
    console.log('User has', langCount, 'languages chosen')

    const kpi = await getStudentStats(userId)
    const weeklyActivity = await getWeeklyActivity(userId)
    
    let upcomingLessons = []
    if (langCount > 0) {
      upcomingLessons = await getUpcomingLessons(userId)
      console.log('Found', upcomingLessons.length, 'upcoming lessons')
    } else {
      console.log('No languages, skipping upcoming lessons query')
    }

    const stats = { kpi, weeklyActivity, upcomingLessons }
    console.log('Returning stats:', JSON.stringify(stats, null, 2))

    res.json(stats)
  } catch (err) {
    console.error('Error in getStats:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id
    const progress = await getStudentProgress(userId)
    res.json(progress)
  } catch (err) {
    console.error('Error in getProgress:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getLessons = async (req, res) => {
  try {
    const userId = req.user.id
    console.log('getLessons called for user:', userId)

    const langCount = await countUserLanguages(userId)
    console.log('User has', langCount, 'languages chosen')

    if (langCount === 0) {
      console.log('No languages chosen, returning empty array')
      return res.json([])
    }

    const userLangs = await getUserLanguagesDebug(userId)
    console.log('User languages:', userLangs)

    const lessons = await getStudentLessons(userId)
    console.log('Query returned', lessons.length, 'lessons')
    if (lessons.length > 0) {
      console.log('First lesson:', lessons[0])
    }

    res.json(lessons)
  } catch (err) {
    console.error('Error in getLessons:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
