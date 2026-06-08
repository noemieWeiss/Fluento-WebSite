import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import logo from '../../assets/logo.svg'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getToken = () => { try { return JSON.parse(localStorage.getItem('authUser'))?.token } catch { return null } }

export default function AdminSidebar() {
  const { user, logout, login } = useUser()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [editOpen, setEditOpen]     = useState(false)
  const [pwOpen, setPwOpen]         = useState(false)
  const [newName, setNewName]       = useState(user?.name ?? '')
  const [pwForm, setPwForm]         = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError]       = useState('')
  const [saving, setSaving]         = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const handleSavePassword = async () => {
    setPwError('')
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) { setPwError('All fields are required'); return }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match'); return }
    if (pwForm.next.length <= 8) { setPwError('Must be more than 8 characters'); return }
    if (!/[0-9]/.test(pwForm.next)) { setPwError('Must contain at least one number'); return }
    if (!/[A-Z]/.test(pwForm.next)) { setPwError('Must contain at least one uppercase letter'); return }
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next })
      })
      const data = await res.json()
      if (!res.ok) { setPwError(data.message || 'Failed'); return }
      setPwOpen(false)
      setMenuOpen(false)
      setPwForm({ current: '', next: '', confirm: '' })
    } catch { setPwError('Network error') }
    finally { setSaving(false) }
  }

  const handleSaveName = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      await fetch(`${API_BASE}/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: newName, email: user.email, status: 'active' })
      })
      login({ ...user, name: newName })
      setEditOpen(false)
      setMenuOpen(false)
    } finally { setSaving(false) }
  }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'A'

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img src={logo} alt="Fluento" className="sidebar-logo-img" />
        <span className="logo-badge">ADMIN</span>
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">👥</span> Users
        </NavLink>
        <NavLink to="/admin/lessons" end className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📚</span> Lessons
        </NavLink>
        <NavLink to="/admin/lessons/new" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">🧱</span> Build Lesson
        </NavLink>
        <NavLink to="/admin/languages" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">🌍</span> Languages
        </NavLink>
        <NavLink to="/admin/rewards" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">💎</span> Rewards
        </NavLink>
        <NavLink to="/admin/communications" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📣</span> Communications
        </NavLink>
      </nav>

      <div className="sidebar-profile-wrap" ref={menuRef}>
        {menuOpen && (
          <div className="sidebar-menu">
            {editOpen ? (
              <div className="sidebar-edit-form">
                <div className="sidebar-menu-label">Change Name</div>
                <input
                  className="sidebar-edit-input"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  autoFocus
                />
                <div className="sidebar-edit-actions">
                  <button className="sidebar-menu-item" onClick={() => setEditOpen(false)}>Cancel</button>
                  <button className="sidebar-menu-item accent" onClick={handleSaveName} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : pwOpen ? (
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
                  <button className="sidebar-menu-item" onClick={() => { setPwOpen(false); setPwError('') }}>Cancel</button>
                  <button className="sidebar-menu-item accent" onClick={handleSavePassword} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="sidebar-menu-label">Settings</div>
                <button className="sidebar-menu-item" onClick={() => setEditOpen(true)}>✏️ Change Name</button>
                <button className="sidebar-menu-item" onClick={() => setPwOpen(true)}>🔑 Change Password</button>
                <div className="sidebar-menu-divider" />
                <button className="sidebar-menu-item danger" onClick={handleLogout}>🚪 Logout</button>
              </>
            )}
          </div>
        )}
        <button className="sidebar-profile" onClick={() => { setMenuOpen(o => !o); setEditOpen(false) }}>
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{user?.name ?? 'Admin'}</div>
            <div className="sidebar-profile-role">Administrator</div>
          </div>
          <span className="sidebar-chevron">▲</span>
        </button>
      </div>
    </aside>
  )
}
