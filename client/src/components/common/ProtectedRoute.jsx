import { Navigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

function ProtectedRoute({ children, adminOnly = false, studentOnly = false }) {
  const { user, logout } = useUser()

  const tokenExists = !!localStorage.getItem('authUser')

  if (!user || !tokenExists) {
    if (user && !tokenExists) logout()
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  if (studentOnly && user.role !== 'student') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
