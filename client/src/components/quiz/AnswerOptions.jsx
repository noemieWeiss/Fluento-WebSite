import React from 'react';

const AnswerOptions = ({ options, selectedOption, onSelect, isAnswered }) => {
  return (
    <div className="options-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '15px',
      margin: '30px 0'
    }}>
      {options.map((option, index) => {
        const isSelected = selectedOption === option;

        return (
          <button
            key={index}
            disabled={isAnswered} 
            onClick={() => onSelect(option)}
            style={{
              padding: '15px',
              fontSize: '18px',
              backgroundColor: isSelected ? '#ddf4ff' : 'white',
              border: isSelected ? '2px solid #1899d6' : '2px solid #e5e5e5',
              borderRadius: '12px',
              cursor: isAnswered ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              textAlign: 'center',
              boxShadow: isSelected ? '0 2px 0 #1899d6' : '0 2px 0 #e5e5e5',
              transition: 'all 0.2s ease'
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default AnswerOptions;