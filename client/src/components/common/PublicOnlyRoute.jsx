import { Navigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
function PublicOnlyRoute({ children }) {
  const { user } = useUser()

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />
    } else {  
    return <Navigate to="/student" replace />
  }}

  return children
}

export default PublicOnlyRoute