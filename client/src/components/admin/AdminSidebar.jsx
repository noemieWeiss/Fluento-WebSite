import { useRef, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import ProfileMenu from './ProfileMenu'
import SidebarProfileButton from '../common/SidebarProfileButton'
import logo from '../../assets/logo.svg'

const NAV_LINKS = [
  { to: '/admin',                end: true,  icon: '📊', label: 'Dashboard' },
  { to: '/admin/users',                       icon: '👥', label: 'Users' },
  { to: '/admin/lessons',        end: true,  icon: '📚', label: 'Lessons' },
  { to: '/admin/lessons/new',                 icon: '🧱', label: 'Build Lesson' },
  { to: '/admin/languages',                   icon: '🌍', label: 'Languages' },
  { to: '/admin/rewards',                     icon: '💎', label: 'Rewards' },
  { to: '/admin/communications',              icon: '📣', label: 'Communications' },
  { to: '/admin/broadcasts',                  icon: '📢', label: 'Broadcasts' },
  { to: '/admin/automations',                 icon: '⚙️', label: 'Automations' },
  { to: '/admin/audit-logs',                  icon: '🔍', label: 'Audit Logs' },
]

export default function AdminSidebar() {
  const { user } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img src={logo} alt="Fluento" className="sidebar-logo-img" />
        <span className="logo-badge">ADMIN</span>
      </div>

      <nav className="admin-nav">
        {NAV_LINKS.map(({ to, end, icon, label }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">{icon}</span> {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-profile-wrap" ref={menuRef}>
        {menuOpen && (
          <div className="sidebar-menu">
            <ProfileMenu onClose={() => setMenuOpen(false)} />
          </div>
        )}
        <SidebarProfileButton name={user?.name} role="Administrator" onClick={() => setMenuOpen(o => !o)} />
      </div>
    </aside>
  )
}
