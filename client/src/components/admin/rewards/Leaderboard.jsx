const medal = (i) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`

export default function Leaderboard({ leaderboard }) {
  return (
    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="users-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Student</th>
            <th>XP</th>
            <th>Streak</th>
            <th>Badges</th>
            <th>Lessons</th>
            <th>Languages</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((s, i) => (
            <tr key={s.id}>
              <td><span style={{ fontSize: i < 3 ? 22 : 14, fontWeight: 700 }}>{medal(i)}</span></td>
              <td>
                <div className="user-cell">
                  <div className="user-avatar-sm">{s.name[0]}</div>
                  <div>
                    <div className="user-name">{s.name}</div>
                    <div className="user-email">{s.languages || '—'}</div>
                  </div>
                </div>
              </td>
              <td><span className="xp-value">{s.xp} XP</span></td>
              <td><span style={{ color: '#f59e0b', fontWeight: 600 }}>🔥 {s.streak}</span></td>
              <td><span style={{ color: '#a78bfa' }}>🏅 {s.badge_count}</span></td>
              <td>{s.lessons_completed}</td>
              <td><span className="lang-pill">{s.languages || '—'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
