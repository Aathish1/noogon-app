import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/shared/glass-card';
import { useUserStore } from '@/stores/use-user-store';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3001'
  : 'https://api-noogon-new.onrender.com';

const AVATAR_OPTIONS = ['👤', '🔥', '🛡️', '⚡', '🦊', '🦁', '🐼', '🐨', '🧙', '🚀', '🐱', '🐶'];

/**
 * Create Profile — collect user's name and avatar during onboarding.
 * Step 1 of 4.
 */
export default function CreateProfileScreen() {
  const router = useRouter();
  const setUserName = useUserStore((s) => s.setName);
  const setUserAvatar = useUserStore((s) => s.setAvatar);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const finalName = name.trim() || 'Forger';

    // Update local store first (instant)
    setUserName(finalName);
    setUserAvatar(avatar);

    // Sync with backend (with 3s timeout so it doesn't hang)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: finalName, avatar }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (err) {
      console.log('Backend sync skipped (offline or timeout):', err);
    }

    setIsSaving(false);
    router.push('/(onboarding)/choose-companion');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="pt-6 pb-4"
        >
          <Text className="text-muted-foreground text-sm font-sans mb-1">
            Step 1 of 4
          </Text>
          <Text className="text-foreground text-2xl font-sans-bold">
            Create Your Profile
          </Text>
          <Text className="text-muted-foreground text-sm font-sans mt-1">
            Tell us your name and pick an avatar.
          </Text>
        </Animated.View>

        {/* Profile Form */}
        <View className="flex-1 justify-center">
          {/* Avatar Selection */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="items-center mb-8"
          >
            <View className="w-24 h-24 rounded-3xl bg-primary/15 items-center justify-center mb-4">
              <Text style={{ fontSize: 48 }}>{avatar}</Text>
            </View>
            <Text className="text-muted-foreground text-xs font-sans mb-3">
              Choose your avatar
            </Text>
            <View className="flex-row flex-wrap justify-center gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => setAvatar(emoji)}
                  className={`w-12 h-12 rounded-xl items-center justify-center ${
                    avatar === emoji
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-secondary/50 border border-border/30'
                  }`}
                >
                  <Text style={{ fontSize: 24 }}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Name Input */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
          >
            <GlassCard>
              <Text className="text-muted-foreground text-xs font-sans mb-2">
                Your Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#8A8A96"
                maxLength={20}
                autoFocus
                className="bg-secondary/50 text-foreground text-base font-sans rounded-xl px-4 py-3 border border-border/30"
              />
            </GlassCard>
          </Animated.View>
        </View>
      </View>

      {/* CTA */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        className="px-6 pb-6"
      >
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="bg-primary w-full py-4 rounded-2xl items-center"
        >
          {isSaving ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#0A0A0F" />
              <Text className="text-primary-foreground text-base font-sans-bold">
                Syncing with server...
              </Text>
            </View>
          ) : (
            <Text className="text-primary-foreground text-base font-sans-bold">
              Save & Continue
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
