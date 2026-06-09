import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { getCompanionEmoji, type CompanionState } from '@/lib/companion-engine';
import { type CompanionType } from '@/lib/constants';

interface CompanionAvatarProps {
  type: CompanionType;
  state: CompanionState;
  evolutionStage: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * Main companion visual — shows emoji avatar with state-based animations.
 * Phase 1: Emoji-based. Phase 2: Swap to Rive/Lottie animations.
 */
export function CompanionAvatar({
  type,
  state,
  evolutionStage,
  size = 'large',
  className,
}: CompanionAvatarProps) {
  const emoji = getCompanionEmoji(type, evolutionStage);

  // Idle bobbing animation
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    // Reset
    scale.value = 1;
    opacity.value = 1;

    switch (state) {
      case 'idle':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        break;

      case 'happy':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-10, { duration: 300, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
          ),
          3,
          true
        );
        scale.value = withSequence(
          withTiming(1.15, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
        break;

      case 'celebrating':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-16, { duration: 200, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) })
          ),
          5,
          true
        );
        scale.value = withRepeat(
          withSequence(
            withTiming(1.2, { duration: 300 }),
            withTiming(1, { duration: 300 })
          ),
          3,
          true
        );
        break;

      case 'weakened':
        translateY.value = withTiming(4, { duration: 1000 });
        scale.value = withTiming(0.85, { duration: 1000 });
        opacity.value = withRepeat(
          withSequence(
            withTiming(0.5, { duration: 2000 }),
            withTiming(0.8, { duration: 2000 })
          ),
          -1,
          true
        );
        break;

      case 'defeated':
        translateY.value = withTiming(8, { duration: 500 });
        scale.value = withTiming(0.7, { duration: 500 });
        opacity.value = withTiming(0.4, { duration: 500 });
        break;
    }
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const sizeMap = {
    small: { container: 'w-16 h-16', emoji: 28 },
    medium: { container: 'w-24 h-24', emoji: 48 },
    large: { container: 'w-36 h-36', emoji: 72 },
  };

  const sizeConfig = sizeMap[size];

  const stateColorMap: Record<CompanionState, string> = {
    idle: 'border-primary/20',
    happy: 'border-success/30',
    celebrating: 'border-primary/50',
    weakened: 'border-destructive/30',
    defeated: 'border-destructive/50',
  };

  return (
    <View className={cn('items-center justify-center', className)}>
      <Animated.View
        style={animatedStyle}
        className={cn(
          sizeConfig.container,
          'items-center justify-center rounded-full border-2 bg-card',
          stateColorMap[state]
        )}
      >
        <Text style={{ fontSize: sizeConfig.emoji }}>{emoji}</Text>
      </Animated.View>

      {/* State indicator dot */}
      <View className="flex-row items-center mt-2 gap-1.5">
        <View
          className={cn(
            'w-2 h-2 rounded-full',
            state === 'idle' && 'bg-primary',
            state === 'happy' && 'bg-success',
            state === 'celebrating' && 'bg-primary',
            state === 'weakened' && 'bg-destructive/60',
            state === 'defeated' && 'bg-destructive'
          )}
        />
        <Text className="text-muted-foreground text-xs font-sans capitalize">
          {state === 'idle' ? 'content' : state}
        </Text>
      </View>
    </View>
  );
}
