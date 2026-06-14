import { getInitials } from '../../utils/getInitials'

export default function SidebarProfileButton({ name, role, onClick }) {
  return (
    <button className="sidebar-profile" onClick={onClick}>
      <div className="sidebar-avatar">{getInitials(name)}</div>
      <div className="sidebar-profile-info">
        <div className="sidebar-profile-name">{name ?? role}</div>
        <div className="sidebar-profile-role">{role}</div>
      </div>
      <span className="sidebar-chevron">▲</span>
    </button>
  )
}
