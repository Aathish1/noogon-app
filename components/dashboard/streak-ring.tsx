import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface StreakRingProps {
  currentStreak: number;
  /** Next milestone to show progress toward */
  nextMilestone: number;
  isActive: boolean;
  className?: string;
}

/**
 * Circular progress ring showing streak progress toward next milestone.
 * Amber when active, red when at risk. Streak count displayed in center.
 */
export function StreakRing({
  currentStreak,
  nextMilestone,
  isActive,
  className,
}: StreakRingProps) {
  const SIZE = 160;
  const STROKE_WIDTH = 8;
  const RADIUS = (SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const progress = nextMilestone > 0 ? currentStreak / nextMilestone : 1;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(Math.min(progress, 1), {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - animatedProgress.value),
  }));

  const activeColor = isActive ? '#F59E0B' : '#DC2626';
  const trackColor = '#272730';

  return (
    <View className={cn('items-center justify-center', className)}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={trackColor}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {/* Progress */}
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={activeColor}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>

      {/* Center content */}
      <View className="absolute items-center">
        <Text
          className="text-foreground font-sans-bold"
          style={{ fontSize: 40 }}
        >
          {currentStreak}
        </Text>
        <Text className="text-muted-foreground text-xs font-sans mt--1">
          day{currentStreak !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
}
