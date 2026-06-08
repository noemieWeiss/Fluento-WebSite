const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const BASE = `${API}/rewards`
const ADMIN = `${API}/admin`

const tok  = () => { try { return JSON.parse(localStorage.getItem('authUser'))?.token } catch { return null } }
const auth = () => ({ Authorization: `Bearer ${tok()}` })
const json = () => ({ 'Content-Type': 'application/json', ...auth() })

const get  = (url)       => fetch(url, { headers: auth() }).then(r => r.json())
const post = (url, body) => fetch(url, { method: 'POST',   headers: json(), body: JSON.stringify(body) }).then(r => r.json())
const put  = (url)       => fetch(url, { method: 'PUT',    headers: auth() }).then(r => r.json())
const del  = (url)       => fetch(url, { method: 'DELETE', headers: auth() }).then(r => r.json())

export const rewardsApi = {
  // XP
  giveXP:      (body)           => post(`${BASE}/xp`, body),
  resetStreak: (userId)         => put(`${BASE}/streak/${userId}/reset`),

  // Badges
  getBadges:   ()               => get(`${BASE}/badges`),
  createBadge: (body)           => post(`${BASE}/badges`, body),
  giveBadge:   (body)           => post(`${BASE}/badges/give`, body),
  getUserBadges: (userId)       => get(`${BASE}/badges/${userId}`),
  revokeBadge: (userId, badgeId) => del(`${BASE}/badges/${userId}/${badgeId}`),

  // Warnings
  getWarnings: ()               => get(`${BASE}/warnings`),
  sendWarning: (body)           => post(`${BASE}/warnings`, body),

  // Quizzes
  getQuizzes:  ()               => get(`${BASE}/quizzes`),
  createQuiz:  (body)           => post(`${BASE}/quizzes`, body),
  toggleQuiz:  (id)             => put(`${BASE}/quizzes/${id}/toggle`),

  // Leaderboard & profiles
  getLeaderboard:    ()         => get(`${BASE}/leaderboard`),
  getStudentProfile: (userId)   => get(`${BASE}/students/${userId}`),

  // Students list (from admin routes)
  getStudents: ()               => get(`${ADMIN}/users`),
}
