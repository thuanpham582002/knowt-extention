import React from 'react';
import ReactDOM from 'react-dom';
import TextTracker from './components/TextTracker';

const createObserver = () => {
  const observer = new MutationObserver((mutations) => {
    const proseMirrorDivs = document.querySelectorAll('.ProseMirror');
    
    if (proseMirrorDivs.length == 2) {
        const boldBody2 = document.querySelector('.bold.body2');
        console.log('knowt-extension', boldBody2);
        if (boldBody2) {
            const skippedText = boldBody2.textContent?.includes('You skipped this');
            console.log(skippedText);
            if (skippedText) {
                const targetDiv = proseMirrorDivs[1];
                const existingTracker = document.getElementById('text-tracker-extension');
                if (!existingTracker) {
                    const container = document.createElement('div');
                    container.id = 'text-tracker-extension';
                    targetDiv.parentNode?.insertBefore(container, targetDiv.nextSibling);
                    ReactDOM.render(
                        <React.StrictMode>
                            <TextTracker />
                        </React.StrictMode>,
                        container
                    );
                }
            }
        }
    }
    if (proseMirrorDivs.length >= 3) {
      const targetDiv = proseMirrorDivs[2];
      const existingTracker = document.getElementById('text-tracker-extension');
      
      if (!existingTracker) {
        const container = document.createElement('div');
        container.id = 'text-tracker-extension';
        targetDiv.parentNode?.insertBefore(container, targetDiv.nextSibling);

        ReactDOM.render(
          <React.StrictMode>
            <TextTracker />
          </React.StrictMode>,
          container
        );
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return observer;
};

createObserver();
window.addEventListener('load', createObserver); 