import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { GlassCard } from '@/components/shared/glass-card';
import { HapticPressable } from '@/components/shared/haptic-pressable';
import { THEME } from '@/lib/constants';

// Disconnect challenge questions
const CHALLENGE_QUESTIONS = [
  "Type the name of one person who would be proud of your streak.",
  "What were you about to do when you picked up your phone?",
  "Name one thing you'll do instead of scrolling right now.",
  "Type 'I am stronger than this urge' to continue.",
  "What is one goal you're working toward this week?",
  "Name someone you're doing this for (including yourself).",
  "What did you accomplish today that you're proud of?",
  "Type the number of days in your current streak.",
];

/**
 * Disconnect prompt — cognitive friction when disabling Shield.
 * Shows a challenge question that requires a typed answer.
 */
export default function DisconnectPromptModal() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [question] = useState(
    CHALLENGE_QUESTIONS[Math.floor(Math.random() * CHALLENGE_QUESTIONS.length)]
  );

  const canSubmit = answer.trim().length >= 3;

  const handleSubmit = () => {
    if (!canSubmit) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        {/* Warning */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="items-center mb-8"
        >
          <Text style={{ fontSize: 60 }} className="mb-4">
            ⚠️
          </Text>
          <Text className="text-foreground text-xl font-sans-bold text-center">
            Wait.
          </Text>
          <Text className="text-muted-foreground text-sm font-sans text-center mt-2 leading-5">
            Disabling Shield means your companion will weaken{'\n'}
            and your streak is at risk.
          </Text>
        </Animated.View>

        {/* Challenge */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <GlassCard variant="elevated">
            <Text className="text-foreground text-base font-sans-semibold mb-3">
              Answer to continue:
            </Text>
            <Text className="text-primary text-sm font-sans-medium mb-4 leading-5">
              "{question}"
            </Text>
            <TextInput
              value={answer}
              onChangeText={setAnswer}
              placeholder="Type your answer..."
              placeholderTextColor={THEME.mutedForeground}
              className="bg-secondary/50 rounded-xl px-4 py-3 text-foreground text-sm font-sans"
              style={{ color: THEME.cardForeground }}
              multiline
            />
          </GlassCard>
        </Animated.View>
      </View>

      {/* Actions */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        className="px-6 pb-6 gap-3"
      >
        <HapticPressable
          hapticStyle="medium"
          onPress={() => router.back()}
          className="bg-primary w-full py-4 rounded-2xl items-center"
        >
          <Text className="text-primary-foreground text-base font-sans-bold">
            Keep Shield Active ✨
          </Text>
        </HapticPressable>

        <HapticPressable
          hapticStyle="heavy"
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-3 items-center"
        >
          <Text className="text-destructive/60 text-sm font-sans">
            {canSubmit ? 'Disable Shield' : 'Answer the question to continue'}
          </Text>
        </HapticPressable>
      </Animated.View>
    </SafeAreaView>
  );
}
