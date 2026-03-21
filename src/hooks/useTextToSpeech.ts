import { useCallback } from 'react';

const languageMap: Record<string, string> = {
  'English': 'en-IN',
  'Tamil': 'ta-IN',
  'Malayalam': 'ml-IN',
  'Hindi': 'hi-IN',
  'Kannada': 'kn-IN',
  'Telugu': 'te-IN',
};

export const useTextToSpeech = () => {
  const speak = useCallback((text: string, language: string = 'English') => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis is not supported in this browser.');
      alert('Your browser does not support voice output. Please try using Google Chrome on a secure (HTTPS) connection.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = languageMap[language] || 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1;

    // Function to set voice and speak
    const performSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a voice that matches the language exactly, then by prefix
      let voice = voices.find(v => v.lang === targetLang);
      if (!voice) {
        voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
      }
      
      if (voice) {
        utterance.voice = voice;
      }
      
      window.speechSynthesis.speak(utterance);
    };

    // If voices aren't loaded yet, wait for them
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        performSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      performSpeak();
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
};
