export const pick = (obj, keys) =>
  keys.reduce((acc, k) => (obj[k] !== undefined ? { ...acc, [k]: obj[k] } : acc), {})

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  })

export const validatePassword = (password) => {
  if (!password || password.length <= 8) return 'Password must be more than 8 characters'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
  return null
}
