import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { adminApi } from '../../services/adminApi'
import { usersApi } from '../../services/usersApi'
import { validatePassword } from '../../utils/validatePassword'
import EditNameForm from '../common/EditNameForm'

export default function ProfileMenu({ onClose }) {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [view,    setView]   = useState('main') // 'main' | 'name' | 'password'
  const [pwForm,  setPwForm]  = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [saving,  setSaving]  = useState(false)

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const handleSavePassword = async () => {
    setPwError('')
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) { setPwError('All fields are required'); return }
    const pwError = validatePassword(pwForm.next, pwForm.confirm)
    if (pwError) { setPwError(pwError); return }
    setSaving(true)
    try {
      await usersApi.changePassword(user.id, pwForm.current, pwForm.next)
      onClose()
    } catch (err) { setPwError(err.message || 'Network error') }
    finally { setSaving(false) }
  }

  if (view === 'name') return (
    <EditNameForm
      onSave={(name) => adminApi.updateUser(user.id, { name, email: user.email, status: 'active' })}
      close={onClose}
    />
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
