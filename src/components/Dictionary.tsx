import React, { useState, useEffect } from 'react';

interface DictionaryResponse {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

interface DictionaryProps {
  word: string;
}

const Dictionary: React.FC<DictionaryProps> = ({ word }) => {
  const [definition, setDefinition] = useState<DictionaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefinition = async () => {
      if (!word.trim()) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        );
        
        if (!response.ok) {
          throw new Error('Word not found');
        }
        
        const data = await response.json();
        setDefinition(data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch definition');
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

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
      <h3 style={{ margin: '0 0 10px 0' }}>{definition.word}</h3>
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