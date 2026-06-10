import React from 'react';
import { Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { THEME } from '@/lib/constants';
import { HomeAngle, Shield, Stars, User } from '@solar-icons/react-native/BoldDuotone';

/**
 * Renders a standalone tab icon (no label — label is handled by tabBarLabel).
 */
function renderTabIcon(Icon: any, focused: boolean) {
  return (
    <Icon
      size={24}
      color={focused ? THEME.primary : THEME.mutedForeground}
      style={{ opacity: focused ? 1 : 0.7 }}
    />
  );
}

/**
 * Renders a standalone tab label (no icon — icon is handled by tabBarIcon).
 */
function renderTabLabel(label: string, focused: boolean) {
  return (
    <Text
      numberOfLines={1}
      style={{
        fontSize: 10,
        color: focused ? THEME.primary : THEME.mutedForeground,
        fontFamily: focused ? 'Inter-SemiBold' : 'Inter',
        textAlign: 'center',
      }}
    >
      {label}
    </Text>
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
        tabBarShowLabel: true,
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(HomeAngle, focused),
          tabBarLabel: ({ focused }) => renderTabLabel('Home', focused),
        }}
      />
      <Tabs.Screen
        name="shield"
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(Shield, focused),
          tabBarLabel: ({ focused }) => renderTabLabel('Shield', focused),
        }}
      />
      <Tabs.Screen
        name="rituals"
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(Stars, focused),
          tabBarLabel: ({ focused }) => renderTabLabel('Rituals', focused),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(User, focused),
          tabBarLabel: ({ focused }) => renderTabLabel('Profile', focused),
        }}
      />
    </Tabs>
  );
}
