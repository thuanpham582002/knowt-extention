import React, { useState, useEffect, useCallback } from 'react';
import { DictionaryResponse } from '../types/DictionaryResponse';

export async function fetchDefinition(word: string): Promise<DictionaryResponse> {
  if (!word.trim()) {
    throw new Error('Word is required');
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Failed to fetch definition:', error);
    throw error;
  }
}

interface DictionaryProps {
  word: string;
}

const Dictionary: React.FC<DictionaryProps> = ({ word }) => {
  const [definition, setDefinition] = useState<DictionaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const playAudio = useCallback(() => {
    if (!definition?.phonetics?.length) return;

    const audioUrl = definition.phonetics.find(p => p.audio)?.audio;
    if (!audioUrl) return;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio(audioUrl);
    setAudio(newAudio);
    setIsPlaying(true);
    
    newAudio.play().catch(console.error);
    newAudio.onended = () => setIsPlaying(false);
  }, [definition, audio]);

  // Add message listener for keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event: MessageEvent) => {
      if (event.data.type === 'PLAY_AUDIO') {
        playAudio();
      }
    };

    window.addEventListener('message', handleKeyPress);
    return () => window.removeEventListener('message', handleKeyPress);
  }, [playAudio]);

  useEffect(() => {
    // Reset audio when word changes
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
    }
    setIsPlaying(false);

    const getDictionary = async () => {
      if (!word.trim()) return;
      
      setLoading(true);
      setError(null);
      setDefinition(null);
      
      try {
        const data = await fetchDefinition(word);
        setDefinition(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch definition');
      } finally {
        setLoading(false);
      }
    };

    getDictionary();
  }, [word, audio]);

  if (loading) {
    return <div>Loading definition...</div>;
  }

  if (error) {
    return <div>No definition found</div>;
  }

  if (!definition) {
    return null;
  }

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginTop: '10px',
      fontFamily: 'var(--knowt-font-name)',
      fontSize: '1.4rem',
      color: '#000000'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '10px' 
      }}>
        <h3 style={{ margin: 0 }}>{definition.word}</h3>
        {definition.phonetics?.length > 0 && definition.phonetics[0].text && (
          <span style={{ 
            color: '#666666',
            fontSize: '1.2rem'
          }}>
            {definition.phonetics[0].text}
          </span>
        )}
        {definition.phonetics?.some(p => p.audio) && (
          <button
            onClick={playAudio}
            disabled={isPlaying}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              opacity: isPlaying ? 0.5 : 1
            }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="#000000"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
        )}
      </div>
      {definition.meanings.map((meaning, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <div style={{ 
            color: '#444444',
            fontStyle: 'italic',
            marginBottom: '5px',
            fontWeight: '500'
          }}>
            {meaning.partOfSpeech}
          </div>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            {meaning.definitions.slice(0, 2).map((def, idx) => (
              <li key={idx} style={{ marginBottom: '5px' }}>
                {def.definition}
                {def.example && (
                  <div style={{ 
                    color: '#444444',
                    marginTop: '3px',
                    fontSize: '1.2rem',
                    fontWeight: '500'
                  }}>
                    Example: {def.example}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Dictionary;