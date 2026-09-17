import React, { createContext, useContext } from 'react';
import { useProgress } from '../hooks/useProgress';

type ProgressContextValue = ReturnType<typeof useProgress>;

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const value = useProgress();
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return ctx;
}
