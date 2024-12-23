import React, { useEffect, useState, useRef, useCallback } from 'react';

interface TextTrackerProps {
  userAnswer: string;
  correctAnswer: string;
  onRetypeMatch?: (isMatch: boolean) => void;
}


const TextTracker: React.FC<TextTrackerProps> = ({ userAnswer, correctAnswer, onRetypeMatch }) => {
  const [inputText, setInputText] = useState(userAnswer);
  const [isMatch, setIsMatch] = useState(false);
  const [containerHeight, setContainerHeight] = useState('auto');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = textareaRef.current.scrollHeight;
      const heightWithPadding = newHeight ; // Convert 3rem to pixels
      textareaRef.current.style.height = `${heightWithPadding}px`;
      setContainerHeight(`${heightWithPadding}px`);
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText, adjustTextareaHeight]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault(); // Prevent default Enter behavior
        return;
      }
      // Let Shift+Enter create a new line - default behavior
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    const matches = newText === correctAnswer;
    setIsMatch(matches);
    if (matches && onRetypeMatch) {
      onRetypeMatch(matches);
    }
  }, [correctAnswer, onRetypeMatch]);

  const textareaStyles = {
    position: 'absolute' as const,
    width: '100%',
    padding: `1.5rem 1.6rem`,
    resize: 'none' as const,
    lineHeight: 1.5,
    overflow: 'hidden',
    borderStyle: 'solid',
    borderWidth: '0.125rem',
    borderRadius: '1.7rem',
    fontFamily: 'var(--knowt-font-name)',
    fontSize: '1.7rem',
    boxSizing: 'border-box' as const
  };

  const resultStyles = {
    padding: '1.2rem',
    backgroundColor: isMatch ? 'lightgreen' : 'lightcoral',
    borderRadius: '1.7rem',
    borderStyle: 'solid',
    borderWidth: '0.125rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--knowt-font-name)',
    fontSize: '1.7rem',
    marginTop: '1rem'
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <div style={{ 
        position: 'relative',
        height: containerHeight,
        display: 'flex',
        alignItems: 'center'
      }}>
        <textarea
          ref={textareaRef}
          rows={1}
          className="bold MuiBox-root mui-5u2f15"
          placeholder="(Press shift + enter for multi line answers)"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={textareaStyles}
          autoFocus
        />
      </div>
      {inputText && (
        <div style={resultStyles}>
          {isMatch ? 'Text matches exactly!' : 'Text does not match'}
        </div>
      )}
    </div>
  );
};

export default TextTracker;