import styled from 'styled-components';

export const Container = styled.div`
  padding: 1.5rem;
  background-color: #fff3f3;
  border-radius: 1.7rem;
  margin-top: 1rem;
  font-family: var(--knowt-font-name);
  font-size: 1.4rem;
  border-style: solid;
  border-width: 0.125rem;
  border-color: #ffcdd2;
  color: #000000;
`;

export const LoadingText = styled.div`
  color: #666666;
`;

export const MarkdownContent = styled.div`
  .markdown-content {
    line-height: 1.6;
    
    p {
      margin: 0.8rem 0;
    }
    
    ul, ol {
      margin: 0.8rem 0;
      padding-left: 2rem;
    }
    
    li {
      margin: 0.4rem 0;
    }
    
    code {
      background-color: #f8f8f8;
      padding: 0.2rem 0.4rem;
      border-radius: 0.3rem;
      font-family: monospace;
    }
  }
`; 