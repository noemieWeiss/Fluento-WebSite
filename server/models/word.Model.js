import pool from '../config/db.js'

export const getWordsByLesson = async (lessonId) => {
  const [rows] = await pool.query(
    'SELECT id, word, translation, ui_language, example_sentence, image_url, audio_url FROM words WHERE lesson_id = ? ORDER BY id',
    [lessonId]
  )
  return rows
}

export const createWord = async (lessonId, { word, translation, ui_language, example_sentence, image_url, audio_url }) => {
  const [result] = await pool.query(
    'INSERT INTO words (lesson_id, word, translation, ui_language, example_sentence, image_url, audio_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [lessonId, word, translation, ui_language || 'en', example_sentence || null, image_url || null, audio_url || null]
  )
  return { id: result.insertId, lesson_id: Number(lessonId), word, translation, ui_language: ui_language || 'en', example_sentence, image_url, audio_url }
}

export const updateWord = async (wordId, { word, translation, ui_language, example_sentence, image_url, audio_url }) => {
  await pool.query(
    'UPDATE words SET word = ?, translation = ?, ui_language = ?, example_sentence = ?, image_url = ?, audio_url = ? WHERE id = ?',
    [word, translation, ui_language || 'en', example_sentence || null, image_url || null, audio_url || null, wordId]
  )
}

export const deleteWord = async (wordId) => {
  await pool.query('DELETE FROM words WHERE id = ?', [wordId])
}
