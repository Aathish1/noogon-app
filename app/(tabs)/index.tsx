import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CompanionAvatar } from '@/components/companion/companion-avatar';
import { ShieldCheck, DangerCircle, Target } from '@solar-icons/react-native/BoldDuotone';
import { CompanionGreeting } from '@/components/companion/companion-greeting';
import { StreakRing } from '@/components/dashboard/streak-ring';
import { XPBar } from '@/components/dashboard/xp-bar';
import { LevelBadge } from '@/components/dashboard/level-badge';
import { TodaySummary } from '@/components/dashboard/today-summary';
import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeader } from '@/components/shared/section-header';
import { useShallow } from 'zustand/react/shallow';

import { useStreakStore } from '@/stores/use-streak-store';
import { useHabitStore } from '@/stores/use-habit-store';
import { useCompanionStore } from '@/stores/use-companion-store';
import { useShieldStore } from '@/stores/use-shield-store';
import { getNextMilestone } from '@/lib/streak-engine';
import { COMPANION_TYPES, THEME } from '@/lib/constants';
import { toDateKey } from '@/lib/utils';

/**
 * HOME — The main dashboard.
 * Shows companion, streak, XP, and today's habits at a glance.
 */
export default function HomeScreen() {
  // Store data
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const totalXP = useStreakStore((s) => s.totalXP);
  const addXP = useStreakStore((s) => s.addXP);

  const habits = useHabitStore(useShallow((s) => s.getActiveHabits()));
  const completedToday = useHabitStore(useShallow((s) => s.getCompletedToday()));
  const completeHabit = useHabitStore((s) => s.completeHabit);
  const uncompleteHabit = useHabitStore((s) => s.uncompleteHabit);

  const companionType = useCompanionStore((s) => s.type);
  const companionState = useCompanionStore((s) => s.currentState);
  const evolutionStage = useCompanionStore((s) => s.evolutionStage);
  const lastGreeting = useCompanionStore((s) => s.lastGreeting);

  const dnsEnabled = useShieldStore((s) => s.dnsEnabled);

  const nextMilestone = getNextMilestone(currentStreak);
  const companionInfo = COMPANION_TYPES.find((c) => c.type === companionType);

  const handleToggleHabit = useCallback(
    (habitId: string) => {
      const isCompleted = completedToday.includes(habitId);
      if (isCompleted) {
        uncompleteHabit(habitId);
      } else {
        completeHabit(habitId);
        addXP('habit_complete');
      }
    },
    [completedToday, completeHabit, uncompleteHabit, addXP]
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          className="flex-row items-center justify-between px-5 pt-3 pb-2"
        >
          <View>
            <Text className="text-foreground text-2xl font-sans-bold">
              Forge
            </Text>
            <Text className="text-muted-foreground text-sm font-sans">
              Forge the person you want to be
            </Text>
          </View>
          <LevelBadge totalXP={totalXP} size="small" />
        </Animated.View>

        {/* Companion Section */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="items-center pt-4 pb-2"
        >
          <CompanionAvatar
            type={companionType}
            state={companionState}
            evolutionStage={evolutionStage}
            size="large"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <CompanionGreeting
            greeting={lastGreeting}
            companionName={companionInfo?.name ?? 'Companion'}
          />
        </Animated.View>

        {/* Streak + Shield Status */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          className="flex-row items-center justify-center gap-6 mt-6 px-5"
        >
          <StreakRing
            currentStreak={currentStreak}
            nextMilestone={nextMilestone}
            isActive={dnsEnabled}
          />

          <View className="gap-3 flex-1">
            {/* Shield status mini card */}
            <GlassCard
              variant={dnsEnabled ? 'glow' : 'default'}
              className="py-2.5 px-3"
            >
              <View className="flex-row items-center gap-2">
                {dnsEnabled ? (
                  <ShieldCheck size={24} color={THEME.primary} />
                ) : (
                  <DangerCircle size={24} color={THEME.destructive} />
                )}
                <View>
                  <Text className="text-foreground text-xs font-sans-semibold">
                    Shield {dnsEnabled ? 'Active' : 'Down'}
                  </Text>
                  <Text className="text-muted-foreground text-xs font-sans">
                    {dnsEnabled ? 'DNS filter protecting you' : 'Turn on to maintain streak'}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* Next milestone */}
            <GlassCard className="py-2.5 px-3">
              <View className="flex-row items-center gap-2">
                <Target size={24} color={THEME.primary} />
                <View>
                  <Text className="text-foreground text-xs font-sans-semibold">
                    Next: Day {nextMilestone}
                  </Text>
                  <Text className="text-muted-foreground text-xs font-sans">
                    {nextMilestone - currentStreak} days to go
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>
        </Animated.View>

        {/* XP Bar */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          className="px-5 mt-6"
        >
          <GlassCard>
            <XPBar totalXP={totalXP} />
          </GlassCard>
        </Animated.View>

        {/* Today's Habits */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          className="px-5 mt-4"
        >
          <TodaySummary
            habits={habits}
            completedIds={completedToday}
            onToggleHabit={handleToggleHabit}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
