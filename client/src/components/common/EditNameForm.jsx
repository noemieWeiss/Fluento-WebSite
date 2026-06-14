import { useState } from 'react'
import { useUser } from '../../context/UserContext'

export default function EditNameForm({ onSave, close }) {
  const { user, login } = useUser()
  const [newName, setNewName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      await onSave(newName)
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
        <button className="sidebar-menu-item" onClick={close}>Cancel</button>
        <button className="sidebar-menu-item accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
