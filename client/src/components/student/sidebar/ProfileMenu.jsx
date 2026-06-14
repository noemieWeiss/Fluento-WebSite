import EditNameForm from './EditNameForm'

export default function ProfileMenu({
  user,
  editOpen,
  setEditOpen,
  setPasswordOpen,
  close,
  onLogout
}) {
  return (
    <div className="sidebar-menu">
      {editOpen ? (
        <EditNameForm user={user} close={close} />
      ) : (
        <>
          <div className="sidebar-menu-label">Settings</div>

          <button
            className="sidebar-menu-item"
            onClick={() => setEditOpen(true)}
          >
            ✏️ Change Name
          </button>

          <button
            className="sidebar-menu-item"
            onClick={() => setPasswordOpen(true)}
          >
            🔑 Change Password
          </button>

          <div className="sidebar-menu-divider" />

          <button
            className="sidebar-menu-item danger"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </>
      )}
    </div>
  )
}