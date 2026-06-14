import { useState } from 'react'

const LearnPhase = ({ word, onNext, currentWord, totalWords }) => {
  const [showTranslation, setShowTranslation] = useState(false)

  if (!word) return null

  return (
    <div className="learn-phase">
      <div className="word-counter">
        Word {currentWord} of {totalWords}
      </div>

      {word.image_url && (
        <div className="word-image">
          <img src={word.image_url} alt={word.word} />
        </div>
      )}

      <div className="word-main">
        <h1 className="word">{word.word}</h1>

        {word.audio_url && (
          <button
            className="btn-audio"
            onClick={() => new Audio(word.audio_url).play()}
          >
            🔊 Listen
          </button>
        )}
      </div>

      {showTranslation && (
        <>
          <div className="translation">{word.translation}</div>

          {word.example_sentence && (
            <div className="example">
              <div className="example-label">Example:</div>
              <div className="example-text">{word.example_sentence}</div>
            </div>
          )}
        </>
      )}

      <div className="learn-actions">
        {!showTranslation ? (
          <button
            className="btn-primary"
            onClick={() => setShowTranslation(true)}
          >
            Show Translation
          </button>
        ) : (
          <button className="btn-primary" onClick={onNext}>
            Continue
          </button>
        )}
      </div>
    </div>
  )
}

export default LearnPhase