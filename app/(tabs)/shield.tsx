import React, { useCallback } from 'react';
import { View, Text, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ShieldCheck, DangerCircle, DangerTriangle, Calendar } from '@solar-icons/react-native/BoldDuotone';

import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeader } from '@/components/shared/section-header';
import { HapticPressable } from '@/components/shared/haptic-pressable';
import { useShieldStore } from '@/stores/use-shield-store';
import { SHIELD_DEFAULTS, THEME } from '@/lib/constants';

/**
 * SHIELD — DNS filter, app limits, focus windows, doom scroll settings.
 */
export default function ShieldScreen() {
  const router = useRouter();
  const dnsEnabled = useShieldStore((s) => s.dnsEnabled);
  const toggleDNS = useShieldStore((s) => s.toggleDNS);
  const appLimits = useShieldStore((s) => s.appLimits);
  const focusWindows = useShieldStore((s) => s.focusWindows);
  const doomScrollEnabled = useShieldStore((s) => s.doomScrollEnabled);
  const toggleDoomScroll = useShieldStore((s) => s.toggleDoomScroll);

  const handleToggleDNS = useCallback(
    (value: boolean) => {
      if (!value) {
        // Show disconnect prompt before allowing disable
        Alert.alert(
          'Disable Shield?',
          'Your companion will weaken if Shield stays off for 12+ hours. Your streak requires Shield to be active all day.',
          [
            { text: 'Keep Active', style: 'cancel' },
            {
              text: 'Disable Anyway',
              style: 'destructive',
              onPress: () => toggleDNS(false),
            },
          ]
        );
      } else {
        toggleDNS(true);
      }
    },
    [toggleDNS]
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="px-5 pt-3 pb-4"
        >
          <Text className="text-foreground text-2xl font-sans-bold">
            Shield
          </Text>
          <Text className="text-muted-foreground text-sm font-sans">
            Your defense against doom scrolling
          </Text>
        </Animated.View>

        {/* DNS Filter Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="px-5 mb-4"
        >
          <GlassCard variant={dnsEnabled ? 'glow' : 'elevated'}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className={`w-14 h-14 rounded-2xl items-center justify-center ${
                    dnsEnabled ? 'bg-primary/15' : 'bg-destructive/15'
                  }`}
                >
                  {dnsEnabled ? (
                    <ShieldCheck size={28} color={THEME.primary} />
                  ) : (
                    <DangerCircle size={28} color={THEME.destructive} />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-base font-sans-semibold">
                    DNS Content Filter
                  </Text>
                  <Text className="text-muted-foreground text-xs font-sans mt-0.5">
                    {dnsEnabled
                      ? 'AdGuard Family DNS active'
                      : 'Network protection disabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={dnsEnabled}
                onValueChange={handleToggleDNS}
                trackColor={{ false: THEME.secondary, true: THEME.primary }}
                thumbColor="#ffffff"
              />
            </View>

            {dnsEnabled && (
              <View className="mt-3 pt-3 border-t border-border/30">
                <Text className="text-success text-xs font-sans">
                  ✓ Zero battery drain — system-level DNS filtering
                </Text>
              </View>
            )}
          </GlassCard>
        </Animated.View>

        {/* App Limits */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="px-5 mb-4"
        >
          <SectionHeader
            title="App Time Limits"
            subtitle="Daily caps for social apps"
          />
          <GlassCard>
            {SHIELD_DEFAULTS.defaultAppLimits.map((app, index) => {
              const limit = appLimits.find((a) => a.appId === app.appId);
              const usedMin = limit?.usedMinutes ?? 0;
              const dailyMin = limit?.dailyMinutes ?? app.dailyMinutes;
              const progress = Math.min(usedMin / dailyMin, 1);

              return (
                <View key={app.appId}>
                  {index > 0 && (
                    <View className="h-px bg-border/30 my-3" />
                  )}
                  <View className="flex-row items-center gap-3">
                    <Text style={{ fontSize: 24 }}>{app.emoji}</Text>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-foreground text-sm font-sans-medium">
                          {app.name}
                        </Text>
                        <Text className="text-muted-foreground text-xs font-sans">
                          {usedMin}/{dailyMin} min
                        </Text>
                      </View>
                      <View className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <View
                          className={`h-full rounded-full ${
                            progress >= 1
                              ? 'bg-destructive'
                              : progress > 0.7
                              ? 'bg-yellow-500'
                              : 'bg-primary'
                          }`}
                          style={{ width: `${progress * 100}%` }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </GlassCard>
        </Animated.View>

        {/* Doom Scroll Interruptor */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          className="px-5 mb-4"
        >
          <SectionHeader
            title="Doom Scroll Interruptor"
            subtitle="Break card after 90s of continuous scrolling"
          />
          <GlassCard>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <DangerTriangle size={28} color={THEME.primary} />
                <View>
                  <Text className="text-foreground text-sm font-sans-medium">
                    Auto-interrupt
                  </Text>
                  <Text className="text-muted-foreground text-xs font-sans">
                    20s break after 90s scrolling
                  </Text>
                </View>
              </View>
              <Switch
                value={doomScrollEnabled}
                onValueChange={toggleDoomScroll}
                trackColor={{ false: THEME.secondary, true: THEME.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Focus Windows */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          className="px-5"
        >
          <SectionHeader
            title="Focus Windows"
            subtitle="Auto-block during work hours"
            action={
              <HapticPressable
                className="bg-primary/15 px-3 py-1.5 rounded-lg"
              >
                <Text className="text-primary text-xs font-sans-semibold">
                  + Add
                </Text>
              </HapticPressable>
            }
          />
          <GlassCard>
            {focusWindows.length === 0 ? (
              <View className="items-center py-6">
                <Calendar size={40} color={THEME.mutedForeground} style={{ marginBottom: 8 }} />
                <Text className="text-muted-foreground text-sm font-sans text-center">
                  No focus windows set.{'\n'}Schedule auto-blocking during work hours.
                </Text>
              </View>
            ) : (
              focusWindows.map((fw) => (
                <View
                  key={fw.id}
                  className="flex-row items-center justify-between py-2"
                >
                  <Text className="text-foreground text-sm font-sans">
                    {fw.startTime} — {fw.endTime}
                  </Text>
                  <Switch
                    value={fw.enabled}
                    trackColor={{ false: THEME.secondary, true: THEME.primary }}
                    thumbColor="#ffffff"
                  />
                </View>
              ))
            )}
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
