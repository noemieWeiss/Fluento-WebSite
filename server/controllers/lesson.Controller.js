import { getAllLanguages } from '../models/language.Model.js'
import { getAllLevels } from '../models/level.Model.js'
import { getWordsByLesson } from '../models/word.Model.js'
import pool from '../config/db.js'

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

    const [[existing]] = await pool.query(
      'SELECT id FROM user_languages WHERE user_id = ? AND language_id = ?',
      [userId, languageId]
    )
    if (!existing) {
      await pool.query(
        'INSERT INTO user_languages (user_id, language_id) VALUES (?, ?)',
        [userId, languageId]
      )
    }

    res.json({ message: 'Language chosen successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getLevels = async (req, res) => {
  try {
    const { languageId } = req.params
    const [levels] = await pool.query(`
      SELECT lv.id, lv.level_number, lv.title,
        COUNT(DISTINCT l.id) AS lesson_count
      FROM levels lv
      LEFT JOIN lessons l ON l.level_id = lv.id
      WHERE lv.language_id = ?
      GROUP BY lv.id, lv.level_number, lv.title
      ORDER BY lv.level_number
    `, [languageId])
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

export const getLevelSummary = async (req, res) => {
  try {
    const { levelId } = req.params
    const userId = req.user.id

    const [lessons] = await pool.query(`
      SELECT l.id, l.lesson_number, l.title,
        up.completed, up.score
      FROM lessons l
      LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
      WHERE l.level_id = ?
      ORDER BY l.lesson_number
    `, [userId, levelId])

    const total = lessons.length
    const completed = lessons.filter(l => l.completed).length

    res.json({ lessons, total, completed })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
