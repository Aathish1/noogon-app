import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { THEME } from '@/lib/constants';
import { HomeAngle, Shield, Stars, User } from '@solar-icons/react-native/BoldDuotone';

/**
 * Tab icon component with active/inactive states.
 */
function TabIcon({
  Icon,
  label,
  focused,
}: {
  Icon: any;
  label: string;
  focused: boolean;
}) {
  return (
    <View className="items-center justify-center pt-2">
      <Icon
        size={24}
        color={focused ? THEME.primary : THEME.mutedForeground}
        style={{ opacity: focused ? 1 : 0.7 }}
      />
      <Text
        style={{
          fontSize: 10,
          marginTop: 4,
          color: focused ? THEME.primary : THEME.mutedForeground,
          fontFamily: focused ? 'Inter-SemiBold' : 'Inter',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: THEME.card,
          borderTopColor: THEME.border,
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 4,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={HomeAngle} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="shield"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Shield} label="Shield" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rituals"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Stars} label="Rituals" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={User} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
