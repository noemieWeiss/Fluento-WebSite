const EMPTY_RULE = {
  name: '',
  trigger_type: 'inactivity',
  condition_value: 5,
  action_type: 'send_email',
  email_subject: '',
  email_template: '',
}

export { EMPTY_RULE }

export default function AutomationForm({ form, onChange, onSubmit, onCancel, isEdit, saving }) {
  return (
    <div className="automation-form-card">
      <h2>{isEdit ? 'Edit Rule' : 'New Automation Rule'}</h2>
      <form onSubmit={onSubmit} className="automation-form">
        <label className="form-label">
          Rule Name
          <input className="form-input" value={form.name} required
            onChange={e => onChange(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Inactivity reminder" />
        </label>

        <div className="form-row">
          <label className="form-label">
            Trigger
            <select className="form-input" value={form.trigger_type}
              onChange={e => onChange(f => ({ ...f, trigger_type: e.target.value }))}>
              <option value="inactivity">Student inactivity</option>
            </select>
          </label>
          <label className="form-label">
            Days without login
            <input type="number" className="form-input" min={1} max={365} required
              value={form.condition_value}
              onChange={e => onChange(f => ({ ...f, condition_value: parseInt(e.target.value) }))} />
          </label>
          <label className="form-label">
            Action
            <select className="form-input" value={form.action_type}
              onChange={e => onChange(f => ({ ...f, action_type: e.target.value }))}>
              <option value="send_email">Send Email</option>
            </select>
          </label>
        </div>

        {form.action_type === 'send_email' && (
          <>
            <label className="form-label">
              Email Subject
              <input className="form-input" value={form.email_subject}
                onChange={e => onChange(f => ({ ...f, email_subject: e.target.value }))}
                placeholder="We miss you on Fluento!" />
            </label>
            <label className="form-label">
              Email Body
              <textarea className="form-textarea" rows={4} value={form.email_template}
                onChange={e => onChange(f => ({ ...f, email_template: e.target.value }))}
                placeholder="Hi {{name}}, you haven't logged in for {{days}} days. Come back! 🎓" />
              <span className="form-hint">Use {'{{name}}'} and {'{{days}}'} as placeholders</span>
            </label>
          </>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Rule'}
          </button>
        </div>
      </form>
    </div>
  )
}
