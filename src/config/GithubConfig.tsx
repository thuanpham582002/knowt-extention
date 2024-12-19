import React, { useEffect, useState } from 'react';

const GithubConfig: React.FC = () => {
  const [githubToken, setGithubToken] = useState('');
  const [githubRepoOwner, setGithubRepoOwner] = useState('');
  const [githubRepoName, setGithubRepoName] = useState('');
  const [githubHighlightsPath, setGithubHighlightsPath] = useState('data/vocabulary.json');
  const [enableGithubSync, setEnableGithubSync] = useState(false);

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get({
      githubToken: '',
      githubRepoOwner: '',
      githubRepoName: '',
      githubHighlightsPath: 'data/vocabulary.json',
      enableGithubSync: false
    }, (items) => {
      setGithubToken(items.githubToken);
      setGithubRepoOwner(items.githubRepoOwner);
      setGithubRepoName(items.githubRepoName);
      setGithubHighlightsPath(items.githubHighlightsPath);
      setEnableGithubSync(items.enableGithubSync);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({
      githubToken,
      githubRepoOwner,
      githubRepoName,
      githubHighlightsPath,
      enableGithubSync
    }, () => {
      alert('Settings saved successfully!');
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '15px' }}>GitHub Configuration</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          <input
            type="checkbox"
            checked={enableGithubSync}
            onChange={(e) => setEnableGithubSync(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Enable GitHub Sync
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>GitHub Token:</label>
        <input
          type="password"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          placeholder="ghp_xxxxxxxxxxxx"
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Repository Owner:</label>
        <input
          type="text"
          value={githubRepoOwner}
          onChange={(e) => setGithubRepoOwner(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          placeholder="username or organization"
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Repository Name:</label>
        <input
          type="text"
          value={githubRepoName}
          onChange={(e) => setGithubRepoName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          placeholder="repository-name"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>File Path Backup:</label>
        <input
          type="text"
          value={githubHighlightsPath}
          onChange={(e) => setGithubHighlightsPath(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          placeholder="data/vocabulary.json"
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Save Settings
      </button>
    </div>
  );
};

export default GithubConfig; 