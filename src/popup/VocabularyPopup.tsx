import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ReactDOM from 'react-dom';
import { VocabularyItem } from '../types/VocabularyItem';
import { VocabularyStorage } from '../utils/VocabularyStorage';
import MuscleMemoryHolder from '../components/MuscleMemoryHolder';
import { AudioService } from '../services/AudioService';

interface PopupContainerProps {
  $show: boolean;
}

type ReactKeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

const PopupOverlay = styled.div<PopupContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999998;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${props => props.$show ? 'auto' : 'none'};
`;

const PopupContainer = styled.div<PopupContainerProps>`
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%)!important;
  transform-origin: center;
  width: 63.75rem !important;
  max-width: 95vw !important;
  height: 80vh !important;
  background: white;
  border-radius: 1.275rem;
  box-shadow: 0 0.425rem 2.125rem rgba(0, 0, 0, 0.15);
  z-index: 999999;
  opacity: ${props => props.$show ? 1 : 0};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
`;

const PopupContent = styled.div`
  padding: 2.55rem;
  flex: 1;
  background: #282929;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 0.85rem;
  }
  
  &::-webkit-scrollbar-track {
    background: #1e1e1e;
    border-radius: 0.425rem;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 0.425rem;
    
    &:hover {
      background: #5a5a5a;
    }
  }
`;
const Description = styled.p`
  font-size: 1.7rem;
  margin-bottom: 2.55rem;
  line-height: 1.5;
  color: #E7E7E7;
  font-weight: 500;
`;
const Input = styled.input`
  width: 100%;
  padding: 1.7rem;
  border: 0.2125rem solid #e0e0e0;
  border-radius: 0.85rem;
  font-size: 1.7rem;
  transition: all 0.2s ease;
  background: #333;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 0.32rem rgba(33, 150, 243, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.0625rem;
  margin-top: 2.89rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger'; disabled?: boolean }>`
  padding: 0.85rem 1.7rem;
  border: none;
  border-radius: 0.53rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => {
    if (props.disabled) return '#cccccc';
    return props.variant === 'danger' ? '#f44336' : '#4CAF50';
  }};
  opacity: ${props => props.disabled ? 0.7 : 1};
  color: white;
  font-size: 1.7rem;
  transition: all 0.2s ease;
`;


const VocabularyPopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyItem | null>(null);
  const [input, setInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRewriteCorrect, setIsRewriteCorrect] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if reminders are enabled
    chrome.storage.sync.get({ enableVocabularyReminder: true }, (result) => {
      setIsEnabled(result.enableVocabularyReminder);
      if (result.enableVocabularyReminder) {
        checkAndLoadVocabulary();
      }
    });

    // Cleanup function
    return () => {
      const container = document.getElementById('vocabulary-popup-root');
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 't') {
        console.log('ctrl + t');
      }
      if (event.ctrlKey && event.key.toLowerCase() === 't' && 
          vocabulary?.word && 
          show && 
          !isPlaying) {
        setIsPlaying(true);
        await AudioService.playAudio(vocabulary.word);
        setIsPlaying(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [show, vocabulary, isPlaying]);

  useEffect(() => {
    const handleKeyPress = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      } else if ( 
        showAnswer && 
        isRewriteCorrect
      ) {
        if (event.key === 'ArrowRight') {
          handleNext();
        } else if (event.key === 'Enter') {
          handleClose();
        }
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [show, showAnswer, isRewriteCorrect]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      const container = document.getElementById('vocabulary-popup-root');
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
      }
    }, 300);
  };

  const checkAndLoadVocabulary = async () => {
    const dueVocabulary = await VocabularyStorage.getDueItems();
    if (dueVocabulary.length > 0) {
      const randomIndex = Math.floor(Math.random() * dueVocabulary.length);
      setVocabulary(dueVocabulary[randomIndex]);
      setShow(true);
    } else {
      console.log('No vocabulary items are due for review yet!');
    }
  };

  const handleInputKeyPress = async (e: ReactKeyboardEvent) => {
    if (e.key === 'Enter') {
      const isAnswerCorrect = input.toLowerCase().trim() === vocabulary?.word.toLowerCase().trim();
      setIsCorrect(isAnswerCorrect);
      setShowAnswer(true);
      
      if (vocabulary) {
        await VocabularyStorage.updateReviewInterval(vocabulary.word, isAnswerCorrect);
      }
    }
  };


  const handleNext = () => {
    setShowAnswer(false);
    setShow(false);
    setInput('');
    setIsCorrect(false);
    setTimeout(() => {
      checkAndLoadVocabulary();
    }, 300);
  };
  
  console.log('vocabulary', vocabulary);
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
            <>
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
            </>
          )}

          <ButtonContainer>
            {showAnswer && (
              <Button 
                onClick={handleNext}
                disabled={!isRewriteCorrect}
                title={!isRewriteCorrect ? "Write a sentence using the word to continue" : ""}
              >
                Next Word
              </Button>
            )}
            <Button variant="danger" onClick={handleClose}>Close</Button>
          </ButtonContainer>
        </PopupContent>
      </PopupContainer>
    </>
  );
};

export default VocabularyPopup; 