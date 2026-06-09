import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter, STORAGE_KEYS } from '@/lib/storage';
import { type CompanionType } from '@/lib/constants';
import { type CompanionState } from '@/lib/companion-engine';

interface CompanionStoreState {
  type: CompanionType;
  currentState: CompanionState;
  evolutionStage: number;
  lastGreeting: string;
  lastGreetingDate: string | null;

  // Actions
  setType: (type: CompanionType) => void;
  setState: (state: CompanionState) => void;
  setEvolutionStage: (stage: number) => void;
  setGreeting: (greeting: string, date: string) => void;
}

export const useCompanionStore = create<CompanionStoreState>()(
  persist(
    (set) => ({
      type: 'dog',
      currentState: 'idle',
      evolutionStage: 0,
      lastGreeting: "Let's build something today. One step at a time.",
      lastGreetingDate: null,

      setType: (type) => set({ type }),
      setState: (state) => set({ currentState: state }),
      setEvolutionStage: (stage) => set({ evolutionStage: stage }),
      setGreeting: (greeting, date) =>
        set({ lastGreeting: greeting, lastGreetingDate: date }),
    }),
    {
      name: STORAGE_KEYS.COMPANION,
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);
