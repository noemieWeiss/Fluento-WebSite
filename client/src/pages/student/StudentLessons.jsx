import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentSidebar from '../../components/student/StudentSidebar'
import { studentApi } from '../../services/api'
import '../../styles/student.css'

export default function StudentLessons() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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

  const groupedLessons = Array.isArray(lessons) ? lessons.reduce((acc, lesson) => {
    const key = `${lesson.language}-${lesson.level}`
    if (!acc[key]) {
      acc[key] = {
        language: lesson.language,
        flag_emoji: lesson.flag_emoji,
        level: lesson.level,
        level_id: lesson.level_id,
        lessons: []
      }
    }
    acc[key].lessons.push(lesson)
    return acc
  }, {}) : {}

  return (
    <div className="student-layout">
      <StudentSidebar />
      <main className="student-main">
        <div className="student-page-header">
          <h1>My Lessons</h1>
          <p>Continue your learning journey</p>
        </div>

        {loading ? (
          <div className="student-loading"><div className="spinner" /></div>
        ) : error ? (
          <div className="student-error">{error}</div>
        ) : lessons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <div>No lessons available. Add a language to get started!</div>
          </div>
        ) : Object.keys(groupedLessons).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <div>No lessons found for your languages.</div>
          </div>
        ) : (
          <div className="lessons-container">
            {Object.values(groupedLessons).map(group => (
              <div key={`${group.language}-${group.level}`} className="lesson-group">
                <div className="lesson-group-header">
                  <div className="lesson-group-title">
                    <span className="group-flag">{group.flag_emoji}</span>
                    <span>{group.language} - {group.level}</span>
                  </div>
                </div>
                <div className="lesson-list">
                  {group.lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className={`lesson-card ${lesson.isCompleted ? 'completed' : ''}`}
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                    >
                      <div className="lesson-card-content">
                        <div className="lesson-number">#{lesson.lesson_number}</div>
                        <div className="lesson-info">
                          <div className="lesson-card-title">{lesson.title}</div>
                          <div className="lesson-card-meta">
                            {lesson.isCompleted ? (
                              <span className="lesson-completed-badge">✓ Completed • {lesson.score} XP</span>
                            ) : (
                              <span className="lesson-start-badge">Start Lesson</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
