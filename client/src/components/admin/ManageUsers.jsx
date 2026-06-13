import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'
import AdminSidebar from './AdminSidebar'
import EditUserModal from './modals/EditUserModal'
import Toast from '../common/Toast'
import { useToast } from '../../hooks/useToast'
import '../../styles/admin.css'
import '../../styles/admin-users.css'

export default function ManageUsers() {
  const [users, setUsers]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editUser, setEditUser]         = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showAddAdmin, setShowAddAdmin]   = useState(false)
  const [adminForm, setAdminForm]         = useState({ name: '', email: '', password: '' })
  const { toast, notify, clear }        = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    adminApi.getUsers().then(data => { setUsers(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleToggleBan = async (user) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended'
    await adminApi.updateUser(user.id, { name: user.name, email: user.email, status: newStatus })
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
    notify(`${user.name} ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`)
  }

  const handleSaveEdit = async (id, data) => {
    await adminApi.updateUser(id, { ...data, status: users.find(u => u.id === id)?.status })
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u))
    notify('User updated successfully')
  }

  const handleDelete = async (user) => {
    await adminApi.deleteUser(user.id)
    setUsers(prev => prev.filter(u => u.id !== user.id))
    setConfirmDelete(null)
    notify(`${user.name} deleted`, 'error')
  }

  const handleAddAdmin = async () => {
    if (!adminForm.name || !adminForm.email || !adminForm.password)
      return notify('Fill all fields', 'error')
    try {
      await adminApi.createAdmin(adminForm)
      notify(`Admin ${adminForm.name} created successfully`)
      setAdminForm({ name: '', email: '', password: '' })
      setShowAddAdmin(false)
    } catch (err) {
      notify(err.message || 'Failed to create admin', 'error')
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || (u.status ?? 'active') === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1>User Management</h1>
          <p>Manage all registered students</p>
          <button className="btn-primary" onClick={() => setShowAddAdmin(true)}>+ Add Admin</button>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}

        <div className="users-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {['all', 'active', 'suspended'].map(f => (
              <button key={f} className={`filter-tab ${filterStatus === f ? 'active' : ''}`} onClick={() => setFilterStatus(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="filter-count">{f === 'all' ? users.length : users.filter(u => (u.status ?? 'active') === f).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-card admin-card--table">
          {loading ? (
            <div className="admin-loading"><div className="spinner" /></div>
          ) : (
            <table className="users-table">
              <thead>
                <tr><th>Student</th><th>Languages</th><th>XP</th><th>Lessons</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="empty-row">No users found</td></tr>
                ) : filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">{user.name?.[0]?.toUpperCase()}</div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="lang-pill">{user.languages || '—'}</span></td>
                    <td><span className="xp-value">{user.totalXP ?? 0} XP</span></td>
                    <td>{user.lessonsCompleted ?? 0}</td>
                    <td>
                      <span className={`status-badge ${user.status ?? 'active'}`}>
                        {user.status === 'suspended' ? '🚫 Suspended' : '✅ Active'}
                      </span>
                    </td>
                    <td className="date-cell">{user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : '—'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn view" title="View full profile" onClick={() => navigate(`/admin/students/${user.id}`)}>👁</button>
                        <button className="action-btn edit" title="Edit user" onClick={() => setEditUser(user)}>✏️</button>
                        <button className={`action-btn ${user.status === 'suspended' ? 'unban' : 'ban'}`} title={user.status === 'suspended' ? 'Reactivate' : 'Suspend'} onClick={() => handleToggleBan(user)}>
                          {user.status === 'suspended' ? '✅' : '🚫'}
                        </button>
                        <button className="action-btn delete" title="Delete user" onClick={() => setConfirmDelete(user)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showAddAdmin && (
          <div className="modal-overlay" onClick={() => setShowAddAdmin(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>Add New Admin</h3>
              <div className="field-group">
                <label>Name</label>
                <input className="admin-input" placeholder="Full name" value={adminForm.name} onChange={e => setAdminForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input className="admin-input" type="email" placeholder="Email" value={adminForm.email} onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="field-group">
                <label>Password</label>
                <input className="admin-input" type="password" placeholder="Password" value={adminForm.password} onChange={e => setAdminForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setShowAddAdmin(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleAddAdmin}>Create Admin</button>
              </div>
            </div>
          </div>
        )}

        {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSaveEdit} />}

        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal-box confirm-box" onClick={e => e.stopPropagation()}>
              <div className="confirm-icon">⚠️</div>
              <h3>Delete {confirmDelete.name}?</h3>
              <p>This will permanently delete the user and all their progress. This cannot be undone.</p>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete Permanently</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
