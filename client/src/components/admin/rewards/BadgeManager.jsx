import { useState } from 'react'
import { rewardsApi } from '../../../services/rewardsApi'

export default function BadgeManager({ students, badges, setBadges, notify }) {
  const [badgeForm, setBadgeForm]     = useState({ user_id: '', badge_id: '' })
  const [newBadge, setNewBadge]       = useState({ name: '', emoji: '', description: '' })
  const [showNewBadge, setShowNewBadge] = useState(false)
  const [userBadges, setUserBadges]   = useState([])
  const [revokeUser, setRevokeUser]   = useState('')

  const handleGiveBadge = async () => {
    if (!badgeForm.user_id || !badgeForm.badge_id) return notify('Select student and badge', 'error')
    const res = await rewardsApi.giveBadge(badgeForm)
    if (res.message === 'Badge awarded') notify('Badge awarded!')
    else notify(res.message, 'error')
  }

  const handleCreateBadge = async () => {
    if (!newBadge.name || !newBadge.emoji) return notify('Name and emoji required', 'error')
    const res = await rewardsApi.createBadge(newBadge)
    if (res.id) {
      setBadges(prev => [...prev, res])
      notify('Badge created!')
      setShowNewBadge(false)
      setNewBadge({ name: '', emoji: '', description: '' })
    } else notify(res.message, 'error')
  }

  const loadUserBadges = async (userId) => {
    setRevokeUser(userId)
    const data = await rewardsApi.getUserBadges(userId)
    setUserBadges(data)
    setBadgeForm(f => ({ ...f, user_id: userId }))
  }

  const handleRevoke = async (badgeId, badgeName) => {
    await rewardsApi.revokeBadge(revokeUser, badgeId)
    setUserBadges(prev => prev.filter(b => b.id !== badgeId))
    notify(`Badge "${badgeName}" revoked`, 'error')
  }

  return (
    <div className="reward-grid">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Award Badge</h2>
          <button className="btn-primary btn-sm"
            onClick={() => setShowNewBadge(v => !v)}>
            + New Badge
          </button>
        </div>

        {showNewBadge && (
          <div className="new-badge-form">
            <div className="badge-name-row">
              <div className="field-group badge-emoji-field">
                <label>Emoji</label>
                <input className="admin-input" placeholder="🏅" value={newBadge.emoji}
                  onChange={e => setNewBadge(f => ({ ...f, emoji: e.target.value }))} />
              </div>
              <div className="field-group badge-name-field">
                <label>Name</label>
                <input className="admin-input" placeholder="Badge name" value={newBadge.name}
                  onChange={e => setNewBadge(f => ({ ...f, name: e.target.value }))} />
              </div>
            </div>
            <div className="field-group">
              <label>Description</label>
              <input className="admin-input" placeholder="What did they do to earn it?" 
                value={newBadge.description} onChange={e => setNewBadge(f => ({ ...f, description: e.target.value }))} />
            </div>
            <button className="btn-primary" onClick={handleCreateBadge}>Create Badge</button>
          </div>
        )}

        <div className="badge-grid">
          {badges.map(b => (
            <div key={b.id} className="badge-chip">
              <span className="badge-emoji">{b.emoji}</span>
              <span className="badge-name">{b.name}</span>
            </div>
          ))}
        </div>

        <div className="badge-award-section">
          <div className="field-group">
            <label>Student</label>
            <select className="admin-input admin-select" value={badgeForm.user_id} 
              onChange={e => loadUserBadges(e.target.value)}>
              <option value="">Select student...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label>Badge</label>
            <select className="admin-input admin-select" value={badgeForm.badge_id} 
              onChange={e => setBadgeForm(f => ({ ...f, badge_id: e.target.value }))}>
              <option value="">Select badge...</option>
              {badges.map(b => <option key={b.id} value={b.id}>{b.emoji} {b.name}</option>)}
            </select>
          </div>
          <button className="btn-primary btn-full" onClick={handleGiveBadge}>Award Badge</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header"><h2>Revoke Badge</h2></div>
        <div className="field-group">
          <label>Select Student</label>
          <select className="admin-input admin-select" value={revokeUser} onChange={e => loadUserBadges(e.target.value)}>
            <option value="">Select student...</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="revoke-list">
          {revokeUser && userBadges.length === 0 && <div className="empty-state"><div>No badges yet</div></div>}
          {userBadges.map(b => (
            <div key={b.id} className="streak-row">
              <span className="revoke-badge-emoji">{b.emoji}</span>
              <span className="streak-name">{b.name}</span>
              <button className="action-btn delete" onClick={() => handleRevoke(b.id, b.name)}>🗑</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
