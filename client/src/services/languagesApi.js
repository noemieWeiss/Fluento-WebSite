import { API_BASE, authHeader, jsonHeaders, handleResponse } from './api'

export const languagesApi = {
  getAll: () =>
    fetch(`${API_BASE}/languages`)
      .then(r => r.json()),

  getStudentLanguages: () =>
    fetch(`${API_BASE}/student/languages`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),

  choose: (languageId) =>
    fetch(`${API_BASE}/languages/choose`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ languageId })
    }).then(handleResponse),
}
