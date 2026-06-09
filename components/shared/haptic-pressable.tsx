import * as React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticPressableProps extends PressableProps {
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'selection';
}

/**
 * Pressable wrapper that triggers haptic feedback on press.
 * Every interactive element should use this for tactile responsiveness.
 */
export function HapticPressable({
  hapticStyle = 'light',
  onPress,
  ...props
}: HapticPressableProps) {
  const handlePress = React.useCallback(
    (e: any) => {
      switch (hapticStyle) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'selection':
          Haptics.selectionAsync();
          break;
      }
      onPress?.(e);
    },
    [hapticStyle, onPress]
  );

  return <Pressable onPress={handlePress} {...props} />;
}
