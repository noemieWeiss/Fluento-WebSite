import { useEffect, useState } from 'react'
import { rewardsApi } from '../services/rewardsApi'
import { useToast } from './useToast'

export default function useSurpriseQuizzes() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  const { notify } = useToast()

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      const data = await rewardsApi.getActiveQuizzes()
      setQuizzes(data)
    } catch {
      notify('Failed to load quizzes', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuizzes()
  }, [])

  const selectQuiz = (quiz) => {
    setSelectedQuiz(quiz)
    setSelectedAnswer(null)
    setSubmitted(false)
    setResult(null)
  }

  const submitAnswer = async () => {
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

      notify(
        res.correct ? `Correct! +${res.xp} XP` : 'Incorrect answer',
        res.correct ? 'success' : 'error'
      )

      setTimeout(() => {
        setSelectedQuiz(null)
        loadQuizzes()
      }, 2000)

    } catch {
      notify('Failed to submit answer', 'error')
    }
  }

  return {
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
  }
}