import { useEffect, useState } from 'react'
import StudentSidebar from '../sidebar/StudentSidebar'
import '../../../styles/warnings.css'

import { studentApi } from '../../../services/studentApi'

import WarningsHeader from './WarningsHeader'
import WarningsList from './WarningsList'

export default function StudentWarnings() {
  const [warnings, setWarnings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    studentApi.getWarnings()
      .then(data => setWarnings(data.warnings || []))
      .catch(err => console.error('Failed to load warnings:', err))
      .finally(() => setLoading(false))
  }, [])

  const markAsSeen = async (warningId) => {
    try {
      await studentApi.markWarningSeen(warningId)
      setWarnings(prev => prev.map(w => w.id === warningId ? { ...w, seen: true } : w))
    } catch (err) {
      console.error('Failed to mark warning as seen:', err)
    }
  }

  return (
    <div className="student-layout">
      <StudentSidebar />

      <main className="student-main">
        <WarningsHeader />

        {loading ? (
          <div className="student-loading">
            <div className="spinner" />
            <span className="loading-text">
              Loading warnings...
            </span>
          </div>
        ) : warnings.length === 0 ? (
          <div className="student-card empty-state">
            <div className="empty-icon">✅</div>
            <div>No warnings. Keep up the good work!</div>
          </div>
        ) : (
          <WarningsList
            warnings={warnings}
            onMarkSeen={markAsSeen}
          />
        )}
      </main>
    </div>
  )
}