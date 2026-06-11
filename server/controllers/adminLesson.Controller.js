import { asyncHandler } from '../utils/helpers.js'
import { getAllLessons, createLesson, updateLesson, deleteLesson } from '../models/lesson.Model.js'
import { getWordsByLesson, createWord, updateWord, deleteWord } from '../models/word.Model.js'

export const getLessons          = asyncHandler(async (req, res) => res.json(await getAllLessons()))
export const createLessonHandler = asyncHandler(async (req, res) => res.status(201).json(await createLesson(req.body)))
export const updateLessonHandler = asyncHandler(async (req, res) => { await updateLesson(req.params.id, req.body); res.json({ message: 'Lesson updated' }) })
export const deleteLessonHandler = asyncHandler(async (req, res) => { await deleteLesson(req.params.id); res.json({ message: 'Lesson deleted' }) })

export const getWordsHandler    = asyncHandler(async (req, res) => res.json(await getWordsByLesson(req.params.lessonId)))
export const createWordHandler   = asyncHandler(async (req, res) => res.status(201).json(await createWord(req.params.lessonId, req.body)))
export const updateWordHandler   = asyncHandler(async (req, res) => { await updateWord(req.params.wordId, req.body); res.json({ message: 'Word updated' }) })
export const deleteWordHandler   = asyncHandler(async (req, res) => { await deleteWord(req.params.wordId); res.json({ message: 'Word deleted' }) })
