import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  font-size: 14px;
`;

const Title = styled.h3`
  margin-bottom: 15px;
  font-size: 17px;
  color: #333;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const ToggleSwitch = styled.div<{ $enabled: boolean }>`
  width: 48px;
  height: 24px;
  background-color: ${props => props.$enabled ? '#4CAF50' : '#ccc'};
  border-radius: 12px;
  padding: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    left: ${props => props.$enabled ? '24px' : '2px'};
    transition: all 0.3s ease;
  }
`;

const Description = styled.p`
  color: #666;
  margin-top: 10px;
  line-height: 1.5;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1976D2;
  }
`;

const ConfigSection = styled.div`
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 80px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
`;

const VocabularyConfig: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [breakInterval, setBreakInterval] = useState(5);

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(
      { 
        enableVocabularyReminder: true,
        breakIntervalMinutes: 5 
      }, 
      (result) => {
        setIsEnabled(result.enableVocabularyReminder);
        setBreakInterval(result.breakIntervalMinutes);
      }
    );
  }, []);

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    chrome.storage.sync.set({ enableVocabularyReminder: newValue }, () => {
      console.log('Vocabulary reminder setting saved:', newValue);
    });
  };

  const handleBreakIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(60, parseInt(e.target.value) || 5));
    setBreakInterval(value);
    chrome.storage.sync.set({ breakIntervalMinutes: value }, () => {
      console.log('Break interval saved:', value);
    });
  };

  const handleOpenManager = () => {
    chrome.tabs.create({ url: 'vocabulary.html' });
  };

  return (
    <Container>
      <Title>Vocabulary Reminder Settings</Title>
      
      <ConfigSection>
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
      </ConfigSection>

      <ConfigSection>
        <Label>Break Interval</Label>
        <InputContainer>
          <Input
            type="number"
            min="1"
            max="60"
            value={breakInterval}
            onChange={handleBreakIntervalChange}
          />
          <span>minutes</span>
        </InputContainer>
        <Description>
          Minimum time between vocabulary checks. This prevents too frequent reminders.
        </Description>
      </ConfigSection>

      <Button onClick={handleOpenManager}>
        Open Vocabulary Manager
      </Button>
    </Container>
  );
};

export default VocabularyConfig; 