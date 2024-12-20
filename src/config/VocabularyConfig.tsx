import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  font-size: 1.4rem;
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  font-size: 1.7rem;
  color: #333;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const ToggleSwitch = styled.div<{ $enabled: boolean }>`
  width: 4.8rem;
  height: 2.4rem;
  background-color: ${props => props.$enabled ? '#4CAF50' : '#ccc'};
  border-radius: 1.2rem;
  padding: 0.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    width: 2rem;
    height: 2rem;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    left: ${props => props.$enabled ? '2.4rem' : '0.2rem'};
    transition: all 0.3s ease;
  }
`;

const Description = styled.p`
  color: #666;
  margin-top: 1rem;
  line-height: 1.5;
`;

const VocabularyConfig: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Load saved setting
    chrome.storage.sync.get({ enableVocabularyReminder: true }, (result) => {
      setIsEnabled(result.enableVocabularyReminder);
    });
  }, []);

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    chrome.storage.sync.set({ enableVocabularyReminder: newValue }, () => {
      console.log('Vocabulary reminder setting saved:', newValue);
    });
  };

  return (
    <Container>
      <Title>Vocabulary Reminder Settings</Title>
      
      <ToggleContainer>
        <ToggleLabel>
          <ToggleSwitch $enabled={isEnabled} onClick={handleToggle} />
          <span>Enable Vocabulary Reminders</span>
        </ToggleLabel>
      </ToggleContainer>

      <Description>
        When enabled, you'll receive reminders to review vocabulary items at scheduled intervals.
        This helps reinforce your learning through spaced repetition.
      </Description>
    </Container>
  );
};

export default VocabularyConfig; 