import QuizCard from './QuizCard'

export default function QuizList({ quizzes, onSelect }) {
  return (
    <div className="quizzes-grid">
      {quizzes.map(quiz => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}