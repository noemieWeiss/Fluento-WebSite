import { useEffect, useState } from 'react'
import StudentSidebar from '../sidebar/StudentSidebar'
import '../../../styles/student.css'

import { studentApi } from '../../../services/studentApi'
import { groupLessonsByLanguageLevel } from '../../../utils/groupLessonsByLanguageLevel'

import LessonsPageHeader from './LessonsPageHeader'
import LessonGroup from './LessonGroup'

export default function StudentLessons() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    studentApi.getLessons()
      .then(data => {
        setLessons(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading lessons:', err)
        setError('Failed to load lessons')
        setLessons([])
        setLoading(false)
      })
  }, [])

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