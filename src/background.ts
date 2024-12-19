import { VocabularyItem } from './types/VocabularyItem';
async function checkVocabulary() {
  const { vocabularyList = [] } = await chrome.storage.sync.get('vocabularyList');
  const now = Date.now();
  
  const dueVocabulary = vocabularyList.filter((item: VocabularyItem) => {
    const timePassed = (now - item.timestamp) / 1000;
    return timePassed >= item.showAfterSeconds;
  });

  if (dueVocabulary.length > 0) {
    console.log('Due vocabulary found:', dueVocabulary.length, 'items');
  }
}

// Check vocabulary when a new tab is opened
chrome.tabs.onCreated.addListener(() => {
  checkVocabulary();
});

// Also check periodically (every 30 minutes)
setInterval(checkVocabulary, 30 * 60 * 1000);

export {};