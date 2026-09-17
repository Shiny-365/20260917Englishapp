import { useCallback } from 'react';
import * as Speech from 'expo-speech';

export function useSpeak() {
  const speak = useCallback((text: string, rate: number = 0.9) => {
    Speech.stop();
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate,
    });
  }, []);

  return { speak };
}
