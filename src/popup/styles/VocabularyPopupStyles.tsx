import styled from 'styled-components';

interface PopupContainerProps {
  $show: boolean;
}

export const PopupOverlay = styled.div<PopupContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999998;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${props => props.$show ? 'auto' : 'none'};
`;

export const PopupContainer = styled.div<PopupContainerProps>`
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%)!important;
  transform-origin: center;
  width: 63.75rem !important;
  max-width: 95vw !important;
  height: 80vh !important;
  background: white;
  border-radius: 1.275rem;
  box-shadow: 0 0.425rem 2.125rem rgba(0, 0, 0, 0.15);
  z-index: 999999;
  opacity: ${props => props.$show ? 1 : 0};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
`;

export const PopupContent = styled.div`
  padding: 2.55rem;
  flex: 1;
  background: #282929;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 0.85rem;
  }
  
  &::-webkit-scrollbar-track {
    background: #1e1e1e;
    border-radius: 0.425rem;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 0.425rem;
    
    &:hover {
      background: #5a5a5a;
    }
  }
`;

export const Description = styled.p`
  font-size: 1.7rem;
  margin-bottom: 2.55rem;
  line-height: 1.5;
  color: #E7E7E7;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 1.7rem;
  border: 0.2125rem solid #e0e0e0;
  border-radius: 0.85rem;
  font-size: 1.7rem;
  transition: all 0.2s ease;
  background: #333;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 0.32rem rgba(33, 150, 243, 0.1);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1.0625rem;
  margin-top: 2.89rem;
  justify-content: flex-end;
`;

export const Button = styled.button<{ variant?: 'primary' | 'danger' | 'default'; disabled?: boolean }>`
  padding: 0.85rem 1.7rem;
  border: none;
  border-radius: 0.53rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => {
    if (props.disabled) return '#cccccc';
    switch (props.variant) {
      case 'danger': return '#f44336';
      case 'primary': return '#4CAF50';
      default: return '#2196F3';
    }
  }};
  opacity: ${props => props.disabled ? 0.7 : 1};
  color: white;
  font-size: 1.7rem;
  transition: all 0.2s ease;
`; 