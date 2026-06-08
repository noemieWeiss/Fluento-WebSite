import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { rewardsApi } from '../../services/rewardsApi'
import '../../styles/admin.css'
import '../../styles/admin-users.css'
import '../../styles/admin-rewards.css'

const TABS = [['progress', '📚 Progress'], ['xp', '💎 XP History'], ['warnings', '⚠️ Warnings']]

export default function StudentProfile() {
  const { userId } = useParams()
  const navigate   = useNavigate()
  const [data, setData]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]     = useState('progress')

  useEffect(() => {
    rewardsApi.getStudentProfile(userId)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [userId])

  if (loading) return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main"><div className="admin-loading"><div className="spinner" /></div></main>
    </div>
  )
  if (!data) return null

  const { user, progress, badges, xpHistory, warnings } = data
  const completed = progress.filter(p => p.completed)
  const avgScore  = completed.length ? Math.round(completed.reduce((s, p) => s + p.score, 0) / completed.length) : 0

  const grouped = progress.reduce((acc, p) => {
    const key = `${p.language}__${p.level}`
    if (!acc[key]) acc[key] = { language: p.language, flag: p.flag_emoji, level: p.level, items: [] }
    acc[key].items.push(p)
    return acc
  }, {})

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <button className="btn-ghost btn-back" onClick={() => navigate('/admin/users')}>
          ← Back to Users
        </button>

        <div className="profile-hero">
          <div className="profile-avatar-lg">{user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
          <div className="profile-hero-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <div className="profile-badges-row">
              <span className={`status-badge ${user.status}`}>{user.status === 'suspended' ? '🚫 Suspended' : '✅ Active'}</span>
              {badges.map(b => <span key={b.id} className="badge-chip small">{b.emoji} {b.name}</span>)}
            </div>
          </div>
          <div className="profile-kpis">
            {[
              { val: user.xp,        cls: 'purple', label: 'XP' },
              { val: `🔥${user.streak}`, cls: 'orange', label: 'Streak' },
              { val: `${avgScore}%`, cls: 'green',  label: 'Avg Score' },
              { val: completed.length, cls: '',     label: 'Completed' },
            ].map(({ val, cls, label }) => (
              <div key={label} className="profile-kpi">
                <span className={`profile-kpi-val ${cls}`}>{val}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reward-tabs profile-tabs">
          {TABS.map(([key, label]) => (
            <button key={key} className={`reward-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>

        {tab === 'progress' && (
          <div className="profile-tab-content">
            {progress.length === 0
              ? <div className="admin-card"><div className="empty-state"><div className="empty-icon">📚</div><div>No lessons attempted yet</div></div></div>
              : Object.values(grouped).map(group => (
                <div key={`${group.language}__${group.level}`} className="admin-card">
                  <div className="admin-card-header">
                    <h2>{group.flag} {group.language} — {group.level}</h2>
                    <span className="card-badge">{group.items.filter(i => i.completed).length}/{group.items.length} done</span>
                  </div>
                  {group.items.map(p => (
                    <div key={p.id} className="progress-lesson-row">
                      <span className={`progress-dot ${p.completed ? 'done' : 'pending'}`} />
                      <span className="progress-lesson-name">{p.lesson}</span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-bg">
                          <div className={`progress-bar-fill score-${p.score >= 80 ? 'high' : p.score >= 50 ? 'mid' : 'low'}`} style={{ width: `${p.score}%` }} />
                        </div>
                        <span className="progress-score">{p.score}%</span>
                      </div>
                      <span className={`status-badge status-badge--sm ${p.completed ? 'active' : 'suspended'}`}>{p.completed ? '✓' : '—'}</span>
                    </div>
                  ))}
                </div>
              ))
            }
          </div>
        )}

        {tab === 'xp' && (
          <div className="admin-card tab-card">
            <div className="admin-card-header"><h2>XP Transaction History</h2></div>
            {xpHistory.length === 0
              ? <div className="empty-state"><div className="empty-icon">💎</div><div>No XP transactions yet</div></div>
              : xpHistory.map((x, i) => (
                <div key={i} className="xp-row">
                  <span className={`xp-amount ${x.amount > 0 ? 'pos' : 'neg'}`}>{x.amount > 0 ? '+' : ''}{x.amount} XP</span>
                  <span className="xp-reason">{x.reason}</span>
                  <span className="xp-by">by {x.given_by_name}</span>
                  <span className="xp-date">{new Date(x.created_at).toLocaleDateString('en-GB')}</span>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'warnings' && (
          <div className="admin-card tab-card">
            <div className="admin-card-header"><h2>Warnings Received</h2></div>
            {warnings.length === 0
              ? <div className="empty-state"><div className="empty-icon">✅</div><div>No warnings</div></div>
              : warnings.map((w, i) => (
                <div key={i} className="warning-item">
                  <div className="warning-header">
                    <span className="warning-student">⚠️ Warning</span>
                    <span className="warning-date">{new Date(w.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="warning-message">{w.message}</div>
                </div>
              ))
            }
          </div>
        )}
      </main>
    </div>
  )
}
