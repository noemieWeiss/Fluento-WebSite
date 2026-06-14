import '../../../styles/lesson-summary.css'

const LessonSummary = ({
  score,
  correctAnswers,
  totalWords,
  xpEarned,
  classesCount,
  onBackToLessons
}) => {
  return (
    <div className="lesson-summary-container">
      <div className="lesson-summary-card">

        <div className="lesson-summary-icon">🏁</div>

        <h1>Lesson Complete!</h1>

        <div className="lesson-summary-score">
          <div className="score-number">{score}%</div>
          <div className="score-label">Final Score</div>
        </div>

        <div className="lesson-summary-stats">
          <div className="stat">
            <div className="stat-value">{correctAnswers}</div>
            <div className="stat-label">Correct Answers</div>
          </div>

          <div className="stat">
            <div className="stat-value">{totalWords}</div>
            <div className="stat-label">Total Words</div>
          </div>

          <div className="stat">
            <div className="stat-value">{classesCount}</div>
            <div className="stat-label">Classes Completed</div>
          </div>

          <div className="stat">
            <div className="stat-value">+{xpEarned}</div>
            <div className="stat-label">XP Earned</div>
          </div>
        </div>

        <p className="lesson-summary-message">
          Great work! You’ve completed the entire lesson.
        </p>

        <button className="btn-primary" onClick={onBackToLessons}>
          Back to Lessons
        </button>

      </div>
    </div>
  )
}

export default LessonSummary