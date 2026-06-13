import { API_BASE, authHeader, jsonHeaders, handleResponse } from './api'

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
