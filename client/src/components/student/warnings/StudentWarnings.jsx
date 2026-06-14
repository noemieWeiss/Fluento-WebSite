import StudentSidebar from '../sidebar/StudentSidebar'
import '../../../styles/warnings.css'

import useStudentWarnings from '../../../hooks/useStudentWarnings'

import WarningsHeader from './WarningsHeader'
import WarningsList from './WarningsList'

export default function StudentWarnings() {
  const { warnings, loading, markAsSeen } = useStudentWarnings()

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