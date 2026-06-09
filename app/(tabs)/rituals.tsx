import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeader } from '@/components/shared/section-header';
import { HapticPressable } from '@/components/shared/haptic-pressable';
import { useHabitStore, type Habit } from '@/stores/use-habit-store';
import { useStreakStore } from '@/stores/use-streak-store';
import { toDateKey, getLastNDays } from '@/lib/utils';
import { HABIT_TEMPLATES, THEME } from '@/lib/constants';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/lib/utils';
import { Sun, Moon } from '@solar-icons/react-native/BoldDuotone';

/**
 * RITUALS — Morning and evening habit management with heatmap.
 */
export default function RitualsScreen() {
  const router = useRouter();
  const [activeSlot, setActiveSlot] = useState<'morning' | 'evening'>('morning');

  const habits = useHabitStore(useShallow((s) => s.getActiveHabits()));
  const morningHabits = useHabitStore(useShallow((s) => s.getMorningHabits()));
  const eveningHabits = useHabitStore(useShallow((s) => s.getEveningHabits()));
  const completedToday = useHabitStore(useShallow((s) => s.getCompletedToday()));
  const completeHabit = useHabitStore((s) => s.completeHabit);
  const uncompleteHabit = useHabitStore((s) => s.uncompleteHabit);
  const importHabits = useHabitStore((s) => s.importHabits);
  const completions = useHabitStore((s) => s.completions);
  const addXP = useStreakStore((s) => s.addXP);

  const displayedHabits = activeSlot === 'morning' ? morningHabits : eveningHabits;

  const handleToggleHabit = useCallback(
    (habitId: string) => {
      const isCompleted = completedToday.includes(habitId);
      if (isCompleted) {
        uncompleteHabit(habitId);
      } else {
        completeHabit(habitId);
        addXP('habit_complete');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [completedToday, completeHabit, uncompleteHabit, addXP]
  );

  const handleImportTemplate = useCallback(
    (templateId: string) => {
      const template = HABIT_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        importHabits(template.habits);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [importHabits]
  );

  // Heatmap data (last 90 days)
  const heatmapDays = getLastNDays(90);
  const activeCount = habits.length;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="px-5 pt-3 pb-2"
        >
          <Text className="text-foreground text-2xl font-sans-bold">
            Daily Rituals
          </Text>
          <Text className="text-muted-foreground text-sm font-sans">
            Build the habits that replace scrolling
          </Text>
        </Animated.View>

        {/* Slot Tabs */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="flex-row mx-5 mt-3 mb-4 bg-secondary/50 rounded-xl p-1"
        >
          {(['morning', 'evening'] as const).map((slot) => {
            const isActive = activeSlot === slot;
            const count = slot === 'morning' ? morningHabits.length : eveningHabits.length;
            return (
              <HapticPressable
                key={slot}
                hapticStyle="selection"
                onPress={() => setActiveSlot(slot)}
                className={cn(
                  'flex-1 py-2.5 rounded-lg items-center flex-row justify-center gap-2',
                  isActive && 'bg-card'
                )}
              >
                {slot === 'morning' ? (
                  <Sun size={18} color={isActive ? THEME.primary : THEME.mutedForeground} />
                ) : (
                  <Moon size={18} color={isActive ? THEME.primary : THEME.mutedForeground} />
                )}
                <Text
                  className={cn(
                    'text-sm font-sans-medium capitalize',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {slot} ({count})
                </Text>
              </HapticPressable>
            );
          })}
        </Animated.View>

        {/* Habit List */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="px-5 mb-4"
        >
          {displayedHabits.length === 0 ? (
            <GlassCard className="items-center py-8">
              <View className="mb-3">
                {activeSlot === 'morning' ? (
                  <Sun size={48} color={THEME.primary} />
                ) : (
                  <Moon size={48} color={THEME.primary} />
                )}
              </View>
              <Text className="text-foreground text-base font-sans-semibold mb-1">
                No {activeSlot} habits yet
              </Text>
              <Text className="text-muted-foreground text-sm font-sans text-center mb-4">
                Add habits or import a template to get started
              </Text>
              <HapticPressable
                hapticStyle="medium"
                onPress={() => router.push('/(modals)/habit-editor')}
                className="bg-primary px-5 py-2.5 rounded-xl"
              >
                <Text className="text-primary-foreground text-sm font-sans-semibold">
                  + Add Habit
                </Text>
              </HapticPressable>
            </GlassCard>
          ) : (
            <View className="gap-2">
              {displayedHabits.map((habit, index) => {
                const isCompleted = completedToday.includes(habit.id);
                return (
                  <Animated.View
                    key={habit.id}
                    entering={FadeInDown.delay(index * 60).duration(300)}
                    layout={Layout.springify()}
                  >
                    <HapticPressable
                      hapticStyle="selection"
                      onPress={() => handleToggleHabit(habit.id)}
                    >
                      <GlassCard
                        variant={isCompleted ? 'glow' : 'default'}
                        className={cn(
                          'flex-row items-center py-3',
                          isCompleted && 'bg-success/5'
                        )}
                      >
                        <Text style={{ fontSize: 24 }} className="mr-3">
                          {habit.emoji}
                        </Text>
                        <View className="flex-1">
                          <Text
                            className={cn(
                              'text-sm font-sans-medium',
                              isCompleted
                                ? 'text-muted-foreground line-through'
                                : 'text-foreground'
                            )}
                          >
                            {habit.name}
                          </Text>
                          <Text className="text-muted-foreground text-xs font-sans mt-0.5">
                            {habit.timeMinutes} min
                          </Text>
                        </View>
                        <View
                          className={cn(
                            'w-7 h-7 rounded-full border-2 items-center justify-center',
                            isCompleted
                              ? 'bg-success border-success'
                              : 'border-muted-foreground/30'
                          )}
                        >
                          {isCompleted && (
                            <Text className="text-white font-sans-bold" style={{ fontSize: 12 }}>
                              ✓
                            </Text>
                          )}
                        </View>
                      </GlassCard>
                    </HapticPressable>
                  </Animated.View>
                );
              })}

              {/* Add habit button */}
              <HapticPressable
                hapticStyle="medium"
                onPress={() => router.push('/(modals)/habit-editor')}
                className="border border-dashed border-border/50 rounded-2xl py-3 items-center mt-1"
              >
                <Text className="text-muted-foreground text-sm font-sans">
                  + Add {activeSlot} habit
                </Text>
              </HapticPressable>
            </View>
          )}
        </Animated.View>

        {/* Quick Templates */}
        {habits.length === 0 && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            className="px-5 mb-4"
          >
            <SectionHeader
              title="Quick Start Templates"
              subtitle="One-tap import, then customize"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {HABIT_TEMPLATES.map((template) => (
                <HapticPressable
                  key={template.id}
                  hapticStyle="medium"
                  onPress={() => handleImportTemplate(template.id)}
                >
                  <GlassCard className="w-44">
                    <Text style={{ fontSize: 28 }} className="mb-2">
                      {template.emoji}
                    </Text>
                    <Text className="text-foreground text-sm font-sans-semibold mb-1">
                      {template.name}
                    </Text>
                    <Text
                      className="text-muted-foreground text-xs font-sans"
                      numberOfLines={2}
                    >
                      {template.description}
                    </Text>
                    <Text className="text-primary text-xs font-sans-medium mt-2">
                      {template.habits.length} habits →
                    </Text>
                  </GlassCard>
                </HapticPressable>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Heatmap */}
        {habits.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            className="px-5"
          >
            <SectionHeader
              title="90-Day Heatmap"
              subtitle="Your consistency visualized"
            />
            <GlassCard>
              <View className="flex-row flex-wrap gap-1">
                {heatmapDays.map((day) => {
                  const key = toDateKey(day);
                  const completed = (completions[key] ?? []).length;
                  const rate = activeCount > 0 ? completed / activeCount : 0;

                  let bgColor = 'bg-secondary/30';
                  if (rate > 0) bgColor = 'bg-primary/20';
                  if (rate >= 0.5) bgColor = 'bg-primary/50';
                  if (rate >= 0.8) bgColor = 'bg-primary/80';
                  if (rate >= 1) bgColor = 'bg-primary';

                  return (
                    <View
                      key={key}
                      className={cn('w-2.5 h-2.5 rounded-sm', bgColor)}
                    />
                  );
                })}
              </View>
              <View className="flex-row items-center justify-end mt-2 gap-1">
                <Text className="text-muted-foreground text-xs font-sans mr-1">
                  Less
                </Text>
                {['bg-secondary/30', 'bg-primary/20', 'bg-primary/50', 'bg-primary/80', 'bg-primary'].map(
                  (c, i) => (
                    <View key={i} className={cn('w-2.5 h-2.5 rounded-sm', c)} />
                  )
                )}
                <Text className="text-muted-foreground text-xs font-sans ml-1">
                  More
                </Text>
              </View>
            </GlassCard>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
