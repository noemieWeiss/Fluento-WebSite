import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import { useUser } from '../../context/UserContext'
import ChangePasswordModal from './ChangePassword'
import '../../styles/global.css'

function Navbar() {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [showChangePassword, setShowChangePassword] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Fluento" className="navbar-logo-img" />
        </Link>

        {user && (
          <div className="navbar-actions">
            <span className="navbar-user">Hi, {user.name}</span>
            <button
              className="btn-secondary navbar-btn"
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </button>
            <button className="btn-danger navbar-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>

      {showChangePassword && (
        <ChangePasswordModal
          userId={user.id}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </>
  )
}

export default Navbar
