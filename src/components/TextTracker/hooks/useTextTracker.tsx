import { useState, useEffect, useCallback, RefObject } from 'react';

interface UseTextTrackerProps {
  correctAnswer: string;
  onRetypeMatch?: (isMatch: boolean) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

export const useTextTracker = ({ correctAnswer, onRetypeMatch, textareaRef }: UseTextTrackerProps) => {
  const [inputText, setInputText] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [containerHeight, setContainerHeight] = useState('auto');

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = textareaRef.current.scrollHeight;
      const heightWithPadding = newHeight;
      textareaRef.current.style.height = `${heightWithPadding}px`;
      setContainerHeight(`${heightWithPadding}px`);
    }
  }, [textareaRef]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText, adjustTextareaHeight]);

  useEffect(() => {
    if (textareaRef.current && !isMatch) {
      textareaRef.current.focus();
    }
  }, [isMatch, textareaRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMatch) {
      e.preventDefault();
      return;
    }
    
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        return;
      }
      // Let Shift+Enter create a new line - default behavior
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isMatch) return;
    
    const newText = e.target.value;
    setInputText(newText);
    const matches = newText === correctAnswer;
    setIsMatch(matches);
    if (matches && onRetypeMatch) {
      onRetypeMatch(matches);
    }
  }, [correctAnswer, onRetypeMatch, isMatch]);

  return {
    inputText,
    isMatch,
    containerHeight,
    handleKeyDown,
    handleInputChange
  };
}; 