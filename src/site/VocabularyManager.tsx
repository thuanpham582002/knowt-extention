import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VocabularyItem } from '../types/VocabularyItem';
import { VocabularyStorage } from '../utils/VocabularyStorage';

// Styled Components
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #282929;
  color: #E7E7E7;
  z-index: 999999;
  overflow-y: auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #333;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: #444;
  color: #fff;
  width: 300px;
  font-size: 14px;

  &:focus {
    outline: none;
    background: #555;
  }

  &::placeholder {
    color: #999;
  }
`;

const VocabularyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const VocabularyCard = styled.div`
  background: #333;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Word = styled.h3`
  margin: 0 0 10px 0;
  color: #2196F3;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Description = styled.p`
  color: #ccc;
  margin: 0 0 15px 0;
  line-height: 1.5;
`;

const ReviewInfo = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #444;
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.$variant === 'danger' ? '#f44336' : '#2196F3'};
  color: white;
  font-size: 14px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  padding: 25px;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 999;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormField = styled.div`
  label {
    display: block;
    margin-bottom: 8px;
    color: #ccc;
  }

  input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 4px;
    background: #222;
    color: #fff;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #2196F3;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const VocabularyManager: React.FC = () => {
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);

  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = async () => {
    const vocabulary = await VocabularyStorage.getAll();
    setItems(vocabulary.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleEdit = (item: VocabularyItem) => {
    setEditingItem(item);
  };

  const handleDelete = async (word: string) => {
    if (window.confirm('Are you sure you want to delete this vocabulary item?')) {
      await VocabularyStorage.delete(word);
      await loadVocabulary();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    await VocabularyStorage.update(editingItem.word, editingItem);
    setEditingItem(null);
    await loadVocabulary();
  };

  const formatNextReview = (item: VocabularyItem) => {
    const nextReview = new Date(item.timestamp + item.showAfterSeconds * 1000);
    const now = new Date();
    const diffTime = nextReview.getTime() - now.getTime();

    if (diffTime <= 0) return 'Ready for review';

    const seconds = Math.floor(diffTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (seconds < 60) {
      return `Next review in ${seconds} second${seconds === 1 ? '' : 's'}`;
    } else if (minutes < 60) {
      return `Next review in ${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else if (hours < 24) {
      return `Next review in ${hours} hour${hours === 1 ? '' : 's'}`;
    } else if (days < 30) {
      return `Next review in ${days} day${days === 1 ? '' : 's'}`;
    } else {
      return `Next review in ${months} month${months === 1 ? '' : 's'}`;
    }
  };

  const filteredItems = items.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h2>Vocabulary Manager</h2>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Search vocabulary..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => window.close()}>Close</Button>
        </SearchBar>
      </Header>

      <VocabularyGrid>
        {filteredItems.map(item => (
          <VocabularyCard key={item.word}>
            <Word>
              {item.word}
              <ButtonGroup>
                <Button onClick={() => handleEdit(item)}>Edit</Button>
                <Button $variant="danger" onClick={() => handleDelete(item.word)}>Delete</Button>
              </ButtonGroup>
            </Word>
            <Description>{item.description}</Description>
            <ReviewInfo>{formatNextReview(item)}</ReviewInfo>
          </VocabularyCard>
        ))}
      </VocabularyGrid>

      {editingItem && (
        <Overlay onClick={() => setEditingItem(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <h3>Edit Vocabulary</h3>
            <Form onSubmit={handleSave}>
              <FormField>
                <label>Word</label>
                <input
                  value={editingItem.word}
                  onChange={e => setEditingItem({...editingItem, word: e.target.value})}
                  required
                />
              </FormField>
              <FormField>
                <label>Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                  required
                />
              </FormField>
              <ButtonGroup>
                <Button type="submit">Save</Button>
                <Button type="button" onClick={() => setEditingItem(null)}>Cancel</Button>
              </ButtonGroup>
            </Form>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
};

export default VocabularyManager;
