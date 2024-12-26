import { useState, useEffect, useCallback } from 'react';
import { DictionaryResponse } from '../../../types/DictionaryResponse';
import { DictionaryService } from '../../../services/DictionaryService';
import { AudioService } from '../../../services/AudioService';

export const useDictionary = (word: string) => {
  const [definition, setDefinition] = useState<DictionaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlayAudio = useCallback(async () => {
    await AudioService.playAudio(word);
  }, [word]);

  useEffect(() => {
    const handleKeyPress = (event: MessageEvent) => {
      if (event.data.type === 'PLAY_AUDIO' && 
          word.trim() && 
          definition?.word && 
          !loading && 
          !error) {
        handlePlayAudio();
      }
    };

    window.addEventListener('message', handleKeyPress);
    return () => window.removeEventListener('message', handleKeyPress);
  }, [handlePlayAudio, word, definition, loading, error]);

  useEffect(() => {
    const getDictionary = async () => {
      if (!word.trim()) return;
      
      setLoading(true);
      setError(null);
      setDefinition(null);
      
      try {
        const data = await DictionaryService.fetchDefinition(word);
        setDefinition(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch definition');
      } finally {
        setLoading(false);
      }
    };

    getDictionary();
  }, [word]);

  return {
    definition,
    loading,
    error,
    handlePlayAudio
  };
}; 