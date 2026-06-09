import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

/**
 * Storage keys used throughout the app.
 */
export const STORAGE_KEYS = {
  STREAK: 'forge:streak',
  HABITS: 'forge:habits',
  SHIELD: 'forge:shield',
  COMPANION: 'forge:companion',
  ONBOARDING: 'forge:onboarding',
  SETTINGS: 'forge:settings',
  FOCUS: 'forge:focus',
} as const;

/**
 * AsyncStorage-based storage adapter for Zustand persist middleware.
 */
export const asyncStorageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

/**
 * Simple get/set helpers for non-Zustand storage needs.
 */
export async function getStoredJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function setStoredJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeStored(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
