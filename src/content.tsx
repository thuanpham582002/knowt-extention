import React from 'react';
import ReactDOM from 'react-dom';
import TextTracker from './components/TextTracker';
import Dictionary from './components/Dictionary';
import Explanation from './components/Explanation';

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key.toLowerCase() === 't') {
    window.postMessage({ type: 'PLAY_AUDIO' }, '*');
  }
};

const createObserver = () => {
  document.addEventListener('keydown', handleKeyPress);
  
  const observer = new MutationObserver((mutations) => {
    const proseMirrorDivs = document.querySelectorAll('.ProseMirror');
    
    if (proseMirrorDivs.length == 2) {
      const boldBody2 = document.querySelector('.bold.body2');
      if (boldBody2) {
        const skippedText = boldBody2.textContent?.includes('You skipped this');
        if (skippedText) {
          const targetDiv = proseMirrorDivs[1];
          const targetText = targetDiv.textContent || '';
          const definitionDiv = proseMirrorDivs[0];
          const definitionText = definitionDiv.textContent || '';
          const existingTracker = document.getElementById('text-tracker-extension');
          const existingDict = document.getElementById('dictionary-extension');
          const existingExplanation = document.getElementById('explanation-extension');
          
          if (!existingTracker && !existingDict && !existingExplanation) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.gap = '10px';
            
            const dictContainer = document.createElement('div');
            dictContainer.id = 'dictionary-extension';
            
            const trackerContainer = document.createElement('div');
            trackerContainer.id = 'text-tracker-extension';

            const explanationContainer = document.createElement('div');
            explanationContainer.id = 'explanation-extension';
            
            wrapper.appendChild(dictContainer);
            wrapper.appendChild(trackerContainer);
            wrapper.appendChild(explanationContainer);
            
            targetDiv.parentNode?.insertBefore(wrapper, targetDiv.nextSibling);

            ReactDOM.render(<Dictionary word={targetText} />, dictContainer);
            ReactDOM.render(
              <React.StrictMode>
                <TextTracker />
              </React.StrictMode>,
              trackerContainer
            );
            ReactDOM.render(
              <Explanation
                userAnswer=""
                correctAnswer={targetText}
                definition={definitionText}
              />,
              explanationContainer
            );
          }
        }
      }
    }
    if (proseMirrorDivs.length == 3) {
      const definitionDiv = proseMirrorDivs[0];
      const definitionText = definitionDiv.textContent || '';
      
      const targetDiv = proseMirrorDivs[2];
      const targetText = targetDiv.textContent || '';
      const existingTracker = document.getElementById('text-tracker-extension');
      const existingDict = document.getElementById('dictionary-extension');
      const existingExplanation = document.getElementById('explanation-extension');
      
      if (!existingTracker && !existingDict && !existingExplanation) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '10px';
        
        const dictContainer = document.createElement('div');
        dictContainer.id = 'dictionary-extension';
        
        const trackerContainer = document.createElement('div');
        trackerContainer.id = 'text-tracker-extension';

        const explanationContainer = document.createElement('div');
        explanationContainer.id = 'explanation-extension';
        
        wrapper.appendChild(dictContainer);
        wrapper.appendChild(trackerContainer);
        wrapper.appendChild(explanationContainer);
        
        targetDiv.parentNode?.insertBefore(wrapper, targetDiv.nextSibling);

        const userAnswerDiv = proseMirrorDivs[1];
        const userAnswerText = userAnswerDiv.textContent || '';

        ReactDOM.render(<Dictionary word={targetText} />, dictContainer);
        ReactDOM.render(
          <React.StrictMode>
            <TextTracker />
          </React.StrictMode>,
          trackerContainer
        );
        ReactDOM.render(
          <Explanation 
            userAnswer={userAnswerText} 
            correctAnswer={targetText} 
            definition={definitionText}
          />,
          explanationContainer
        );
      }
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