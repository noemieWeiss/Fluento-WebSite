import { API_BASE, authHeader, handleResponse } from './api'

export const lessonsApi = {
  getClasses: (lessonId) =>
    fetch(`${API_BASE}/lessons/${lessonId}/classes`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),
}
