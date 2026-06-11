export default function LanguageModal({ mode, form, onChange, onSave, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>{mode === 'create' ? 'New Language' : 'Edit Language'}</h3>
        <div className="form-group">
          <label>Name</label>
          <input className="form-input" placeholder="e.g. Spanish" value={form.name}
            onChange={e => onChange(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Code</label>
          <input className="form-input" placeholder="e.g. es" value={form.code}
            onChange={e => onChange(f => ({ ...f, code: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Flag emoji</label>
          <input className="form-input" placeholder="e.g. 🇪🇸" value={form.flag_emoji}
            onChange={e => onChange(f => ({ ...f, flag_emoji: e.target.value }))} />
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
