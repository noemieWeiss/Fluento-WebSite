import { useState, useEffect } from 'react'
import { rewardsApi } from '../../services/rewardsApi'
import StudentSidebar from '../../components/student/StudentSidebar'
import { useToast } from '../../hooks/useToast'
import '../../styles/surprise-quizzes.css'

export default function SurpriseQuizzes() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const { notify } = useToast()

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      const data = await rewardsApi.getActiveQuizzes()
      setQuizzes(data)
    } catch (err) {
      notify('Failed to load quizzes', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz)
    setSelectedAnswer(null)
    setSubmitted(false)
    setResult(null)
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      notify('Please select an answer', 'error')
      return
    }

    try {
      const res = await rewardsApi.submitQuizAnswer({
        quizId: selectedQuiz.id,
        answer: selectedAnswer
      })

      setSubmitted(true)
      setResult(res)

      if (res.correct) {
        notify(`Correct! +${res.xp} XP`, 'success')
      } else {
        notify('Incorrect answer', 'error')
      }

      setTimeout(() => {
        setSelectedQuiz(null)
        loadQuizzes()
      }, 2000)
    } catch (err) {
      notify('Failed to submit answer', 'error')
    }
  }

  const getAnswerLabel = (opt) => {
    const labels = { a: 'A', b: 'B', c: 'C', d: 'D' }
    return labels[opt]
  }

  
  if (loading) {
    return <div className='student-layout'><StudentSidebar /><div className="surprise-quizzes-container"><div className="loading">Loading quizzes...</div></div></div>
  }

  if (selectedQuiz) {
    return (
        <div className="student-layout">
        <StudentSidebar/>
      <div className="surprise-quizzes-container">
        <div className="quiz-modal">
          <div className="quiz-header">
            <h2>{selectedQuiz.title}</h2>
            <button className="btn-close" onClick={() => setSelectedQuiz(null)}>✕</button>
          </div>

          <div className="quiz-content">
            <div className="question-section">
              <p className="question-text">{selectedQuiz.question}</p>
            </div>

            {!submitted ? (
              <>
                <div className="options-grid">
                  {['a', 'b', 'c', 'd'].map(opt => (
                    <button
                      key={opt}
                      className={`option-button ${selectedAnswer === opt ? 'selected' : ''}`}
                      onClick={() => setSelectedAnswer(opt)}
                      disabled={submitted}
                    >
                      <span className="option-label">{getAnswerLabel(opt)}</span>
                      <span className="option-text">{selectedQuiz[`option_${opt}`]}</span>
                    </button>
                  ))}
                </div>

                <div className="quiz-actions">
                  <button className="btn-primary btn-full" onClick={handleSubmitAnswer} disabled={!selectedAnswer || submitted}>
                    Submit Answer
                  </button>
                </div>
              </>
            ) : (
              <div className={`result-section ${result.correct ? 'correct' : 'incorrect'}`}>
                <div className="result-icon">{result.correct ? '✅' : '❌'}</div>
                <div className="result-text">
                  {result.correct ? (
                    <>
                      <p className="result-title">Correct!</p>
                      <p className="result-xp">+{result.xp} XP</p>
                    </>
                  ) : (
                    <>
                      <p className="result-title">Incorrect</p>
                      <p className="result-answer">The correct answer was {getAnswerLabel(selectedQuiz.correct)}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    )
  }

  return (
    <div className="student-layout">
        <StudentSidebar/>
    <div className="surprise-quizzes-container">
      <div className="quizzes-header">
        <h1>🎯 Surprise Quizzes</h1>
        <p>Test your knowledge and earn XP!</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <div className="empty-text">No active quizzes right now</div>
          <p className="empty-subtext">Check back later for new challenges!</p>
        </div>
      ) : (
        <div className="quizzes-grid">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-card">
              <div className="card-header">
                <h3>{quiz.title}</h3>
                <span className="xp-badge">💎 {quiz.xp_reward} XP</span>
              </div>
              <p className="card-question">{quiz.question}</p>
              <button className="btn-primary btn-full" onClick={() => handleSelectQuiz(quiz)}>
                Take Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}
