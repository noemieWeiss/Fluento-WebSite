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
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const user = await usersApi.login(email, password)
      if (user) {
        login(user)
        if (user.role === 'admin') {
          navigate('/admin')
        } else if (user.isNewStudent) {
          navigate('/choose-language')
        } else {
          navigate('/student')
        }
      } else {
        alert('email or password incorrect')
      }
    } catch (error) {
      alert('email or password incorrect')
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
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email"
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
