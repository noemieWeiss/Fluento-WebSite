import { useEffect, useMemo, useState } from 'react'
import { lessonsApi } from '../services/lessonsApi'
import { progressApi } from '../services/progressApi'

export default function useLessonPlayer(lessonId, navigate) {
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
            const [classesData, progressData] = await Promise.all([
                lessonsApi.getClasses(lessonId),
                progressApi.getLessonProgress(lessonId),
            ])

            const allWords = classesData.flatMap(c => c.words || [])

            const normalized = []
            for (let i = 0; i < allWords.length; i += 2) {
                const chunk = [allWords[i]]
                if (allWords[i + 1]) chunk.push(allWords[i + 1])

                normalized.push({
                    classNumber: normalized.length + 1,
                    words: chunk,
                    languageName: classesData[0]?.languageName
                })
            }

            setClasses(normalized)
            setCompletedClasses(progressData.completedClasses || [])

            const nextClassIndex = normalized.findIndex(
                c => !progressData.completedClasses?.includes(c.classNumber)
            )

            if (nextClassIndex !== -1) setCurrentClassIndex(nextClassIndex)
            else if (progressData.lessonCompleted) setPhase('complete')

            setLoading(false)
        } catch (err) {
            console.error(err)
            setError('Failed to load lesson')
            setLoading(false)
        }
    }

    const handleNext = () => {
        const currentClass = classes[currentClassIndex]

        if (!currentClass) return

        if (phase === 'learn') {
            if (currentWordIndex < currentClass.words.length - 1) {
                setCurrentWordIndex(i => i + 1)
            } else {
                setPhase('quiz')
                setCurrentWordIndex(0)
            }
        }

        if (phase === 'quiz') {
            const answeredAll = currentClass.words.every(
                w => quizAnswers[w.id] !== undefined
            )

            if (answeredAll) saveClassProgress()
        }
    }

    const saveClassProgress = async () => {
        const currentClass = classes[currentClassIndex]

        try {
            await progressApi.saveClassProgress(lessonId, currentClass.classNumber)

            setCompletedClasses(prev => [...prev, currentClass.classNumber])
            setPhase('classComplete')
        } catch (err) {
            console.error(err)
        }
    }

    const handleContinueToNextClass = () => {
        if (currentClassIndex < classes.length - 1) {
            setCurrentClassIndex(i => i + 1)
            setCurrentWordIndex(0)
            setPhase('learn')
        } else {
            completeLesson()
        }
    }

    const handleStopAndExit = () => {
        navigate('/student/lessons')
    }

    const handleQuizAnswer = (wordId, isCorrect) => {
        setQuizAnswers(prev => ({
            ...prev,
            [wordId]: isCorrect
        }))
    }

    const completeLesson = async () => {
        const correct = Object.values(quizAnswers).filter(Boolean).length
        const total = new Set(
            classes.flatMap(c => c.words.map(w => w.id))
        ).size

        const score = Math.round((correct / (total || 1)) * 100)

        try {
            await progressApi.completeLesson(lessonId, score)

            setPhase('complete')
        } catch (err) {
            console.error(err)
        }
    }
    const lessonSummary = useMemo(() => {
        const correct = Object.values(quizAnswers).filter(Boolean).length

        const total = new Set(
            classes.flatMap(c => c.words.map(w => w.id))
        ).size

        const score = Math.round((correct / (total || 1)) * 100)

        return {
            correct,
            total,
            score,
            xp: score
        }
    }, [quizAnswers, classes])
    const allWords = useMemo(() => {
        const map = new Map()
        classes.flatMap(c => c.words).forEach(w => {
            if (!map.has(w.id)) map.set(w.id, w)
        })
        return Array.from(map.values())
    }, [classes])

    return {
        classes,
        currentClassIndex,
        currentWordIndex,
        phase,
        quizAnswers,
        completedClasses,
        loading,
        error,
        allWords,
        lessonSummary,
        setQuizAnswers,

        handleNext,
        handleQuizAnswer,
        handleContinueToNextClass,
        handleStopAndExit
    }
}