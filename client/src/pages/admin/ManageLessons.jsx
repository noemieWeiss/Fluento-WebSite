import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar'
import LessonModal from '../../components/admin/modals/LessonModal'
import Toast from '../../components/common/Toast'
import { useToast } from '../../hooks/useToast'
import '../../styles/admin.css'
import '../../styles/admin-users.css'
import '../../styles/admin-lessons.css'

export default function ManageLessons() {
  const navigate                        = useNavigate()
  const [lessons, setLessons]           = useState([])
  const [levels, setLevels]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [filterLang, setFilterLang]     = useState('all')
  const [editLesson, setEditLesson]     = useState(null)
  const [showCreate, setShowCreate]     = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toast, notify, clear }        = useToast()

  useEffect(() => {
    Promise.all([adminApi.getLessons(), adminApi.getLevels()])
      .then(([ls, lvs]) => { setLessons(ls); setLevels(lvs); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const languages = ['all', ...new Set(lessons.map(l => l.language))]

  const filtered = lessons.filter(l => {
    const matchSearch = l.title?.toLowerCase().includes(search.toLowerCase())
    const matchLang   = filterLang === 'all' || l.language === filterLang
    return matchSearch && matchLang
  })

  const grouped = filtered.reduce((acc, l) => {
    const key = `${l.language}__${l.level}`
    if (!acc[key]) acc[key] = { language: l.language, flag: l.flag_emoji, level: l.level, items: [] }
    acc[key].items.push(l)
    return acc
  }, {})

  const handleCreate = async (form) => {
    const created = await adminApi.createLesson(form)
    const level   = levels.find(lv => lv.id == form.level_id)
    setLessons(prev => [...prev, { ...created, level: level?.title, language: level?.language, flag_emoji: level?.flag_emoji }])
    notify('Lesson created!')
  }

  const handleEdit = async (form) => {
    await adminApi.updateLesson(editLesson.id, form)
    setLessons(prev => prev.map(l => l.id === editLesson.id ? { ...l, ...form } : l))
    notify('Lesson updated!')
  }

  const handleDelete = async (lesson) => {
    await adminApi.deleteLesson(lesson.id)
    setLessons(prev => prev.filter(l => l.id !== lesson.id))
    setConfirmDelete(null)
    notify(`"${lesson.title}" deleted`, 'error')
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header admin-page-header--row">
          <div>
            <h1>Lesson Management</h1>
            <p>Create and manage the learning curriculum</p>
          </div>
          <button className="btn-primary btn-header-action" onClick={() => setShowCreate(true)}>+ New Lesson</button>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}

        <div className="users-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {languages.map(lang => (
              <button key={lang} className={`filter-tab ${filterLang === lang ? 'active' : ''}`} onClick={() => setFilterLang(lang)}>
                {lang === 'all' ? 'All' : lang}
                <span className="filter-count">{lang === 'all' ? lessons.length : lessons.filter(l => l.language === lang).length}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="spinner" /></div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="admin-card"><div className="empty-state"><div className="empty-icon">📚</div><div>No lessons found</div></div></div>
        ) : (
          Object.values(grouped).map(group => (
            <div key={`${group.language}__${group.level}`} className="lesson-group">
              <div className="lesson-group-header">
                <span className="group-flag">{group.flag}</span>
                <span className="group-language">{group.language}</span>
                <span className="group-separator">›</span>
                <span className="group-level">{group.level}</span>
                <span className="group-count">{group.items.length} lessons</span>
              </div>
              <div className="lesson-cards">
                {group.items.sort((a, b) => a.lesson_number - b.lesson_number).map(lesson => (
                  <div key={lesson.id} className="lesson-card">
                    <div className="lesson-card-number">#{lesson.lesson_number}</div>
                    <div className="lesson-card-title">{lesson.title}</div>
                    <div className="lesson-card-actions">
                      <button className="action-btn words" title="Manage words" onClick={() => navigate(`/admin/lessons/${lesson.id}/words`)}>📝</button>
                      <button className="action-btn edit" onClick={() => setEditLesson(lesson)}>✏️</button>
                      <button className="action-btn delete" onClick={() => setConfirmDelete(lesson)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {showCreate  && <LessonModal levels={levels} onClose={() => setShowCreate(false)} onSave={handleCreate} />}
        {editLesson  && <LessonModal lesson={editLesson} levels={levels} onClose={() => setEditLesson(null)} onSave={handleEdit} />}

        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal-box confirm-box" onClick={e => e.stopPropagation()}>
              <div className="confirm-icon">⚠️</div>
              <h3>Delete "{confirmDelete.title}"?</h3>
              <p>This will delete the lesson and all student progress for it. Cannot be undone.</p>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
