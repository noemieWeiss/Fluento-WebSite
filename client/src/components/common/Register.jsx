import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { usersApi } from '../../services/api'
import '../../styles/forms.css'

function Register() {
  const formRef = useRef()
  const navigate = useNavigate()
  const { login } = useUser()

  const handleRegister = async (e) => {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    const username = formData.get('username')
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password.length <= 8) {
      alert('Password must be more than 8 characters')
      return
    }
    if (!/[0-9]/.test(password)) {
      alert('Password must contain at least one number')
      return
    }
    if (!/[A-Z]/.test(password)) {
      alert('Password must contain at least one uppercase letter')
      return
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const result = await usersApi.create({ username, name, email, password })
      if (result?.message === 'Username already exists') {
        alert('Username already taken')
        return
      }
      if (!result?.id) {
        alert(result?.message || 'Registration failed')
        return
      }
      const fullUser = await usersApi.login(username, password)
      if (!fullUser) {
        navigate('/login')
        return
      }
      login(fullUser)
      navigate(`/users/${fullUser.id}/home`)
    } catch (error) {
      alert('Server error - please try again')
    }
  }

  return (
    <div className="register-page">
      <div className="container">
        <div className="auth-card">
          <div className="brand">
            <div className="brand-logo">F</div>
            <span className="brand-name">Fluento</span>
          </div>

          <h2>Create an account</h2>
          <p className="auth-subtitle">Start your language learning journey</p>

          <form ref={formRef} onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" name="username" placeholder="Choose a username" required />
            </div>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" name="name" placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" name="password" placeholder="Min 8 chars, 1 number, 1 uppercase" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" name="confirmPassword" placeholder="Repeat your password" required />
            </div>
            <button type="submit">Create account</button>
          </form>

          <button className="secondary-btn" onClick={() => navigate('/login')}>
            Already have an account? <span>Sign in</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
