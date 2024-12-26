import React from 'react';
import { useDictionary } from './hooks/useDictionary';
import {
  Container,
  Header,
  Title,
  Phonetic,
  AudioButton,
  MeaningContainer,
  PartOfSpeech,
  DefinitionList,
  DefinitionItem,
  Example
} from './styles';

interface DictionaryProps {
  word: string;
}

const Dictionary: React.FC<DictionaryProps> = ({ word }) => {
  const { definition, loading, error, handlePlayAudio } = useDictionary(word);

  if (loading) {
    return <div>Loading definition...</div>;
  }

  if (error) {
    return <div>No definition found</div>;
  }

  if (!definition) {
    return null;
  }

  return (
    <Container>
      <Header>
        <Title>{definition.word}</Title>
        {definition.phonetics?.length > 0 && definition.phonetics[0].text && (
          <Phonetic>{definition.phonetics[0].text}</Phonetic>
        )}
        <AudioButton onClick={handlePlayAudio}>
          <svg 
            width="2.4rem" 
            height="2.4rem" 
            viewBox="0 0 24 24" 
            fill="#000000"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </AudioButton>
      </Header>
      {definition.meanings.map((meaning, index) => (
        <MeaningContainer key={index}>
          <PartOfSpeech>
            {meaning.partOfSpeech}
          </PartOfSpeech>
          <DefinitionList>
            {meaning.definitions.slice(0, 2).map((def, idx) => (
              <DefinitionItem key={idx}>
                {def.definition}
                {def.example && (
                  <Example>
                    Example: {def.example}
                  </Example>
                )}
              </DefinitionItem>
            ))}
          </DefinitionList>
        </MeaningContainer>
      ))}
    </Container>
  );
};

export default Dictionary; 