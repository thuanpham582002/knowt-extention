import React from 'react';
import ReactDOM from 'react-dom';
import VocabularyPopup from './components/VocabularyPopup';

const container = document.createElement('div');
container.id = 'vocabulary-popup-root';
document.body.appendChild(container);

ReactDOM.render(
  <React.StrictMode>
    <VocabularyPopup />
  </React.StrictMode>,
  container
); 