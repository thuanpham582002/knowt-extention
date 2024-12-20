import React, { useEffect, useState, useRef, useCallback } from 'react';

interface TextTrackerProps {
  userAnswer: string;
  correctAnswer: string;
  onRetypeMatch?: (isMatch: boolean) => void;
}

const TextTracker: React.FC<TextTrackerProps> = ({ userAnswer, correctAnswer, onRetypeMatch }) => {
  const [inputText, setInputText] = useState(userAnswer);
  const [isMatch, setIsMatch] = useState(false);
  const [containerHeight, setContainerHeight] = useState('5.8rem');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '5.8rem';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.max(scrollHeight, 58) + 'px';
      textareaRef.current.style.height = newHeight;
      setContainerHeight(newHeight);
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
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    padding: '2.1rem 0 2.1rem 1.6rem',
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
        minHeight: '5.8rem'
      }}>
        <textarea
          ref={textareaRef}
          rows={1}
          className="bold MuiBox-root mui-5u2f15"
          placeholder="(Press shift + enter for multi line answers)"
          value={inputText}
          onChange={handleInputChange}
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