import { getAllLanguages } from '../models/language.Model.js'
import { getWordsByLesson, getClassesByLesson } from '../models/word.Model.js'
import { hasUserLanguage, addUserLanguage } from '../models/userLanguages.Model.js'
import { getLevelsByLanguage, getLessonsByLevel } from '../models/lessons.Model.js'

export const getLanguages = async (req, res) => {
  try {
    const languages = await getAllLanguages()
    res.json(languages)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const chooseLanguage = async (req, res) => {
  try {
    const { languageId } = req.body
    const userId = req.user.id

    if (!languageId) return res.status(400).json({ message: 'languageId is required' })

    const exists = await hasUserLanguage(userId, languageId)
    if (!exists) {
      await addUserLanguage(userId, languageId)
    }

    res.json({ message: 'Language chosen successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getLevels = async (req, res) => {
  try {
    const { languageId } = req.params
    const levels = await getLevelsByLanguage(languageId)
    res.json(levels)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getLessonWords = async (req, res) => {
  try {
    const { lessonId } = req.params
    const words = await getWordsByLesson(lessonId)
    res.json(words)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getLessonClasses = async (req, res) => {
  try {
    const { lessonId } = req.params
    const userId = req.user.id
    const classes = await getClassesByLesson(lessonId, userId)
    res.json(classes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getLevelSummary = async (req, res) => {
  try {
    const { levelId } = req.params
    const userId = req.user.id

    const lessons = await getLessonsByLevel(levelId, userId)
    const total = lessons.length
    const completed = lessons.filter(l => l.completed).length

    res.json({ lessons, total, completed })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
