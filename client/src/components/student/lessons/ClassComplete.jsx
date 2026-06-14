const ClassComplete = ({ classNumber, isLastClass, onContinue, onStop }) => {
  return (
    <div className="class-complete">
      <div className="class-complete-icon">✓</div>

      <h1>Class {classNumber} Complete!</h1>
      <p>Great job! You've finished this class.</p>

      <div className="class-complete-actions">
        {!isLastClass ? (
          <>
            <button className="btn-primary" onClick={onContinue}>
              Continue to Next Class
            </button>

            <button className="btn-secondary" onClick={onStop}>
              Stop and Exit
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={onContinue}>
            Finish Lesson
          </button>
        )}
      </div>
    </div>
  )
}

export default ClassComplete