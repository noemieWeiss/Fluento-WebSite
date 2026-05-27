import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { usersApi } from '../../services/api'
import '../../styles/forms.css'

function Login() {
  const formRef = useRef()
  const navigate = useNavigate()
  const { login } = useUser()

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const user = await usersApi.login(username, password)
      if (user) {
        login(user)
        navigate(`/users/${user.id}/home`)
      } else {
        alert('Username or password incorrect')
      }
    } catch (error) {
      alert('Username or password incorrect')
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="auth-card">
          <div className="brand">
            <div className="brand-logo">F</div>
            <span className="brand-name">Fluento</span>
          </div>

          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue learning</p>

          <form ref={formRef} onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit">Sign in</button>
          </form>

          <button className="secondary-btn" onClick={() => navigate('/register')}>
            Don't have an account? <span>Sign up</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
