import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';
import { getCurrentLevel } from '@/lib/xp-engine';

interface LevelBadgeProps {
  totalXP: number;
  size?: 'small' | 'medium';
  className?: string;
}

/**
 * Compact level badge showing current level emoji and name.
 */
export function LevelBadge({ totalXP, size = 'medium', className }: LevelBadgeProps) {
  const level = getCurrentLevel(totalXP);

  return (
    <View
      className={cn(
        'flex-row items-center bg-primary/10 border border-primary/20 rounded-full',
        size === 'small' ? 'px-2 py-0.5 gap-1' : 'px-3 py-1 gap-1.5',
        className
      )}
    >
      <Text style={{ fontSize: size === 'small' ? 12 : 16 }}>
        {level.emoji}
      </Text>
      <Text
        className={cn(
          'text-primary font-sans-semibold',
          size === 'small' ? 'text-xs' : 'text-sm'
        )}
      >
        {level.name}
      </Text>
    </View>
  );
}
