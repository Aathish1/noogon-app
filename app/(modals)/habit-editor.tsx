import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { GlassCard } from '@/components/shared/glass-card';
import { HapticPressable } from '@/components/shared/haptic-pressable';
import { useHabitStore } from '@/stores/use-habit-store';
import { cn } from '@/lib/utils';
import { THEME } from '@/lib/constants';

const EMOJI_OPTIONS = [
  '💧', '🏃', '📖', '🧘', '✍️', '🎯', '🧠', '💪',
  '🛏️', '📵', '🥤', '🍽️', '🌿', '🎨', '📚', '✏️',
  '🔨', '🌟', '🙏', '😴', '🥶', '🎵', '📋', '🧴',
];

const TIME_OPTIONS = [1, 2, 5, 10, 15, 20, 30, 45, 60, 90];

/**
 * Habit Editor modal — create a new habit with name, emoji, time, and slot.
 */
export default function HabitEditorModal() {
  const router = useRouter();
  const addHabit = useHabitStore((s) => s.addHabit);

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [timeMinutes, setTimeMinutes] = useState(10);
  const [slot, setSlot] = useState<'morning' | 'evening'>('morning');

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;

    addHabit({
      name: name.trim(),
      emoji,
      timeMinutes,
      slot,
      reminder: null,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-border/30">
        <HapticPressable onPress={() => router.back()}>
          <Text className="text-muted-foreground text-base font-sans">
            Cancel
          </Text>
        </HapticPressable>
        <Text className="text-foreground text-base font-sans-semibold">
          New Habit
        </Text>
        <HapticPressable
          hapticStyle="medium"
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text
            className={cn(
              'text-base font-sans-semibold',
              canSave ? 'text-primary' : 'text-muted-foreground/50'
            )}
          >
            Save
          </Text>
        </HapticPressable>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Preview */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="items-center py-8"
        >
          <View className="w-20 h-20 rounded-2xl bg-card border border-border items-center justify-center mb-3">
            <Text style={{ fontSize: 36 }}>{emoji}</Text>
          </View>
          <Text className="text-foreground text-lg font-sans-semibold">
            {name || 'Habit Name'}
          </Text>
          <Text className="text-muted-foreground text-sm font-sans mt-0.5">
            {timeMinutes} min • {slot === 'morning' ? '☀️ Morning' : '🌙 Evening'}
          </Text>
        </Animated.View>

        {/* Name Input */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <Text className="text-foreground text-sm font-sans-semibold mb-2">
            Habit Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Read 20 pages"
            placeholderTextColor={THEME.mutedForeground}
            className="bg-card border border-border rounded-xl px-4 py-3.5 text-foreground text-sm font-sans mb-5"
            style={{ color: THEME.cardForeground }}
            maxLength={50}
          />
        </Animated.View>

        {/* Emoji Picker */}
        <Animated.View entering={FadeInDown.delay(150).duration(300)}>
          <Text className="text-foreground text-sm font-sans-semibold mb-2">
            Icon
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {EMOJI_OPTIONS.map((e) => (
              <HapticPressable
                key={e}
                hapticStyle="selection"
                onPress={() => setEmoji(e)}
                className={cn(
                  'w-11 h-11 rounded-xl items-center justify-center',
                  emoji === e ? 'bg-primary/20 border border-primary/40' : 'bg-card border border-border/50'
                )}
              >
                <Text style={{ fontSize: 20 }}>{e}</Text>
              </HapticPressable>
            ))}
          </View>
        </Animated.View>

        {/* Time Estimate */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <Text className="text-foreground text-sm font-sans-semibold mb-2">
            Time Estimate
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            className="mb-5"
          >
            {TIME_OPTIONS.map((t) => (
              <HapticPressable
                key={t}
                hapticStyle="selection"
                onPress={() => setTimeMinutes(t)}
                className={cn(
                  'px-4 py-2 rounded-xl',
                  timeMinutes === t
                    ? 'bg-primary'
                    : 'bg-card border border-border/50'
                )}
              >
                <Text
                  className={cn(
                    'text-sm font-sans-medium',
                    timeMinutes === t
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {t} min
                </Text>
              </HapticPressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Slot Selector */}
        <Animated.View entering={FadeInDown.delay(250).duration(300)}>
          <Text className="text-foreground text-sm font-sans-semibold mb-2">
            When
          </Text>
          <View className="flex-row gap-3">
            {(['morning', 'evening'] as const).map((s) => (
              <HapticPressable
                key={s}
                hapticStyle="selection"
                onPress={() => setSlot(s)}
                className={cn(
                  'flex-1 py-3 rounded-xl items-center border',
                  slot === s
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-card border-border/50'
                )}
              >
                <Text style={{ fontSize: 20 }}>
                  {s === 'morning' ? '☀️' : '🌙'}
                </Text>
                <Text
                  className={cn(
                    'text-sm font-sans-medium mt-1 capitalize',
                    slot === s ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {s}
                </Text>
              </HapticPressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
