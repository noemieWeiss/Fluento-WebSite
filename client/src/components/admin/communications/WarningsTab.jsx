import { useState } from 'react'
import { rewardsApi } from '../../../services/rewardsApi'

const TEMPLATES = [
  'Your streak was reset due to inactivity.',
  'Warning: suspicious activity detected on your account.',
  'Please review the community guidelines.',
  'Your last quiz attempt was flagged for review.',
]

export default function WarningsTab({ students, warnings, setWarnings, notify }) {
  const [form, setForm] = useState({ user_id: '', message: '' })

  const handleWarn = async () => {
    if (!form.user_id || !form.message.trim()) return notify('Select student and write message', 'error')
    const res = await rewardsApi.sendWarning(form)
    if (res.message === 'Warning sent') {
      const student = students.find(s => s.id == form.user_id)
      setWarnings(prev => [{ ...form, student_name: student?.name, created_at: new Date().toISOString(), seen: false }, ...prev])
      notify('Warning sent!')
      setForm({ user_id: '', message: '' })
    } else notify(res.message, 'error')
  }

  return (
    <div className="reward-grid">
      <div className="admin-card">
        <div className="admin-card-header"><h2>Send Warning</h2></div>
        <div className="reward-form">
          <div className="field-group">
            <label>Student</label>
            <select className="admin-input admin-select" value={form.user_id} onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))}>
              <option value="">Select student...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label>Quick Templates</label>
            <div className="template-btns">
              {TEMPLATES.map(t => (
                <button key={t} className="template-btn" onClick={() => setForm(f => ({ ...f, message: t }))}>{t}</button>
              ))}
            </div>
          </div>
          <div className="field-group">
            <label>Message</label>
            <textarea className="admin-input admin-textarea" rows={4} placeholder="Write your warning message..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
          </div>
          <button className="btn-danger btn-full" onClick={handleWarn}>
            ⚠️ Send Warning
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Recent Warnings</h2>
          <span className="card-badge">{warnings.length} total</span>
        </div>
        <div className="warnings-list">
          {warnings.length === 0 && <div className="empty-state"><div className="empty-icon">✅</div><div>No warnings sent yet</div></div>}
          {warnings.map((w, i) => (
            <div key={i} className="warning-item">
              <div className="warning-header">
                <span className="warning-student">⚠️ {w.student_name}</span>
                <span className="warning-date">{new Date(w.created_at).toLocaleDateString('en-GB')}</span>
              </div>
              <div className="warning-message">{w.message}</div>
              <div className={`warning-status ${w.seen ? 'seen' : 'unseen'}`}>{w.seen ? '✓ Seen' : '• Unread'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
