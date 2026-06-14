import { useNavigate } from 'react-router-dom'

export default function LessonCard({ lesson }) {
  const navigate = useNavigate()

  return (
    <div
      className={`lesson-card ${lesson.isCompleted ? 'completed' : ''}`}
      onClick={() => navigate(`/lesson/${lesson.id}`)}
    >
      <div className="lesson-card-content">
        <div className="lesson-number">#{lesson.lesson_number}</div>

        <div className="lesson-info">
          <div className="lesson-card-title">{lesson.title}</div>

          <div className="lesson-card-meta">
            {lesson.isCompleted ? (
              <span className="lesson-completed-badge">
                ✓ Completed • {lesson.score} XP
              </span>
            ) : (
              <span className="lesson-start-badge">Start Lesson</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}