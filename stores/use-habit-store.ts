import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter, STORAGE_KEYS } from '@/lib/storage';
import { toDateKey } from '@/lib/utils';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  timeMinutes: number;
  slot: 'morning' | 'evening';
  reminder: string | null; // HH:MM format or null
  createdAt: string;
  archived: boolean;
}

interface HabitState {
  habits: Habit[];
  /** date key → array of completed habit IDs */
  completions: Record<string, string[]>;

  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => string;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  archiveHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (habitId: string, date?: string) => void;
  uncompleteHabit: (habitId: string, date?: string) => void;
  importHabits: (habits: Array<Omit<Habit, 'id' | 'createdAt' | 'archived' | 'reminder'> & { reminder?: string | null }>) => void;

  // Getters
  getActiveHabits: () => Habit[];
  getMorningHabits: () => Habit[];
  getEveningHabits: () => Habit[];
  getCompletedToday: () => string[];
  getCompletionCount: (date?: string) => number;
  isHabitCompleted: (habitId: string, date?: string) => boolean;
  getCompletionRate: (days: number) => number;
}

function generateId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: {},

      addHabit: (habit) => {
        const id = generateId();
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id,
              createdAt: toDateKey(),
              archived: false,
            },
          ],
        }));
        return id;
      },

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),

      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archived: true } : h
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      completeHabit: (habitId, date) => {
        const dateKey = date ?? toDateKey();
        set((state) => {
          const existing = state.completions[dateKey] ?? [];
          if (existing.includes(habitId)) return state;
          return {
            completions: {
              ...state.completions,
              [dateKey]: [...existing, habitId],
            },
          };
        });
      },

      uncompleteHabit: (habitId, date) => {
        const dateKey = date ?? toDateKey();
        set((state) => {
          const existing = state.completions[dateKey] ?? [];
          return {
            completions: {
              ...state.completions,
              [dateKey]: existing.filter((id) => id !== habitId),
            },
          };
        });
      },

      importHabits: (habits) =>
        set((state) => ({
          habits: [
            ...state.habits,
            ...habits.map((h) => ({
              ...h,
              reminder: h.reminder ?? null,
              id: generateId(),
              createdAt: toDateKey(),
              archived: false,
            })),
          ],
        })),

      getActiveHabits: () => get().habits.filter((h) => !h.archived),
      getMorningHabits: () =>
        get().habits.filter((h) => !h.archived && h.slot === 'morning'),
      getEveningHabits: () =>
        get().habits.filter((h) => !h.archived && h.slot === 'evening'),
      getCompletedToday: () => get().completions[toDateKey()] ?? [],
      getCompletionCount: (date) => {
        const dateKey = date ?? toDateKey();
        return (get().completions[dateKey] ?? []).length;
      },
      isHabitCompleted: (habitId, date) => {
        const dateKey = date ?? toDateKey();
        return (get().completions[dateKey] ?? []).includes(habitId);
      },
      getCompletionRate: (days) => {
        const state = get();
        const activeCount = state.habits.filter((h) => !h.archived).length;
        if (activeCount === 0) return 0;

        let totalCompleted = 0;
        let totalPossible = 0;

        for (let i = 0; i < days; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = toDateKey(d);
          totalCompleted += (state.completions[key] ?? []).length;
          totalPossible += activeCount;
        }

        return totalPossible > 0 ? totalCompleted / totalPossible : 0;
      },
    }),
    {
      name: STORAGE_KEYS.HABITS,
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);
