import styled from 'styled-components';

export const Container = styled.div`
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 0.75rem;
  margin-top: 1rem;
  font-family: var(--knowt-font-name);
  font-size: 1.4rem;
  color: #000000;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const Title = styled.h3`
  margin: 0;
`;

export const Phonetic = styled.span`
  color: #666666;
  font-size: 1.2rem;
`;

export const AudioButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  opacity: 1;
`;

export const MeaningContainer = styled.div`
  margin-bottom: 1rem;
`;

export const PartOfSpeech = styled.div`
  color: #444444;
  font-style: italic;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const DefinitionList = styled.ul`
  margin: 0;
  padding-left: 2rem;
`;

export const DefinitionItem = styled.li`
  margin-bottom: 0.5rem;
`;

export const Example = styled.div`
  color: #444444;
  margin-top: 0.3rem;
  font-size: 1.2rem;
  font-weight: 500;
`; 