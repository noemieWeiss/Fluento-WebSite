import { API_BASE, authHeader, handleResponse } from './api'

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

  getBadges: () =>
    fetch(`${API_BASE}/student/badges`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json())
      .catch(() => []),

  getXPHistory: () =>
    fetch(`${API_BASE}/student/xp-history`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json())
      .catch(() => []),
}
