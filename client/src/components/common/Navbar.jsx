import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import '../../styles/global.css'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Fluento" className="navbar-logo-img" />
      </Link>
    </nav>
  )
}

export default Navbar
