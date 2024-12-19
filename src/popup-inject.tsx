import React from 'react';
import { createRoot } from 'react-dom/client';
import VocabularyPopup from './popup/VocabularyPopup';

const container = document.createElement('div');
container.id = 'vocabulary-popup-root';
document.body.appendChild(container);

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <VocabularyPopup />
  </React.StrictMode>
); 