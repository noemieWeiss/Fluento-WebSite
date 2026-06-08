import { useState } from 'react'

export default function EditUserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ name: user.name, email: user.email })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(user.id, form)
    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit — {user.name}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="field-group">
            <label>Full Name</label>
            <input className="admin-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="field-group">
            <label>Email</label>
            <input className="admin-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
