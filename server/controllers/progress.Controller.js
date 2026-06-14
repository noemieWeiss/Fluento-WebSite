import { getLessonProgress, getClassProgress, saveClassProgress, createLessonProgress, updateLessonProgress } from '../models/progress.Model.js'
import { updateStudentXP } from '../models/xp.Model.js'
import { asyncHandler } from '../utils/helpers.js'
export const getProgress = asyncHandler(async (req, res) => {
  const { lessonId } = req.params
  const userId = req.user.id

  const lessonProgress = await getLessonProgress(userId, lessonId)
  const classProgress = await getClassProgress(userId, lessonId)

  res.json({
    lessonCompleted: !!lessonProgress?.completed,
    completedClasses: classProgress.map(c => c.class_number),
    score: lessonProgress?.score || 0
  })
})

export const saveClass = asyncHandler(async (req, res) => {
  const { lessonId, classNumber } = req.params
  const userId = req.user.id

  await saveClassProgress(userId, lessonId, parseInt(classNumber))

  res.json({ message: 'Class progress saved' })
})

export const completeLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params
  const { score } = req.body
  const userId = req.user.id

  if (score === undefined) {
    return res.status(400).json({ message: 'score is required' })
  }

  const existingProgress = await getLessonProgress(userId, lessonId)

  if (existingProgress) {
    await updateLessonProgress(existingProgress.id, score)
  } else {
    await createLessonProgress(userId, lessonId, score)
  }

  await updateStudentXP(userId, score)

  res.json({ message: 'Lesson completed successfully', score })
})
