import { API_BASE, authHeader, jsonHeaders, handleResponse } from './api'

export const progressApi = {
  getLessonProgress: (lessonId) =>
    fetch(`${API_BASE}/progress/lessons/${lessonId}`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  saveClassProgress: (lessonId, classNumber) =>
    fetch(`${API_BASE}/progress/lessons/${lessonId}/classes/${classNumber}`, {
      method: 'POST',
      headers: jsonHeaders()
    }).then(handleResponse),

  completeLesson: (lessonId, score) =>
    fetch(`${API_BASE}/progress/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ score })
    }).then(handleResponse),
}
