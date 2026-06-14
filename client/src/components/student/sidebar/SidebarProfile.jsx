import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../context/UserContext'
import useClickOutside from '../../../hooks/useClickOutside'
import { getInitials } from '../../../utils/getInitials'
import ProfileMenu from './ProfileMenu'
import ChangePasswordModal from '../../common/ChangePassword'

export default function SidebarProfile() {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  const ref = useRef()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleOpenMenu = () => {
    setMenuOpen(o => !o)
    setEditOpen(false)
    setPasswordOpen(false)
  }

  useClickOutside(ref, () => {
    setMenuOpen(false)
    setEditOpen(false)
    setPasswordOpen(false)
  })

  return (
    <div className="sidebar-profile-wrap" ref={ref}>
      {menuOpen && (
        <ProfileMenu
          user={user}
          editOpen={editOpen}
          setEditOpen={setEditOpen}
          setPasswordOpen={setPasswordOpen}
          close={() => setMenuOpen(false)}
          onLogout={handleLogout}
        />
      )}

      <button className="sidebar-profile" onClick={handleOpenMenu}>
        <div className="sidebar-avatar">
          {getInitials(user?.name)}
        </div>

        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">
            {user?.name ?? 'Student'}
          </div>
          <div className="sidebar-profile-role">Learner</div>
        </div>

        <span className="sidebar-chevron">▲</span>
      </button>

      {passwordOpen && (
        <ChangePasswordModal 
        userId={user?.id}
        onClose={() => setPasswordOpen(false)} />
      )}
    </div>
  )
}