import { useState, useEffect, useCallback } from 'react';
import { ExplanationService } from '../../../services/ExplanationService';

interface UseExplanationProps {
  userAnswer: string;
  correctAnswer: string;
  definition: string;
}

export const useExplanation = ({ userAnswer, correctAnswer, definition }: UseExplanationProps) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [lastRequest, setLastRequest] = useState<string>('');

  useEffect(() => {
    chrome.storage.sync.get(['groqApiKey', 'groqModel'], (result) => {
      if (result.groqApiKey) {
        setApiKey(result.groqApiKey);
      }
      if (result.groqModel) {
        setModel(result.groqModel);
      }
    });
  }, []);

  const fetchExplanation = useCallback(async () => {
    if (!correctAnswer) return;
    
    const requestSignature = `${userAnswer || ''}-${correctAnswer}`;
    if (requestSignature === lastRequest) return;
    setLastRequest(requestSignature);
    
    setLoading(true);
    try {
      const content = await ExplanationService.getExplanation({
        userAnswer,
        correctAnswer,
        definition,
        apiKey,
        model
      });
      setExplanation(content);
    } catch (error) {
      console.error('Failed to get explanation:', error);
      setExplanation('Không thể lấy được giải thích lúc này.');
    } finally {
      setLoading(false);
    }
  }, [userAnswer, correctAnswer, definition, apiKey, model, lastRequest]);

  useEffect(() => {
    if (userAnswer !== correctAnswer) {
      const timeoutId = setTimeout(() => {
        fetchExplanation();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setExplanation('');
    }
  }, [userAnswer, correctAnswer, fetchExplanation]);

  return {
    explanation,
    loading
  };
}; 