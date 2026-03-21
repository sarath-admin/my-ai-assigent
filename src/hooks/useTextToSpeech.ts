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
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[language] || 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;

    // Find a suitable voice for the language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
};
