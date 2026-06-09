import { Platform } from 'react-native';
import { SHIELD_DEFAULTS } from './constants';

/**
 * Shield Service — platform abstraction for DNS filtering and app blocking.
 *
 * Phase 1: Mock implementation (state stored in Zustand).
 * Phase 2+: Bridge to native APIs:
 *   - iOS: NEDNSSettingsManager + Screen Time API
 *   - Android: Private DNS + Digital Wellbeing
 *
 * This module provides the interface that native implementations will fulfill.
 */

export interface ShieldService {
  /** Enable DNS content filter */
  enableDNSFilter(): Promise<{ success: boolean; error?: string }>;
  /** Disable DNS content filter */
  disableDNSFilter(): Promise<{ success: boolean; error?: string }>;
  /** Check if DNS filter is currently active at the system level */
  isDNSFilterActive(): Promise<boolean>;
  /** Set a daily time limit for an app */
  setAppLimit(appId: string, dailyMinutes: number): Promise<void>;
  /** Get current usage for an app in minutes */
  getAppUsage(appId: string): Promise<number>;
  /** Check if an app is currently blocked */
  isAppBlocked(appId: string): Promise<boolean>;
}

/**
 * Mock implementation for Phase 1.
 * All state management happens via the Zustand shield store.
 * This service provides the API surface for future native bridging.
 */
class MockShieldService implements ShieldService {
  async enableDNSFilter(): Promise<{ success: boolean; error?: string }> {
    // In production, this would configure:
    // iOS: NEDNSSettingsManager with AdGuard Family DNS
    // Android: Private DNS settings
    console.log('[Shield] DNS filter enabled (mock)');
    console.log('[Shield] DNS servers:', SHIELD_DEFAULTS.dnsServers.adguardFamily);
    return { success: true };
  }

  async disableDNSFilter(): Promise<{ success: boolean; error?: string }> {
    console.log('[Shield] DNS filter disabled (mock)');
    return { success: true };
  }

  async isDNSFilterActive(): Promise<boolean> {
    // In production, this would query the system DNS settings
    // For now, we rely on the Zustand store state
    return false;
  }

  async setAppLimit(appId: string, dailyMinutes: number): Promise<void> {
    console.log(`[Shield] App limit set: ${appId} = ${dailyMinutes}min/day (mock)`);
  }

  async getAppUsage(appId: string): Promise<number> {
    // In production: Screen Time API (iOS) / Digital Wellbeing (Android)
    return 0;
  }

  async isAppBlocked(appId: string): Promise<boolean> {
    return false;
  }
}

// Singleton instance
let shieldService: ShieldService;

export function getShieldService(): ShieldService {
  if (!shieldService) {
    // Phase 1: Always use mock
    // Phase 2: Platform.select({ ios: new IOSShieldService(), android: new AndroidShieldService() })
    shieldService = new MockShieldService();
  }
  return shieldService;
}
