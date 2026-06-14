import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../context/UserContext'
import useClickOutside from '../../../hooks/useClickOutside'
import ProfileMenu from './ProfileMenu'
import ChangePasswordModal from '../../common/ChangePassword'
import SidebarProfileButton from '../../common/SidebarProfileButton'

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
          editOpen={editOpen}
          setEditOpen={setEditOpen}
          setPasswordOpen={setPasswordOpen}
          close={() => setMenuOpen(false)}
          onLogout={handleLogout}
        />
      )}

      <SidebarProfileButton name={user?.name} role="Learner" onClick={handleOpenMenu} />

      {passwordOpen && (
        <ChangePasswordModal 
        userId={user?.id}
        onClose={() => setPasswordOpen(false)} />
      )}
    </div>
  )
}