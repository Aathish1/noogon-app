import React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface GlassCardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'glow';
}

/**
 * Card component with subtle glassmorphism effect.
 * Core container for all content sections in the app.
 */
export function GlassCard({
  variant = 'default',
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <View
      className={cn(
        'rounded-2xl border border-border/50 p-4',
        variant === 'default' && 'bg-card',
        variant === 'elevated' && 'bg-card border-border',
        variant === 'glow' && 'bg-card border-primary/20',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
