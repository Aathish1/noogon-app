import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/shared/glass-card';
import { useHabitStore } from '@/stores/use-habit-store';
import { useOnboardingStore } from '@/stores/use-onboarding-store';
import { HABIT_TEMPLATES } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Set goals — import a habit template or skip to build custom.
 */
export default function SetGoalsScreen() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const importHabits = useHabitStore((s) => s.importHabits);
  const setGoalsSet = useOnboardingStore((s) => s.setGoalsSet);

  const handleContinue = () => {
    if (selectedTemplate) {
      const template = HABIT_TEMPLATES.find((t) => t.id === selectedTemplate);
      if (template) {
        importHabits(template.habits);
      }
    }
    setGoalsSet();
    router.push('/(onboarding)/enable-shield');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="px-6 pt-6 pb-4"
        >
          <Text className="text-muted-foreground text-sm font-sans mb-1">
            Step 3 of 4
          </Text>
          <Text className="text-foreground text-2xl font-sans-bold">
            Set Your Rituals
          </Text>
          <Text className="text-muted-foreground text-sm font-sans mt-1">
            Pick a template to start, or build your own later.
          </Text>
        </Animated.View>

        {/* Templates */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 12, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {HABIT_TEMPLATES.map((template, index) => {
            const isSelected = selectedTemplate === template.id;
            return (
              <Animated.View
                key={template.id}
                entering={FadeInDown.delay(200 + index * 80).duration(400)}
              >
                <Pressable
                  onPress={() => {
                    setSelectedTemplate(
                      isSelected ? null : template.id
                    );
                  }}
                >
                  <GlassCard
                    variant={isSelected ? 'glow' : 'default'}
                    className={cn(isSelected && 'border-primary/40')}
                  >
                    <View className="flex-row items-center gap-3 mb-3">
                      <Text style={{ fontSize: 28 }}>{template.emoji}</Text>
                      <View className="flex-1">
                        <Text className="text-foreground text-base font-sans-semibold">
                          {template.name}
                        </Text>
                        <Text className="text-muted-foreground text-xs font-sans">
                          {template.description}
                        </Text>
                      </View>
                      {isSelected && (
                        <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                          <Text
                            className="text-primary-foreground font-sans-bold"
                            style={{ fontSize: 12 }}
                          >
                            ✓
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Habit preview */}
                    <View className="flex-row flex-wrap gap-1.5">
                      {template.habits.map((habit, i) => (
                        <View
                          key={i}
                          className="flex-row items-center bg-secondary/50 rounded-lg px-2 py-1 gap-1"
                        >
                          <Text style={{ fontSize: 12 }}>{habit.emoji}</Text>
                          <Text className="text-muted-foreground text-xs font-sans">
                            {habit.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </GlassCard>
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>

      {/* CTA */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        className="px-6 pb-6 gap-3"
      >
        <Pressable
          onPress={handleContinue}
          className="bg-primary w-full py-4 rounded-2xl items-center"
        >
          <Text className="text-primary-foreground text-base font-sans-bold">
            {selectedTemplate ? 'Import & Continue' : 'Skip for Now'}
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
