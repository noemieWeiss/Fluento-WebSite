import EditNameForm from '../../common/EditNameForm'
import { usersApi } from '../../../services/usersApi'
import { useUser } from '../../../context/UserContext'

export default function ProfileMenu({
  editOpen,
  setEditOpen,
  setPasswordOpen,
  close,
  onLogout
}) {
  const { user } = useUser()

  return (
    <div className="sidebar-menu">
      {editOpen ? (
        <EditNameForm
          onSave={(name) => usersApi.update(user.id, { name, email: user.email })}
          close={close}
        />
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