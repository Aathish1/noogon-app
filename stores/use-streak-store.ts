import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter, STORAGE_KEYS } from '@/lib/storage';
import { toDateKey } from '@/lib/utils';
import { getXPForAction, getCurrentLevel, checkLevelUp, type XPSource } from '@/lib/xp-engine';
import { type DayResult } from '@/lib/streak-engine';

interface GraceDay {
  date: string;
  month: number;
  year: number;
}

interface StreakState {
  // Streak
  currentStreak: number;
  longestStreak: number;
  streakStartDate: string | null;
  lastEvaluatedDate: string | null;

  // XP
  totalXP: number;

  // Grace days
  graceDaysUsed: GraceDay[];

  // Day log
  dayLog: Array<{ date: string; result: DayResult }>;

  // Actions
  incrementStreak: () => void;
  breakStreak: () => void;
  useGraceDay: () => void;
  addXP: (source: XPSource) => { leveled: boolean; newLevel: string | null };
  addCustomXP: (amount: number) => void;
  logDay: (result: DayResult) => void;
  setLastEvaluatedDate: (date: string) => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      streakStartDate: null,
      lastEvaluatedDate: null,
      totalXP: 0,
      graceDaysUsed: [],
      dayLog: [],

      incrementStreak: () =>
        set((state) => {
          const newStreak = state.currentStreak + 1;
          return {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            streakStartDate: state.streakStartDate ?? toDateKey(),
          };
        }),

      breakStreak: () =>
        set(() => ({
          currentStreak: 0,
          streakStartDate: null,
        })),

      useGraceDay: () =>
        set((state) => {
          const now = new Date();
          return {
            graceDaysUsed: [
              ...state.graceDaysUsed,
              {
                date: toDateKey(now),
                month: now.getMonth(),
                year: now.getFullYear(),
              },
            ],
          };
        }),

      addXP: (source: XPSource) => {
        const state = get();
        const amount = getXPForAction(source);
        const oldXP = state.totalXP;
        const newXP = oldXP + amount;
        const levelCheck = checkLevelUp(oldXP, newXP);

        set({ totalXP: newXP });

        return {
          leveled: levelCheck.leveled,
          newLevel: levelCheck.newLevel?.name ?? null,
        };
      },

      addCustomXP: (amount: number) =>
        set((state) => ({ totalXP: state.totalXP + amount })),

      logDay: (result: DayResult) =>
        set((state) => ({
          dayLog: [
            ...state.dayLog,
            { date: toDateKey(), result },
          ],
        })),

      setLastEvaluatedDate: (date: string) =>
        set({ lastEvaluatedDate: date }),
    }),
    {
      name: STORAGE_KEYS.STREAK,
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);
