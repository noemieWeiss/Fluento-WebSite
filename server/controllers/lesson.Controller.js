import { getWordsByLesson, getClassesByLesson } from '../models/word.Model.js'
import { getLevelsByLanguage, getLessonsByLevel } from '../models/lessons.Model.js'
import { asyncHandler } from '../utils/helpers.js'
export const getLevels = asyncHandler(async (req, res) => {
  res.json(await getLevelsByLanguage(req.params.languageId))
})

export const getLessonWords = asyncHandler(async (req, res) => {
  res.json(await getWordsByLesson(req.params.lessonId))
})

export const getLessonClasses = asyncHandler(async (req, res) => {
  res.json(await getClassesByLesson(req.params.lessonId, req.user.id))
})


export const getLevelSummary = asyncHandler(async (req, res) => {
  const lessons = await getLessonsByLevel(req.params.levelId, req.user.id)
  res.json({ lessons, total: lessons.length, completed: lessons.filter(l => l.completed).length })
})
