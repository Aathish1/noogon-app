import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { GlassCard } from '@/components/shared/glass-card';
import { HapticPressable } from '@/components/shared/haptic-pressable';
import { useShieldStore } from '@/stores/use-shield-store';
import { useOnboardingStore } from '@/stores/use-onboarding-store';
import { SHIELD_DEFAULTS } from '@/lib/constants';

/**
 * Enable Shield — turn on DNS filtering and set up app limits.
 * Final onboarding step.
 */
export default function EnableShieldScreen() {
  const router = useRouter();
  const toggleDNS = useShieldStore((s) => s.toggleDNS);
  const setShieldEnabled = useOnboardingStore((s) => s.setShieldEnabled);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const handleEnable = () => {
    toggleDNS(true);

    // Set default app limits
    const store = useShieldStore.getState();
    SHIELD_DEFAULTS.defaultAppLimits.forEach((app) => {
      store.setAppLimit(app.appId, app.dailyMinutes);
      // Also update name and emoji
      useShieldStore.setState((s) => ({
        appLimits: s.appLimits.map((a) =>
          a.appId === app.appId
            ? { ...a, name: app.name, emoji: app.emoji }
            : a
        ),
      }));
    });

    setShieldEnabled();
    completeOnboarding();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    setShieldEnabled();
    completeOnboarding();
    router.replace('/(tabs)');
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
            Step 3 of 3
          </Text>
          <Text className="text-foreground text-2xl font-sans-bold">
            Activate Shield
          </Text>
          <Text className="text-muted-foreground text-sm font-sans mt-1">
            Your first line of defense against doom scrolling.
          </Text>
        </Animated.View>

        {/* Shield visual */}
        <View className="flex-1 justify-center">
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="items-center mb-8"
          >
            <Text style={{ fontSize: 80 }} className="mb-4">
              🛡️
            </Text>
            <Text className="text-foreground text-lg font-sans-semibold text-center">
              DNS Content Filter
            </Text>
            <Text className="text-muted-foreground text-sm font-sans text-center mt-2 leading-5">
              Blocks distracting content at the network level.{'\n'}
              Zero battery drain. No background processes.
            </Text>
          </Animated.View>

          {/* What it does */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
          >
            <GlassCard>
              {[
                { emoji: '✅', text: 'Filters adult and distracting content' },
                { emoji: '✅', text: 'Works across all apps and browsers' },
                { emoji: '✅', text: 'Required for streak maintenance' },
                { emoji: '⚡', text: 'Uses AdGuard Family DNS' },
              ].map((item, i) => (
                <View key={i} className={`flex-row items-center gap-3 ${i > 0 ? 'mt-3' : ''}`}>
                  <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
                  <Text className="text-foreground text-sm font-sans flex-1">
                    {item.text}
                  </Text>
                </View>
              ))}
            </GlassCard>
          </Animated.View>
        </View>
      </View>

      {/* CTAs */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        className="px-6 pb-6 gap-3"
      >
        <HapticPressable
          hapticStyle="heavy"
          onPress={handleEnable}
          className="bg-primary w-full py-4 rounded-2xl items-center"
        >
          <Text className="text-primary-foreground text-base font-sans-bold">
            🛡️ Enable Shield & Start
          </Text>
        </HapticPressable>

        <HapticPressable
          hapticStyle="light"
          onPress={handleSkip}
          className="w-full py-3 items-center"
        >
          <Text className="text-muted-foreground text-sm font-sans">
            Skip for now
          </Text>
        </HapticPressable>
      </Animated.View>
    </SafeAreaView>
  );
}
