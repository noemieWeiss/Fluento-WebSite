import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'
import AdminSidebar from './AdminSidebar'
import Toast from '../common/Toast'
import { useToast } from '../../hooks/useToast'
import '../../styles/admin.css'
import '../../styles/admin-lessons.css'

const EMPTY_WORD = { word: '', translation: '', ui_language: 'en', example_sentence: '', image_url: '', audio_url: '' }

const UI_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'he', label: 'עברית' },
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
]

export default function ManageWords() {
  const { lessonId } = useParams()
  const navigate     = useNavigate()

  const [words,   setWords]   = useState([])
  const [lesson,  setLesson]  = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast, notify, clear } = useToast()

  const [wordModal,  setWordModal]  = useState(null)  // null | 'create' | word-object
  const [wordForm,   setWordForm]   = useState(EMPTY_WORD)
  const [confirmDel, setConfirmDel] = useState(null)

  useEffect(() => {
    Promise.all([adminApi.getWords(lessonId), adminApi.getLessons()])
      .then(([ws, lessons]) => {
        setWords(Array.isArray(ws) ? ws : [])
        setLesson(lessons.find(l => l.id === Number(lessonId)) || null)
      })
      .catch(() => setWords([]))
      .finally(() => setLoading(false))
  }, [lessonId])

  const openCreate = () => { setWordForm(EMPTY_WORD); setWordModal('create') }
  const openEdit   = (w)  => { setWordForm({ word: w.word, translation: w.translation, example_sentence: w.example_sentence || '', image_url: w.image_url || '', audio_url: w.audio_url || '' }); setWordModal(w) }

  const saveWord = async () => {
    if (!wordForm.word.trim() || !wordForm.translation.trim()) return
    if (wordModal === 'create') {
      const created = await adminApi.createWord(lessonId, wordForm)
      setWords(prev => [...prev, created])
      notify('Word added!')
    } else {
      await adminApi.updateWord(lessonId, wordModal.id, wordForm)
      setWords(prev => prev.map(w => w.id === wordModal.id ? { ...w, ...wordForm } : w))
      notify('Word updated')
    }
    setWordModal(null)
  }

  const deleteWord = async () => {
    await adminApi.deleteWord(lessonId, confirmDel.id)
    setWords(prev => prev.filter(w => w.id !== confirmDel.id))
    notify('Word deleted', 'error')
    setConfirmDel(null)
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header admin-page-header--row">
          <div>
            <button className="btn-ghost" style={{ marginBottom: '6px', fontSize: '0.85rem' }} onClick={() => navigate('/admin/lessons')}>
              ← Back to Lessons
            </button>
            <h1>
              {lesson ? `${lesson.flag_emoji || ''} ${lesson.title}` : `Lesson #${lessonId}`}
            </h1>
            <p>{lesson ? `${lesson.language} · ${lesson.level} · Lesson ${lesson.lesson_number}` : 'Loading...'}</p>
          </div>
          <button className="btn-primary btn-header-action" onClick={openCreate}>+ Add Word</button>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}

        {loading ? (
          <div className="admin-loading"><div className="spinner" /></div>
        ) : words.length === 0 ? (
          <div className="admin-card">
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <div>No words yet. Add the first word to this lesson!</div>
            </div>
          </div>
        ) : (
          <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="hardest-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Word</th>
                  <th>Translation</th>
                  <th>Lang</th>
                  <th>Example sentence</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {words.map((w, i) => (
                  <tr key={w.id}>
                    <td><div className="rank-badge">{i + 1}</div></td>
                    <td><div className="lesson-title">{w.word}</div></td>
                    <td><div style={{ color: '#94a3b8' }}>{w.translation}</div></td>
                    <td><div style={{ color: '#64748b', fontSize: '0.8rem' }}>{w.ui_language || 'en'}</div></td>
                    <td><div style={{ color: '#64748b', fontSize: '0.8rem' }}>{w.example_sentence || '—'}</div></td>
                    <td>
                      <div className="lesson-card-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="action-btn edit"   onClick={() => openEdit(w)}>✏️</button>
                        <button className="action-btn delete" onClick={() => setConfirmDel(w)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Word modal */}
        {wordModal !== null && (
          <div className="modal-overlay" onClick={() => setWordModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>{wordModal === 'create' ? 'Add Word' : 'Edit Word'}</h3>
              {[
                { key: 'word',             label: 'Word (in target language)', placeholder: 'e.g. こんにちは' },
                { key: 'translation',      label: 'Translation',               placeholder: 'e.g. Hello' },
                { key: 'example_sentence', label: 'Example sentence',          placeholder: 'e.g. こんにちは、元気ですか？' },
                { key: 'image_url',        label: 'Image URL',                 placeholder: 'https://...' },
                { key: 'audio_url',        label: 'Audio URL',                 placeholder: 'https://...' },
              ].map(({ key, label, placeholder }) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input
                    className="form-input"
                    placeholder={placeholder}
                    value={wordForm[key]}
                    onChange={e => setWordForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Translation language</label>
                <select className="form-input admin-select" value={wordForm.ui_language} onChange={e => setWordForm(f => ({ ...f, ui_language: e.target.value }))}>
                  {UI_LANGS.map(l => <option key={l.code} value={l.code}>{l.label} ({l.code})</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setWordModal(null)}>Cancel</button>
                <button className="btn-primary" onClick={saveWord}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm delete */}
        {confirmDel && (
          <div className="modal-overlay" onClick={() => setConfirmDel(null)}>
            <div className="modal-box confirm-box" onClick={e => e.stopPropagation()}>
              <div className="confirm-icon">⚠️</div>
              <h3>Delete "{confirmDel.word}"?</h3>
              <p>This word will be permanently removed from the lesson.</p>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setConfirmDel(null)}>Cancel</button>
                <button className="btn-danger" onClick={deleteWord}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
