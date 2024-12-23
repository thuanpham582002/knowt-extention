import React from 'react';
import { createRoot } from 'react-dom/client';
import VocabularyPopup from './popup/VocabularyPopup';
import type { VocabularyItem } from './types/VocabularyItem';

async function checkVocabulary() {
  const now = Date.now();
  
  // Get lastCheckTime and breakInterval from storage
  const { lastCheckTime = 0, breakIntervalMinutes = 5, enableVocabularyReminder = true } = 
    await chrome.storage.sync.get(['lastCheckTime', 'breakIntervalMinutes', 'enableVocabularyReminder']);
  
  if (!enableVocabularyReminder) {
    console.log('Vocabulary reminders are disabled');
    return;
  }

  const BREAK_INTERVAL = breakIntervalMinutes * 60 * 1000;

  // Check if enough time has passed since last check
  if (now - lastCheckTime < BREAK_INTERVAL) {
    console.log('Skipping check - within break interval');
    return;
  }

  const { vocabularyList = [] } = await chrome.storage.sync.get('vocabularyList');
  
  const dueVocabulary = vocabularyList.filter((item: VocabularyItem) => {
    const timePassed = (now - item.timestamp) / 1000;
    return timePassed >= item.showAfterSeconds;
  });

  if (dueVocabulary.length > 0) {
    console.log('Due vocabulary found:', dueVocabulary.length, 'items');
    // Update lastCheckTime in storage only when we find due vocabulary
    await chrome.storage.sync.set({ lastCheckTime: now });
    return dueVocabulary;
  }

  return null;
}

function showVocabularyPopup(dueVocabulary: VocabularyItem[]) {
  const container = document.createElement('div');
  container.id = 'vocabulary-popup-root';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <VocabularyPopup />
    </React.StrictMode>
  );

  // Savi due vocabulary to storage for popup to access
  chrome.storage.local.set({ dueVocabulary });
}

async function periodicCheck() {
  // Skip if we're on knowt.com
  if (window.location.href.includes('knowt.com')) {
    console.log('Skipping popup on knowt.com');
    return;
  }

  // Skip if popup already exists
  if (document.getElementById('vocabulary-popup-root')) {
    return;
  }

  const dueVocabulary = await checkVocabulary();
  if (dueVocabulary && dueVocabulary.length > 0) {
    showVocabularyPopup(dueVocabulary);
  }
}

// Initial check
periodicCheck();

// Check every 30 minutes
const THIRTY_MINUTES = 30 * 60 * 1000;
setInterval(periodicCheck, THIRTY_MINUTES);

// Also check when the page becomes visible
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    periodicCheck();
  }
}); 