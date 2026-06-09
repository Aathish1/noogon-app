// ─── Level System ───────────────────────────────────────────────
export const LEVELS = [
  { level: 1, name: 'Seedling', emoji: '🌱', xpRequired: 0 },
  { level: 2, name: 'Sprout', emoji: '🌿', xpRequired: 100 },
  { level: 3, name: 'Sapling', emoji: '🌳', xpRequired: 300 },
  { level: 4, name: 'Tree', emoji: '🌲', xpRequired: 600 },
  { level: 5, name: 'Oak', emoji: '🪵', xpRequired: 1000 },
  { level: 6, name: 'Sequoia', emoji: '🏔️', xpRequired: 1500 },
  { level: 7, name: 'Titan', emoji: '⚡', xpRequired: 2200 },
  { level: 8, name: 'Phoenix', emoji: '🔥', xpRequired: 3000 },
  { level: 9, name: 'Sage', emoji: '🧠', xpRequired: 4000 },
  { level: 10, name: 'Legend', emoji: '👑', xpRequired: 5500 },
] as const;

export type LevelName = (typeof LEVELS)[number]['name'];

// ─── XP Rewards ─────────────────────────────────────────────────
export const XP_REWARDS = {
  habit_complete: 10,
  all_morning_habits: 25,
  all_evening_habits: 25,
  clean_day: 50,         // DNS active all day
  focus_session: 20,     // Per completed pomodoro
  journal_entry: 15,
  streak_milestone_7: 100,
  streak_milestone_30: 300,
  streak_milestone_100: 1000,
} as const;

// ─── Streak ─────────────────────────────────────────────────────
export const STREAK_CONFIG = {
  /** Minimum habits to complete for streak to count */
  minHabitsForStreak: 3,
  /** Grace days allowed per calendar month */
  graceDaysPerMonth: 1,
  /** Milestone days that trigger special rewards */
  milestones: [7, 14, 30, 60, 90, 180, 365],
} as const;

// ─── Companion ──────────────────────────────────────────────────
export type CompanionType = 'dog' | 'cat' | 'hero';

export const COMPANION_TYPES: Array<{
  type: CompanionType;
  name: string;
  emoji: string;
  description: string;
}> = [
  {
    type: 'dog',
    name: 'Luna',
    emoji: '🐕',
    description: 'Loyal and always by your side. Grows from a puppy to a mighty wolf.',
  },
  {
    type: 'cat',
    name: 'Mochi',
    emoji: '🐱',
    description: 'Independent but deeply bonded. Evolves from a kitten to a wise lion.',
  },
  {
    type: 'hero',
    name: 'Spark',
    emoji: '⚡',
    description: 'Your inner hero, made visible. Grows from a spark to a supernova.',
  },
];

/** DNS off for this many hours triggers vulnerability mode */
export const COMPANION_VULNERABILITY_HOURS = 12;

// ─── Companion Evolution Stages ─────────────────────────────────
// Using √streak_days formula: stages at days 1, 4, 9, 16, 25, 36, 49
export const EVOLUTION_STAGES = [
  { stage: 0, minDays: 0, label: 'Newborn' },
  { stage: 1, minDays: 1, label: 'Baby' },
  { stage: 2, minDays: 4, label: 'Young' },
  { stage: 3, minDays: 9, label: 'Growing' },
  { stage: 4, minDays: 16, label: 'Strong' },
  { stage: 5, minDays: 25, label: 'Mature' },
  { stage: 6, minDays: 36, label: 'Wise' },
  { stage: 7, minDays: 49, label: 'Legendary' },
] as const;

// ─── Companion Greetings ────────────────────────────────────────
export const COMPANION_GREETINGS = {
  morning: {
    low_streak: [
      "Let's build something today. One step at a time.",
      "Every great journey starts with showing up. You're here.",
      "Today is a blank page. Let's write something good.",
    ],
    mid_streak: [
      "You're on a roll! Let's keep this momentum going.",
      "I can feel you getting stronger. Let's make today count.",
      "Your streak is growing and so am I!",
    ],
    high_streak: [
      "You're becoming unstoppable. I'm so proud of you.",
      "Look how far we've come together. Let's keep forging.",
      "The person you were a month ago wouldn't believe this.",
    ],
  },
  evening: {
    completed: [
      "Amazing day. Rest well — you've earned it.",
      "All rituals done. Tomorrow we go again. 💪",
      "You showed up fully today. That's everything.",
    ],
    incomplete: [
      "Still time to finish a few habits before bed.",
      "Even one more habit completed makes a difference.",
      "Don't let the day end without finishing strong.",
    ],
  },
} as const;

// ─── Habit Templates ────────────────────────────────────────────
export interface HabitTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  habits: Array<{
    name: string;
    emoji: string;
    timeMinutes: number;
    slot: 'morning' | 'evening';
  }>;
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: 'student',
    name: 'Student Focus',
    emoji: '📚',
    description: 'Optimized for academic performance and mental clarity.',
    habits: [
      { name: 'Make bed', emoji: '🛏️', timeMinutes: 2, slot: 'morning' },
      { name: 'Drink water', emoji: '💧', timeMinutes: 1, slot: 'morning' },
      { name: 'Review today\'s tasks', emoji: '📋', timeMinutes: 5, slot: 'morning' },
      { name: 'Read 20 pages', emoji: '📖', timeMinutes: 20, slot: 'morning' },
      { name: 'Exercise 15 min', emoji: '🏃', timeMinutes: 15, slot: 'morning' },
      { name: 'Review what I learned', emoji: '🧠', timeMinutes: 10, slot: 'evening' },
      { name: 'Journal', emoji: '✏️', timeMinutes: 5, slot: 'evening' },
      { name: 'No phone 30 min before bed', emoji: '📵', timeMinutes: 30, slot: 'evening' },
    ],
  },
  {
    id: 'athlete',
    name: 'Athlete',
    emoji: '💪',
    description: 'Built around physical training, recovery, and nutrition.',
    habits: [
      { name: 'Hydrate (500ml)', emoji: '💧', timeMinutes: 1, slot: 'morning' },
      { name: 'Stretch / mobility', emoji: '🧘', timeMinutes: 10, slot: 'morning' },
      { name: 'Training session', emoji: '🏋️', timeMinutes: 60, slot: 'morning' },
      { name: 'Protein shake', emoji: '🥤', timeMinutes: 2, slot: 'morning' },
      { name: 'Cold shower', emoji: '🥶', timeMinutes: 3, slot: 'morning' },
      { name: 'Foam roll', emoji: '🧴', timeMinutes: 10, slot: 'evening' },
      { name: 'Meal prep', emoji: '🍽️', timeMinutes: 15, slot: 'evening' },
      { name: 'Sleep by 10pm', emoji: '😴', timeMinutes: 1, slot: 'evening' },
    ],
  },
  {
    id: 'deep-worker',
    name: 'Deep Worker',
    emoji: '🎯',
    description: 'For those who need uninterrupted focus and creative output.',
    habits: [
      { name: 'No phone first hour', emoji: '📵', timeMinutes: 60, slot: 'morning' },
      { name: 'Morning pages (writing)', emoji: '✍️', timeMinutes: 15, slot: 'morning' },
      { name: 'Set 3 priorities', emoji: '🎯', timeMinutes: 5, slot: 'morning' },
      { name: 'Deep work block', emoji: '🔨', timeMinutes: 90, slot: 'morning' },
      { name: 'Walk break', emoji: '🚶', timeMinutes: 15, slot: 'morning' },
      { name: 'Review accomplishments', emoji: '✅', timeMinutes: 5, slot: 'evening' },
      { name: 'Read 30 min', emoji: '📚', timeMinutes: 30, slot: 'evening' },
      { name: 'Gratitude list', emoji: '🙏', timeMinutes: 3, slot: 'evening' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    emoji: '🎨',
    description: 'Nurture your creative energy with inspired routines.',
    habits: [
      { name: 'Meditate', emoji: '🧘', timeMinutes: 10, slot: 'morning' },
      { name: 'Sketch / doodle', emoji: '✏️', timeMinutes: 15, slot: 'morning' },
      { name: 'Creative work', emoji: '🎨', timeMinutes: 60, slot: 'morning' },
      { name: 'Consume inspiration', emoji: '💡', timeMinutes: 15, slot: 'morning' },
      { name: 'Nature walk', emoji: '🌿', timeMinutes: 20, slot: 'evening' },
      { name: 'Journal reflections', emoji: '📓', timeMinutes: 10, slot: 'evening' },
      { name: 'Learn something new', emoji: '🌟', timeMinutes: 15, slot: 'evening' },
      { name: 'Digital sunset', emoji: '🌅', timeMinutes: 1, slot: 'evening' },
    ],
  },
];

// ─── Shield Defaults ────────────────────────────────────────────
export const SHIELD_DEFAULTS = {
  /** DNS server for content filtering */
  dnsServers: {
    adguardFamily: {
      ipv4: ['94.140.14.15', '94.140.15.16'],
      ipv6: ['2a10:50c0::bad1:ff', '2a10:50c0::bad2:ff'],
      doh: 'https://dns-family.adguard.com/dns-query',
    },
  },
  /** Default app limits in minutes */
  defaultAppLimits: [
    { appId: 'com.instagram.android', name: 'Instagram', emoji: '📸', dailyMinutes: 30 },
    { appId: 'com.zhiliaoapp.musically', name: 'TikTok', emoji: '🎵', dailyMinutes: 15 },
    { appId: 'com.google.android.youtube', name: 'YouTube', emoji: '▶️', dailyMinutes: 45 },
    { appId: 'com.twitter.android', name: 'X (Twitter)', emoji: '🐦', dailyMinutes: 20 },
    { appId: 'com.reddit.frontpage', name: 'Reddit', emoji: '🤖', dailyMinutes: 20 },
  ],
  /** Doom scroll interruptor threshold in seconds */
  doomScrollThreshold: 90,
  /** Break card wait time in seconds */
  doomScrollCooldown: 20,
} as const;

// ─── Recovery Milestones ────────────────────────────────────────
export const RECOVERY_MILESTONES = [
  { day: 3, title: 'First Shift', description: 'Your brain starts noticing the change.', emoji: '🌅' },
  { day: 7, title: 'Sleep Improved', description: 'Melatonin regulation begins to normalize.', emoji: '😴' },
  { day: 14, title: 'Attention Span Growing', description: 'You can focus longer without reaching for your phone.', emoji: '🎯' },
  { day: 21, title: 'Habit Forming', description: 'New neural pathways are being built.', emoji: '🧠' },
  { day: 30, title: 'Dopamine Receptors Rebuilding', description: 'Your reward system is recalibrating to natural stimuli.', emoji: '⚡' },
  { day: 60, title: 'Energy Surge', description: 'Consistent energy throughout the day. Less crashes.', emoji: '🔋' },
  { day: 90, title: 'Identity Shift', description: 'You no longer identify as someone who doom scrolls.', emoji: '🦋' },
  { day: 180, title: 'New Normal', description: 'This is who you are now. The old habit feels foreign.', emoji: '🏔️' },
  { day: 365, title: 'Year of Forge', description: 'You forged a new person. Legendary.', emoji: '👑' },
] as const;

// ─── UI Theme Colors (for non-NativeWind usage) ─────────────────
export const THEME = {
  background: '#0A0A0F',
  card: '#181820',
  cardForeground: '#F2F2F2',
  primary: '#F59E0B',
  primaryForeground: '#0A0A0F',
  secondary: '#272730',
  muted: '#272730',
  mutedForeground: '#8A8A96',
  destructive: '#DC2626',
  success: '#22C55E',
  border: '#272730',
  ring: '#F59E0B',
} as const;
