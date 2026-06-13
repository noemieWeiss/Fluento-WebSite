import { API_BASE, authHeader, jsonHeaders, handleResponse } from './api'

const BASE = `${API_BASE}/rewards`
const STUDENT = `${API_BASE}/student`

export const rewardsApi = {
  // XP
  giveXP: (body) =>
    fetch(`${BASE}/xp`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(body)
    }).then(handleResponse).then(r => r.json()),

  resetStreak: (userId) =>
    fetch(`${BASE}/streak/${userId}/reset`, {
      method: 'PUT', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  // Badges
  getBadges: () =>
    fetch(`${BASE}/badges`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  createBadge: (body) =>
    fetch(`${BASE}/badges`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(body)
    }).then(handleResponse).then(r => r.json()),

  giveBadge: (body) =>
    fetch(`${BASE}/badges/give`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(body)
    }).then(handleResponse).then(r => r.json()),

  getUserBadges: (userId) =>
    fetch(`${BASE}/badges/${userId}`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  revokeBadge: (userId, badgeId) =>
    fetch(`${BASE}/badges/${userId}/${badgeId}`, {
      method: 'DELETE', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  // Warnings
  getWarnings: () =>
    fetch(`${BASE}/warnings`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  sendWarning: (body) =>
    fetch(`${BASE}/warnings`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(body)
    }).then(handleResponse).then(r => r.json()),

  // Quizzes
  getQuizzes: () =>
    fetch(`${BASE}/quizzes`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  createQuiz: (body) =>
    fetch(`${BASE}/quizzes`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(body)
    }).then(handleResponse).then(r => r.json()),

  toggleQuiz: (id) =>
    fetch(`${BASE}/quizzes/${id}/toggle`, {
      method: 'PUT', headers: authHeader()
    }).then(handleResponse).then(r => r.json()),

  getActiveQuizzes: () =>
    fetch(`${STUDENT}/quizzes`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  submitQuizAnswer: (body) =>
    fetch(`${STUDENT}/quizzes/answer`, {
      method: 'POST', headers: jsonHeaders(), body: JSON.stringify(body)
    }).then(handleResponse).then(r => r.json()),

  // Leaderboard & profiles
  getLeaderboard: () =>
    fetch(`${BASE}/leaderboard`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  getStudentProfile: (userId) =>
    fetch(`${BASE}/students/${userId}`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),
}
