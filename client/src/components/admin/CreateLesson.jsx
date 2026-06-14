import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'
import AdminSidebar from './AdminSidebar'
import Toast from '../common/Toast'
import { useToast } from '../../hooks/useToast'
import '../../styles/admin.css'
import '../../styles/admin-lessons.css'
import '../../styles/admin-users.css'

const STEPS = ['Language', 'Level', 'Lesson', 'Words', 'Done']

import { UI_LANGS, LANG_LIST, EMPTY_WORD } from '../../utils/constants'

function LangRefCard({ flag, name, code, onUse }) {
  const [used, setUsed] = useState(false)
  const handleUse = () => {
    onUse({ flag, name, code })
    setUsed(true)
    setTimeout(() => setUsed(false), 1500)
  }
  return (
    <div className="lang-ref-card">
      <span className="lang-ref-card-flag">{flag}</span>
      <span className="lang-ref-card-name">{name}</span>
      <code className="lang-ref-code">{code}</code>
      <button className={`lang-ref-use-btn ${used ? 'used' : ''}`} onClick={handleUse}>
        {used ? '✓ Added!' : 'Use this →'}
      </button>
    </div>
  )
}

export default function CreateLesson() {
  const navigate = useNavigate()
  const { toast, notify, clear } = useToast()

  const [tab, setTab]   = useState('builder')
  const [step, setStep] = useState(0)

  const [languages, setLanguages] = useState([])
  const [levels,    setLevels]    = useState([])
  const [loading,   setLoading]   = useState(true)

  const [selectedLang,  setSelectedLang]  = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [createdLesson, setCreatedLesson] = useState(null)

  const [newLangForm,  setNewLangForm]  = useState({ name: '', code: '', flag_emoji: '' })
  const [newLevelForm, setNewLevelForm] = useState({ title: '', level_number: '' })
  const [lessonForm,   setLessonForm]   = useState({ title: '', lesson_number: '' })
  const [words,        setWords]        = useState([])
  const [wordForm,     setWordForm]     = useState(EMPTY_WORD)
  const [wordError,    setWordError]    = useState('')

  const [creatingLang,  setCreatingLang]  = useState(false)
  const [creatingLevel, setCreatingLevel] = useState(false)

  useEffect(() => {
    Promise.all([adminApi.getLanguages(), adminApi.getLevels()])
      .then(([langs, lvls]) => { setLanguages(langs); setLevels(lvls) })
      .finally(() => setLoading(false))
  }, [])

  const levelsFor = (langId) => levels.filter(lv => lv.language_id === langId)

  // כשלוחצים "Use this" ברפרנס — ממלא את הטופס ועובר לbuilder
  const handleUseFromRef = ({ flag, name, code }) => {
    const existing = languages.find(l => l.code === code || l.name.toLowerCase() === name.toLowerCase())
    if (existing) {
      setSelectedLang(existing)
      setCreatingLang(false)
      setTab('builder')
      notify(`${existing.flag_emoji || flag} ${existing.name} selected!`)
    } else {
      setNewLangForm({ name, code, flag_emoji: flag })
      setCreatingLang(true)
      setTab('builder')
    }
  }

  const handleSelectLang = (lang) => { setSelectedLang(lang); setSelectedLevel(null); setCreatingLang(false) }

  const handleCreateLang = async () => {
    if (!newLangForm.name.trim() || !newLangForm.code.trim()) return
    try {
      const created = await adminApi.createLanguage(newLangForm)
      if (!created?.id) { notify('Failed to create language', 'error'); return }
      setLanguages(prev => [...prev, created])
      setSelectedLang(created)
      setCreatingLang(false)
      setNewLangForm({ name: '', code: '', flag_emoji: '' })
      notify(`${created.name} created!`)
    } catch (err) {
      notify(err.message || 'Failed to create language', 'error')
    }
  }

  const handleSelectLevel = (lv) => { setSelectedLevel(lv); setCreatingLevel(false) }

  const handleCreateLevel = async () => {
    if (!newLevelForm.title.trim() || !newLevelForm.level_number) return
    try {
      const created = await adminApi.createLevel({ language_id: selectedLang.id, ...newLevelForm, level_number: Number(newLevelForm.level_number) })
      const enriched = { ...created, language: selectedLang.name, flag_emoji: selectedLang.flag_emoji, language_id: selectedLang.id }
      setLevels(prev => [...prev, enriched])
      setSelectedLevel(enriched)
      setCreatingLevel(false)
      setNewLevelForm({ title: '', level_number: '' })
      notify('Level created!')
    } catch (err) {
      notify(err.message || 'Failed to create level', 'error')
    }
  }

  const handleCreateLessonStep = async () => {
    if (!lessonForm.title.trim() || !lessonForm.lesson_number) return
    try {
      const created = await adminApi.createLesson({ level_id: selectedLevel.id, title: lessonForm.title, lesson_number: Number(lessonForm.lesson_number) })
      setCreatedLesson(created)
      setStep(3)
    } catch (err) {
      notify(err.message || 'Failed to create lesson', 'error')
    }
  }

  const addWordRow = () => {
    if (!wordForm.word.trim() || !wordForm.translation.trim()) { setWordError('Word and translation are required'); return }
    setWordError('')
    setWords(prev => [...prev, { ...wordForm, _id: Date.now() }])
    setWordForm(EMPTY_WORD)
  }

  const removeWord = (idx) => setWords(prev => prev.filter((_, i) => i !== idx))

  const saveWords = async () => {
    try {
      for (const w of words) await adminApi.createWord(createdLesson.id, w)
      setStep(4)
    } catch (err) {
      notify(err.message || 'Failed to save words', 'error')
    }
  }

  const skipWords = () => setStep(4)

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1>Build a Lesson</h1>
          <p>Step-by-step lesson builder</p>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}

        <div className="nav-tabs">
          <button className={`nav-tab ${tab === 'builder' ? 'active' : ''}`} onClick={() => setTab('builder')}>
            <span className="nav-tab-icon">🧱</span>
            <div className="nav-tab-text">
              <span className="nav-tab-label">Build Lesson</span>
              <span className="nav-tab-desc">Step-by-step wizard</span>
            </div>
          </button>
          <button className={`nav-tab ${tab === 'reference' ? 'active' : ''}`} onClick={() => setTab('reference')}>
            <span className="nav-tab-icon">🌍</span>
            <div className="nav-tab-text">
              <span className="nav-tab-label">Languages Reference</span>
              <span className="nav-tab-desc">לחץ "Use this" להוספה ישירה</span>
            </div>
          </button>
        </div>

        {/* ── REFERENCE TAB ─────────────────────────────────────────── */}
        {tab === 'reference' && (
          <div className="admin-card lang-ref-panel-full">
            <p className="lang-ref-sub">לחץ <strong>Use this →</strong> על השפה הרצויה — הטופס יתמלא אוטומטית ותועבר לbuilder.</p>
            <div className="lang-ref-grid">
              {LANG_LIST.map(({ flag, name, code }) => (
                <LangRefCard key={code} flag={flag} name={name} code={code} onUse={handleUseFromRef} />
              ))}
            </div>
          </div>
        )}

        {/* ── BUILDER TAB ───────────────────────────────────────────── */}
        {tab === 'builder' && (
          <>
            <div className="wizard-steps">
              {STEPS.map((s, i) => (
                <div key={s} className={`wizard-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                  <div className="wizard-step-circle">{i < step ? '✓' : i + 1}</div>
                  <div className="wizard-step-label">{s}</div>
                  {i < STEPS.length - 1 && <div className="wizard-step-line" />}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="admin-loading"><div className="spinner" /></div>
            ) : (
              <>
                {/* STEP 0 */}
                {step === 0 && (
                  <div className="admin-card wizard-card">
                    <h2>Choose a language</h2>
                    <div className="wizard-options">
                      {languages.map(lang => (
                        <button key={lang.id} className={`wizard-option ${selectedLang?.id === lang.id ? 'selected' : ''}`} onClick={() => handleSelectLang(lang)}>
                          <span className="wizard-option-flag">{lang.flag_emoji}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                      <button className={`wizard-option new-option ${creatingLang ? 'selected' : ''}`} onClick={() => setCreatingLang(true)}>
                        <span className="wizard-option-flag">➕</span>
                        <span>New language</span>
                      </button>
                    </div>

                    {creatingLang && (
                      <div className="wizard-inline-form">
                        <input className="form-input" placeholder="Name (e.g. Spanish)" value={newLangForm.name} onChange={e => setNewLangForm(f => ({ ...f, name: e.target.value }))} />
                        <input className="form-input" placeholder="Code (e.g. es)" value={newLangForm.code} onChange={e => setNewLangForm(f => ({ ...f, code: e.target.value }))} />
                        <input className="form-input" placeholder="Flag emoji" value={newLangForm.flag_emoji} onChange={e => setNewLangForm(f => ({ ...f, flag_emoji: e.target.value }))} />
                        <button className="btn-primary" onClick={handleCreateLang}>Create &amp; Select</button>
                      </div>
                    )}

                    <div className="wizard-footer">
                      <button className="btn-ghost" onClick={() => navigate('/admin/lessons')}>Cancel</button>
                      <button className="btn-primary" disabled={!selectedLang} onClick={() => setStep(1)}>Next →</button>
                    </div>
                  </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                  <div className="admin-card wizard-card">
                    <h2>Choose a level <span style={{ color: '#64748b', fontWeight: 400 }}>for {selectedLang?.flag_emoji} {selectedLang?.name}</span></h2>
                    <div className="wizard-options">
                      {levelsFor(selectedLang?.id).sort((a, b) => a.level_number - b.level_number).map(lv => (
                        <button key={lv.id} className={`wizard-option ${selectedLevel?.id === lv.id ? 'selected' : ''}`} onClick={() => handleSelectLevel(lv)}>
                          <span className="wizard-option-flag">#{lv.level_number}</span>
                          <span>{lv.title}</span>
                        </button>
                      ))}
                      <button className={`wizard-option new-option ${creatingLevel ? 'selected' : ''}`} onClick={() => setCreatingLevel(true)}>
                        <span className="wizard-option-flag">➕</span>
                        <span>New level</span>
                      </button>
                    </div>

                    {creatingLevel && (
                      <div className="wizard-inline-form">
                        <input className="form-input" placeholder="Title (e.g. Beginner)" value={newLevelForm.title} onChange={e => setNewLevelForm(f => ({ ...f, title: e.target.value }))} />
                        <input className="form-input" type="number" placeholder="Level number" value={newLevelForm.level_number} onChange={e => setNewLevelForm(f => ({ ...f, level_number: e.target.value }))} />
                        <button className="btn-primary" onClick={handleCreateLevel}>Create &amp; Select</button>
                      </div>
                    )}

                    <div className="wizard-footer">
                      <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
                      <button className="btn-primary" disabled={!selectedLevel} onClick={() => setStep(2)}>Next →</button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="admin-card wizard-card">
                    <h2>Create the lesson</h2>
                    <p style={{ color: '#64748b', marginBottom: '20px' }}>{selectedLang?.flag_emoji} {selectedLang?.name} · {selectedLevel?.title}</p>
                    <div className="form-group">
                      <label>Lesson title</label>
                      <input className="form-input" placeholder="e.g. Greetings" value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Lesson number</label>
                      <input className="form-input" type="number" min="1" placeholder="1" value={lessonForm.lesson_number} onChange={e => setLessonForm(f => ({ ...f, lesson_number: e.target.value }))} />
                    </div>
                    <div className="wizard-footer">
                      <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                      <button className="btn-primary" disabled={!lessonForm.title.trim() || !lessonForm.lesson_number} onClick={handleCreateLessonStep}>Create Lesson →</button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="admin-card wizard-card">
                    <h2>Add words to "{createdLesson?.title}"</h2>
                    <p style={{ color: '#64748b', marginBottom: '16px' }}>Add vocabulary words. You can skip and add later.</p>
                    <div className="wizard-word-row">
                      {[
                        { key: 'word',             ph: 'Word in target language (e.g. こんにちは)' },
                        { key: 'translation',      ph: 'Translation (e.g. Hello)' },
                        { key: 'example_sentence', ph: 'Example sentence (optional)' },
                      ].map(({ key, ph }) => (
                        <input key={key} className="form-input" placeholder={ph} value={wordForm[key]} onChange={e => setWordForm(f => ({ ...f, [key]: e.target.value }))} />
                      ))}
                      <select className="form-input admin-select" style={{ flex: '0 0 130px' }} value={wordForm.ui_language} onChange={e => setWordForm(f => ({ ...f, ui_language: e.target.value }))}>
                        {UI_LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                      </select>
                      <button className="btn-primary" onClick={addWordRow}>Add</button>
                    </div>
                    {wordError && <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '8px' }}>{wordError}</div>}

                    {words.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                        {words.map((w, i) => (
                          <div key={w._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0f1520', border: '1px solid #1e2535', borderRadius: '10px', padding: '10px 14px' }}>
                            <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '12px', minWidth: '20px' }}>{i + 1}</span>
                            <span style={{ flex: 1, color: '#e2e8f0', fontWeight: 600 }}>{w.word}</span>
                            <span style={{ flex: 1, color: '#94a3b8' }}>{w.translation}</span>
                            <span style={{ color: '#64748b', fontSize: '0.8rem', minWidth: '30px' }}>{w.ui_language}</span>
                            <span style={{ flex: 2, color: '#64748b', fontSize: '0.8rem' }}>{w.example_sentence || '—'}</span>
                            <button className="action-btn delete" onClick={() => removeWord(i)}>🗑</button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="wizard-footer">
                      <button className="btn-ghost" onClick={skipWords}>Skip for now</button>
                      <button className="btn-primary" onClick={saveWords}>Save {words.length} words →</button>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div className="admin-card wizard-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
                    <h2>Lesson created!</h2>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>
                      "{createdLesson?.title}" was added to {selectedLang?.flag_emoji} {selectedLang?.name} · {selectedLevel?.title}
                      {words.length > 0 && ` with ${words.length} words`}.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button className="btn-ghost" onClick={() => navigate('/admin/lessons')}>Go to Lessons</button>
                      <button className="btn-primary" onClick={() => navigate(`/admin/lessons/${createdLesson?.id}/words`)}>Manage Words</button>
                      <button className="btn-primary" onClick={() => { setStep(0); setSelectedLang(null); setSelectedLevel(null); setCreatedLesson(null); setWords([]) }}>Build Another</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
