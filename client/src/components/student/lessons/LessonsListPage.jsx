import StudentSidebar from '../sidebar/StudentSidebar'
import '../../../styles/student.css'

import useStudentLessons from '../../../hooks/useStudentLessons'
import { groupLessonsByLanguageLevel } from '../../../utils/groupLessonsByLanguageLevel'

import LessonsPageHeader from './LessonsPageHeader'
import LessonGroup from './LessonGroup'

export default function StudentLessons() {
  const { lessons, loading, error } = useStudentLessons()

  const groupedLessons = groupLessonsByLanguageLevel(lessons)

  const hasLessons = lessons.length > 0
  const hasGroups = Object.keys(groupedLessons).length > 0

  return (
    <div className="student-layout">
      <StudentSidebar />

      <main className="student-main">
        <LessonsPageHeader />

        {loading ? (
          <div className="student-loading">
            <div className="spinner" />
          </div>
        ) : error ? (
          <div className="student-error">{error}</div>
        ) : !hasLessons ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <div>No lessons available. Add a language to get started!</div>
          </div>
        ) : !hasGroups ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <div>No lessons found for your languages.</div>
          </div>
        ) : (
          <div className="lessons-container">
            {Object.values(groupedLessons).map(group => (
              <LessonGroup
                key={`${group.language}-${group.level}`}
                group={group}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}