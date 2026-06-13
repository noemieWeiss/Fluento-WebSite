import { getPasswordByUserId, verifyPassword } from '../models/password.Model.js'
import { blockUser as blockUserModel, isAlreadyBlocked } from '../models/block.Model.js'

export const blockUser = async (req, res, next) => {
  try {
    const { blockerId, blockedId, password } = req.body
    if (!blockerId || !blockedId || !password)
      return res.status(400).json({ message: 'blockerId, blockedId and password are required' })
    if (Number(blockerId) === Number(blockedId))
      return res.status(400).json({ message: 'Cannot block yourself' })

    const storedPassword = await getPasswordByUserId(blockerId)
    if (!storedPassword)
      return res.status(400).json({ message: 'Wrong password' })
    const matches = await verifyPassword(password, storedPassword)
    if (!matches)
      return res.status(400).json({ message: 'Wrong password' })

    const alreadyBlocked = await isAlreadyBlocked(blockerId, blockedId)
    if (alreadyBlocked)
      return res.status(200).json({ message: 'Already blocked' })

    await blockUserModel(blockerId, blockedId)
    res.status(200).json({ message: 'User blocked successfully' })
  } catch (err) { next(err) }
}
