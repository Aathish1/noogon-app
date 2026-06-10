import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS, asyncStorageAdapter } from '@/lib/storage';

interface UserState {
  name: string;
  avatar: string;
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
}

/**
 * Persistent store for user profile info (name + avatar).
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: 'Forger',
      avatar: '👤',
      setName: (name) => set({ name }),
      setAvatar: (avatar) => set({ avatar }),
    }),
    {
      name: STORAGE_KEYS.USER,
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);
