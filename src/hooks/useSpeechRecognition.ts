import { useState, useCallback, useEffect, useRef } from 'react';

interface UseSpeechRecognitionProps {
  onResult: (text: string) => void;
  language?: string;
}

const languageMap: Record<string, string> = {
  'English': 'en-IN',
  'Tamil': 'ta-IN',
  'Malayalam': 'ml-IN',
  'Hindi': 'hi-IN',
  'Kannada': 'kn-IN',
  'Telugu': 'te-IN',
};

export const useSpeechRecognition = ({ onResult, language = 'English' }: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const onResultRef = useRef(onResult);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = languageMap[language] || 'en-IN';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResultRef.current(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access is blocked. Please enable it in your browser settings.');
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [language]); // Only re-initialize when language changes

  const startListening = useCallback(async () => {
    if (recognition) {
      try {
        // Explicitly request microphone permission first to ensure prompt appears
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
      } catch (error: any) {
        console.error('Failed to start recognition:', error);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          alert('Microphone access is blocked. Please enable it in your browser settings.');
        } else {
          // If getUserMedia fails but it's not a permission error, try starting recognition anyway
          try {
            recognition.start();
          } catch (e) {
            console.error('Final attempt to start recognition failed:', e);
          }
        }
      }
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  return { isListening, startListening, stopListening };
};
