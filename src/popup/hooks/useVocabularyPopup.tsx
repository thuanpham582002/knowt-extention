import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { VocabularyItem } from '../../types/VocabularyItem';
import { VocabularyStorage } from '../../utils/VocabularyStorage';
import { AudioService } from '../../services/AudioService';

type ReactKeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

export const useVocabularyPopup = () => {
  const [show, setShow] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyItem | null>(null);
  const [input, setInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRewriteCorrect, setIsRewriteCorrect] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRetry, setIsRetry] = useState(false);

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

  const handleInputKeyPress = async (e: ReactKeyboardEvent) => {
    if (e.key === 'Enter') {
      const isAnswerCorrect = input.toLowerCase().trim() === vocabulary?.word.toLowerCase().trim();
      setIsCorrect(isAnswerCorrect);
      setShowAnswer(true);
      
      if (vocabulary && !isRetry) {
        await VocabularyStorage.updateReviewInterval(vocabulary.word, isAnswerCorrect);
      }
    }
  };

  const handleNext = () => {
    setShowAnswer(false);
    setShow(false);
    setInput('');
    setIsCorrect(false);
    setIsRetry(false);
    setTimeout(() => {
      checkAndLoadVocabulary();
    }, 300);
  };

  const handleRetry = () => {
    setShowAnswer(false);
    setInput('');
    setIsCorrect(false);
    setIsRewriteCorrect(false);
    setIsRetry(true);
  };

  useEffect(() => {
    chrome.storage.sync.get({ enableVocabularyReminder: true }, (result) => {
      setIsEnabled(result.enableVocabularyReminder);
      if (result.enableVocabularyReminder) {
        checkAndLoadVocabulary();
      }
    });

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
        return;
      }

      if (showAnswer && isRewriteCorrect) {
        if (event.key === 'ArrowRight' && 
            !event.ctrlKey && 
            !event.altKey && 
            !event.shiftKey && 
            !event.metaKey) {
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

  return {
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
  };
}; 