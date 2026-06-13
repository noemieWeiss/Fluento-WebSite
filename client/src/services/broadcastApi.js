import { API_BASE, authHeader, jsonHeaders, handleResponse } from './api'

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
