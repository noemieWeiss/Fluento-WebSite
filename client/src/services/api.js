
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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

export const adminApi = {
  getStats: () =>
    fetch(`${API_BASE}/admin/stats`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  getUsers: () =>
    fetch(`${API_BASE}/admin/users`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  updateUser: (id, data) =>
    fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  deleteUser: (id) =>
    fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  createAdmin: async (data) => {
    const res = await fetch(`${API_BASE}/admin/users/admin`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(data)
    })
    await handleResponse(res)
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Failed to create admin')
    return json
  },

  getLevels: () =>
    fetch(`${API_BASE}/admin/levels`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  getLessons: () =>
    fetch(`${API_BASE}/admin/lessons`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  createLesson: (data) =>
    fetch(`${API_BASE}/admin/lessons`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  updateLesson: (id, data) =>
    fetch(`${API_BASE}/admin/lessons/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  deleteLesson: (id) =>
    fetch(`${API_BASE}/admin/lessons/${id}`, {
      method: 'DELETE', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  getLanguages: () =>
    fetch(`${API_BASE}/admin/languages`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  createLanguage: (data) =>
    fetch(`${API_BASE}/admin/languages`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  updateLanguage: (id, data) =>
    fetch(`${API_BASE}/admin/languages/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  deleteLanguage: (id) =>
    fetch(`${API_BASE}/admin/languages/${id}`, {
      method: 'DELETE', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  createLevel: (data) =>
    fetch(`${API_BASE}/admin/levels`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  updateLevel: (id, data) =>
    fetch(`${API_BASE}/admin/levels/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  deleteLevel: (id) =>
    fetch(`${API_BASE}/admin/levels/${id}`, {
      method: 'DELETE', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  getWords: (lessonId) =>
    fetch(`${API_BASE}/admin/lessons/${lessonId}/words`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  createWord: (lessonId, data) =>
    fetch(`${API_BASE}/admin/lessons/${lessonId}/words`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  updateWord: (lessonId, wordId, data) =>
    fetch(`${API_BASE}/admin/lessons/${lessonId}/words/${wordId}`, {
      method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  deleteWord: (lessonId, wordId) =>
    fetch(`${API_BASE}/admin/lessons/${lessonId}/words/${wordId}`, {
      method: 'DELETE', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  getAuditLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return fetch(`${API_BASE}/admin/audit-logs${qs ? '?' + qs : ''}`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json())
  },
}

export const broadcastApi = {
  getActive: () =>
    fetch(`${API_BASE}/broadcasts/active`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  getAll: () =>
    fetch(`${API_BASE}/broadcasts`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  create: (data) =>
    fetch(`${API_BASE}/broadcasts`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  update: (id, data) =>
    fetch(`${API_BASE}/broadcasts/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  deactivate: (id) =>
    fetch(`${API_BASE}/broadcasts/${id}/deactivate`, {
      method: 'PATCH', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  delete: (id) =>
    fetch(`${API_BASE}/broadcasts/${id}`, {
      method: 'DELETE', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),
}

export const automationApi = {
  getAll: () =>
    fetch(`${API_BASE}/automations`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  create: (data) =>
    fetch(`${API_BASE}/automations`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  update: (id, data) =>
    fetch(`${API_BASE}/automations/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(data)
    }).then(handleResponse).then(r => r.json()),

  toggle: (id) =>
    fetch(`${API_BASE}/automations/${id}/toggle`, {
      method: 'PATCH', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  delete: (id) =>
    fetch(`${API_BASE}/automations/${id}`, {
      method: 'DELETE', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),
}

export const studentApi = {
  getStats: () =>
    fetch(`${API_BASE}/student/stats`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json())
      .catch(err => {
        console.error('getStats error:', err)
        return { kpi: { totalLessons: 0, totalXP: 0, successRate: 0 }, weeklyActivity: [], upcomingLessons: [] }
      }),

  getProgress: () =>
    fetch(`${API_BASE}/student/progress`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json())
      .catch(err => {
        console.error('getProgress error:', err)
        return []
      }),

  getLessons: () =>
    fetch(`${API_BASE}/student/lessons`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json())
      .catch(err => {
        console.error('getLessons error:', err)
        return []
      }),
      
  getLanguages: () =>
    fetch(`${API_BASE}/student/languages`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json())
      .catch(err => {
        console.error('getLanguages error:', err)
        return []
      }),
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
