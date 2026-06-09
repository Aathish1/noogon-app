/**
 * Forge Theme Constants
 *
 * Design system: "Dark Minimal Forge"
 * - Dark-first with amber/forge-orange accent
 * - Card-based layouts with subtle borders
 * - Inter typography
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#F2F2F2',
    background: '#0A0A0F',
    tint: '#F59E0B',
    icon: '#8A8A96',
    tabIconDefault: '#8A8A96',
    tabIconSelected: '#F59E0B',
  },
  dark: {
    text: '#F2F2F2',
    background: '#0A0A0F',
    tint: '#F59E0B',
    icon: '#8A8A96',
    tabIconDefault: '#8A8A96',
    tabIconSelected: '#F59E0B',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'serif',
    rounded: 'Inter',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "Inter, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
