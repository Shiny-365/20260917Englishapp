import { useCallback, useEffect, useState } from 'react';
import type { ProgressState } from '../types/word';
import { loadProgress, recordAttempt, resetProgress, saveProgress } from '../storage/progress';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadProgress().then((state) => {
      setProgress(state);
      setIsLoaded(true);
    });
  }, []);

  const recordResult = useCallback((wordId: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const next = recordAttempt(prev, wordId, isCorrect);
      saveProgress(next);
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    await resetProgress();
    setProgress({});
  }, []);

  return { progress, isLoaded, recordResult, reset };
}
