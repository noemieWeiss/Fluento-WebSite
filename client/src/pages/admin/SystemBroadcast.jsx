import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Toast from '../../components/common/Toast'
import { useToast } from '../../hooks/useToast'
import { broadcastApi } from '../../services/api'
import '../../styles/admin.css'

export default function SystemBroadcast() {
  const [broadcasts, setBroadcasts] = useState([])
  const [loading, setLoading]       = useState(true)
  const [form, setForm]             = useState({ message: '', expires_at: '' })
  const [saving, setSaving]         = useState(false)
  const { toast, notify, clear }    = useToast()

  useEffect(() => {
    broadcastApi.getAll()
      .then(data => setBroadcasts(Array.isArray(data) ? data : []))
      .catch(() => notify('Failed to load broadcasts', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.message.trim()) return
    setSaving(true)
    try {
      await broadcastApi.create(form)
      const updated = await broadcastApi.getAll()
      setBroadcasts(updated)
      setForm({ message: '', expires_at: '' })
      notify('Broadcast created!')
    } catch {
      notify('Failed to create broadcast', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (id) => {
    await broadcastApi.deactivate(id)
    setBroadcasts(prev => prev.map(b => b.id === id ? { ...b, is_active: false } : b))
    notify('Broadcast deactivated')
  }

  const handleDelete = async (id) => {
    await broadcastApi.delete(id)
    setBroadcasts(prev => prev.filter(b => b.id !== id))
    notify('Broadcast deleted', 'error')
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1>System Broadcasts</h1>
          <p>Send global announcements to all students</p>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}

        {/* Create Form */}
        <div className="broadcast-form-card">
          <h2>New Broadcast</h2>
          <form onSubmit={handleCreate} className="broadcast-form">
            <textarea
              className="broadcast-textarea"
              placeholder="Write your announcement... (e.g. System maintenance tonight at 2:00 AM)"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={3}
              maxLength={500}
              required
            />
            <div className="broadcast-form-row">
              <label className="broadcast-label">
                Expires at (optional):
                <input
                  type="datetime-local"
                  className="broadcast-input"
                  value={form.expires_at}
                  onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                />
              </label>
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? 'Sending...' : 'Send Broadcast'}
              </button>
            </div>
          </form>
        </div>

        {/* Active Preview */}
        {broadcasts.some(b => b.is_active) && (
          <div className="broadcast-preview">
            <span className="broadcast-preview-label">Live banner preview:</span>
            <div className="system-banner-preview">
              <span>📢</span>
              <span>{broadcasts.find(b => b.is_active)?.message}</span>
            </div>
          </div>
        )}

        {/* List */}
        <h2 className="broadcast-list-title">All Broadcasts</h2>
        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : broadcasts.length === 0 ? (
          <div className="audit-empty">No broadcasts yet.</div>
        ) : (
          <div className="broadcast-list">
            {broadcasts.map(b => (
              <div key={b.id} className={`broadcast-item ${b.is_active ? 'active' : 'inactive'}`}>
                <div className="broadcast-item-header">
                  <span className={`broadcast-status ${b.is_active ? 'status-active' : 'status-inactive'}`}>
                    {b.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="broadcast-meta">
                    By {b.created_by_name} · {new Date(b.created_at).toLocaleString()}
                    {b.expires_at && ` · Expires ${new Date(b.expires_at).toLocaleString()}`}
                  </span>
                </div>
                <p className="broadcast-message">{b.message}</p>
                <div className="broadcast-actions">
                  {b.is_active && (
                    <button className="btn-secondary" onClick={() => handleDeactivate(b.id)}>
                      Deactivate
                    </button>
                  )}
                  <button className="btn-danger" onClick={() => handleDelete(b.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
