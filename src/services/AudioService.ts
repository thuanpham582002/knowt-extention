import { TTSResponse } from '../types/TTSResponse';

export class AudioService {
  private static isPlaying = false;
  private static currentAudio: HTMLAudioElement | null = null;

  private static stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.remove();
      this.currentAudio = null;
    }
  }

  public static async playAudio(word: string): Promise<void> {
    if (!word.trim()) return;

    // Stop current audio if playing
    this.stopCurrentAudio();
    this.isPlaying = true;

    try {
      const response = await new Promise<TTSResponse>((resolve, reject) => {
        chrome.runtime.sendMessage({
          type: 'PLAY_TTS',
          word: word
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(response || { success: false, error: 'No response received' });
        });
      });

      if (!response.success || !response.audioData) {
        throw new Error(response.error || 'Failed to get audio data');
      }

      this.currentAudio = new Audio(response.audioData);
      this.currentAudio.onerror = (e) => {
        console.error('Audio error:', e);
        throw new Error('Failed to load audio');
      };

      await this.currentAudio.play();
      
      // Wait for audio to finish playing
      await new Promise((resolve, reject) => {
        if (!this.currentAudio) return reject(new Error('No audio element'));
        this.currentAudio.onended = resolve;
        this.currentAudio.onerror = reject;
      });

    } catch (error) {
      console.error('Failed to play audio:', error);
    } finally {
      this.stopCurrentAudio();
      this.isPlaying = false;
    }
  }
} 