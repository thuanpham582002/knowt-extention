import React from 'react';
import ReactDOM from 'react-dom';
import MuscleMemoryHolder from './components/MuscleMemoryHolder';
import { VocabularyStorage } from './utils/VocabularyStorage';

const parseShowAfterTime = (timeText: string): number | null => {
  const match = timeText.match(/Show in (\d+) (second|seconds|minute|minutes|day|days)/);
  if (!match) return null;

  const number = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  let showAfterSeconds = number;
  if (unit.startsWith('minute')) {
    showAfterSeconds = number * 60;
  } else if (unit.startsWith('day')) {
    showAfterSeconds = number * 24 * 60 * 60;
  }
  
  return showAfterSeconds;
};

const findButtonWithBlackBorder = (): HTMLElement | null => {
  const buttons = document.querySelectorAll('div[button]');
  return Array.from(buttons).find(button => {
    const buttonElement = button as HTMLElement;
    const style = buttonElement.style.border;
    const hasBlackBorder = style.includes('var(--color-neutral-black');
    return hasBlackBorder;
  }) as HTMLElement || null;
};

const saveVocabulary = async (word: string, description: string, showAfterSeconds: number) => {
  try {
    const success = await VocabularyStorage.add(word, description, showAfterSeconds);
    if (success) {
      console.log('Saved vocabulary:', { word, description });
    } else {
      console.log('Word already exists in vocabulary');
    }
  } catch (error) {
    console.error('Failed to save vocabulary:', error);
  }
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key.toLowerCase() === 't') {
    window.postMessage({ type: 'PLAY_AUDIO' }, '*');
  }
};

const createObserver = () => {
  document.addEventListener('keydown', handleKeyPress);
  
  const observer = new MutationObserver((mutations) => {
    if (document.querySelector('.muscle-memory-holder')) {
      return;
    }
    const proseMirrorDivs = document.querySelectorAll('.ProseMirror');
    
    if (proseMirrorDivs.length == 2) {
      const boldBody2 = document.querySelector('.bold.body2');
      if (boldBody2) {
        const targetDiv = proseMirrorDivs[1];
        const targetText = targetDiv.textContent || '';
        const definitionDiv = proseMirrorDivs[0];
        const definitionText = definitionDiv.textContent || '';
        const skippedText = boldBody2.textContent?.includes('You skipped this');

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '10px';
        targetDiv.parentNode?.insertBefore(wrapper, targetDiv.nextSibling);

       if (skippedText) {
          ReactDOM.render(<MuscleMemoryHolder userAnswer="" correctAnswer={targetText} isRenderDiffCheck={false} description={definitionText} isRenderTextTracker={true} isRenderDictionary={true} isRenderExplanation={true} onRenderSuccess={() => {
            const button = findButtonWithBlackBorder();
            const showAfterSeconds = button?.textContent ? parseShowAfterTime(button.textContent) : null;
            
            if (showAfterSeconds) {
              saveVocabulary(targetText, definitionText, showAfterSeconds);
            }
          }} />, wrapper);
        } 
        else {
          const button = findButtonWithBlackBorder();
          const showAfterSeconds = button?.textContent ? parseShowAfterTime(button.textContent) : null;
          
          if (showAfterSeconds) {
            saveVocabulary(targetText, definitionText, showAfterSeconds);
          }
        }
      }
    }
    if (proseMirrorDivs.length == 3) {
      const definitionDiv = proseMirrorDivs[0];
      const definitionText = definitionDiv.textContent || '';
      
      const targetDiv = proseMirrorDivs[2];
      const targetText = targetDiv.textContent || '';
     
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.gap = '10px';
              
      targetDiv.parentNode?.insertBefore(wrapper, targetDiv.nextSibling);

      const userAnswerDiv = proseMirrorDivs[1];
      const userAnswerText = userAnswerDiv.textContent || '';

      ReactDOM.render(<MuscleMemoryHolder userAnswer={userAnswerText} correctAnswer={targetText} isRenderDiffCheck={false} description={definitionText} isRenderTextTracker={true} isRenderDictionary={true} isRenderExplanation={true} onRenderSuccess={() => {
        const button = findButtonWithBlackBorder();
        const showAfterSeconds = button?.textContent ? parseShowAfterTime(button.textContent) : null;
        
        if (showAfterSeconds) {
          saveVocabulary(targetText, definitionText, showAfterSeconds);
        }
      }} />, wrapper);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyPress);
    observer.disconnect();
  };
};

// Create observer and store cleanup function
const cleanup = createObserver();

// Add cleanup on window unload
window.addEventListener('unload', cleanup);

// Create new observer on load
window.addEventListener('load', () => {
  cleanup(); // Clean up existing observer if any
  createObserver();
}); 