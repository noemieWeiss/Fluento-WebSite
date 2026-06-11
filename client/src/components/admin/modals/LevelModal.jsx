export default function LevelModal({ isEdit, form, onChange, onSave, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>{isEdit ? 'Edit Level' : 'New Level'}</h3>
        <div className="form-group">
          <label>Title</label>
          <input className="form-input" placeholder="e.g. Beginner" value={form.title}
            onChange={e => onChange(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Level number</label>
          <input className="form-input" type="number" min="1" placeholder="1" value={form.level_number}
            onChange={e => onChange(f => ({ ...f, level_number: e.target.value }))} />
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
