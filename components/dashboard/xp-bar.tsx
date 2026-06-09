import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { getCurrentLevel, getNextLevel, getProgressToNextLevel, getXPToNextLevel } from '@/lib/xp-engine';

interface XPBarProps {
  totalXP: number;
  className?: string;
}

/**
 * Horizontal XP progress bar with level info.
 * Shows current level, XP progress, and remaining XP to next level.
 */
export function XPBar({ totalXP, className }: XPBarProps) {
  const level = getCurrentLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);
  const progress = getProgressToNextLevel(totalXP);
  const xpRemaining = getXPToNextLevel(totalXP);

  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
  }));

  return (
    <View className={cn('gap-2', className)}>
      {/* Level info row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Text style={{ fontSize: 18 }}>{level.emoji}</Text>
          <Text className="text-foreground text-sm font-sans-semibold">
            {level.name}
          </Text>
          <Text className="text-muted-foreground text-xs font-sans">
            Lv.{level.level}
          </Text>
        </View>
        <Text className="text-muted-foreground text-xs font-sans">
          {totalXP.toLocaleString()} XP
        </Text>
      </View>

      {/* Progress bar */}
      <View className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <Animated.View
          style={barStyle}
          className="h-full bg-primary rounded-full"
        />
      </View>

      {/* Next level info */}
      {nextLevel && (
        <View className="flex-row items-center justify-between">
          <Text className="text-muted-foreground text-xs font-sans">
            {xpRemaining.toLocaleString()} XP to {nextLevel.name}
          </Text>
          <Text className="text-muted-foreground text-xs font-sans">
            {nextLevel.emoji}
          </Text>
        </View>
      )}
    </View>
  );
}
