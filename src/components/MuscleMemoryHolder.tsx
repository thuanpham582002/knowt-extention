import TextTracker from './TextTracker';
import Dictionary from './Dictionary';
import Explanation from './Explanation';
import DiffCheck from './DiffCheck';
import React, { useEffect } from 'react';

interface MuscleMemoryHolderProps {
  userAnswer: string;
  correctAnswer: string;
  isRenderDiffCheck: boolean;
  description: string;
  isRenderTextTracker: boolean;
  isRenderDictionary: boolean;
  isRenderExplanation: boolean;
  onRenderSuccess?: () => void;
}

const MuscleMemoryHolder: React.FC<MuscleMemoryHolderProps> = ({
  userAnswer,
  correctAnswer,
  isRenderDiffCheck,
  description,
  isRenderTextTracker,
  isRenderDictionary,
  isRenderExplanation,
  onRenderSuccess
}) => {
  const muscleMemoryHolder = document.querySelector('.muscle-memory-holder');
  console.log('muscleMemoryHolder', muscleMemoryHolder);
  if (muscleMemoryHolder) {
    return null;
  }

  useEffect(() => {
    if (onRenderSuccess) {
      onRenderSuccess();
    }
  }, [onRenderSuccess]);

  return (
    <div className="muscle-memory-holder">
      {isRenderDiffCheck && <DiffCheck userAnswer={userAnswer} correctAnswer={correctAnswer} />}
      {isRenderTextTracker && <TextTracker  userAnswer={userAnswer} correctAnswer={correctAnswer} />}
      {isRenderDictionary && <Dictionary word={correctAnswer} />}
      {isRenderExplanation && <Explanation userAnswer={userAnswer} correctAnswer={correctAnswer} definition={description} />}
    </div>
  );
}

export default MuscleMemoryHolder;