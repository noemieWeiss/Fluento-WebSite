export default function UserProgressModal({ user, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Progress — {user.name}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="progress-stats">
            <div className="progress-stat">
              <span className="progress-stat-value purple">{user.totalXP ?? 0}</span>
              <span className="progress-stat-label">Total XP</span>
            </div>
            <div className="progress-stat">
              <span className="progress-stat-value green">{user.lessonsCompleted ?? 0}</span>
              <span className="progress-stat-label">Lessons Done</span>
            </div>
            <div className="progress-stat">
              <span className="progress-stat-value orange">{user.languages || '—'}</span>
              <span className="progress-stat-label">Languages</span>
            </div>
          </div>
          <div className="progress-detail">
            <p><strong>Member since:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : '—'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Status:</strong> <span className={`status-badge ${user.status}`}>{user.status ?? 'active'}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
