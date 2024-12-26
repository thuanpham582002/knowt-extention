import React, { useRef } from 'react';
import { useTextTracker } from './hooks/useTextTracker';
import {
  Container,
  TextareaContainer,
  StyledTextarea,
  ResultContainer
} from './styles';

interface TextTrackerProps {
  userAnswer: string;
  correctAnswer: string;
  onRetypeMatch?: (isMatch: boolean) => void;
}

const TextTracker: React.FC<TextTrackerProps> = ({ userAnswer, correctAnswer, onRetypeMatch }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    inputText,
    isMatch,
    containerHeight,
    handleKeyDown,
    handleInputChange
  } = useTextTracker({
    correctAnswer,
    onRetypeMatch,
    textareaRef
  });

  return (
    <Container>
      <TextareaContainer $height={containerHeight}>
        <StyledTextarea
          ref={textareaRef}
          rows={1}
          className="bold MuiBox-root mui-5u2f15"
          placeholder="(Press shift + enter for multi line answers)"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          $isMatch={isMatch}
          disabled={isMatch}
          autoFocus
        />
      </TextareaContainer>
      {inputText && (
        <ResultContainer $isMatch={isMatch}>
          {isMatch ? 'Text matches exactly!' : 'Text does not match'}
        </ResultContainer>
      )}
    </Container>
  );
};

export default TextTracker; 