import { LEVELS, XP_REWARDS } from './constants';

export type XPSource = keyof typeof XP_REWARDS;

export interface LevelInfo {
  level: number;
  name: string;
  emoji: string;
  xpRequired: number;
}

/**
 * Get the current level based on total XP.
 */
export function getCurrentLevel(totalXP: number): LevelInfo {
  let currentLevel: LevelInfo = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXP >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return { ...currentLevel };
}

/**
 * Get the next level info, or null if at max level.
 */
export function getNextLevel(totalXP: number): LevelInfo | null {
  const current = getCurrentLevel(totalXP);
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  if (nextIdx >= LEVELS.length) return null;
  return { ...LEVELS[nextIdx] };
}

/**
 * Get progress (0-1) toward the next level.
 */
export function getProgressToNextLevel(totalXP: number): number {
  const current = getCurrentLevel(totalXP);
  const next = getNextLevel(totalXP);
  if (!next) return 1; // Max level

  const xpInCurrentLevel = totalXP - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  return Math.min(xpInCurrentLevel / xpNeeded, 1);
}

/**
 * Calculate XP for a given action.
 */
export function getXPForAction(source: XPSource): number {
  return XP_REWARDS[source];
}

/**
 * Check if a level-up occurred between old and new XP.
 */
export function checkLevelUp(
  oldXP: number,
  newXP: number
): { leveled: boolean; newLevel: LevelInfo | null } {
  const oldLevel = getCurrentLevel(oldXP);
  const newLevel = getCurrentLevel(newXP);

  if (newLevel.level > oldLevel.level) {
    return { leveled: true, newLevel };
  }
  return { leveled: false, newLevel: null };
}

/**
 * Get XP remaining until next level.
 */
export function getXPToNextLevel(totalXP: number): number {
  const next = getNextLevel(totalXP);
  if (!next) return 0;
  return next.xpRequired - totalXP;
}
