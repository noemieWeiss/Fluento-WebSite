import pool from '../config/db.js'

export const getWordsByLesson = async (lessonId) => {
  const [rows] = await pool.query(
    'SELECT id, word, translation, ui_language, example_sentence, image_url, audio_url, class_order FROM words WHERE lesson_id = ? ORDER BY class_order, id',
    [lessonId]
  )
  return rows
}

export const getClassesByLesson = async (lessonId, userId) => {
  // Get the lesson's language to ensure we only return words from that language
  const [[lessonInfo]] = await pool.query(`
    SELECT lang.id as language_id, lang.name as language_name
    FROM lessons l
    JOIN levels lv ON lv.id = l.level_id
    JOIN languages lang ON lang.id = lv.language_id
    WHERE l.id = ?
  `, [lessonId])
  
  if (!lessonInfo) {
    return []
  }
  
  // Get words for this specific lesson only
  const [rows] = await pool.query(
    'SELECT id, word, translation, ui_language, example_sentence, image_url, audio_url, class_order FROM words WHERE lesson_id = ? ORDER BY class_order, id',
    [lessonId]
  )
  
  // Group words into classes (2 words per class)
  const classes = []
  const groupedByClass = {}
  
  rows.forEach(word => {
    const classNum = word.class_order || 1
    if (!groupedByClass[classNum]) {
      groupedByClass[classNum] = []
    }
    groupedByClass[classNum].push(word)
  })
  
  Object.keys(groupedByClass).sort((a, b) => a - b).forEach(classNum => {
    classes.push({
      classNumber: parseInt(classNum),
      words: groupedByClass[classNum],
      languageId: lessonInfo.language_id,
      languageName: lessonInfo.language_name
    })
  })
  
  return classes
}

export const createWord = async (lessonId, { word, translation, ui_language, example_sentence, image_url, audio_url, class_order }) => {
  const [result] = await pool.query(
    'INSERT INTO words (lesson_id, word, translation, ui_language, example_sentence, image_url, audio_url, class_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [lessonId, word, translation, ui_language || 'en', example_sentence || null, image_url || null, audio_url || null, class_order || 1]
  )
  return { id: result.insertId, lesson_id: Number(lessonId), word, translation, ui_language: ui_language || 'en', example_sentence, image_url, audio_url, class_order: class_order || 1 }
}

export const updateWord = async (wordId, { word, translation, ui_language, example_sentence, image_url, audio_url, class_order }) => {
  await pool.query(
    'UPDATE words SET word = ?, translation = ?, ui_language = ?, example_sentence = ?, image_url = ?, audio_url = ?, class_order = ? WHERE id = ?',
    [word, translation, ui_language || 'en', example_sentence || null, image_url || null, audio_url || null, class_order || 1, wordId]
  )
}

export const deleteWord = async (wordId) => {
  await pool.query('DELETE FROM words WHERE id = ?', [wordId])
}
