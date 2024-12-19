import React, { useEffect, useState, useRef } from 'react';
import { VocabularyStorage } from '../utils/VocabularyStorage';

const TextTracker: React.FC = () => {
  const [originalText, setOriginalText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isMatch, setIsMatch] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(58);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parseShowAfterTime = (timeText: string): number | null => {
    const match = timeText.match(/Show in (\d+) (second|seconds|minute|minutes|day|days)/);
    if (!match) return null;

    const number = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    let showAfterSeconds = number;
    if (unit.startsWith('minute')) {
      showAfterSeconds = number * 60;
    } else if (unit.startsWith('day')) {
      showAfterSeconds = number * 24 * 60 * 60;
    }
    
    return showAfterSeconds;
  };

  const findButtonWithBlackBorder = (): HTMLElement | null => {
    const buttons = document.querySelectorAll('div[button]');
    return Array.from(buttons).find(button => {
      const buttonElement = button as HTMLElement;
      const style = buttonElement.style.border;
      const hasBlackBorder = style.includes('var(--color-neutral-black');
      return hasBlackBorder;
    }) as HTMLElement || null;
  };

  const saveVocabulary = async (word: string, description: string, showAfterSeconds: number) => {
    try {
      const success = await VocabularyStorage.add(word, description, showAfterSeconds);
      if (success) {
        console.log('Saved vocabulary:', { word, description });
      } else {
        console.log('Word already exists in vocabulary');
      }
    } catch (error) {
      console.error('Failed to save vocabulary:', error);
    }
  };

  const handleSkippedWord = (proseMirrorDivs: NodeListOf<Element>, isSkipped: boolean) => {
    const targetAnswerDiv = proseMirrorDivs[1];
    const targetAnswerText = targetAnswerDiv.textContent || '';
    const description = proseMirrorDivs[0].textContent || '';
    
    console.log('handleSkippedWord:', {
      isSkipped,
      targetAnswerText,
      description
    });
    
    if (isSkipped) {
      setOriginalText(targetAnswerText);
      setInputText('');
      textareaRef.current?.focus();
    }

    const button = findButtonWithBlackBorder();
    if (!button) {
      console.log('No button with black border found');
      return;
    }

    const spans = button.querySelectorAll('span');
    const showAfterText = spans[spans.length - 1]?.textContent || '';
    const showAfterSeconds = parseShowAfterTime(showAfterText);
    
    console.log('Show after info:', {
      showAfterText,
      showAfterSeconds
    });
    
    if (showAfterSeconds !== null) {
      saveVocabulary(targetAnswerText, description, showAfterSeconds);
    }
  };

  const handleUserAnswer = (proseMirrorDivs: NodeListOf<Element>) => {
    const targetDiv = proseMirrorDivs[1];
    const text = targetDiv.textContent || '';
    const targetAnswerDiv = proseMirrorDivs[2];
    const targetAnswerText = targetAnswerDiv.textContent || '';
    const description = proseMirrorDivs[0].textContent || '';
    
    setOriginalText(targetAnswerText);
    setInputText(text);
    textareaRef.current?.focus();
    textareaRef.current?.select();

    const button = findButtonWithBlackBorder();
    if (!button) return;

    const spans = button.querySelectorAll('span');
    const showAfterText = spans[spans.length - 1]?.textContent || '';
    const showAfterSeconds = parseShowAfterTime(showAfterText);
    
    if (showAfterSeconds !== null) {
      saveVocabulary(targetAnswerText, description, showAfterSeconds);
    }
  };

  useEffect(() => {
    const updateOriginalText = () => {
      const proseMirrorDivs = document.querySelectorAll('.ProseMirror');
      
      if (proseMirrorDivs.length === 2) {
        const boldBody2 = document.querySelector('.bold.body2');
        if (boldBody2 && boldBody2.textContent?.includes('You skipped this')) {
          handleSkippedWord(proseMirrorDivs, true);
        } else if (boldBody2 && boldBody2.textContent?.includes('You got it right!')) {
          handleSkippedWord(proseMirrorDivs, false);
        }
      } else if (proseMirrorDivs.length === 3) {
        handleUserAnswer(proseMirrorDivs);
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
      console.log('Observer attached to ProseMirror div');
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
    console.log('Input text changed:', newText);
    console.log('Text matches:', newText === originalText);
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