import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface ExplanationProps {
  userAnswer: string;
  correctAnswer: string;
  definition: string;
}

const Explanation: React.FC<ExplanationProps> = ({ userAnswer, correctAnswer, definition }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [lastRequest, setLastRequest] = useState<string>('');

  useEffect(() => {
    chrome.storage.sync.get(['groqApiKey', 'groqModel'], (result) => {
      if (result.groqApiKey) {
        setApiKey(result.groqApiKey);
      }
      if (result.groqModel) {
        setModel(result.groqModel);
      }
    });
  }, []);

  const getExplanation = useCallback(async () => {
    if (!userAnswer || !correctAnswer) return;
    
    const requestSignature = `${userAnswer}-${correctAnswer}`;
    if (requestSignature === lastRequest) return;
    setLastRequest(requestSignature);
    
    setLoading(true);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{
            role: "user",
            content: `As an English teacher, compare these two answers and explain why the user's answer is incorrect:
              Correct answer: "${correctAnswer}"
              Definition of correct answer: "${definition}"
              User's answer: "${userAnswer}"
              Provide a clear and concise explanation of the mistake. Keep it concise and brief.
              Please explain in Vietnamese language for Vietnamese learners.

              Then provide an example English sentence using the correct answer, along with its translation in Vietnamese.
              You can provide some English vocabulary phrases that use the correct answer to help the Vietnamese learners understand it.
              Please respond in Vietnamese language.`
          }]
        })
      });

      const data = await response.json();
      console.log('Explanation content:', data.choices[0].message.content);
      setExplanation(data.choices[0].message.content);
    } catch (error) {
      console.error('Failed to get explanation:', error);
      setExplanation('Không thể lấy được giải thích lúc này.');
    } finally {
      setLoading(false);
    }
  }, [userAnswer, correctAnswer, apiKey, model, lastRequest]);

  useEffect(() => {
    if (userAnswer !== correctAnswer) {
      const timeoutId = setTimeout(() => {
        getExplanation();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setExplanation('');
    }
  }, [userAnswer, correctAnswer, getExplanation]);

  if (!explanation) return null;

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#fff3f3',
      borderRadius: '1.7rem',
      marginTop: '10px',
      fontFamily: 'var(--knowt-font-name)',
      fontSize: '1.4rem',
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: '#ffcdd2',
      color: '#000000'
    }}>
      {loading ? (
        <div>Đang phân tích câu trả lời...</div>
      ) : (
        <div className="markdown-content">
          <ReactMarkdown>{explanation}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Explanation;