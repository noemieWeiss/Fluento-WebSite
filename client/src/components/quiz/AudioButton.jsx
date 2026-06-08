const AudioButton = ({ audioUrl }) => {
  const playAudio = () => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <button onClick={playAudio} className="audio-btn">
      🔊
    </button>
  );
};
export default AudioButton;