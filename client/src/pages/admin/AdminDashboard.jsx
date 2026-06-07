import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { adminApi } from '../../services/api'
import '../../styles/admin.css'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      <div><strong>{payload[0].value}</strong> {payload[0].name}</div>
    </div>
  )
}

const fillWeekly = (raw) => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key   = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en', { weekday: 'short' })
    const found = raw?.find(r => r.day?.slice(0, 10) === key)
    days.push({ day: label, completions: found ? found.completions : 0 })
  }
  return days
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    adminApi.getStats()
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => { setError('Failed to load stats'); setLoading(false) })
  }, [])

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1>Dashboard</h1>
          <p>Overview of Fluento platform activity</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loading"><div className="spinner" /><span style={{ color: '#475569' }}>Loading stats...</span></div>
        ) : (
          <>
            <div className="kpi-grid">
              <div className="kpi-card purple">
                <div className="kpi-icon">👥</div>
                <div className="kpi-info">
                  <div className="kpi-label">Total Students</div>
                  <div className="kpi-value">{stats?.kpi?.totalUsers ?? '—'}</div>
                  <div className="kpi-sub">Registered accounts</div>
                </div>
              </div>
              <div className="kpi-card green">
                <div className="kpi-icon">⚡</div>
                <div className="kpi-info">
                  <div className="kpi-label">Active Today</div>
                  <div className="kpi-value">{stats?.kpi?.activeToday ?? '—'}</div>
                  <div className="kpi-sub">Completed a lesson today</div>
                </div>
              </div>
              <div className="kpi-card orange">
                <div className="kpi-icon">🎯</div>
                <div className="kpi-info">
                  <div className="kpi-label">Success Rate</div>
                  <div className="kpi-value">{stats?.kpi?.successRate ?? '—'}%</div>
                  <div className="kpi-sub">Lessons completed successfully</div>
                </div>
              </div>
            </div>

            <div className="charts-row">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>Weekly Activity</h2>
                  <span className="card-badge">Last 7 days</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={fillWeekly(stats?.weeklyActivity)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="completions" name="completions" stroke="#6366f1" strokeWidth={2} fill="url(#colorComp)" dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-card-header"><h2>Platform Health</h2></div>
                {[
                  { label: 'Engagement',          value: stats?.kpi?.activeToday > 0 ? Math.min(100, Math.round((stats.kpi.activeToday / stats.kpi.totalUsers) * 100)) : 0, color: '#6366f1' },
                  { label: 'Success Rate',         value: stats?.kpi?.successRate ?? 0, color: '#10b981' },
                  { label: 'Activity This Week',   value: stats?.weeklyActivity?.reduce((s, d) => s + d.completions, 0) > 0 ? Math.min(100, stats.weeklyActivity.reduce((s, d) => s + d.completions, 0) * 5) : 0, color: '#f59e0b' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
                    </div>
                    <div style={{ height: 8, background: '#1e2535', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 4, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Hardest Lessons</h2>
                <span className="card-badge">By failure rate</span>
              </div>
              {!stats?.hardestLessons?.length ? (
                <div className="empty-state"><div className="empty-icon">📋</div><div>No lesson data yet</div></div>
              ) : (
                <table className="hardest-table">
                  <thead>
                    <tr><th>#</th><th>Lesson</th><th>Failures</th><th>Avg Score</th></tr>
                  </thead>
                  <tbody>
                    {stats.hardestLessons.map((lesson, i) => {
                      const failRate = lesson.attempts > 0 ? Math.round((lesson.failures / lesson.attempts) * 100) : 0
                      return (
                        <tr key={lesson.id}>
                          <td><div className={`rank-badge rank-${i + 1}`}>{i + 1}</div></td>
                          <td>
                            <div className="lesson-title">{lesson.lesson}</div>
                            <div className="lesson-meta">{lesson.language} · {lesson.level}</div>
                          </td>
                          <td>
                            <div className="failure-bar-wrap">
                              <div className="failure-bar-bg"><div className="failure-bar-fill" style={{ width: `${failRate}%` }} /></div>
                              <span className="failure-count">{lesson.failures}</span>
                            </div>
                          </td>
                          <td><span className={`score-badge ${lesson.avgScore < 50 ? 'low' : ''}`}>{lesson.avgScore ?? 0}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
