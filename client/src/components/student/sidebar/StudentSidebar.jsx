import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../../../context/UserContext'
import logo from '../../../assets/logo.svg'

import SidebarProfile from './SidebarProfile'

export default function StudentSidebar() {
  const { user } = useUser()
  const navigate = useNavigate()

  return (
    <aside className="student-sidebar">
      <div className="student-sidebar-logo">
        <img src={logo} alt="Fluento" className="sidebar-logo-img" />
        <span className="logo-badge">STUDENT</span>
      </div>

      <nav className="student-nav">
        <NavLink to="/student" end>📊 Dashboard</NavLink>
        <NavLink to="/student/lessons">📚 My Lessons</NavLink>
        <NavLink to="/student/quizzes">🎯 Surprise Quizzes</NavLink>
        <NavLink to="/choose-language">🌍 Languages</NavLink>
        <NavLink to="/student/warnings">⚠️ Warnings</NavLink>
      </nav>

      <SidebarProfile />
    </aside>
  )
}