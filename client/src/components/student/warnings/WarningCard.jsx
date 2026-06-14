export default function WarningCard({ warning, onMarkSeen }) {
  return (
    <div className={`warning-card ${warning.seen ? 'seen' : 'unseen'}`}>
      <div className="warning-header">
        <div className="warning-from">
          <span className="warning-icon">👤</span>
          <span>
            From: <strong>{warning.admin_name}</strong>
          </span>
        </div>

        <div className="warning-date">
          {new Date(warning.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      <div className="warning-message">
        {warning.message}
      </div>

      {!warning.seen && (
        <button
          className="btn-mark-seen"
          onClick={() => onMarkSeen(warning.id)}
        >
          Mark as Read
        </button>
      )}
    </div>
  )
}