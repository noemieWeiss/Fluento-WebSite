import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Toast from '../../components/common/Toast'
import AutomationForm, { EMPTY_RULE } from '../../components/admin/AutomationForm'
import { useToast } from '../../hooks/useToast'
import { automationApi } from '../../services/api'
import '../../styles/admin.css'

export default function AutomationRules() {
  const [rules,    setRules]   = useState([])
  const [loading,  setLoading] = useState(true)
  const [form,     setForm]    = useState(EMPTY_RULE)
  const [editing,  setEditing] = useState(null)
  const [saving,   setSaving]  = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { toast, notify, clear } = useToast()

  useEffect(() => {
    automationApi.getAll()
      .then(data => setRules(Array.isArray(data) ? data : []))
      .catch(() => notify('Failed to load rules', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_RULE); setShowForm(true) }

  const openEdit = (rule) => {
    setEditing(rule.id)
    setForm({ name: rule.name, trigger_type: rule.trigger_type, condition_value: rule.condition_value,
              action_type: rule.action_type, email_subject: rule.email_subject || '', email_template: rule.email_template || '' })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await automationApi.update(editing, form)
        setRules(prev => prev.map(r => r.id === editing ? { ...r, ...form } : r))
        notify('Rule updated')
      } else {
        await automationApi.create(form)
        setRules(await automationApi.getAll())
        notify('Rule created!')
      }
      setShowForm(false)
      setEditing(null)
    } catch { notify('Failed to save rule', 'error') }
    finally { setSaving(false) }
  }

  const handleToggle = async (id) => {
    await automationApi.toggle(id)
    setRules(prev => prev.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r))
  }

  const handleDelete = async (id) => {
    await automationApi.delete(id)
    setRules(prev => prev.filter(r => r.id !== id))
    notify('Rule deleted', 'error')
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1>Automation Rules</h1>
          <p>Set up triggers to automatically send emails to students</p>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}

        <div className="automation-toolbar">
          <button className="btn-primary" onClick={openCreate}>+ New Rule</button>
          <div className="automation-info">Runs daily at 08:00 · node-cron + Nodemailer</div>
        </div>

        {showForm && (
          <AutomationForm
            form={form} onChange={setForm}
            onSubmit={handleSubmit} onCancel={() => setShowForm(false)}
            isEdit={!!editing} saving={saving}
          />
        )}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : rules.length === 0 ? (
          <div className="audit-empty">No automation rules yet. Create your first rule above.</div>
        ) : (
          <div className="automation-list">
            {rules.map(rule => (
              <div key={rule.id} className={`automation-card ${rule.is_active ? 'active' : 'inactive'}`}>
                <div className="automation-card-header">
                  <div className="automation-card-title">
                    <span className={`broadcast-status ${rule.is_active ? 'status-active' : 'status-inactive'}`}>
                      {rule.is_active ? 'Active' : 'Paused'}
                    </span>
                    <strong>{rule.name}</strong>
                  </div>
                  <div className="automation-card-actions">
                    <button className="btn-icon" title="Edit" onClick={() => openEdit(rule)}>✏️</button>
                    <button className={`btn-toggle ${rule.is_active ? 'on' : 'off'}`} onClick={() => handleToggle(rule.id)}>
                      {rule.is_active ? 'Pause' : 'Activate'}
                    </button>
                    <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(rule.id)}>🗑️</button>
                  </div>
                </div>

                <div className="automation-card-body">
                  <div className="automation-trigger">
                    <span className="automation-tag">IF</span>
                    Student inactive for {rule.condition_value} day{rule.condition_value !== 1 ? 's' : ''}
                  </div>
                  <div className="automation-action">
                    <span className="automation-tag action">THEN</span>
                    {rule.action_type === 'send_email' ? `Send email: "${rule.email_subject || 'We miss you!'}"` : rule.action_type}
                  </div>
                </div>

                <div className="automation-card-footer">
                  Created by {rule.created_by_name} · {new Date(rule.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
