import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import AdminSidebar from './AdminSidebar'
import Toast from '../common/Toast'
import LanguageModal from './modals/LanguageModal'
import LevelModal from './modals/LevelModal'
import ConfirmModal from './modals/ConfirmModal'
import { useToast } from '../../hooks/useToast'
import '../../styles/admin.css'
import '../../styles/admin-lessons.css'

const EMPTY_LANG  = { name: '', code: '', flag_emoji: '' }
const EMPTY_LEVEL = { title: '', level_number: '' }

export default function ManageLanguages() {
  const [languages, setLanguages] = useState([])
  const [levels,    setLevels]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [langModal,  setLangModal]  = useState(null) // null | 'create' | lang-object
  const [levelModal, setLevelModal] = useState(null) // null | { languageId } | level-object
  const [confirmDel, setConfirmDel] = useState(null) // { type:'lang'|'level', item }
  const [langForm,  setLangForm]  = useState(EMPTY_LANG)
  const [levelForm, setLevelForm] = useState(EMPTY_LEVEL)
  const { toast, notify, clear }  = useToast()

  useEffect(() => {
    Promise.all([adminApi.getLanguages(), adminApi.getLevels()])
      .then(([langs, lvls]) => { setLanguages(langs); setLevels(lvls) })
      .finally(() => setLoading(false))
  }, [])

  const levelsFor = (langId) => levels.filter(lv => lv.language_id === langId)

  const openCreateLang = () => { setLangForm(EMPTY_LANG); setLangModal('create') }
  const openEditLang   = (lang) => { setLangForm({ name: lang.name, code: lang.code, flag_emoji: lang.flag_emoji || '' }); setLangModal(lang) }

  const saveLang = async () => {
    if (!langForm.name.trim() || !langForm.code.trim()) return
    if (langModal === 'create') {
      const created = await adminApi.createLanguage(langForm)
      setLanguages(prev => [...prev, created])
      notify(`${created.name} added!`)
    } else {
      await adminApi.updateLanguage(langModal.id, langForm)
      setLanguages(prev => prev.map(l => l.id === langModal.id ? { ...l, ...langForm } : l))
      notify('Language updated')
    }
    setLangModal(null)
  }

  const deleteLang = async () => {
    await adminApi.deleteLanguage(confirmDel.item.id)
    setLanguages(prev => prev.filter(l => l.id !== confirmDel.item.id))
    setLevels(prev => prev.filter(lv => lv.language_id !== confirmDel.item.id))
    notify(`${confirmDel.item.name} deleted`, 'error')
    setConfirmDel(null)
  }

  const openCreateLevel = (langId) => { setLevelForm(EMPTY_LEVEL); setLevelModal({ languageId: langId }) }
  const openEditLevel   = (lv) => { setLevelForm({ title: lv.title, level_number: lv.level_number }); setLevelModal(lv) }

  const saveLevel = async () => {
    if (!levelForm.title.trim() || !levelForm.level_number) return
    if (!levelModal.id) {
      const created = await adminApi.createLevel({ language_id: levelModal.languageId, ...levelForm, level_number: Number(levelForm.level_number) })
      const lang = languages.find(l => l.id === levelModal.languageId)
      setLevels(prev => [...prev, { ...created, language: lang?.name, flag_emoji: lang?.flag_emoji, language_id: levelModal.languageId }])
      notify('Level created!')
    } else {
      await adminApi.updateLevel(levelModal.id, { ...levelForm, level_number: Number(levelForm.level_number) })
      setLevels(prev => prev.map(lv => lv.id === levelModal.id ? { ...lv, ...levelForm, level_number: Number(levelForm.level_number) } : lv))
      notify('Level updated')
    }
    setLevelModal(null)
  }

  const deleteLevel = async () => {
    await adminApi.deleteLevel(confirmDel.item.id)
    setLevels(prev => prev.filter(lv => lv.id !== confirmDel.item.id))
    notify('Level deleted', 'error')
    setConfirmDel(null)
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header admin-page-header--row">
          <div>
            <h1>Languages &amp; Levels</h1>
            <p>Manage supported languages and their levels</p>
          </div>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}

        {loading ? (
          <div className="admin-loading"><div className="spinner" /></div>
        ) : languages.length === 0 ? (
          <div className="admin-card">
            <div className="empty-state"><div className="empty-icon">🌍</div><div>No languages yet. Add one!</div></div>
          </div>
        ) : languages.map(lang => (
          <div key={lang.id} className="lesson-group">
            <div className="lesson-group-header">
              <span className="group-flag">{lang.flag_emoji}</span>
              <span className="group-language">{lang.name}</span>
              <span className="group-separator">·</span>
              <span className="group-level" style={{ color: '#64748b', fontSize: '0.8rem' }}>{lang.code.toUpperCase()}</span>
              <span className="group-count">{levelsFor(lang.id).length} levels</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                <button className="action-btn edit" title="Edit" onClick={() => openEditLang(lang)}>✏️</button>
                <button className="action-btn delete" title="Delete" onClick={() => setConfirmDel({ type: 'lang', item: lang })}>🗑</button>
                <button className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => openCreateLevel(lang.id)}>+ Level</button>
              </div>
            </div>

            {levelsFor(lang.id).length === 0 ? (
              <div style={{ padding: '12px 20px', color: '#64748b', fontSize: '0.85rem' }}>No levels yet.</div>
            ) : (
              <div className="lesson-cards">
                {levelsFor(lang.id).sort((a, b) => a.level_number - b.level_number).map(lv => (
                  <div key={lv.id} className="lesson-card">
                    <div className="lesson-card-number">#{lv.level_number}</div>
                    <div className="lesson-card-title">{lv.title}</div>
                    <div className="lesson-card-actions">
                      <button className="action-btn edit" onClick={() => openEditLevel(lv)}>✏️</button>
                      <button className="action-btn delete" onClick={() => setConfirmDel({ type: 'level', item: lv })}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {langModal !== null && (
          <LanguageModal
            mode={langModal === 'create' ? 'create' : 'edit'}
            form={langForm}
            onChange={setLangForm}
            onSave={saveLang}
            onClose={() => setLangModal(null)}
          />
        )}

        {levelModal !== null && (
          <LevelModal
            isEdit={!!levelModal.id}
            form={levelForm}
            onChange={setLevelForm}
            onSave={saveLevel}
            onClose={() => setLevelModal(null)}
          />
        )}

        {confirmDel && (
          <ConfirmModal
            title={`Delete "${confirmDel.item.name || confirmDel.item.title}"?`}
            message={confirmDel.type === 'lang'
              ? 'This will delete the language, all its levels, lessons, and words. Cannot be undone.'
              : 'This will delete the level and all its lessons. Cannot be undone.'}
            onConfirm={confirmDel.type === 'lang' ? deleteLang : deleteLevel}
            onClose={() => setConfirmDel(null)}
          />
        )}
      </main>
    </div>
  )
}
