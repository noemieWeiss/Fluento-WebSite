import { getKpi, getWeeklyActivity, getHardestLessons } from '../models/adminStats.Model.js'
import { getAdminUsers, updateUser, deleteUserById } from '../models/user.Model.js'
import { getAllLanguages, createLanguage, updateLanguage, deleteLanguage } from '../models/language.Model.js'
import { getAllLevels, createLevel, updateLevel, deleteLevel } from '../models/level.Model.js'
import { getAllLessons, createLesson, updateLesson, deleteLesson } from '../models/lesson.Model.js'
import { getWordsByLesson, createWord, updateWord, deleteWord } from '../models/word.Model.js'

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getStats = async (req, res) => {
  try {
    const [kpi, weeklyActivity, hardestLessons] = await Promise.all([
      getKpi(),
      getWeeklyActivity(),
      getHardestLessons(),
    ])
    res.json({ kpi, weeklyActivity, hardestLessons })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const getUsers = async (req, res) => {
  try {
    res.json(await getAdminUsers())
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateUserHandler = async (req, res) => {
  try {
    await updateUser(req.params.id, req.body)
    res.json({ message: 'User updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteUserHandler = async (req, res) => {
  try {
    await deleteUserById(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─── Languages ────────────────────────────────────────────────────────────────

export const getLanguagesHandler = async (req, res) => {
  try {
    res.json(await getAllLanguages())
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createLanguageHandler = async (req, res) => {
  try {
    res.status(201).json(await createLanguage(req.body))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateLanguageHandler = async (req, res) => {
  try {
    await updateLanguage(req.params.id, req.body)
    res.json({ message: 'Language updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteLanguageHandler = async (req, res) => {
  try {
    await deleteLanguage(req.params.id)
    res.json({ message: 'Language deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─── Levels ───────────────────────────────────────────────────────────────────

export const getLevelsHandler = async (req, res) => {
  try {
    res.json(await getAllLevels())
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createLevelHandler = async (req, res) => {
  try {
    res.status(201).json(await createLevel(req.body))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateLevelHandler = async (req, res) => {
  try {
    await updateLevel(req.params.id, req.body)
    res.json({ message: 'Level updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteLevelHandler = async (req, res) => {
  try {
    await deleteLevel(req.params.id)
    res.json({ message: 'Level deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export const getLessonsHandler = async (req, res) => {
  try {
    res.json(await getAllLessons())
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createLessonHandler = async (req, res) => {
  try {
    res.status(201).json(await createLesson(req.body))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateLessonHandler = async (req, res) => {
  try {
    await updateLesson(req.params.id, req.body)
    res.json({ message: 'Lesson updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteLessonHandler = async (req, res) => {
  try {
    await deleteLesson(req.params.id)
    res.json({ message: 'Lesson deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─── Words ────────────────────────────────────────────────────────────────────

export const getWordsHandler = async (req, res) => {
  try {
    res.json(await getWordsByLesson(req.params.lessonId))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createWordHandler = async (req, res) => {
  try {
    res.status(201).json(await createWord(req.params.lessonId, req.body))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateWordHandler = async (req, res) => {
  try {
    await updateWord(req.params.wordId, req.body)
    res.json({ message: 'Word updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteWordHandler = async (req, res) => {
  try {
    await deleteWord(req.params.wordId)
    res.json({ message: 'Word deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
