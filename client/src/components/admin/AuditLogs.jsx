import { useEffect, useState, useCallback } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { adminApi } from '../../services/api'
import '../../styles/admin.css'

const ACTION_LABELS = {
  create: { label: 'Create', color: '#22c55e' },
  update: { label: 'Update', color: '#f59e0b' },
  delete: { label: 'Delete', color: '#ef4444' },
}

function buildDescription(log) {
  const { action_type, target_type, target_id, details } = log
  const d = typeof details === 'string' ? JSON.parse(details) : details
  const body = d?.body || {}
  const id = target_id ? ` #${target_id}` : ''

  const who = body.name ? ` "${body.name}"` : body.email ? ` "${body.email}"` : id

  const map = {
    user: {
      create: `Added new user${body.name ? ` "${body.name}"` : ''}${body.email ? ` (${body.email})` : ''}`,
      update: body.status ? `Changed user${id} status to "${body.status}"` : `Updated user${body.name ? ` name to "${body.name}"` : id}`,
      delete: `Deleted user${id}`,
    },
    language: {
      create: `Added language "${body.name || ''}" (${body.code || ''})`,
      update: `Updated language${id}`,
      delete: `Deleted language${id}`,
    },
    level: {
      create: `Added level "${body.title || ''}" (${body.level_number ? `Level ${body.level_number}` : ''})`,
      update: `Updated level${id}`,
      delete: `Deleted level${id}`,
    },
    lesson: {
      create: `Added lesson "${body.title || ''}"`,
      update: `Updated lesson${id}${body.title ? ` title to "${body.title}"` : ''}`,
      delete: `Deleted lesson${id}`,
    },
    word: {
      create: `Added word "${body.word || ''}"${body.translation ? ` → "${body.translation}"` : ''}`,
      update: `Updated word${body.translation ? ` translation to "${body.translation}"` : id}`,
      delete: `Deleted word${id}`,
    },
    badge: {
      create: body.user_id ? `Gave badge #${body.badge_id} to user #${body.user_id}` : `Created badge "${body.name || ''}"`,
      update: `Updated badge${id}`,
      delete: `Removed badge from user`,
    },
    xp: {
      create: `Gave ${body.amount} XP to user #${body.user_id}${body.reason ? ` — "${body.reason}"` : ''}`,
      update: `Updated XP`,
      delete: `Removed XP`,
    },
    warning: {
      create: `Sent warning to user #${body.user_id}${body.message ? `: "${body.message}"` : ''}`,
      update: `Updated warning`,
      delete: `Deleted warning`,
    },
    quiz: {
      create: `Created quiz "${body.title || ''}"`,
      update: body.active === false ? `Deactivated quiz${id}` : `Updated quiz${id}`,
      delete: `Deleted quiz${id}`,
    },
    broadcast: {
      create: `Sent broadcast: "${body.message || ''}"`,
      update: `Deactivated broadcast${id}`,
      delete: `Deleted broadcast${id}`,
    },
    automation: {
      create: `Created automation rule "${body.name || ''}"${body.condition_value ? ` (${body.condition_value} days)` : ''}`,
      update: body.is_active === false ? `Paused automation rule${id}` : `Updated automation rule${id}`,
      delete: `Deleted automation rule${id}`,
    },
  }

  return map[target_type]?.[action_type] ?? `${action_type} ${target_type}${id}`
}

const PAGE_SIZE = 25

export default function AuditLogs() {
  const [logs, setLogs]       = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(0)

  const [filters, setFilters] = useState({
    action_type: '',
    target_type: '',
    from: '',
    to: '',
  })

  const load = useCallback(async (currentPage = 0, currentFilters = filters) => {
    setLoading(true)
    try {
      const params = {
        limit: PAGE_SIZE,
        offset: currentPage * PAGE_SIZE,
        ...Object.fromEntries(Object.entries(currentFilters).filter(([, v]) => v)),
      }
      const data = await adminApi.getAuditLogs(params)
      setLogs(Array.isArray(data.logs) ? data.logs : [])
      setTotal(data.total ?? 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load(page, filters) }, [page])

  const handleFilter = () => { setPage(0); load(0, filters) }
  const handleClear  = () => {
    const cleared = { action_type: '', target_type: '', from: '', to: '' }
    setFilters(cleared)
    setPage(0)
    load(0, cleared)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1>Audit Logs</h1>
          <p>Track all admin actions in the system</p>
        </div>

        {/* Filters */}
        <div className="audit-filters">
          <select
            value={filters.action_type}
            onChange={e => setFilters(f => ({ ...f, action_type: e.target.value }))}
            className="audit-filter-select"
          >
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>

          <select
            value={filters.target_type}
            onChange={e => setFilters(f => ({ ...f, target_type: e.target.value }))}
            className="audit-filter-select"
          >
            <option value="">All Types</option>
            {['user','language','level','lesson','word','warning','quiz','badge','xp','broadcast','automation'].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.from}
            onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
            className="audit-filter-input"
            title="From date"
          />

          <button className="btn-primary" onClick={handleFilter}>Filter</button>
          <button className="btn-secondary" onClick={handleClear}>Clear</button>
        </div>

        <div className="audit-count">
          {total} total log{total !== 1 ? 's' : ''}
        </div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="audit-empty">No logs found.</div>
        ) : (
          <>
            <div className="audit-table-wrap">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>ID</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => {
                    const action = ACTION_LABELS[log.action_type] ?? { label: log.action_type, color: '#6b7280' }
                    const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details
                    return (
                      <tr key={log.id}>
                        <td className="audit-time">{new Date(log.created_at).toLocaleDateString('he-IL')}</td>
                        <td className="audit-time">{new Date(log.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{log.admin_name}</td>
                        <td>
                          <span className="audit-badge" style={{ background: action.color + '22', color: action.color }}>
                            {action.label}
                          </span>
                        </td>
                        <td className="audit-target">{log.target_type}</td>
                        <td>{log.target_id ?? '—'}</td>
                        <td className="audit-details">
                          {buildDescription(log)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="audit-pagination">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span>Page {page + 1} / {totalPages}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
