import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/student/StudentSidebar'
import { useUser } from '../context/UserContext'
import '../styles/student.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function ChooseLanguage() {
  const [languages, setLanguages] = useState([])
  const [myLanguages, setMyLanguages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const navigate = useNavigate()
  const isNewStudent = user?.isNewStudent

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token
    if (!token) {
      setLoading(false)
      return
    }
    
    Promise.all([
      fetch(`${API_BASE}/languages`).then(r => r.json()),
      fetch(`${API_BASE}/student/languages`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()).catch(() => [])
    ]).then(([allLangs, myLangs]) => {
      setLanguages(allLangs || [])
      setMyLanguages(myLangs || [])
      setLoading(false)
    }).catch(err => {
      console.error('Error loading languages:', err)
      setLoading(false)
    })
  }, [])

  const handleChoose = async () => {
    if (!selectedId) return
    try {
      const token = JSON.parse(localStorage.getItem('authUser')).token
      const res = await fetch(`${API_BASE}/languages/choose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ languageId: selectedId })
      })
      if (res.ok) {
        if (isNewStudent) {
          navigate('/student')
        } else {
          window.location.reload()
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isChosen = (langId) => myLanguages.some(l => l.id === langId)

  const content = (
    <>
      <div className="student-page-header">
        <h1>{isNewStudent ? 'Choose Your Language' : 'My Languages'}</h1>
        <p>{isNewStudent ? 'Select a language to start learning' : 'Manage your learning languages'}</p>
      </div>
      
      {loading ? (
        <div className="student-loading"><div className="spinner" /></div>
      ) : (
        <>
          {myLanguages.length > 0 && (
            <div className="current-languages">
              <h3>Currently Learning</h3>
              <div className="language-grid">
                {myLanguages.map(lang => (
                  <div key={lang.id} className="language-card chosen">
                    <div className="language-emoji">{lang.flag_emoji || '🌍'}</div>
                    <div className="language-name">{lang.name}</div>
                    <div className="chosen-badge">✓ Active</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="available-languages">
            <h3>Add New Language</h3>
            <div className="language-grid">
              {languages.filter(lang => !isChosen(lang.id)).map(lang => (
                <div
                  key={lang.id}
                  className={`language-card ${selectedId === lang.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(lang.id)}
                >
                  <div className="language-emoji">{lang.flag_emoji || '🌍'}</div>
                  <div className="language-name">{lang.name}</div>
                </div>
              ))}
            </div>
            {languages.filter(lang => !isChosen(lang.id)).length > 0 && (
              <button 
                className="choose-btn" 
                disabled={!selectedId}
                onClick={handleChoose}
              >
                {isNewStudent ? 'Start Learning' : 'Add Language'}
              </button>
            )}
          </div>
        </>
      )}
    </>
  )

  if (isNewStudent) {
    return (
      <div className="choose-language-page">
        <div className="choose-language-container">{content}</div>
      </div>
    )
  }

  return (
    <div className="student-layout">
      <StudentSidebar />
      <main className="student-main">{content}</main>
    </div>
  )
}

export default ChooseLanguage
