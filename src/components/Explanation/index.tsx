import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useExplanation } from './hooks/useExplanation';
import { Container, LoadingText, MarkdownContent } from './styles';

interface ExplanationProps {
  userAnswer: string;
  correctAnswer: string;
  definition: string;
}

const Explanation: React.FC<ExplanationProps> = ({ userAnswer, correctAnswer, definition }) => {
  const { explanation, loading } = useExplanation({
    userAnswer,
    correctAnswer,
    definition
  });

  if (!explanation) return null;

  return (
    <Container>
      {loading ? (
        <LoadingText>Đang phân tích câu trả lời...</LoadingText>
      ) : (
        <MarkdownContent>
          <ReactMarkdown>{explanation}</ReactMarkdown>
        </MarkdownContent>
      )}
    </Container>
  );
};

export default Explanation; 