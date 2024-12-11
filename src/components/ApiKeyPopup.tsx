import React, { useState, useEffect } from 'react';

interface ModelOption {
  id: string;
  developer: string;
  contextWindow: string;
}

const PRODUCTION_MODELS: ModelOption[] = [
  { id: 'llama-3.3-70b-versatile', developer: 'Meta', contextWindow: '128k' },
  { id: 'gemma2-9b-it', developer: 'Google', contextWindow: '8,192' },
  { id: 'gemma-7b-it', developer: 'Google', contextWindow: '8,192' },
  { id: 'llama3-70b-8192', developer: 'Meta', contextWindow: '8,192' },
  { id: 'llama3-8b-8192', developer: 'Meta', contextWindow: '8,192' },
  { id: 'mixtral-8x7b-32768', developer: 'Mistral', contextWindow: '32,768' }
];

const ApiKeyPopup: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');

  useEffect(() => {
    chrome.storage.sync.get(['groqApiKey', 'groqModel'], (result) => {
      if (result.groqApiKey) {
        setApiKey(result.groqApiKey);
      }
      if (result.groqModel) {
        setSelectedModel(result.groqModel);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    chrome.storage.sync.set({ 
      groqApiKey: apiKey,
      groqModel: selectedModel 
    }, () => {
      console.log('Settings saved');
    });
  };

  return (
    <div style={{
      padding: '20px',
      width: '400px',
      fontFamily: 'var(--knowt-font-name)',
    }}>
      <h2 style={{ marginBottom: '15px' }}>GROQ API Settings</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="apiKey" 
            style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontSize: '14px'
            }}
          >
            GROQ API Key:
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="model"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px'
            }}
          >
            AI Model:
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            {PRODUCTION_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.id} ({model.developer} - {model.contextWindow})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
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
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default ApiKeyPopup; 