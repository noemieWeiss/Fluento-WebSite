import { getAnswerLabel } from '../../../utils/quizHelpers'

export default function QuizModal({
  quiz,
  selectedAnswer,
  setSelectedAnswer,
  submitted,
  result,
  onSubmit,
  onClose
}) {
  return (
    <div className="quiz-modal">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>

      <div className="quiz-content">
        <p className="question-text">{quiz.question}</p>

        {!submitted ? (
          <>
            <div className="options-grid">
              {['a', 'b', 'c', 'd'].map(opt => (
                <button
                  key={opt}
                  className={`option-button ${selectedAnswer === opt ? 'selected' : ''}`}
                  onClick={() => setSelectedAnswer(opt)}
                >
                  <span className="option-label">{getAnswerLabel(opt)}</span>
                  <span className="option-text">{quiz[`option_${opt}`]}</span>
                </button>
              ))}
            </div>

            <button
              className="btn-primary btn-full"
              onClick={onSubmit}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          </>
        ) : (
          <div className={`result-section ${result.correct ? 'correct' : 'incorrect'}`}>
            <div className="result-icon">
              {result.correct ? '✅' : '❌'}
            </div>

            <div className="result-text">
              {result.correct ? (
                <>
                  <p className="result-title">Correct!</p>
                  <p className="result-xp">+{result.xp} XP</p>
                </>
              ) : (
                <>
                  <p className="result-title">Incorrect</p>
                  <p className="result-answer">
                    The correct answer was {getAnswerLabel(quiz.correct)}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}