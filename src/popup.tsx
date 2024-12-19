import React from 'react';
import ReactDOM from 'react-dom';
import ApiKeyPopup from './components/ApiKeyPopup';
import GithubConfig from './components/GithubConfig';

const Popup: React.FC = () => {
  return (
    <div style={{ width: '400px', maxHeight: '600px', overflow: 'auto' }}>
      <ApiKeyPopup />
      <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
      <GithubConfig />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
); 