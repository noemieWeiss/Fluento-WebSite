import { API_BASE, authHeader, jsonHeaders, handleResponse } from './api'

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
