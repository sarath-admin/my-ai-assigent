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
  const [error, setError] = useState<string | null>(null);
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
          setError('Microphone access is blocked. Please enable it in your browser settings and ensure you are using HTTPS.');
        } else if (event.error === 'no-speech') {
          setError('No speech was detected. Please try again.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [language]); // Only re-initialize when language changes

  const startListening = useCallback(async () => {
    setError(null);
    // Check for secure context (HTTPS) which is required for Speech Recognition
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setError('Voice support requires a secure connection (HTTPS).');
      return;
    }

    if (recognition) {
      try {
        // Explicitly request microphone permission first to ensure prompt appears
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (permError: any) {
            console.warn('getUserMedia failed, but will try recognition.start() anyway:', permError);
            if (permError.name === 'NotAllowedError' || permError.name === 'PermissionDeniedError') {
              setError('Microphone access denied. Please allow microphone access in your browser settings.');
              return;
            }
          }
        }
        recognition.start();
      } catch (error: any) {
        console.error('Failed to start recognition:', error);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError' || error.message?.includes('denied')) {
          setError('Microphone access is blocked. Please enable it in your browser settings.');
        } else {
          setError('Could not start voice recognition. Please check your microphone.');
        }
      }
    } else {
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if (!isChrome) {
        setError('Speech recognition is best supported in Google Chrome.');
      } else {
        setError('Speech recognition is not supported in this environment.');
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  return { isListening, error, startListening, stopListening, setError };
};
