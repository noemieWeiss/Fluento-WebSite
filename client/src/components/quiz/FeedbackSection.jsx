import React from 'react';

const FeedbackSection = ({ selectedOption, isAnswered, isCorrect, correctAnswer, onCheck, onNext }) => {
  
  let backgroundColor = '#ffffff'; 
  if (isAnswered) {
    backgroundColor = isCorrect ? '#d7ffb8' : '#ffdfe0'; 
  }

  return (
    <div className="feedback-fixed-footer" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: backgroundColor,
      borderTop: '2px solid #e5e5e5',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxSizing: 'border-box',
      zIndex: 100
    }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {isAnswered && (
          isCorrect ? (
            <span style={{ color: '#58cc02' }}>🎉 Good Work! Correct answer.</span>
          ) : (
            <span style={{ color: '#ea2b2b' }}>😢 Incorrect. The answer is: {correctAnswer}</span>
          )
        )}
      </div>

      {!isAnswered ? (
        <button 
          onClick={onCheck}
          disabled={!selectedOption} 
          style={{
            backgroundColor: selectedOption ? '#58cc02' : '#e5e5e5',
            color: selectedOption ? 'white' : '#afafaf',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 35px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: selectedOption ? 'pointer' : 'not-allowed',
            boxShadow: selectedOption ? '0 4px 0 #46a302' : 'none'
          }}
        >
          Check answer
        </button>
      ) : (
        <button 
          onClick={onNext}
          style={{
            backgroundColor: isCorrect ? '#58cc02' : '#ea2b2b',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 35px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: isCorrect ? '0 4px 0 #46a302' : '0 4px 0 #c41e1e'
          }}
        >
          Continue
        </button>
      )}
    </div>
  );
};

export default FeedbackSection;