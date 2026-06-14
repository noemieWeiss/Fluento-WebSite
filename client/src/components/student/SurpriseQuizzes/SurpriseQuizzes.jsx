import StudentSidebar from '../sidebar/StudentSidebar'
import '../../../styles/surprise-quizzes.css'

import useSurpriseQuizzes from '../../../hooks/useSurpriseQuizzes'

import QuizList from './QuizList'
import QuizModal from './QuizModal'

export default function SurpriseQuizzes() {
  const {
    quizzes,
    loading,

    selectedQuiz,
    selectedAnswer,
    submitted,
    result,

    setSelectedAnswer,
    selectQuiz,
    submitAnswer,
    setSelectedQuiz
  } = useSurpriseQuizzes()

  return (
    <div className="student-layout">
      <StudentSidebar />

      <div className="surprise-quizzes-container">
        {loading ? (
          <div className="loading">Loading quizzes...</div>
        ) : selectedQuiz ? (
          <QuizModal
            quiz={selectedQuiz}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            submitted={submitted}
            result={result}
            onSubmit={submitAnswer}
            onClose={() => setSelectedQuiz(null)}
          />
        ) : (
          <>
            <div className="quizzes-header">
              <h1>🎯 Surprise Quizzes</h1>
              <p>Test your knowledge and earn XP!</p>
            </div>

            {quizzes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <div>No active quizzes right now</div>
              </div>
            ) : (
              <QuizList quizzes={quizzes} onSelect={selectQuiz} />
            )}
          </>
        )}
      </div>
    </div>
  )
}