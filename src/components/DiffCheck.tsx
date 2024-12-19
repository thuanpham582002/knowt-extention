import React from 'react';
import styled from 'styled-components';
import { diffChars, Change } from 'diff';

interface DiffCheckProps {
  userAnswer: string;
  correctAnswer: string;
}

const DiffCheck: React.FC<DiffCheckProps> = ({ userAnswer, correctAnswer }) => {
  const differences = diffChars(
    userAnswer.trim().toLowerCase(), 
    correctAnswer.trim().toLowerCase()
  );

  return (
    <CharacterDiff>
      <div className="diff-section">
        <span className="label">Your answer:</span>
        {differences.map((part: Change, i: number) => {
          if (part.added) return null;
          return (
            <span 
              key={i} 
              className={`char ${part.removed ? 'incorrect' : 'correct'}`}
            >
              {part.value}
            </span>
          );
        })}
      </div>
      
      <div className="diff-section">
        <span className="label">Correct answer:</span>
        {differences.map((part: Change, i: number) => {
          if (part.removed) return null;
          return (
            <span 
              key={i}
              className={`char ${part.added ? 'missing' : 'correct'}`}
            >
              {part.value}
            </span>
          );
        })}
      </div>
    </CharacterDiff>
  );
};

const CharacterDiff = styled.div`
  font-size: 18px;
  font-family: monospace;
  background: #f8f9fa;
  border-radius: 12px;
  line-height: 1.6;

  .diff-section {
    &:last-child {
      margin-bottom: 0;
    }
  }

  .label {
    font-size: 14px;
    color: #666;
    display: block;
  }

  .char {
    display: inline-block;
    
    &.correct {
      color: #2e7d32;
    }
    
    &.incorrect {
      color: #d32f2f;
      text-decoration: line-through;
    }
    
    &.missing {
      color: #ed6c02;
      text-decoration: underline;
    }
  }
`;

export default DiffCheck;