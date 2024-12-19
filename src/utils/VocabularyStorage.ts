import { VocabularyItem } from '../types/VocabularyItem';
import { updateGithubFile } from './github';

export class VocabularyStorage {
    
  private static readonly STORAGE_KEY = 'vocabularyList';

  /**
   * Check if GitHub sync is enabled
   */
  private static async isGithubSyncEnabled(): Promise<boolean> {
    const result = await chrome.storage.sync.get('enableGithubSync');
    return result.enableGithubSync || false;
  }

  /**
   * Backup to GitHub if enabled
   */
  private static async backupToGithub(vocabularyList: VocabularyItem[]): Promise<void> {
    try {
      const isEnabled = await this.isGithubSyncEnabled();
      if (isEnabled) {
        await updateGithubFile(vocabularyList);
        console.log('Vocabulary synced with GitHub successfully');
      }
    } catch (error) {
      console.error('Failed to backup to GitHub:', error);
    }
  }

  /**
   * Get all vocabulary items
   */
  static async getAll(): Promise<VocabularyItem[]> {
    try {
      const result = await chrome.storage.sync.get(this.STORAGE_KEY);
      return result[this.STORAGE_KEY] || [];
    } catch (error) {
      console.error('Error getting vocabulary:', error);
      return [];
    }
  }

  /**
   * Add a new vocabulary item
   */
  static async add(word: string, description: string, showAfterSeconds: number): Promise<boolean> {
    try {
      const vocabularyList = await this.getAll();
      
      // Check if word already exists
      if (vocabularyList.some(item => item.word === word)) {
        console.log(`Word "${word}" already exists in vocabulary`);
        return false;
      }

      const newItem: VocabularyItem = {
        word,
        description,
        showAfterSeconds,
        timestamp: Date.now(),
        previousInterval: 0
      };

      vocabularyList.push(newItem);
      console.log(`Adding new vocabulary item: ${word}`);
      await chrome.storage.sync.set({ [this.STORAGE_KEY]: vocabularyList });
      await this.backupToGithub(vocabularyList);
      console.log(`Successfully added vocabulary item: ${word}`);
      return true;
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      return false;
    }
  }

  /**
   * Update a vocabulary item
   */
  static async update(word: string, updates: Partial<VocabularyItem>): Promise<boolean> {
    try {
      const vocabularyList = await this.getAll();
      const index = vocabularyList.findIndex(item => item.word === word);
      
      if (index === -1) return false;

      vocabularyList[index] = {
        ...vocabularyList[index],
        ...updates
      };

      await chrome.storage.sync.set({ [this.STORAGE_KEY]: vocabularyList });
      await this.backupToGithub(vocabularyList);
      return true;
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      return false;
    }
  }

  /**
   * Get due vocabulary items
   */
  static async getDueItems(): Promise<VocabularyItem[]> {
    try {
      const vocabularyList = await this.getAll();
      const now = Date.now();
      
      return vocabularyList.filter(item => {
        const timePassed = (now - item.timestamp) / 1000;
        return timePassed >= item.showAfterSeconds;
      });
    } catch (error) {
      console.error('Error getting due items:', error);
      return [];
    }
  }

  /**
   * Update review interval after answer
   */
  static async updateReviewInterval(word: string, isCorrect: boolean): Promise<boolean> {
    try {
      const vocabularyList = await this.getAll();
      const item = vocabularyList.find(item => item.word === word);
      
      if (!item) return false;

      if (isCorrect) {
        const currentInterval = item.previousInterval || (24 * 60 * 60);
        const newInterval = currentInterval + (3 * 24 * 60 * 60); // Add 3 days

        return this.update(word, {
          showAfterSeconds: newInterval,
          previousInterval: currentInterval,
          timestamp: Date.now()
        });
      } else {
        return this.update(word, {
          showAfterSeconds: 60 * 60, // Reset to 1 hour
          previousInterval: 0,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error updating review interval:', error);
      return false;
    }
  }

  /**
   * Clear all vocabulary items
   */
  static async clear(): Promise<boolean> {
    try {
      const emptyList: VocabularyItem[] = [];
      await chrome.storage.sync.set({ [this.STORAGE_KEY]: emptyList });
      await this.backupToGithub(emptyList);
      return true;
    } catch (error) {
      console.error('Error clearing vocabulary:', error);
      return false;
    }
  }

  /**
   * Fetch vocabulary from GitHub
   */
  private static async fetchFromGithub(): Promise<VocabularyItem[] | null> {
    try {
      const { githubToken, githubRepo, githubPath } = await chrome.storage.sync.get([
        'githubToken',
        'githubRepo',
        'githubPath'
      ]);

      if (!githubToken || !githubRepo || !githubPath) {
        console.log('GitHub configuration not found');
        return null;
      }

      const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${githubPath}`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from GitHub');
      }

      const data = await response.json();
      const content = atob(data.content);
      return JSON.parse(content) as VocabularyItem[];
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      return null;
    }
  }

  /**
   * Sync vocabulary with GitHub
   */
  static async syncWithGithub(): Promise<boolean> {
    try {
      // Get GitHub data
      const githubData = await this.fetchFromGithub();
      if (!githubData) return false;

      // Get local data
      const localData = await this.getAll();

      // Merge data, preferring items with more recent timestamps
      const mergedData = this.mergeVocabularyLists(localData, githubData);

      // Save merged data
      await chrome.storage.sync.set({ [this.STORAGE_KEY]: mergedData });
      console.log('Vocabulary synced from GitHub successfully');
      return true;
    } catch (error) {
      console.error('Failed to sync from GitHub:', error);
      return false;
    }
  }

  /**
   * Merge two vocabulary lists, keeping the most recent version of each word
   */
  private static mergeVocabularyLists(list1: VocabularyItem[], list2: VocabularyItem[]): VocabularyItem[] {
    const wordMap = new Map<string, VocabularyItem>();

    // Process both lists
    [...list1, ...list2].forEach(item => {
      const existing = wordMap.get(item.word);
      if (!existing || existing.timestamp < item.timestamp) {
        wordMap.set(item.word, item);
      }
    });

    return Array.from(wordMap.values());
  }
} 