export default function QuizCard({ quiz, onSelect }) {
  return (
    <div className="quiz-card">
      <div className="card-header">
        <h3>{quiz.title}</h3>
        <span className="xp-badge">💎 {quiz.xp_reward} XP</span>
      </div>

      <p className="card-question">{quiz.question}</p>

      <button
        className="btn-primary btn-full"
        onClick={() => onSelect(quiz)}
      >
        Take Quiz
      </button>
    </div>
  )
}