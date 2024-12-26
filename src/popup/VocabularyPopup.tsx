import React from 'react';
import MuscleMemoryHolder from '../components/MuscleMemoryHolder';
import { useVocabularyPopup } from './hooks/useVocabularyPopup';
import {
  PopupOverlay,
  PopupContainer,
  PopupContent,
  Description,
  Input,
  ButtonContainer,
  Button
} from './styles/VocabularyPopupStyles';

const VocabularyPopup: React.FC = () => {
  const {
    show,
    vocabulary,
    input,
    setInput,
    showAnswer,
    isCorrect,
    isRewriteCorrect,
    setIsRewriteCorrect,
    isEnabled,
    handleInputKeyPress,
    handleNext,
    handleClose,
    handleRetry
  } = useVocabularyPopup();

  if (!vocabulary || !isEnabled) return null;

  return (
    <>
      <PopupOverlay $show={show} onClick={handleClose} />
      <PopupContainer $show={show}>
        <PopupContent>
          <Description>{vocabulary.description}</Description>
          
          {!showAnswer ? (
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleInputKeyPress}
              placeholder="Type your answer and press Enter..."
              autoFocus
            />
          ) : (
            <MuscleMemoryHolder
              userAnswer={input}
              correctAnswer={vocabulary.word}
              description={vocabulary.description}
              isRenderDiffCheck={!isCorrect}
              isRenderTextTracker={!isCorrect}
              isRenderDictionary={true}
              isRenderExplanation={true}
              onRetypeMatch={(isMatch) => setIsRewriteCorrect(isMatch)}
            />
          )}

          <ButtonContainer>
            {showAnswer && (
              <Button 
                variant="primary"
                onClick={handleNext}
                disabled={!isRewriteCorrect}
                title={!isRewriteCorrect ? "Write a sentence using the word to continue" : ""}
              >
                Next Word
              </Button>
            )}
            <Button onClick={handleRetry}>
              Retry
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </ButtonContainer>
        </PopupContent>
      </PopupContainer>
    </>
  );
};

export default VocabularyPopup; 