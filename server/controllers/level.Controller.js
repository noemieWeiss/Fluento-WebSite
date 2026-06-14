import { asyncHandler } from '../utils/helpers.js'
import { getAllLevels, createLevel, updateLevel, deleteLevel } from '../models/level.Model.js'

export const getLevels = asyncHandler(async (req, res) => res.json(await getAllLevels()))
export const createLevelHandler = asyncHandler(async (req, res) => res.status(201).json(await createLevel(req.body)))
export const updateLevelHandler = asyncHandler(async (req, res) => { await updateLevel(req.params.id, req.body); res.json({ message: 'Level updated' }) })
export const deleteLevelHandler = asyncHandler(async (req, res) => { await deleteLevel(req.params.id); res.json({ message: 'Level deleted' }) })
