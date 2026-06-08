import React from 'react';
import LessonImage from './LessonImage';
import AudioButton from './AudioButton';

const QuestionCard = ({ questionData }) => {
  return (
    <div className="question-card" style={{ textAlign: 'center', margin: '20px 0' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#3c3c3c' }}>
       Select the correct translation: "{questionData.word_target}"
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <LessonImage src={questionData.image_url} alt={questionData.word_target} />
        <AudioButton audioUrl={questionData.audio_url} />
      </div>
    </div>
  );
};

export default QuestionCard;