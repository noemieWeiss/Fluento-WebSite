import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getToken = () => { try { return JSON.parse(localStorage.getItem('authUser'))?.token } catch { return null } }

export default function ProfileMenu({ onClose }) {
  const { user, logout, login } = useUser()
  const navigate = useNavigate()
  const [view,    setView]   = useState('main') // 'main' | 'name' | 'password'
  const [newName, setNewName] = useState(user?.name ?? '')
  const [pwForm,  setPwForm]  = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [saving,  setSaving]  = useState(false)

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const handleSaveName = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      await fetch(`${API_BASE}/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: newName, email: user.email, status: 'active' }),
      })
      login({ ...user, name: newName })
      onClose()
    } finally { setSaving(false) }
  }

  const handleSavePassword = async () => {
    setPwError('')
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) { setPwError('All fields are required'); return }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match'); return }
    if (pwForm.next.length <= 8)        { setPwError('Must be more than 8 characters'); return }
    if (!/[0-9]/.test(pwForm.next))     { setPwError('Must contain at least one number'); return }
    if (!/[A-Z]/.test(pwForm.next))     { setPwError('Must contain at least one uppercase letter'); return }
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      })
      const data = await res.json()
      if (!res.ok) { setPwError(data.message || 'Failed'); return }
      onClose()
    } catch { setPwError('Network error') }
    finally { setSaving(false) }
  }

  if (view === 'name') return (
    <div className="sidebar-edit-form">
      <div className="sidebar-menu-label">Change Name</div>
      <input className="sidebar-edit-input" value={newName}
        onChange={e => setNewName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSaveName()} autoFocus />
      <div className="sidebar-edit-actions">
        <button className="sidebar-menu-item" onClick={() => setView('main')}>Cancel</button>
        <button className="sidebar-menu-item accent" onClick={handleSaveName} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )

  if (view === 'password') return (
    <div className="sidebar-edit-form">
      <div className="sidebar-menu-label">Change Password</div>
      <input className="sidebar-edit-input" type="password" placeholder="Current password"
        value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} autoFocus />
      <input className="sidebar-edit-input" type="password" placeholder="New password"
        value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} />
      <input className="sidebar-edit-input" type="password" placeholder="Confirm new password"
        value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
        onKeyDown={e => e.key === 'Enter' && handleSavePassword()} />
      {pwError && <div className="sidebar-pw-error">{pwError}</div>}
      <div className="sidebar-edit-actions">
        <button className="sidebar-menu-item" onClick={() => { setView('main'); setPwError('') }}>Cancel</button>
        <button className="sidebar-menu-item accent" onClick={handleSavePassword} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="sidebar-menu-label">Settings</div>
      <button className="sidebar-menu-item" onClick={() => setView('name')}>✏️ Change Name</button>
      <button className="sidebar-menu-item" onClick={() => setView('password')}>🔑 Change Password</button>
      <div className="sidebar-menu-divider" />
      <button className="sidebar-menu-item danger" onClick={handleLogout}>🚪 Logout</button>
    </>
  )
}
