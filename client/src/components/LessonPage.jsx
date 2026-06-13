import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/lesson.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const LessonPage = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  
  const [classes, setClasses] = useState([])
  const [currentClassIndex, setCurrentClassIndex] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [phase, setPhase] = useState('learn') 
  const [quizAnswers, setQuizAnswers] = useState({})
  const [completedClasses, setCompletedClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLesson()
  }, [lessonId])

  const loadLesson = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('authUser'))?.token
      
      console.log('Loading lesson:', lessonId)
      
      const classesRes = await fetch(`${API_BASE}/lessons/${lessonId}/classes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const classesData = await classesRes.json()
      
      console.log('Loaded classes:', classesData.length, 'classes')
      if (classesData.length > 0) {
        console.log('First class language:', classesData[0].languageName)
        console.log('First class words:', classesData[0].words.length)
      }
      
      const progressRes = await fetch(`${API_BASE}/progress/lessons/${lessonId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const progressData = await progressRes.json()

      const allWords = classesData.flatMap(c => c.words || [])
      const normalized = []
      for (let i = 0; i < allWords.length; i += 2) {
        const chunk = [allWords[i]]
        if (allWords[i + 1]) {
          chunk.push(allWords[i + 1])
        }
        normalized.push({
          classNumber: normalized.length + 1,
          words: chunk,
          languageName: classesData[0]?.languageName
        })
      }

      setClasses(normalized)
      setCompletedClasses(progressData.completedClasses || [])

      const nextClassIndex = normalized.findIndex(c => 
        !progressData.completedClasses?.includes(c.classNumber)
      )
      
      if (nextClassIndex !== -1) {
        setCurrentClassIndex(nextClassIndex)
      } else if (progressData.lessonCompleted) {
        setPhase('complete')
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error loading lesson:', err)
      setError('Failed to load lesson')
      setLoading(false)
    }
  }

  const handleNext = () => {
    const currentClass = classes[currentClassIndex]
    
    if (phase === 'learn') {
      if (currentWordIndex < currentClass.words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1)
      } else {
        setPhase('quiz')
        setCurrentWordIndex(0)
      }
    } else if (phase === 'quiz') {
      const answeredAll = currentClass.words.every(w => quizAnswers[w.id] !== undefined)
      
      if (answeredAll) {
        saveClassProgress()
      }
    }
  }

  const saveClassProgress = async () => {
    const currentClass = classes[currentClassIndex]
    
    try {
      const token = JSON.parse(localStorage.getItem('authUser'))?.token
      await fetch(`${API_BASE}/progress/lessons/${lessonId}/classes/${currentClass.classNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      setCompletedClasses([...completedClasses, currentClass.classNumber])
      setPhase('classComplete')
    } catch (err) {
      console.error('Error saving class progress:', err)
    }
  }

  const handleContinueToNextClass = () => {
    if (currentClassIndex < classes.length - 1) {
      setCurrentClassIndex(currentClassIndex + 1)
      setCurrentWordIndex(0)
      setPhase('learn')
      setQuizAnswers(prev => ({ ...prev }))
    } else {
      completeLesson()
    }
  }

  const handleStopAndExit = () => {
    navigate('/student/lessons')
  }

  const handleQuizAnswer = (wordId, isCorrect) => {
    setQuizAnswers({ ...quizAnswers, [wordId]: isCorrect })
  }

  const completeLesson = async () => {
    const correctAnswers = Object.values(quizAnswers).filter(a => a).length
    const uniqueIds = new Set(classes.flatMap(c => c.words.map(w => w.id)))
    const totalWords = uniqueIds.size || 0
    const score = Math.round((correctAnswers / (totalWords || 1)) * 100)

    try {
      const token = JSON.parse(localStorage.getItem('authUser'))?.token
      await fetch(`${API_BASE}/progress/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score })
      })
      setPhase('complete')
    } catch (err) {
      console.error('Error completing lesson:', err)
    }
  }

  const allWords = useMemo(() => {
    const map = new Map()
    classes.flatMap(c => c.words).forEach(word => {
      if (!map.has(word.id)) map.set(word.id, word)
    })
    return Array.from(map.values())
  }, [classes])

  if (loading) {
    return (
      <div className="lesson-container">
        <div className="loading">Loading lesson...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="lesson-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/student/lessons')}>Back to Lessons</button>
      </div>
    )
  }

  if (classes.length === 0) {
    return (
      <div className="lesson-container">
        <div className="empty">No content available for this lesson.</div>
        <button onClick={() => navigate('/student/lessons')}>Back to Lessons</button>
      </div>
    )
  }

  if (phase === 'complete') {
    const correctAnswers = Object.values(quizAnswers).filter(a => a).length
    const uniqueIds = new Set(classes.flatMap(c => c.words.map(w => w.id)))
    const totalWords = uniqueIds.size || 0
    const score = Math.round((correctAnswers / (totalWords || 1)) * 100)

    return (
      <div className="lesson-container">
        <div className="completion-card">
          <h1>🎉 Lesson Complete!</h1>
          <div className="score">
            <div className="score-number">{score}%</div>
            <div className="score-label">Score</div>
          </div>
          <div className="stats">
            <div>Correct: {correctAnswers}/{totalWords}</div>
            <div>XP Earned: +{score}</div>
          </div>
          <button className="btn-primary" onClick={() => navigate('/student/lessons')}>
            Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  const currentClass = classes[currentClassIndex]
  const progress = ((currentClassIndex * 100) / classes.length).toFixed(0)

  return (
    <div className="lesson-container">
      <div className="lesson-header">
        <button className="btn-back" onClick={() => navigate('/student/lessons')}>✕</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">Class {currentClassIndex + 1}/{classes.length}</div>
      </div>

      <div className="lesson-content">
        {phase === 'learn' ? (
          <LearnPhase 
            word={currentClass.words[currentWordIndex]}
            onNext={handleNext}
            currentWord={currentWordIndex + 1}
            totalWords={currentClass.words.length}
          />
        ) : phase === 'quiz' ? (
          <QuizPhase 
              words={currentClass.words}
              allWords={allWords}
              answers={quizAnswers}
              onAnswer={handleQuizAnswer}
              onNext={handleNext}
            />
        ) : phase === 'classComplete' ? (
          <ClassComplete
            classNumber={currentClass.classNumber}
            isLastClass={currentClassIndex === classes.length - 1}
            onContinue={handleContinueToNextClass}
            onStop={handleStopAndExit}
          />
        ) : null}
      </div>
    </div>
  )
}

const LearnPhase = ({ word, onNext, currentWord, totalWords }) => {
  const [showTranslation, setShowTranslation] = useState(false)

  return (
    <div className="learn-phase">
      <div className="word-counter">Word {currentWord} of {totalWords}</div>
      
      {word.image_url && (
        <div className="word-image">
          <img src={word.image_url} alt={word.word} />
        </div>
      )}
      
      <div className="word-main">
        <h1 className="word">{word.word}</h1>
        {word.audio_url && (
          <button className="btn-audio" onClick={() => new Audio(word.audio_url).play()}>
            🔊 Listen
          </button>
        )}
      </div>

      {showTranslation && (
        <>
          <div className="translation">{word.translation}</div>
          {word.example_sentence && (
            <div className="example">
              <div className="example-label">Example:</div>
              <div className="example-text">{word.example_sentence}</div>
            </div>
          )}
        </>
      )}

      <div className="learn-actions">
        {!showTranslation ? (
          <button className="btn-primary" onClick={() => setShowTranslation(true)}>
            Show Translation
          </button>
        ) : (
          <button className="btn-primary" onClick={onNext}>
            Continue
          </button>
        )}
      </div>
    </div>
  )
}

const QuizPhase = ({ words, allWords, answers, onAnswer, onNext }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const currentWord = words[currentQuizIndex]
  const allAnswered = words.every(w => answers[w.id] !== undefined)

  // Generate options (correct + 3 wrong from full lesson words)
  const generateOptions = () => {
    if (!currentWord) return []

    const options = [currentWord.translation]
    const pool = allWords ? allWords.filter(w => w.id !== currentWord.id) : words.filter(w => w.id !== currentWord.id)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)

    for (const w of shuffled) {
      if (options.length >= 4) break
      if (w.translation && !options.includes(w.translation)) {
        options.push(w.translation)
      }
    }

    if (options.length < 4) {
      const fallback = words.filter(w => w.id !== currentWord?.id)
      for (const w of fallback) {
        if (options.length >= 4) break
        if (w.translation && !options.includes(w.translation)) options.push(w.translation)
      }
    }

    while (options.length < 4) options.push(`Option ${options.length}`)

    return options.sort(() => Math.random() - 0.5)
  }

  const options = useMemo(() => generateOptions(), [currentWord?.id, allWords, words])

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

  const handleNextQuiz = () => {
    if (currentQuizIndex < words.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else if (allAnswered) {
      onNext()
    }
  }

  return (
    <div className="quiz-phase">
      <div className="quiz-header">
        <h2>Quiz Time!</h2>
        <div className="quiz-progress">{currentQuizIndex + 1}/{words.length}</div>
      </div>

      <div className="quiz-question">
        <h1 className="quiz-word">{currentWord.word}</h1>
        {currentWord.audio_url && (
          <button className="btn-audio" onClick={() => new Audio(currentWord.audio_url).play()}>
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
              ✗ Incorrect. The answer is: {currentWord.translation}
            </div>
          )}
          <button className="btn-primary" onClick={handleNextQuiz}>
            {currentQuizIndex < words.length - 1 ? 'Next Question' : 'Finish Class'}
          </button>
        </div>
      )}
    </div>
  )
}

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

export default LessonPage
