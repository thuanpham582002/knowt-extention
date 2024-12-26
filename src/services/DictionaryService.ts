import { DictionaryResponse } from '../types/DictionaryResponse';

export class DictionaryService {
  static async fetchDefinition(word: string): Promise<DictionaryResponse> {
    if (!word.trim()) {
      throw new Error('Word is required');
    }

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      );
      
      if (!response.ok) {
        throw new Error('Word not found');
      }
      
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Failed to fetch definition:', error);
      throw error;
    }
  }
} 