import React, { useEffect } from 'react';
import { Text, type TextProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedCounterProps extends TextProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatNumber?: boolean;
}

/**
 * Rolling number counter with smooth animation.
 * Used for XP, streak count, and other numeric displays.
 */
export function AnimatedCounter({
  value,
  duration = 800,
  prefix = '',
  suffix = '',
  formatNumber: shouldFormat = true,
  className,
  ...props
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const animatedValue = useSharedValue(value);

  useEffect(() => {
    const startVal = animatedValue.value;
    const diff = value - startVal;
    
    if (diff === 0) {
      setDisplayValue(value);
      return;
    }

    const steps = Math.min(Math.abs(diff), 30); // max 30 frames of text update
    const stepDuration = Math.max(duration / steps, 16);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = progress; // linear for display updates
      const current = Math.round(startVal + diff * eased);
      setDisplayValue(current);

      if (step >= steps) {
        clearInterval(interval);
        setDisplayValue(value);
      }
    }, stepDuration);

    animatedValue.value = value;

    return () => clearInterval(interval);
  }, [value, duration]);

  const formatted = shouldFormat
    ? displayValue.toLocaleString()
    : String(displayValue);

  return (
    <Text className={cn('text-foreground font-sans-bold', className)} {...props}>
      {prefix}
      {formatted}
      {suffix}
    </Text>
  );
}
