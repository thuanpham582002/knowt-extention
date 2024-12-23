import * as googleTTS from 'google-tts-api';

// Listen for audio playback requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PLAY_TTS') {
    try {
      const url = googleTTS.getAudioUrl(request.word, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
      });

      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioData = reader.result as string;
            const formattedAudioData = audioData.replace('data:application/octet-stream', 'data:audio/mp3');
            sendResponse({ success: true, audioData: formattedAudioData });
          };
          reader.onerror = () => {
            sendResponse({ success: false, error: 'Failed to read audio data' });
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.error('Failed to fetch audio:', error);
          sendResponse({ success: false, error: error.message });
        });

      return true; // Will respond asynchronously
    } catch (error) {
      console.error('TTS error:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
  return true;
});

export {};