import { useEffect, useMemo, useState } from 'react'

const QuizPhase = ({ words, allWords, answers, onAnswer, onNext }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const currentWord = words[currentQuizIndex]

  const allAnswered = words.every(w => answers[w.id] !== undefined)

  const generateOptions = () => {
    if (!currentWord) return []

    const options = [currentWord.translation]

    const pool =
      allWords?.filter(w => w.id !== currentWord.id) ??
      words.filter(w => w.id !== currentWord.id)

    const shuffled = [...pool].sort(() => Math.random() - 0.5)

    for (const w of shuffled) {
      if (options.length >= 4) break
      if (w.translation && !options.includes(w.translation)) {
        options.push(w.translation)
      }
    }

    while (options.length < 4) {
      options.push(`Option ${options.length + 1}`)
    }

    return options.sort(() => Math.random() - 0.5)
  }

  const options = useMemo(
    () => generateOptions(),
    [currentWord?.id, allWords, words]
  )

  useEffect(() => {
    setSelectedAnswer(null)
    setShowResult(false)
  }, [currentQuizIndex])

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    setShowResult(true)

    const isCorrect = answer === currentWord.translation
    onAnswer(currentWord.id, isCorrect)
  }

  const handleNext = () => {
    if (currentQuizIndex < words.length - 1) {
      setCurrentQuizIndex((i) => i + 1)
    } else if (allAnswered) {
      onNext()
    }
  }

  if (!currentWord) return null

  return (
    <div className="quiz-phase">
      <div className="quiz-header">
        <h2>Quiz Time!</h2>
        <div className="quiz-progress">
          {currentQuizIndex + 1}/{words.length}
        </div>
      </div>

      <div className="quiz-question">
        <h1 className="quiz-word">{currentWord.word}</h1>

        {currentWord.audio_url && (
          <button
            className="btn-audio"
            onClick={() => new Audio(currentWord.audio_url).play()}
          >
            🔊
          </button>
        )}
      </div>

      <div className="quiz-options">
        {options.map((option, idx) => (
          <button
            key={idx}
            className={`quiz-option ${
              showResult
                ? option === currentWord.translation
                  ? 'correct'
                  : option === selectedAnswer
                  ? 'incorrect'
                  : ''
                : selectedAnswer === option
                ? 'selected'
                : ''
            }`}
            onClick={() => !showResult && handleAnswer(option)}
            disabled={showResult}
          >
            {option}
          </button>
        ))}
      </div>

      {showResult && (
        <div className="quiz-result">
          {selectedAnswer === currentWord.translation ? (
            <div className="result-correct">✓ Correct!</div>
          ) : (
            <div className="result-incorrect">
              ✗ Incorrect. Answer: {currentWord.translation}
            </div>
          )}

          <button className="btn-primary" onClick={handleNext}>
            {currentQuizIndex < words.length - 1
              ? 'Next Question'
              : 'Finish Class'}
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizPhase