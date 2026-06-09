import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments, useNavigationContainerRef } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { PortalHost } from '@rn-primitives/portal';
import 'react-native-reanimated';

import '../global.css';

import { useOnboardingStore } from '@/stores/use-onboarding-store';

// Prevent splash from hiding until fonts load
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function useProtectedRoute(isLoaded: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const completed = useOnboardingStore((s) => s.completed);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (!isLoaded || !navigationRef.current) return;

    const inOnboarding = segments[0] === '(onboarding)';

    if (!completed && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (completed && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [completed, segments, isLoaded, navigationRef.current]);
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useProtectedRoute(fontsLoaded);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0F' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen
          name="(modals)/habit-editor"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="(modals)/disconnect-prompt"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      <StatusBar style="light" />
      <PortalHost />
    </View>
  );
}
