import {
  EVOLUTION_STAGES,
  COMPANION_GREETINGS,
  COMPANION_VULNERABILITY_HOURS,
  type CompanionType,
} from './constants';
import { getTimeGreeting } from './utils';

// ─── Companion States ───────────────────────────────────────────
export type CompanionState = 'idle' | 'happy' | 'celebrating' | 'weakened' | 'defeated';

export interface CompanionStatus {
  type: CompanionType;
  state: CompanionState;
  evolutionStage: number;
  evolutionLabel: string;
  greeting: string;
}

/**
 * Calculate evolution stage from streak days using √streak formula.
 * Stages at days: 0, 1, 4, 9, 16, 25, 36, 49
 */
export function getEvolutionStage(streakDays: number): {
  stage: number;
  label: string;
} {
  const sqrtStage = Math.floor(Math.sqrt(streakDays));
  let matched: { stage: number, minDays: number, label: string } = EVOLUTION_STAGES[0];

  for (const es of EVOLUTION_STAGES) {
    if (sqrtStage >= es.stage) {
      matched = es;
    }
  }

  return { stage: matched.stage, label: matched.label };
}

/**
 * Determine companion state based on current conditions.
 */
export function getCompanionState(params: {
  streakDays: number;
  streakBroken: boolean;
  dnsOffHours: number;
  justCompletedHabit: boolean;
  justLeveledUp: boolean;
}): CompanionState {
  const { streakDays, streakBroken, dnsOffHours, justCompletedHabit, justLeveledUp } = params;

  // Defeated: streak was broken
  if (streakBroken && streakDays === 0) {
    return 'defeated';
  }

  // Weakened: DNS off for 12+ hours
  if (dnsOffHours >= COMPANION_VULNERABILITY_HOURS) {
    return 'weakened';
  }

  // Celebrating: just leveled up or hit a milestone
  if (justLeveledUp) {
    return 'celebrating';
  }

  // Happy: just completed a habit
  if (justCompletedHabit) {
    return 'happy';
  }

  // Default: idle
  return 'idle';
}

/**
 * Get a contextual daily greeting from the companion.
 */
export function getDailyGreeting(params: {
  streakDays: number;
  habitsCompletedToday: number;
  totalHabitsToday: number;
}): string {
  const { streakDays, habitsCompletedToday, totalHabitsToday } = params;
  const timeOfDay = getTimeGreeting();

  // Evening greeting
  if (timeOfDay === 'evening' || timeOfDay === 'night') {
    const pool =
      habitsCompletedToday >= totalHabitsToday
        ? COMPANION_GREETINGS.evening.completed
        : COMPANION_GREETINGS.evening.incomplete;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Morning greeting based on streak tier
  let pool: readonly string[];
  if (streakDays >= 14) {
    pool = COMPANION_GREETINGS.morning.high_streak;
  } else if (streakDays >= 3) {
    pool = COMPANION_GREETINGS.morning.mid_streak;
  } else {
    pool = COMPANION_GREETINGS.morning.low_streak;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get full companion status combining all factors.
 */
export function getCompanionStatus(params: {
  type: CompanionType;
  streakDays: number;
  streakBroken: boolean;
  dnsOffHours: number;
  justCompletedHabit: boolean;
  justLeveledUp: boolean;
  habitsCompletedToday: number;
  totalHabitsToday: number;
}): CompanionStatus {
  const evolution = getEvolutionStage(params.streakDays);
  const state = getCompanionState(params);
  const greeting = getDailyGreeting({
    streakDays: params.streakDays,
    habitsCompletedToday: params.habitsCompletedToday,
    totalHabitsToday: params.totalHabitsToday,
  });

  return {
    type: params.type,
    state,
    evolutionStage: evolution.stage,
    evolutionLabel: evolution.label,
    greeting,
  };
}

/**
 * Emoji representation of companion at different evolution stages.
 * Used as placeholder before animation assets are ready.
 */
export function getCompanionEmoji(type: CompanionType, stage: number): string {
  const emojis: Record<CompanionType, string[]> = {
    dog: ['🐣', '🐶', '🐕', '🐕‍🦺', '🦮', '🐺', '🐺', '🐺'],
    cat: ['🐣', '🐱', '🐈', '🐈‍⬛', '🦁', '🦁', '🦁', '🦁'],
    hero: ['✨', '⚡', '💫', '🌟', '⭐', '🔥', '☀️', '🌟'],
  };

  return emojis[type][Math.min(stage, emojis[type].length - 1)];
}
