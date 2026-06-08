import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LessonSummary = ({ score, total, lessonId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const saveProgress = async () => {
      try {
        await fetch(`http://localhost:5000/api/user/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ lessonId })
        });
      } catch (error) {
        console.error("Error in saving progress:", error);
      }
    };

    saveProgress();
  }, [lessonId]);

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ color: '#58cc02', fontSize: '32px' }}>Lesson completed!</h1>
      <p style={{ fontSize: '20px', margin: '20px 0', color: '#666' }}>
        You answered <strong>{score}</strong> out of <strong>{total}</strong> questions correctly!
      </p>

      <div style={{ fontSize: '48px', margin: '30px 0' }}>🎯</div>

      <button 
        onClick={() => navigate('/dashboard')}
        style={{
          backgroundColor: '#1cb0f6',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '15px 40px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 0 #1899d6'
        }}
      >
        Back to home page
      </button>
    </div>
  );
};

export default LessonSummary;