import React from 'react';
import { createRoot } from 'react-dom/client';
import ApiKeyConfig from './config/ApiKeyConfig';
import GithubConfig from './config/GithubConfig';
import VocabularyConfig from './config/VocabularyConfig';
const Popup: React.FC = () => {
  return (
    <div style={{ width: '400px', maxHeight: '600px', overflow: 'auto' }}>
      <ApiKeyConfig />
      <hr style={{ margin: '6px 0', border: '0', borderTop: '1px solid #eee' }} />
      <GithubConfig />
      <hr style={{ margin: '6px 0', border: '0', borderTop: '1px solid #eee' }} />
      <VocabularyConfig />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );
} 