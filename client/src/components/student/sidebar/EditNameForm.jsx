import { useState } from 'react'
import { useUser } from '../../../context/UserContext'
import { getToken } from '../../../utils/auth'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function EditNameForm({ user, close }) {
  const { login } = useUser()

  const [newName, setNewName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!newName.trim()) return

    setSaving(true)

    try {
      await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          name: newName,
          email: user.email
        })
      })

      login({ ...user, name: newName })
      close()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="sidebar-edit-form">
      <div className="sidebar-menu-label">Change Name</div>

      <input
        className="sidebar-edit-input"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
        autoFocus
      />

      <div className="sidebar-edit-actions">
        <button className="sidebar-menu-item" onClick={close}>
          Cancel
        </button>

        <button
          className="sidebar-menu-item accent"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}