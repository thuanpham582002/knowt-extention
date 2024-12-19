import React, { useEffect, useState, useRef, useCallback } from 'react';

interface TextTrackerProps {
  userAnswer: string;
  correctAnswer: string;
}

const TextTracker: React.FC<TextTrackerProps> = ({ userAnswer, correctAnswer }) => {
  const [inputText, setInputText] = useState(userAnswer);
  const [isMatch, setIsMatch] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(58);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
      setTextareaHeight(scrollHeight);
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
    setIsMatch(newText === correctAnswer);
  }, [correctAnswer]);

  const textareaStyles = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    minHeight: '58px',
    width: '100%',
    padding: '2.1rem 0 2.1rem 1.6rem',
    resize: 'none' as const,
    lineHeight: '1.5',
    overflow: 'hidden',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '1.7rem',
    fontFamily: 'var(--knowt-font-name)',
    fontSize: '1.7rem'
  };

  const resultStyles = {
    padding: '12px',
    backgroundColor: isMatch ? 'lightgreen' : 'lightcoral',
    borderRadius: '1.7rem',
    borderStyle: 'solid',
    borderWidth: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--knowt-font-name)',
    fontSize: '1.7rem'
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <div style={{ 
        position: 'relative',
        height: `${textareaHeight}px`,
        marginBottom: '7px'
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