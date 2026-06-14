import {
  getStudentStats,
  getWeeklyActivity,
  getUpcomingLessons,
  getStudentLessons,
  getStudentProgress,
  countUserLanguages,
  getUserLanguagesDebug
} from '../models/student.Model.js'
import { getWarningsByUser, markWarningAsSeen, getUnseenWarningsCount } from '../models/warning.Model.js'
import { getStudentById, getProgressByUser } from '../models/studentProfile.Model.js'
import { getBadgesByUser } from '../models/badge.Model.js'
import { getXPHistoryByUser } from '../models/xp.Model.js'
import { getUserLanguages } from '../models/userLanguages.Model.js'

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

export const getWarnings = async (req, res) => {
  try {
    const warnings = await getWarningsByUser(req.user.id)
    const unseenCount = await getUnseenWarningsCount(req.user.id)
    res.json({ warnings, unseenCount })
  } catch (err) {
    console.error('Error in getWarnings:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const markWarningSeen = async (req, res) => {
  try {
    await markWarningAsSeen(req.params.id, req.user.id)
    res.json({ message: 'Warning marked as seen' })
  } catch (err) {
    console.error('Error marking warning as seen:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getLanguages = async (req, res, next) => {
  try {
    res.json(await getUserLanguages(req.user.id))
  } catch (err) { next(err) }
}

export const getBadges = async (req, res, next) => {
  try {
    res.json(await getBadgesByUser(req.user.id))
  } catch (err) { next(err) }
}

export const getXPHistory = async (req, res, next) => {
  try {
    res.json(await getXPHistoryByUser(req.user.id))
  } catch (err) { next(err) }
}

export const getStudentProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await getStudentById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const [progress, badges, xpHistory, warnings] = await Promise.all([
      getProgressByUser(userId),
      getBadgesByUser(userId),
      getXPHistoryByUser(userId),
      getWarningsByUser(userId),
    ])
    res.json({ user, progress, badges, xpHistory, warnings })
  } catch (err) {
    console.error('Error in getStudentProfile:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
