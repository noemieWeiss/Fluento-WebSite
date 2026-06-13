import { asyncHandler } from '../utils/helpers.js'
import { getAllLanguages, createLanguage, updateLanguage, deleteLanguage } from '../models/language.Model.js'
import { hasUserLanguage, addUserLanguage } from '../models/userLanguages.Model.js'

export const getLanguages = asyncHandler(async (req, res) => res.json(await getAllLanguages()))
export const createLanguageHandler = asyncHandler(async (req, res) => res.status(201).json(await createLanguage(req.body)))
export const updateLanguageHandler = asyncHandler(async (req, res) => { await updateLanguage(req.params.id, req.body); res.json({ message: 'Language updated' }) })
export const deleteLanguageHandler = asyncHandler(async (req, res) => { await deleteLanguage(req.params.id); res.json({ message: 'Language deleted' }) })

export const chooseLanguage = asyncHandler(async (req, res) => {
    const { languageId } = req.body
    if (!languageId) return res.status(400).json({ message: 'languageId is required' })
    const exists = await hasUserLanguage(req.user.id, languageId)
    if (!exists) await addUserLanguage(req.user.id, languageId)
    res.json({ message: 'Language chosen successfully' })
})
