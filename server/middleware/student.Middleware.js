export const studentMiddleware = (req, res, next) => {
  // Allow all authenticated users (not just admins)
  // This middleware currently just passes through
  // Can add additional student-specific logic here if needed
  next()
}
