import { API_BASE, jsonHeaders, handleResponse } from './api'

export const usersApi = {
  getAll: () =>
    fetch(`${API_BASE}/users`, { headers: { 'Content-Type': 'application/json', ...jsonHeaders() } })
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
