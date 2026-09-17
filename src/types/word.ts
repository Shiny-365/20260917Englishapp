export type WordCategory =
  | 'animals'
  | 'food'
  | 'travel'
  | 'daily'
  | 'emotions'
  | 'work';

export type Word = {
  id: string;
  text: string;
  meaning: string;
  example: string;
  category: WordCategory;
};

export type WordProgress = {
  wordId: string;
  correctStreak: number;
  totalAttempts: number;
  totalCorrect: number;
  lastPracticedAt: number;
  mastered: boolean;
};

export type ProgressState = Record<string, WordProgress>;
