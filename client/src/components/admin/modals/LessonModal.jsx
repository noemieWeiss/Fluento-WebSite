import { useState } from 'react'

export default function LessonModal({ lesson, levels, onClose, onSave }) {
  const [form, setForm] = useState(
    lesson
      ? { title: lesson.title, lesson_number: lesson.lesson_number, level_id: lesson.level_id }
      : { title: '', lesson_number: '', level_id: levels[0]?.id ?? '' }
  )
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.title || !form.lesson_number || !form.level_id) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{lesson ? 'Edit Lesson' : 'New Lesson'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="field-group">
            <label>Level</label>
            <select className="admin-input admin-select" value={form.level_id} onChange={e => setForm(f => ({ ...f, level_id: e.target.value }))}>
              {levels.map(lv => (
                <option key={lv.id} value={lv.id}>{lv.flag_emoji} {lv.language} — {lv.title}</option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>Lesson Title</label>
            <input className="admin-input" placeholder="e.g. Colors, Animals..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="field-group">
            <label>Lesson Number</label>
            <input className="admin-input" type="number" min="1" value={form.lesson_number} onChange={e => setForm(f => ({ ...f, lesson_number: e.target.value }))} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || !form.title || !form.lesson_number}>
            {saving ? 'Saving...' : lesson ? 'Save Changes' : 'Create Lesson'}
          </button>
        </div>
      </div>
    </div>
  )
}
