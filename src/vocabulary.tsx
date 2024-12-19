import React from 'react';
import { createRoot } from 'react-dom/client';
import VocabularyManager from './site/VocabularyManager';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <VocabularyManager />
    </React.StrictMode>
  );
} 