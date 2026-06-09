import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressBar from '../components/quiz/ProgressBar';
import QuestionCard from '../components/quiz/QuestionCard';
import AnswerOptions from '../components/quiz/AnswerOptions';
import FeedbackSection from '../components/quiz/FeedbackSection';
import LessonSummary from '../components/quiz/LessonSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Lesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('authUser'))?.token;
        const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}/words`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [lessonId]);

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    const currentQuestion = questions[currentIndex];
    const correct = selectedOption === currentQuestion.word_translation;

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setLessonCompleted(true);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (questions.length === 0) return <div>לא נמצאו שאלות לשיעור זה.</div>;

  if (lessonCompleted) {
    return <LessonSummary score={score} total={questions.length} lessonId={lessonId} />;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="lesson-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      
      <ProgressBar current={currentIndex} total={questions.length} />

      <button onClick={() => navigate('/dashboard')} className="exit-btn" style={{ float: 'left', margin: '10px 0' }}>✕</button>

      <QuestionCard questionData={currentQuestion} />

      <AnswerOptions 
        options={currentQuestion.options} 
        selectedOption={selectedOption}
        onSelect={setSelectedOption}
        isAnswered={isAnswered}
      />

      <FeedbackSection 
        selectedOption={selectedOption}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        correctAnswer={currentQuestion.word_translation}
        onCheck={handleCheckAnswer}
        onNext={handleNextQuestion}
      />
      
    </div>
  );
};

export default Lesson;