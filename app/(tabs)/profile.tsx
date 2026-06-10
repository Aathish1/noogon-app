import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeader } from '@/components/shared/section-header';
import { XPBar } from '@/components/dashboard/xp-bar';
import { AnimatedCounter } from '@/components/shared/animated-counter';

import { useStreakStore } from '@/stores/use-streak-store';
import { useHabitStore } from '@/stores/use-habit-store';
import { useCompanionStore } from '@/stores/use-companion-store';
import { useUserStore } from '@/stores/use-user-store';
import { getCurrentLevel } from '@/lib/xp-engine';
import { RECOVERY_MILESTONES, COMPANION_TYPES, XP_REWARDS, THEME } from '@/lib/constants';
import { useOnboardingStore } from '@/stores/use-onboarding-store';
import { Pen } from '@solar-icons/react-native/BoldDuotone';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3001'
  : 'https://api-noogon-new.onrender.com';

const AVATAR_OPTIONS = ['👤', '🔥', '🛡️', '⚡', '🦊', '🦁', '🐼', '🐨', '🧙', '🚀', '🐱', '🐶'];

/**
 * PROFILE — XP, levels, streak history, milestones, settings.
 */
export default function ProfileScreen() {
  const totalXP = useStreakStore((s) => s.totalXP);
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const longestStreak = useStreakStore((s) => s.longestStreak);
  const dayLog = useStreakStore((s) => s.dayLog);
  const companionType = useCompanionStore((s) => s.type);
  const companionInfo = COMPANION_TYPES.find((c) => c.type === companionType);
  const level = getCurrentLevel(totalXP);
  const completionRate = useHabitStore((s) => s.getCompletionRate(30));
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  // User store
  const userName = useUserStore((s) => s.name);
  const userAvatar = useUserStore((s) => s.avatar);
  const setUserName = useUserStore((s) => s.setName);
  const setUserAvatar = useUserStore((s) => s.setAvatar);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editAvatar, setEditAvatar] = useState(userAvatar);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setUserName(editName.trim() || 'Forger');
    setUserAvatar(editAvatar);

    // Sync with backend (with 3s timeout so it doesn't hang)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() || 'Forger', avatar: editAvatar }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (err) {
      console.log('Backend sync skipped (offline or timeout):', err);
    }

    setIsSaving(false);
    setIsEditing(false);
  };

  // Find reached milestones
  const reachedMilestones = RECOVERY_MILESTONES.filter(
    (m) => currentStreak >= m.day || longestStreak >= m.day
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
          entering={FadeInDown.duration(400)}
          className="px-5 pt-3 pb-2"
        >
          <Text className="text-foreground text-2xl font-sans-bold">
            Profile
          </Text>
          <Text className="text-muted-foreground text-sm font-sans">
            Your journey in numbers
          </Text>
        </Animated.View>

        {/* User Identity Card */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(400)}
          className="px-5 mt-3 mb-4"
        >
          <GlassCard>
            {isEditing ? (
              <View className="gap-5">
                {/* Header Row: Current Avatar + Name Input */}
                <View className="flex-row items-center gap-4">
                  <View className="w-[72px] h-[72px] rounded-full bg-[#1A1A24] items-center justify-center">
                    <Text style={{ fontSize: 36 }}>{editAvatar}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-muted-foreground text-sm font-sans mb-1.5">
                      Your Name
                    </Text>
                    <TextInput
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Enter your name"
                      placeholderTextColor="#8A8A96"
                      maxLength={20}
                      className="bg-[#1A1A24] text-foreground text-base font-sans rounded-xl px-4 py-3"
                    />
                  </View>
                </View>

                {/* Avatar grid */}
                <View>
                  <Text className="text-muted-foreground text-sm font-sans mb-3">
                    Choose Avatar
                  </Text>
                  <View className="flex-row flex-wrap gap-2.5 justify-start">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <Pressable
                        key={emoji}
                        onPress={() => setEditAvatar(emoji)}
                        className={`w-12 h-12 rounded-xl items-center justify-center ${
                          editAvatar === emoji
                            ? 'bg-primary/10 border border-primary/50'
                            : 'bg-[#1A1A24]'
                        }`}
                      >
                        <Text style={{ fontSize: 24 }}>{emoji}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Save / Cancel */}
                <View className="flex-row justify-end gap-3 mt-2">
                  <Pressable
                    onPress={() => {
                      setIsEditing(false);
                      setEditName(userName);
                      setEditAvatar(userAvatar);
                    }}
                    className="py-2.5 px-6 rounded-xl items-center bg-[#1A1A24]"
                  >
                    <Text className="text-muted-foreground text-sm font-sans-medium">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSave}
                    disabled={isSaving}
                    className="py-2.5 px-8 rounded-xl items-center bg-primary"
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#0A0A0F" />
                    ) : (
                      <Text className="text-primary-foreground text-sm font-sans-bold">
                        Save
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setEditName(userName);
                  setEditAvatar(userAvatar);
                  setIsEditing(true);
                }}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-14 h-14 rounded-2xl bg-primary/15 items-center justify-center">
                    <Text style={{ fontSize: 28 }}>{userAvatar}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-base font-sans-semibold">
                      {userName}
                    </Text>
                    <Text className="text-muted-foreground text-xs font-sans mt-0.5">
                      Tap to edit profile
                    </Text>
                  </View>
                  <Pen size={20} color={THEME.mutedForeground} />
                </View>
              </Pressable>
            )}
          </GlassCard>
        </Animated.View>

        {/* Level Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="px-5 mb-4"
        >
          <GlassCard variant="glow" className="items-center py-6">
            <Text style={{ fontSize: 56 }} className="mb-2">
              {level.emoji}
            </Text>
            <Text className="text-foreground text-xl font-sans-bold">
              {level.name}
            </Text>
            <Text className="text-muted-foreground text-sm font-sans mt-0.5">
              Level {level.level} • {totalXP.toLocaleString()} XP
            </Text>

            <View className="w-full mt-4">
              <XPBar totalXP={totalXP} />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="flex-row px-5 gap-3 mb-4"
        >
          <GlassCard className="flex-1 items-center py-4">
            <AnimatedCounter
              value={currentStreak}
              className="text-primary text-2xl text-center"
            />
            <Text className="text-muted-foreground text-xs font-sans mt-1 text-center">
              Current Streak
            </Text>
          </GlassCard>

          <GlassCard className="flex-1 items-center py-4">
            <AnimatedCounter
              value={longestStreak}
              className="text-foreground text-2xl text-center"
            />
            <Text className="text-muted-foreground text-xs font-sans mt-1 text-center">
              Longest Streak
            </Text>
          </GlassCard>

          <GlassCard className="flex-1 items-center py-4">
            <Text className="text-foreground text-2xl font-sans-bold text-center">
              {Math.round(completionRate * 100)}%
            </Text>
            <Text className="text-muted-foreground text-xs font-sans mt-1 text-center">
              30-Day Rate
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Companion Info */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(400)}
          className="px-5 mb-4"
        >
          <SectionHeader title="Your Companion" />
          <GlassCard className="flex-row items-center gap-3">
            <Text style={{ fontSize: 36 }}>{companionInfo?.emoji}</Text>
            <View className="flex-1">
              <Text className="text-foreground text-base font-sans-semibold">
                {companionInfo?.name}
              </Text>
              <Text className="text-muted-foreground text-xs font-sans mt-0.5">
                {companionInfo?.description}
              </Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* XP Breakdown */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          className="px-5 mb-4"
        >
          <SectionHeader title="How to Earn XP" />
          <GlassCard>
            {Object.entries(XP_REWARDS).map(([key, value], index) => {
              const labels: Record<string, string> = {
                habit_complete: 'Complete a habit',
                all_morning_habits: 'All morning habits done',
                all_evening_habits: 'All evening habits done',
                clean_day: 'Shield active all day',
                focus_session: 'Complete a focus session',
                journal_entry: 'Write a journal entry',
                streak_milestone_7: '7-day streak milestone',
                streak_milestone_30: '30-day streak milestone',
                streak_milestone_100: '100-day streak milestone',
              };
              return (
                <View key={key}>
                  {index > 0 && (
                    <View className="h-px bg-border/30 my-2" />
                  )}
                  <View className="flex-row items-center justify-between py-1">
                    <Text className="text-foreground text-sm font-sans">
                      {labels[key] ?? key}
                    </Text>
                    <Text className="text-primary text-sm font-sans-semibold">
                      +{value} XP
                    </Text>
                  </View>
                </View>
              );
            })}
          </GlassCard>
        </Animated.View>

        {/* Recovery Milestones */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          className="px-5 mb-4"
        >
          <SectionHeader
            title="Recovery Milestones"
            subtitle="What's happening in your brain"
          />
          <View className="gap-2">
            {RECOVERY_MILESTONES.map((milestone) => {
              const reached =
                currentStreak >= milestone.day || longestStreak >= milestone.day;
              return (
                <GlassCard
                  key={milestone.day}
                  variant={reached ? 'glow' : 'default'}
                  className={!reached ? 'opacity-50' : undefined}
                >
                  <View className="flex-row items-start gap-3">
                    <Text style={{ fontSize: 24 }}>{milestone.emoji}</Text>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-foreground text-sm font-sans-semibold">
                          Day {milestone.day}: {milestone.title}
                        </Text>
                        {reached && (
                          <Text className="text-success text-xs font-sans">✓</Text>
                        )}
                      </View>
                      <Text className="text-muted-foreground text-xs font-sans mt-0.5">
                        {milestone.description}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </View>
        </Animated.View>

        {/* Dev/Debug: Reset Onboarding */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          className="px-5 mt-4"
        >
          <Pressable
            onPress={resetOnboarding}
            className="border border-destructive/30 rounded-xl py-3 items-center"
          >
            <Text className="text-destructive text-sm font-sans">
              Reset Onboarding (Dev)
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
