import React from 'react';

const VocabularyConfig: React.FC = () => {
  const handleOpenManager = () => {
    chrome.tabs.create({ url: 'vocabulary.html' });
  };

  return (
    <div style={{
      padding: '20px',
      width: '400px',
      fontFamily: 'var(--knowt-font-name)',
    }}>
      <button
        onClick={handleOpenManager}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white', 
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          width: '100%'
        }}
      >
        Open Vocabulary Manager
      </button>
    </div>
  );
};

export default VocabularyConfig; 