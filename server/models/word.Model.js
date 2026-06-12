import pool from '../config/db.js'

const getLessonLanguageId = async (lessonId) => {
  const [[row]] = await pool.query(`
    SELECT lv.language_id
    FROM lessons l
    JOIN levels lv ON lv.id = l.level_id
    WHERE l.id = ?
  `, [lessonId])
  return row?.language_id ?? null
}

const getExistingWordLanguageId = async (wordId) => {
  const [rows] = await pool.query('SELECT language_id FROM words WHERE id = ?', [wordId])
  return rows.length ? rows[0].language_id : null
}

export const getWordsByLesson = async (lessonId) => {
  const [rows] = await pool.query(
    'SELECT id, lesson_id, language_id, word, translation, ui_language, example_sentence, image_url, audio_url, class_order FROM words WHERE lesson_id = ? ORDER BY class_order, id',
    [lessonId]
  )
  return rows
}

export const getClassesByLesson = async (lessonId, userId) => {
  // Get the lesson's language to ensure we only return words from that language
  const [[lessonInfo]] = await pool.query(`
    SELECT lang.id as language_id, lang.name as language_name, l.title as lesson_title
    FROM lessons l
    JOIN levels lv ON lv.id = l.level_id
    JOIN languages lang ON lang.id = lv.language_id
    WHERE l.id = ?
  `, [lessonId])
  
  if (!lessonInfo) {
    console.error(`No lesson found with id ${lessonId}`)
    return []
  }
  
  console.log(`Loading lesson: ${lessonInfo.lesson_title}, Language: ${lessonInfo.language_name} (ID: ${lessonInfo.language_id})`)
  
  // Get words for this specific lesson with explicit language_id filtering
  const [rows] = await pool.query(`
    SELECT w.id, w.word, w.translation, w.ui_language, w.example_sentence, w.image_url, w.audio_url, w.class_order,
           w.language_id as word_language_id,
           lang.name as word_language
    FROM words w
    JOIN languages lang ON lang.id = w.language_id
    WHERE w.lesson_id = ? AND w.language_id = ?
    ORDER BY w.class_order, w.id
  `, [lessonId, lessonInfo.language_id])
  
  console.log(`Found ${rows.length} words for lesson ${lessonId}`)
  
  // Normalize classes by chunking sequential words into groups of 2.
  // This matches the client behavior which shows 2 words per class.
  const classes = []
  for (let i = 0; i < rows.length; i += 2) {
    const first = rows[i]
    const second = rows[i + 1]
    const classWords = [first]

    if (second) {
      classWords.push(second)
    }

    const normalizedWords = classWords.map(w => ({
      id: w.id,
      word: w.word,
      translation: w.translation,
      ui_language: w.ui_language,
      example_sentence: w.example_sentence,
      image_url: w.image_url,
      audio_url: w.audio_url,
      class_order: w.class_order
    }))

    classes.push({
      classNumber: classes.length + 1,
      words: normalizedWords,
      languageId: lessonInfo.language_id,
      languageName: lessonInfo.language_name
    })
  }

  return classes
}

export const createWord = async (lessonId, { word, translation, ui_language, example_sentence, image_url, audio_url, class_order, language_id }) => {
  const lessonLanguageId = await getLessonLanguageId(lessonId)
  const wordLanguageId = language_id || lessonLanguageId || null

  const [result] = await pool.query(
    'INSERT INTO words (lesson_id, language_id, word, translation, ui_language, example_sentence, image_url, audio_url, class_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [lessonId, wordLanguageId, word, translation, ui_language || 'en', example_sentence || null, image_url || null, audio_url || null, class_order || 1]
  )
  return { id: result.insertId, lesson_id: Number(lessonId), language_id: wordLanguageId, word, translation, ui_language: ui_language || 'en', example_sentence, image_url, audio_url, class_order: class_order || 1 }
}

export const updateWord = async (wordId, { word, translation, ui_language, example_sentence, image_url, audio_url, class_order, language_id }) => {
  const existingLanguageId = await getExistingWordLanguageId(wordId)
  const wordLanguageId = language_id || existingLanguageId || null

  await pool.query(
    'UPDATE words SET word = ?, translation = ?, ui_language = ?, example_sentence = ?, image_url = ?, audio_url = ?, class_order = ?, language_id = ? WHERE id = ?',
    [word, translation, ui_language || 'en', example_sentence || null, image_url || null, audio_url || null, class_order || 1, wordLanguageId, wordId]
  )
}

export const deleteWord = async (wordId) => {
  await pool.query('DELETE FROM words WHERE id = ?', [wordId])
}
