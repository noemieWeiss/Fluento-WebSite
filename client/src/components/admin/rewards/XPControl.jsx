import { rewardsApi } from '../../../services/rewardsApi'

const QUICK = [
  { l: '🎉 +50 Bonus',   a: 50,  r: 'Admin bonus' },
  { l: '🚀 +100 Event',  a: 100, r: 'Special event reward' },
  { l: '⚠️ -20 Penalty', a: -20, r: 'Rule violation' },
  { l: '🔥 +25 Streak',  a: 25,  r: 'Streak reward' },
]

export default function XPControl({ students, leaderboard, setLeaderboard, xpForm, setXpForm, notify }) {
  const handleGiveXP = async () => {
    if (!xpForm.user_id || !xpForm.amount || !xpForm.reason) return notify('Fill all fields', 'error')
    const res = await rewardsApi.giveXP(xpForm)
    if (res.newXP !== undefined) {
      setLeaderboard(prev =>
        prev.map(s => s.id == xpForm.user_id ? { ...s, xp: res.newXP } : s)
            .sort((a, b) => b.xp - a.xp)
      )
      notify(`${Number(xpForm.amount) > 0 ? '+' : ''}${xpForm.amount} XP sent!`)
      setXpForm({ user_id: '', amount: '', reason: '' })
    } else notify(res.message || 'Error', 'error')
  }

  const handleResetStreak = async (userId, name) => {
    await rewardsApi.resetStreak(userId)
    setLeaderboard(prev => prev.map(s => s.id === userId ? { ...s, streak: 0 } : s))
    notify(`${name}'s streak reset`)
  }

  return (
    <div className="reward-grid">
      <div className="admin-card">
        <div className="admin-card-header"><h2>Give / Deduct XP</h2></div>
        <div className="reward-form">
          <div className="field-group">
            <label>Student</label>
            <select className="admin-input admin-select" value={xpForm.user_id} 
              onChange={e => setXpForm(f => ({ ...f, user_id: e.target.value }))}>
              <option value="">Select student...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label>Amount (negative to deduct)</label>
            <input className="admin-input" type="number" placeholder="e.g. 50 or -30" 
              value={xpForm.amount} onChange={e => setXpForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
          <div className="field-group">
            <label>Reason</label>
            <input className="admin-input" placeholder="e.g. Weekend bonus, Cheating penalty..." 
              value={xpForm.reason} onChange={e => setXpForm(f => ({ ...f, reason: e.target.value }))} />
          </div>
          <div className="reward-quick-btns">
            {QUICK.map(({ l, a, r }) => (
              <button key={l} className="quick-btn" onClick={() => setXpForm(f => ({ ...f, amount: a, reason: r }))}>{l}</button>
            ))}
          </div>
          <button className="btn-primary btn-full btn-xp-send" onClick={handleGiveXP}>Send XP</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header"><h2>Streak Management</h2></div>
        <div className="streak-list">
          {leaderboard.slice(0, 8).map(s => (
            <div key={s.id} className="streak-row">
              <div className="user-avatar-sm user-avatar-sm--xs">{s.name[0]}</div>
              <span className="streak-name">{s.name}</span>
              <span className="streak-val">🔥 {s.streak} days</span>
              <button className="action-btn ban" title="Reset streak" onClick={() => handleResetStreak(s.id, s.name)}>↺</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
