import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/shared/glass-card';
import { HapticPressable } from '@/components/shared/haptic-pressable';
import { type Habit } from '@/stores/use-habit-store';

interface TodaySummaryProps {
  habits: Habit[];
  completedIds: string[];
  onToggleHabit: (habitId: string) => void;
  className?: string;
}

/**
 * Quick-toggle list of today's habits for the dashboard.
 * Compact view — shows emoji, name, and completion toggle.
 */
export function TodaySummary({
  habits,
  completedIds,
  onToggleHabit,
  className,
}: TodaySummaryProps) {
  const completedCount = completedIds.length;
  const totalCount = habits.length;
  const allDone = totalCount > 0 && completedCount >= totalCount;

  return (
    <GlassCard variant={allDone ? 'glow' : 'default'} className={cn('', className)}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-foreground text-base font-sans-semibold">
          Today's Rituals
        </Text>
        <View className="flex-row items-center gap-1">
          <Text
            className={cn(
              'text-sm font-sans-bold',
              allDone ? 'text-success' : 'text-primary'
            )}
          >
            {completedCount}/{totalCount}
          </Text>
          {allDone && <Text style={{ fontSize: 14 }}>✨</Text>}
        </View>
      </View>

      {/* Habit list */}
      {habits.length === 0 ? (
        <Text className="text-muted-foreground text-sm font-sans text-center py-4">
          No habits yet. Add some in Rituals tab!
        </Text>
      ) : (
        <View className="gap-1.5">
          {habits.slice(0, 6).map((habit, index) => {
            const isCompleted = completedIds.includes(habit.id);
            return (
              <Animated.View
                key={habit.id}
                entering={FadeInDown.delay(index * 50).duration(300)}
              >
                <HapticPressable
                  hapticStyle="selection"
                  onPress={() => onToggleHabit(habit.id)}
                  className={cn(
                    'flex-row items-center py-2 px-3 rounded-xl',
                    isCompleted ? 'bg-success/10' : 'bg-secondary/50'
                  )}
                >
                  <Text style={{ fontSize: 18 }} className="mr-2.5">
                    {habit.emoji}
                  </Text>
                  <Text
                    className={cn(
                      'flex-1 text-sm font-sans',
                      isCompleted
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    )}
                  >
                    {habit.name}
                  </Text>
                  <View
                    className={cn(
                      'w-5 h-5 rounded-full border-2 items-center justify-center',
                      isCompleted
                        ? 'bg-success border-success'
                        : 'border-muted-foreground/30'
                    )}
                  >
                    {isCompleted && (
                      <Text className="text-white" style={{ fontSize: 10 }}>
                        ✓
                      </Text>
                    )}
                  </View>
                </HapticPressable>
              </Animated.View>
            );
          })}
          {habits.length > 6 && (
            <Text className="text-muted-foreground text-xs font-sans text-center mt-1">
              +{habits.length - 6} more in Rituals
            </Text>
          )}
        </View>
      )}
    </GlassCard>
  );
}
