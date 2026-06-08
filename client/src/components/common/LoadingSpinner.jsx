import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={styles.container}>
      {/* אלמנט העיגול המסתובב */}
      <div style={styles.spinner}></div>
      <p style={styles.text}>טוען את השיעור, בהצלחה...</p>
    </div>
  );
};

// עיצוב CSS-in-JS כדי לחסוך קבצי CSS נפרדים
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh', // ממרכז את הספינר כמעט על כל גובה המסך
    width: '100%',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '6px solid #e5e5e5', // צבע הרקע של העיגול
    borderTop: '6px solid #1cb0f6', // צבע הפס המסתובב (הכחול של דואולינגו)
    borderRadius: '50%',
    animation: 'spin 1s linear infinite', // גורם לו להסתובב ברצף
  },
  text: {
    marginTop: '15px',
    fontSize: '18px',
    color: '#666',
    fontWeight: 'bold',
    fontFamily: 'sans-serif'
  }
};

// הזרקת האנימציה של הסיבוב ישירות לדף (טריק שימושי ב-React כשרוצים להימנע מקובץ CSS חיצוני)
const styleSheet = document.styleSheets[0];
const animationCode = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (styleSheet) {
  styleSheet.insertRule(animationCode, styleSheet.cssRules.length);
}

export default LoadingSpinner;