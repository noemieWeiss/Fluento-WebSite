import { useParams, useNavigate } from 'react-router-dom'
import useLessonPlayer from '../../../hooks/useLessonPlayer'

import LearnPhase from './LearnPhase'
import QuizPhase from './QuizPhase'
import ClassComplete from './ClassComplete'
import LessonSummary from './LessonSummary'
import StudentSidebar from '../../../components/student/sidebar/StudentSidebar'
import '../../../styles/lesson.css'
export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const {
    classes,
    currentClassIndex,
    currentWordIndex,
    phase,
    quizAnswers,
    loading,
    error,
    allWords,
    lessonSummary,
    setQuizAnswers,
    handleNext,
    handleQuizAnswer,
    handleContinueToNextClass,
    handleStopAndExit
  } = useLessonPlayer(lessonId, navigate)

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const currentClass = classes[currentClassIndex]
  if (!currentClass) return <div>No content</div>

  return (
    <div className="student-layout">
      <StudentSidebar />
      <div className="lesson-container">
        {phase === 'learn' && (
          <LearnPhase
            word={currentClass.words[currentWordIndex]}
            onNext={handleNext}
            currentWord={currentWordIndex + 1}
            totalWords={currentClass.words.length}
          />
        )}

        {phase === 'quiz' && (
          <QuizPhase
            words={currentClass.words}
            allWords={allWords}
            answers={quizAnswers}
            onAnswer={handleQuizAnswer}
            onNext={handleNext}
          />
        )}

        {phase === 'classComplete' && (
          <ClassComplete
            classNumber={currentClass.classNumber}
            isLastClass={currentClassIndex === classes.length - 1}
            onContinue={handleContinueToNextClass}
            onStop={handleStopAndExit}
          />
        )}
        {phase === 'complete' && (
          <LessonSummary
            score={lessonSummary.score}
            correctAnswers={lessonSummary.correct}
            totalWords={lessonSummary.total}
            xpEarned={lessonSummary.xp}
            onBackToLessons={handleStopAndExit}
            onRetryLesson={() => window.location.reload()}
          />
        )
        }
      </div>
    </div>
  )
}