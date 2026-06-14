export function validatePassword(password, confirmPassword) {
  if (password.length <= 8) return 'Password must be more than 8 characters'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
  if (confirmPassword !== undefined && password !== confirmPassword) return 'Passwords do not match'
  return null
}
