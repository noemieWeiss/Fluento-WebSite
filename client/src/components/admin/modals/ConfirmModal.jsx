export default function ConfirmModal({ title, message, onConfirm, onClose, confirmLabel = 'Delete' }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box confirm-box" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">⚠️</div>
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
