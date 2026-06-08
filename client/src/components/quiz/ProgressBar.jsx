const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div style={{ width: '100%', backgroundColor: '#e5e5e5', height: '15px', borderRadius: '10px' }}>
      <div style={{ width: `${percentage}%`, backgroundColor: '#58cc02', height: '100%', borderRadius: '10px', transition: 'width 0.3s ease' }} />
    </div>
  );
};
export default ProgressBar;
