import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

/**
 * Welcome screen — first thing users see on fresh install.
 * "Forge the person you want to be."
 */
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-8">
        {/* Forge icon */}
        <Animated.Text
          entering={FadeIn.delay(300).duration(800)}
          style={{ fontSize: 80 }}
          className="mb-6"
        >
          🔥
        </Animated.Text>

        {/* Title */}
        <Animated.Text
          entering={FadeInDown.delay(600).duration(600)}
          className="text-foreground text-4xl font-sans-bold text-center mb-3"
        >
          Forge
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text
          entering={FadeInDown.delay(800).duration(600)}
          className="text-primary text-lg font-sans-medium text-center mb-6"
        >
          Forge the person you want to be.
        </Animated.Text>

        {/* Description */}
        <Animated.Text
          entering={FadeInDown.delay(1000).duration(600)}
          className="text-muted-foreground text-sm font-sans text-center leading-5 mb-12"
        >
          Replace doom scrolling with real rewards.{'\n'}
          Build habits. Grow your companion.{'\n'}
          Watch yourself transform.
        </Animated.Text>

        {/* Features */}
        <Animated.View
          entering={FadeInDown.delay(1200).duration(600)}
          className="w-full gap-3 mb-12"
        >
          {[
            { emoji: '🛡️', text: 'Shield blocks distractions at the network level' },
            { emoji: '🔥', text: 'Streaks & XP make discipline rewarding' },
            { emoji: '🐕', text: 'A companion that grows when you do' },
            { emoji: '✨', text: 'Rituals that fill the gap scrolling leaves' },
          ].map((item, i) => (
            <View key={i} className="flex-row items-center gap-3">
              <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
              <Text className="text-foreground text-sm font-sans flex-1">
                {item.text}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* CTA */}
      <Animated.View
        entering={FadeInUp.delay(1500).duration(600)}
        className="px-8 pb-6"
      >
        <Pressable
          onPress={() => router.push('/(onboarding)/create-profile')}
          className="bg-primary w-full py-4 rounded-2xl items-center"
        >
          <Text className="text-primary-foreground text-base font-sans-bold">
            Let's Begin
          </Text>
        </Pressable>

        <Text className="text-muted-foreground text-xs font-sans text-center mt-3">
          Takes less than 2 minutes to set up
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
