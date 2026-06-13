import { getWordsByLesson, getClassesByLesson } from '../models/word.Model.js'
import { getLevelsByLanguage, getLessonsByLevel } from '../models/lessons.Model.js'

export const getLevels = async (req, res) => {
  try {
    res.json(await getLevelsByLanguage(req.params.languageId))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getLessonWords = async (req, res) => {
  try {
    res.json(await getWordsByLesson(req.params.lessonId))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getLessonClasses = async (req, res) => {
  try {
    res.json(await getClassesByLesson(req.params.lessonId, req.user.id))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getLevelSummary = async (req, res) => {
  try {
    const lessons = await getLessonsByLevel(req.params.levelId, req.user.id)
    res.json({ lessons, total: lessons.length, completed: lessons.filter(l => l.completed).length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
