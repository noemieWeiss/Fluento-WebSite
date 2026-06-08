import React from 'react';

const LessonImage = ({ src, alt }) => {
  return (
    <div className="image-wrapper" style={{
      width: '200px',
      height: '200px',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#f7f7f7',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img 
        src={src} 
        alt={alt} 
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain' 
        }} 
      />
    </div>
  );
};

export default LessonImage;