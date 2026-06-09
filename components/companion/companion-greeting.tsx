import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeIn,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

interface CompanionGreetingProps {
  greeting: string;
  companionName: string;
  className?: string;
}

/**
 * Speech bubble with typing animation effect for the companion's daily greeting.
 */
export function CompanionGreeting({
  greeting,
  companionName,
  className,
}: CompanionGreetingProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    let index = 0;
    const interval = setInterval(() => {
      if (index < greeting.length) {
        setDisplayedText(greeting.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30); // 30ms per character for natural typing speed

    return () => clearInterval(interval);
  }, [greeting]);

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className={cn(
        'bg-card border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 mx-4',
        className
      )}
    >
      <Text className="text-muted-foreground text-xs font-sans-medium mb-1">
        {companionName} says
      </Text>
      <Text className="text-foreground text-sm font-sans leading-5">
        {displayedText}
        {isTyping && (
          <Text className="text-primary">▍</Text>
        )}
      </Text>
    </Animated.View>
  );
}
