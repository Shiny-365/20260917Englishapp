import { useCallback, useRef, useState } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export type SpeechRecognizerStatus = 'idle' | 'listening' | 'error';

export function useSpeechRecognizer() {
  const [status, setStatus] = useState<SpeechRecognizerStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onResultRef = useRef<((transcript: string) => void) | null>(null);

  useSpeechRecognitionEvent('start', () => {
    setStatus('listening');
    setErrorMessage(null);
  });

  useSpeechRecognitionEvent('end', () => {
    setStatus((prev) => (prev === 'error' ? prev : 'idle'));
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? '';
    setTranscript(text);
    if (event.isFinal) {
      onResultRef.current?.(text);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    setStatus('error');
    setErrorMessage(event.message || event.error);
  });

  const start = useCallback(async (onResult: (transcript: string) => void) => {
    setTranscript('');
    setErrorMessage(null);
    onResultRef.current = onResult;

    if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      setStatus('error');
      setErrorMessage('이 기기에서는 음성 인식을 사용할 수 없어요.');
      return;
    }

    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setStatus('error');
      setErrorMessage('마이크/음성 인식 권한이 필요해요.');
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: false,
    });
  }, []);

  const stop = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
  }, []);

  return { status, transcript, errorMessage, start, stop };
}
