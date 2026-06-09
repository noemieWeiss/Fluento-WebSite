import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import logo from '../../assets/logo.svg'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getToken = () => { try { return JSON.parse(localStorage.getItem('authUser'))?.token } catch { return null } }

export default function StudentSidebar() {
  const { user, logout, login } = useUser()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [newName, setNewName]   = useState(user?.name ?? '')
  const [saving, setSaving]     = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const handleSaveName = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: newName, email: user.email })
      })
      login({ ...user, name: newName })
      setEditOpen(false)
      setMenuOpen(false)
    } finally { setSaving(false) }
  }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'S'

  return (
    <aside className="student-sidebar">
      <div className="student-sidebar-logo">
        <img src={logo} alt="Fluento" className="sidebar-logo-img" />
        <span className="logo-badge">STUDENT</span>
      </div>

      <nav className="student-nav">
        <NavLink to="/student" end className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/student/lessons" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📚</span> My Lessons
        </NavLink>
        <NavLink to="/choose-language" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">🌍</span> Languages
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
            ) : (
              <>
                <div className="sidebar-menu-label">Settings</div>
                <button className="sidebar-menu-item" onClick={() => setEditOpen(true)}>✏️ Change Name</button>
                <div className="sidebar-menu-divider" />
                <button className="sidebar-menu-item danger" onClick={handleLogout}>🚪 Logout</button>
              </>
            )}
          </div>
        )}
        <button className="sidebar-profile" onClick={() => { setMenuOpen(o => !o); setEditOpen(false) }}>
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{user?.name ?? 'Student'}</div>
            <div className="sidebar-profile-role">Learner</div>
          </div>
          <span className="sidebar-chevron">▲</span>
        </button>
      </div>
    </aside>
  )
}
