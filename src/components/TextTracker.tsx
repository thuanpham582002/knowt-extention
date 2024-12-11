import React, { useEffect, useState, useRef } from 'react';

const TextTracker: React.FC = () => {
  const [originalText, setOriginalText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isMatch, setIsMatch] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(58);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const updateOriginalText = () => {
      const proseMirrorDivs = document.querySelectorAll('.ProseMirror');
      if (proseMirrorDivs.length === 2) {
        const boldBody2 = document.querySelector('.bold.body2');
        if (boldBody2 && boldBody2.textContent?.includes('You skipped this')) {
          const targetAnswerDiv = proseMirrorDivs[1];
          const targetAnswerText = targetAnswerDiv.textContent || '';
          setOriginalText(targetAnswerText);
          setInputText('');
          textareaRef.current?.focus();
        }
      } else if (proseMirrorDivs.length >= 3) {
        const targetDiv = proseMirrorDivs[1];
        const text = targetDiv.textContent || '';
        const targetAnswerDiv = proseMirrorDivs[2];
        const targetAnswerText = targetAnswerDiv.textContent || '';
        setOriginalText(targetAnswerText);
        setInputText(text);
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }
    };

    const observer = new MutationObserver(updateOriginalText);
    updateOriginalText();

    const proseMirrorDivs = document.querySelectorAll('.ProseMirror');
    if (proseMirrorDivs.length >= 2) {
      observer.observe(proseMirrorDivs[proseMirrorDivs.length - 1], {
        childList: true,
        characterData: true,
        subtree: true
      });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
      setTextareaHeight(scrollHeight);
    }
  }, [inputText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    setIsMatch(newText === originalText);
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
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            minHeight: '58px',
            width: '100%',
            padding: '2.1rem 0 2.1rem 1.6rem',
            resize: 'none',
            lineHeight: '1.5',
            overflow: 'hidden',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderRadius: '1.7rem',
            fontFamily: 'var(--knowt-font-name)',
            fontSize: '1.7rem'
          }}
        />
      </div>
      {inputText && (
        <div
          style={{
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
          }}
        >
          {isMatch ? 'Text matches exactly!' : 'Text does not match'}
        </div>
      )}
    </div>
  );
};

export default TextTracker;