import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter, STORAGE_KEYS } from '@/lib/storage';

export interface AppLimit {
  appId: string;
  name: string;
  emoji: string;
  dailyMinutes: number;
  usedMinutes: number;
  locked: boolean;
}

export interface FocusWindow {
  id: string;
  days: number[]; // 0=Sun, 1=Mon, ...
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  enabled: boolean;
}

interface ShieldState {
  // DNS
  dnsEnabled: boolean;
  dnsEnabledSince: string | null; // ISO timestamp
  dnsDisabledAt: string | null;   // ISO timestamp of last disable

  // App limits
  appLimits: AppLimit[];

  // Focus windows
  focusWindows: FocusWindow[];

  // Doom scroll
  doomScrollEnabled: boolean;
  doomScrollThreshold: number; // seconds
  doomScrollCooldown: number;  // seconds

  // Actions
  toggleDNS: (enabled: boolean) => void;
  setAppLimit: (appId: string, dailyMinutes: number) => void;
  updateAppUsage: (appId: string, usedMinutes: number) => void;
  resetDailyUsage: () => void;
  addFocusWindow: (window: Omit<FocusWindow, 'id'>) => void;
  removeFocusWindow: (id: string) => void;
  toggleFocusWindow: (id: string) => void;
  setDoomScrollConfig: (threshold: number, cooldown: number) => void;
  toggleDoomScroll: (enabled: boolean) => void;
  getDNSOffHours: () => number;
}

export const useShieldStore = create<ShieldState>()(
  persist(
    (set, get) => ({
      dnsEnabled: false,
      dnsEnabledSince: null,
      dnsDisabledAt: null,
      appLimits: [],
      focusWindows: [],
      doomScrollEnabled: true,
      doomScrollThreshold: 90,
      doomScrollCooldown: 20,

      toggleDNS: (enabled) =>
        set(() => ({
          dnsEnabled: enabled,
          dnsEnabledSince: enabled ? new Date().toISOString() : null,
          dnsDisabledAt: enabled ? null : new Date().toISOString(),
        })),

      setAppLimit: (appId, dailyMinutes) =>
        set((state) => {
          const existing = state.appLimits.find((a) => a.appId === appId);
          if (existing) {
            return {
              appLimits: state.appLimits.map((a) =>
                a.appId === appId ? { ...a, dailyMinutes } : a
              ),
            };
          }
          return {
            appLimits: [
              ...state.appLimits,
              {
                appId,
                name: appId,
                emoji: '📱',
                dailyMinutes,
                usedMinutes: 0,
                locked: false,
              },
            ],
          };
        }),

      updateAppUsage: (appId, usedMinutes) =>
        set((state) => ({
          appLimits: state.appLimits.map((a) =>
            a.appId === appId
              ? { ...a, usedMinutes, locked: usedMinutes >= a.dailyMinutes }
              : a
          ),
        })),

      resetDailyUsage: () =>
        set((state) => ({
          appLimits: state.appLimits.map((a) => ({
            ...a,
            usedMinutes: 0,
            locked: false,
          })),
        })),

      addFocusWindow: (window) =>
        set((state) => ({
          focusWindows: [
            ...state.focusWindows,
            {
              ...window,
              id: `fw_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            },
          ],
        })),

      removeFocusWindow: (id) =>
        set((state) => ({
          focusWindows: state.focusWindows.filter((w) => w.id !== id),
        })),

      toggleFocusWindow: (id) =>
        set((state) => ({
          focusWindows: state.focusWindows.map((w) =>
            w.id === id ? { ...w, enabled: !w.enabled } : w
          ),
        })),

      setDoomScrollConfig: (threshold, cooldown) =>
        set({ doomScrollThreshold: threshold, doomScrollCooldown: cooldown }),

      toggleDoomScroll: (enabled) => set({ doomScrollEnabled: enabled }),

      getDNSOffHours: () => {
        const state = get();
        if (state.dnsEnabled || !state.dnsDisabledAt) return 0;
        const disabledAt = new Date(state.dnsDisabledAt);
        const now = new Date();
        return (now.getTime() - disabledAt.getTime()) / (1000 * 60 * 60);
      },
    }),
    {
      name: STORAGE_KEYS.SHIELD,
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);
