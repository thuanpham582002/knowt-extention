import styled from 'styled-components';

interface TextareaProps {
  $isMatch: boolean;
}

export const Container = styled.div`
  margin: 1rem 0;
`;

export const TextareaContainer = styled.div<{ $height: string }>`
  position: relative;
  height: ${props => props.$height};
  display: flex;
  align-items: center;
`;

export const StyledTextarea = styled.textarea<TextareaProps>`
  position: absolute;
  width: 100%;
  padding: 1.5rem 1.6rem;
  resize: none;
  line-height: 1.5;
  overflow: hidden;
  border-style: solid;
  border-width: 0.125rem;
  border-radius: 1.7rem;
  font-family: var(--knowt-font-name);
  font-size: 1.7rem;
  box-sizing: border-box;
  background-color: ${props => props.$isMatch ? '#f5f5f5' : 'white'};
  cursor: ${props => props.$isMatch ? 'not-allowed' : 'text'};
`;

export const ResultContainer = styled.div<{ $isMatch: boolean }>`
  padding: 1.2rem;
  background-color: ${props => props.$isMatch ? 'lightgreen' : 'lightcoral'};
  border-radius: 1.7rem;
  border-style: solid;
  border-width: 0.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--knowt-font-name);
  font-size: 1.7rem;
  margin-top: 1rem;
`; 