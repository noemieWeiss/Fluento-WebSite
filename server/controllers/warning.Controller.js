import { asyncHandler } from '../utils/helpers.js'
import { createWarning, getAllWarnings } from '../models/warning.Model.js'

export const sendWarning = asyncHandler(async (req, res) => {
  const { user_id, message } = req.body
  if (!user_id || !message)
    return res.status(400).json({ message: 'user_id and message required' })
  await createWarning(user_id, message, req.user.id)
  res.json({ message: 'Warning sent' })
})

export const getWarningsHandler = asyncHandler(async (req, res) => res.json(await getAllWarnings()))
