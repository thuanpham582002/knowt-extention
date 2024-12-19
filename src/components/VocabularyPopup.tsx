import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import { diffChars, Change } from 'diff';
import { fetchDefinition } from './Dictionary';
import { getExplanation } from './Explanation';
import { VocabularyItem } from '../types/VocabularyItem';
import { DictionaryResponse } from '../types/DictionaryResponse';
import { VocabularyStorage } from '../utils/VocabularyStorage';


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
  transform: translate(-50%, -50%) !important;
  width: 800px !important;
  max-width: 95vw !important;
  max-height: 90vh !important;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  z-index: 999999;
  opacity: ${props => props.$show ? 1 : 0};
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PopupContent = styled.div`
  padding: 25px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  margin-bottom: 25px;
  line-height: 1.6;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger'; disabled?: boolean }>`
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => {
    if (props.disabled) return '#cccccc';
    return props.variant === 'danger' ? '#f44336' : '#4CAF50';
  }};
  opacity: ${props => props.disabled ? 0.7 : 1};
  color: white;
  font-size: 14px;
  transition: all 0.2s ease;
`;

const ContentColumn = styled.div<{ $type?: 'dictionary' | 'rewrite' | 'explanation' }>`
  background: ${props => {
    switch (props.$type) {
      case 'dictionary':
        return '#f8f9fa';
      case 'rewrite':
        return '#fff';
      case 'explanation':
        return '#f5f8ff';
      default:
        return '#fff';
    }
  }};
  border-radius: 12px;
  padding: 6px 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  
  & > div:first-child {
    margin-top: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #666;
`;

const TabContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
`;

const PhoneticText = styled.div`
  font-style: italic;
  color: #666;
  margin: 5px 0;
`;

const PartOfSpeech = styled.div`
  font-weight: bold;
  margin-top: 10px;
`;

const Definition = styled.div`
  margin: 5px 0;
  padding-left: 15px;
`;

const Example = styled.div`
  color: #666;
  font-style: italic;
  margin-left: 15px;
`;

const CharacterDiff = styled.div`
  font-size: 18px;
  font-family: monospace;
  background: #f8f9fa;
  border-radius: 12px;
  line-height: 1.6;

  .diff-section {
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .label {
    font-size: 14px;
    color: #666;
    display: block;
  }

  .char {
    display: inline-block;
  }
`;

const RewriteTextarea = styled.textarea`
  width: 100%;
  flex: 1;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  margin: 15px 0;
  transition: all 0.3s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`;

const RewriteStatus = styled.div<{ $isCorrect: boolean }>`
  border-radius: 8px;
  font-size: 15px;
  background-color: ${props => props.$isCorrect ? '#e8f5e9' : '#fff3e0'};
  color: ${props => props.$isCorrect ? '#2e7d32' : '#e65100'};
  border: 1px solid ${props => props.$isCorrect ? '#a5d6a7' : '#ffe0b2'};
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "${props => props.$isCorrect ? '✓' : 'ℹ'}";
    font-weight: bold;
  }
`;


const VocabularyPopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyItem | null>(null);
  const [input, setInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // API Data States
  const [dictionaryData, setDictionaryData] = useState<DictionaryResponse | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loadingStates, setLoadingStates] = useState({
    dictionary: false,
    explanation: false,
  });

  const [rewriteInput, setRewriteInput] = useState('');
  const [isRewriteCorrect, setIsRewriteCorrect] = useState(false);

  useEffect(() => {
    checkAndLoadVocabulary();
    return () => {
      const container = document.getElementById('vocabulary-popup-root');
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (showAnswer && !isCorrect && vocabulary) {
      Promise.all([
        fetchDictionaryData(vocabulary.word),
        fetchExplanationData(),
      ]);
    }
  }, [showAnswer, isCorrect]);

  useEffect(() => {
    const handleKeyPress = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      } else if (
        event.key === 'ArrowRight' && 
        showAnswer && 
        isRewriteCorrect
      ) {
        handleNext();
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
    if (e.key === 'Enter' && input.trim() !== '') {
      const isAnswerCorrect = input.toLowerCase().trim() === vocabulary?.word.toLowerCase().trim();
      setIsCorrect(isAnswerCorrect);
      setShowAnswer(true);
      
      if (vocabulary) {
        await VocabularyStorage.updateReviewInterval(vocabulary.word, isAnswerCorrect);
        
        if (!isAnswerCorrect) {
          Promise.all([
            fetchDictionaryData(vocabulary.word),
            fetchExplanationData(),
          ]);
        }
      }
    }
  };


  const handleNext = () => {
    setShowAnswer(false);
    setShow(false);
    setInput('');
    setIsCorrect(false);
    setRewriteInput('');
    setIsRewriteCorrect(false);
    setTimeout(() => {
      checkAndLoadVocabulary();
    }, 300);
  };

  const fetchDictionaryData = async (word: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, dictionary: true }));
      const data = await fetchDefinition(word);
      setDictionaryData(data);
    } catch (error) {
      setDictionaryData(null);
      console.error('Error fetching dictionary data:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, dictionary: false }));
    }
  };

  const fetchExplanationData = async () => {
    if (!vocabulary) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, explanation: true }));
      const { groqApiKey, groqModel } = await chrome.storage.sync.get(['groqApiKey', 'groqModel']);
      
      const content = await getExplanation({
        correctAnswer: vocabulary.word,
        definition: vocabulary.description,
        apiKey: groqApiKey,
        model: groqModel
      });

      setExplanation(content);
    } catch (error) {
      console.error('Error fetching explanation:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, explanation: false }));
    }
  };

  const handleRewriteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRewriteInput(value);
    
    if (vocabulary) {
      const isCorrect = value.toLowerCase().includes(vocabulary.word.toLowerCase());
      setIsRewriteCorrect(isCorrect);
    }
  };

  const renderDictionary = () => (
    <ContentColumn $type="dictionary">
      {loadingStates.dictionary ? (
        <LoadingSpinner>Loading...</LoadingSpinner>
      ) : dictionaryData ? (
        <>
          {dictionaryData.phonetics?.[0]?.text && (
            <PhoneticText>{dictionaryData.phonetics[0].text}</PhoneticText>
          )}
          {dictionaryData.meanings.slice(0, 2).map((meaning, index) => (
            <div key={index}>
              <PartOfSpeech>{meaning.partOfSpeech}</PartOfSpeech>
              {meaning.definitions.slice(0, 2).map((def, i) => (
                <div key={i}>
                  <Definition>{def.definition}</Definition>
                  {def.example && <Example>Example: {def.example}</Example>}
                </div>
              ))}
            </div>
          ))}
        </>
      ) : (
        <div>
          <p>No dictionary data available</p>
        </div>
      )}
    </ContentColumn>
  );

  const renderExplanation = () => (
    <ContentColumn $type="explanation">
      {loadingStates.explanation ? (
        <LoadingSpinner>Loading...</LoadingSpinner>
      ) : (
        <TabContent>{explanation}</TabContent>
      )}
    </ContentColumn>
  );

  const renderRewrite = () => (
    <>
        <RewriteTextarea
          value={rewriteInput}
          onChange={handleRewriteChange}
          placeholder={`Create a sentence that includes the word "${vocabulary?.word}"...`}
          autoFocus
          />
          {rewriteInput && (
            <RewriteStatus $isCorrect={isRewriteCorrect}>
              {isRewriteCorrect 
                ? `Great! Your sentence correctly uses "${vocabulary?.word}"`
                : `Remember to include the word "${vocabulary?.word}" in your sentence`
              }
            </RewriteStatus>
          )}
    </>
  );

  const renderCharacterDiff = () => {
    if (!showAnswer || !vocabulary) return null;

    const userAnswer = input.trim().toLowerCase();
    const correctAnswer = vocabulary.word.toLowerCase();
    
    const differences = diffChars(userAnswer, correctAnswer);

    return (
      <CharacterDiff>
        <div className="diff-section">
          <span className="label">Your answer:</span>
          {differences.map((part: Change, i: number) => {
            if (part.added) {
              return null; // Don't show added parts in user's answer
            }
            return part.removed ? (
              <span key={i} className="char incorrect">
                {part.value}
              </span>
            ) : (
              <span key={i} className="char correct">
                {part.value}
              </span>
            );
          })}
        </div>
        
        <div className="diff-section">
          <span className="label">Correct answer:</span>
          {differences.map((part: Change, i: number) => {
            if (part.removed) {
              return null; // Don't show removed parts in correct answer
            }
            return part.added ? (
              <span key={i} className="char missing">
                {part.value}
              </span>
            ) : (
              <span key={i} className="char correct">
                {part.value}
              </span>
            );
          })}
        </div>
      </CharacterDiff>
    );
  };

  if (!vocabulary) return null;

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
              {renderCharacterDiff()}
              {renderDictionary()}
              {renderRewrite()}
              {renderExplanation()}
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