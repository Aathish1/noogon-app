import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface SectionHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/**
 * Consistent section header used throughout the app.
 * Title on left, optional action button on right.
 */
export function SectionHeader({
  title,
  subtitle,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <View
      className={cn('flex-row items-center justify-between px-1 mb-3', className)}
      {...props}
    >
      <View className="flex-1">
        <Text className="text-foreground text-lg font-sans-semibold">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-muted-foreground text-sm font-sans mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {action && <View>{action}</View>}
    </View>
  );
}
