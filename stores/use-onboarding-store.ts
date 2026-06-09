import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter, STORAGE_KEYS } from '@/lib/storage';

interface OnboardingState {
  completed: boolean;
  companionChosen: boolean;
  goalsSet: boolean;
  shieldEnabled: boolean;

  // Actions
  setCompanionChosen: () => void;
  setGoalsSet: () => void;
  setShieldEnabled: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      companionChosen: false,
      goalsSet: false,
      shieldEnabled: false,

      setCompanionChosen: () => set({ companionChosen: true }),
      setGoalsSet: () => set({ goalsSet: true }),
      setShieldEnabled: () => set({ shieldEnabled: true }),
      completeOnboarding: () => set({ completed: true }),
      resetOnboarding: () =>
        set({
          completed: false,
          companionChosen: false,
          goalsSet: false,
          shieldEnabled: false,
        }),
    }),
    {
      name: STORAGE_KEYS.ONBOARDING,
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);
