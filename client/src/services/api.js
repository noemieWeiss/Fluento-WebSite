export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const getToken = () => {
  try {
    const stored = localStorage.getItem('authUser')
    return stored ? JSON.parse(stored).token : null
  } catch {
    return null
  }
}

export const authHeader = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...authHeader()
})

export const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('authUser')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  return res
}

export { adminApi } from './adminApi'
export { studentApi } from './studentApi'
export { usersApi } from './usersApi'
export { broadcastApi } from './broadcastApi'
export { automationApi } from './automationApi'
