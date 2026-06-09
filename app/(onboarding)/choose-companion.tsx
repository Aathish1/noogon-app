import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { GlassCard } from '@/components/shared/glass-card';
import { HapticPressable } from '@/components/shared/haptic-pressable';
import { useCompanionStore } from '@/stores/use-companion-store';
import { useOnboardingStore } from '@/stores/use-onboarding-store';
import { COMPANION_TYPES, type CompanionType } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Choose companion — pick dog, cat, or superhero during onboarding.
 */
export default function ChooseCompanionScreen() {
  const router = useRouter();
  const companionType = useCompanionStore((s) => s.type);
  const setType = useCompanionStore((s) => s.setType);
  const setCompanionChosen = useOnboardingStore((s) => s.setCompanionChosen);

  const handleSelect = (type: CompanionType) => {
    setType(type);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleContinue = () => {
    setCompanionChosen();
    router.push('/(onboarding)/set-goals');
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
            Step 1 of 3
          </Text>
          <Text className="text-foreground text-2xl font-sans-bold">
            Choose Your Companion
          </Text>
          <Text className="text-muted-foreground text-sm font-sans mt-1">
            They'll grow as you do — and weaken when you slip.
          </Text>
        </Animated.View>

        {/* Companion Options */}
        <View className="flex-1 justify-center gap-4">
          {COMPANION_TYPES.map((companion, index) => {
            const isSelected = companionType === companion.type;
            return (
              <Animated.View
                key={companion.type}
                entering={FadeInDown.delay(200 + index * 100).duration(400)}
              >
                <HapticPressable
                  hapticStyle="medium"
                  onPress={() => handleSelect(companion.type)}
                >
                  <GlassCard
                    variant={isSelected ? 'glow' : 'default'}
                    className={cn(
                      'flex-row items-center gap-4 py-5',
                      isSelected && 'border-primary/40'
                    )}
                  >
                    <View
                      className={cn(
                        'w-16 h-16 rounded-2xl items-center justify-center',
                        isSelected ? 'bg-primary/15' : 'bg-secondary'
                      )}
                    >
                      <Text style={{ fontSize: 32 }}>{companion.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground text-base font-sans-semibold">
                        {companion.name}
                      </Text>
                      <Text className="text-muted-foreground text-sm font-sans mt-0.5">
                        {companion.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                        <Text className="text-primary-foreground font-sans-bold" style={{ fontSize: 12 }}>
                          ✓
                        </Text>
                      </View>
                    )}
                  </GlassCard>
                </HapticPressable>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* CTA */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        className="px-6 pb-6"
      >
        <HapticPressable
          hapticStyle="medium"
          onPress={handleContinue}
          className="bg-primary w-full py-4 rounded-2xl items-center"
        >
          <Text className="text-primary-foreground text-base font-sans-bold">
            Continue
          </Text>
        </HapticPressable>
      </Animated.View>
    </SafeAreaView>
  );
}
