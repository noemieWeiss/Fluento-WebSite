import { getLessonProgress, getClassProgress, saveClassProgress, createLessonProgress, updateLessonProgress, updateStudentXP } from '../models/progress.Model.js'

export const getProgress = async (req, res) => {
  try {
    const { lessonId } = req.params
    const userId = req.user.id

    const lessonProgress = await getLessonProgress(userId, lessonId)
    const classProgress = await getClassProgress(userId, lessonId)

    res.json({
      lessonCompleted: !!lessonProgress?.completed,
      completedClasses: classProgress.map(c => c.class_number),
      score: lessonProgress?.score || 0
    })
  } catch (err) {
    console.error('Error getting progress:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const saveClass = async (req, res) => {
  try {
    const { lessonId, classNumber } = req.params
    const userId = req.user.id

    await saveClassProgress(userId, lessonId, parseInt(classNumber))

    res.json({ message: 'Class progress saved' })
  } catch (err) {
    console.error('Error saving class progress:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const completeLesson = async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Error completing lesson:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
