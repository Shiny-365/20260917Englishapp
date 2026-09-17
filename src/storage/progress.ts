import AsyncStorage from '@react-native-async-storage/async-storage';
import { WORDS } from '../data/words';
import type { ProgressState, WordProgress } from '../types/word';

const STORAGE_KEY = 'english-ear:progress:v1';
const MASTERY_STREAK = 3;

function emptyProgress(wordId: string): WordProgress {
  return {
    wordId,
    correctStreak: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    lastPracticedAt: 0,
    mastered: false,
  };
}

export async function loadProgress(): Promise<ProgressState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ProgressState;
  } catch {
    return {};
  }
}

export async function saveProgress(state: ProgressState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getWordProgress(state: ProgressState, wordId: string): WordProgress {
  return state[wordId] ?? emptyProgress(wordId);
}

export function recordAttempt(
  state: ProgressState,
  wordId: string,
  isCorrect: boolean
): ProgressState {
  const current = getWordProgress(state, wordId);
  const correctStreak = isCorrect ? current.correctStreak + 1 : 0;
  const updated: WordProgress = {
    ...current,
    correctStreak,
    totalAttempts: current.totalAttempts + 1,
    totalCorrect: current.totalCorrect + (isCorrect ? 1 : 0),
    lastPracticedAt: Date.now(),
    mastered: correctStreak >= MASTERY_STREAK,
  };
  return { ...state, [wordId]: updated };
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function summarize(state: ProgressState) {
  const total = WORDS.length;
  let mastered = 0;
  let inProgress = 0;
  for (const word of WORDS) {
    const p = state[word.id];
    if (p?.mastered) mastered += 1;
    else if (p && p.totalAttempts > 0) inProgress += 1;
  }
  const notStarted = total - mastered - inProgress;
  return { total, mastered, inProgress, notStarted };
}
