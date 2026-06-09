import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StudentSidebar from '../../components/student/StudentSidebar'
import { studentApi } from '../../services/api'
import '../../styles/student.css'

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

export default function StudentDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    studentApi.getStats()
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => { setError('Failed to load stats'); setLoading(false) })
  }, [])

  return (
    <div className="student-layout">
      <StudentSidebar />
      <main className="student-main">
        <div className="student-page-header">
          <h1>My Learning Dashboard</h1>
          <p>Track your progress and learning goals</p>
        </div>

        {error && <div className="student-error">{error}</div>}

        {loading ? (
          <div className="student-loading"><div className="spinner" /><span className="loading-text">Loading your progress...</span></div>
        ) : (
          <>
            <div className="kpi-grid">
              <div className="kpi-card blue">
                <div className="kpi-icon">📚</div>
                <div className="kpi-info">
                  <div className="kpi-label">Lessons Completed</div>
                  <div className="kpi-value">{stats?.kpi?.totalLessons ?? '—'}</div>
                  <div className="kpi-sub">Total lessons finished</div>
                </div>
              </div>
              <div className="kpi-card green">
                <div className="kpi-icon">⭐</div>
                <div className="kpi-info">
                  <div className="kpi-label">Total XP</div>
                  <div className="kpi-value">{stats?.kpi?.totalXP ?? '—'}</div>
                  <div className="kpi-sub">Experience points earned</div>
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
              <div className="student-card">
                <div className="student-card-header">
                  <h2>Weekly Activity</h2>
                  <span className="card-badge">Last 7 days</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={fillWeekly(stats?.weeklyActivity)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="completions" name="completions" stroke="#3b82f6" strokeWidth={2} fill="url(#colorComp)" dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="student-card recommended-card">
                <div className="student-card-header"><h2>Recommended Lessons</h2></div>
                {!stats?.upcomingLessons?.length ? (
                  <div className="empty-state"><div className="empty-icon">🎓</div><div>No recommended lessons yet</div></div>
                ) : (
                  <div className="recommended-lessons">
                    {stats.upcomingLessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className="lesson-item"
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="lesson-flag">{lesson.flag_emoji}</div>
                        <div className="lesson-details">
                          <div className="lesson-title">{lesson.title}</div>
                          <div className="lesson-meta">{lesson.language} • {lesson.level}</div>
                        </div>
                        <div className="lesson-status">
                          {lesson.isCompleted ? <span className="status-badge completed">✓ Done</span> : <span className="status-badge pending">→ Start</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
