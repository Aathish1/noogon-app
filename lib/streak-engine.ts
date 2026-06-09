import { STREAK_CONFIG } from './constants';
import { toDateKey } from './utils';

export interface StreakRecord {
  startDate: string;
  endDate: string;
  length: number;
}

export type DayResult = 'maintained' | 'broken' | 'grace_used';

export interface DayEvaluation {
  result: DayResult;
  reason: string;
}

/**
 * Evaluate whether today's activity maintains or breaks the streak.
 *
 * Streak requires BOTH:
 * 1. DNS filter active all day
 * 2. At least STREAK_CONFIG.minHabitsForStreak habits completed
 */
export function evaluateDay(
  dnsActiveAllDay: boolean,
  habitsCompleted: number,
  graceAvailable: boolean
): DayEvaluation {
  const meetsHabits = habitsCompleted >= STREAK_CONFIG.minHabitsForStreak;
  const meetsDNS = dnsActiveAllDay;

  if (meetsDNS && meetsHabits) {
    return { result: 'maintained', reason: 'All conditions met. Streak continues!' };
  }

  if (graceAvailable) {
    const reasons: string[] = [];
    if (!meetsDNS) reasons.push('Shield was off');
    if (!meetsHabits) reasons.push(`only ${habitsCompleted}/${STREAK_CONFIG.minHabitsForStreak} habits`);
    return {
      result: 'grace_used',
      reason: `Grace day used (${reasons.join(', ')}). You get 1 per month.`,
    };
  }

  const reasons: string[] = [];
  if (!meetsDNS) reasons.push('Shield was not active all day');
  if (!meetsHabits)
    reasons.push(
      `${habitsCompleted}/${STREAK_CONFIG.minHabitsForStreak} habits completed`
    );

  return {
    result: 'broken',
    reason: `Streak broken: ${reasons.join('. ')}.`,
  };
}

/**
 * Calculate grace day availability for the current month.
 */
export function isGraceDayAvailable(
  graceDaysUsed: Array<{ date: string; month: number }>,
  currentDate: Date = new Date()
): boolean {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const usedThisMonth = graceDaysUsed.filter(
    (g) => {
      const d = new Date(g.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }
  );

  return usedThisMonth.length < STREAK_CONFIG.graceDaysPerMonth;
}

/**
 * Check if today is a streak milestone.
 */
export function getStreakMilestone(streakDays: number): number | null {
  return STREAK_CONFIG.milestones.includes(streakDays as any)
    ? streakDays
    : null;
}

/**
 * Get the next milestone from current streak.
 */
export function getNextMilestone(streakDays: number): number {
  for (const m of STREAK_CONFIG.milestones) {
    if (m > streakDays) return m;
  }
  return STREAK_CONFIG.milestones[STREAK_CONFIG.milestones.length - 1];
}

/**
 * Build streak history from a log of day results.
 */
export function buildStreakHistory(
  dayLog: Array<{ date: string; result: DayResult }>
): StreakRecord[] {
  const records: StreakRecord[] = [];
  let currentStart: string | null = null;
  let currentLength = 0;

  for (const entry of dayLog) {
    if (entry.result === 'maintained' || entry.result === 'grace_used') {
      if (!currentStart) currentStart = entry.date;
      currentLength++;
    } else {
      if (currentStart) {
        records.push({
          startDate: currentStart,
          endDate: entry.date,
          length: currentLength,
        });
      }
      currentStart = null;
      currentLength = 0;
    }
  }

  // Close any open streak
  if (currentStart) {
    records.push({
      startDate: currentStart,
      endDate: toDateKey(),
      length: currentLength,
    });
  }

  return records;
}
