import { useEffect, useState } from 'react'
import StudentSidebar from '../../components/student/StudentSidebar'
import '../../styles/warnings.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function StudentWarnings() {
  const [warnings, setWarnings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWarnings()
  }, [])

  const loadWarnings = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('authUser'))?.token
      const res = await fetch(`${API_BASE}/student/warnings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setWarnings(data.warnings || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to load warnings:', err)
      setLoading(false)
    }
  }

  const markAsSeen = async (warningId) => {
    try {
      const token = JSON.parse(localStorage.getItem('authUser'))?.token
      await fetch(`${API_BASE}/student/warnings/${warningId}/seen`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setWarnings(warnings.map(w => w.id === warningId ? { ...w, seen: true } : w))
    } catch (err) {
      console.error('Failed to mark warning as seen:', err)
    }
  }

  return (
    <div className="student-layout">
      <StudentSidebar />
      <main className="student-main">
        <div className="student-page-header">
          <h1>⚠️ Warnings</h1>
          <p>Important messages from administrators</p>
        </div>

        {loading ? (
          <div className="student-loading">
            <div className="spinner" />
            <span className="loading-text">Loading warnings...</span>
          </div>
        ) : warnings.length === 0 ? (
          <div className="student-card empty-state">
            <div className="empty-icon">✅</div>
            <div>No warnings. Keep up the good work!</div>
          </div>
        ) : (
          <div className="warnings-list">
            {warnings.map(warning => (
              <div key={warning.id} className={`warning-card ${warning.seen ? 'seen' : 'unseen'}`}>
                <div className="warning-header">
                  <div className="warning-from">
                    <span className="warning-icon">👤</span>
                    <span>From: <strong>{warning.admin_name}</strong></span>
                  </div>
                  <div className="warning-date">
                    {new Date(warning.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="warning-message">{warning.message}</div>
                {!warning.seen && (
                  <button className="btn-mark-seen" onClick={() => markAsSeen(warning.id)}>
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
