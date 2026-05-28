
const API_BASE = 'http://localhost:5000/api'

const getToken = () => {
  try {
    const stored = localStorage.getItem('authUser')
    return stored ? JSON.parse(stored).token : null
  } catch {
    return null
  }
}

const authHeader = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...authHeader()
})

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('authUser')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  return res
}

export const usersApi = {

  getAll: () =>
    fetch(`${API_BASE}/users`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) return null
    return res.json()
  },
  create: (user) =>
    fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password })
    }).then(r => r.json()),


  changePassword: async (userId, currentPassword, newPassword) => {
    const res = await fetch(`${API_BASE}/users/${userId}/password`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    })
    await handleResponse(res)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || 'Password change failed')
    return data
  }
}
