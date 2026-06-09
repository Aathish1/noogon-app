import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Notification Service — handles habit reminders, streak alerts, and companion greetings.
 */

// Configure how notifications behave when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Schedule a daily habit reminder at a specific time.
 */
export async function scheduleHabitReminder(params: {
  habitId: string;
  habitName: string;
  emoji: string;
  hour: number;
  minute: number;
}): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${params.emoji} Time for: ${params.habitName}`,
        body: "Your ritual is waiting. Let's keep the streak alive.",
        data: { type: 'habit_reminder', habitId: params.habitId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: params.hour,
        minute: params.minute,
      },
    });
    return id;
  } catch (error) {
    console.error('[Notifications] Failed to schedule habit reminder:', error);
    return null;
  }
}

/**
 * Schedule an evening streak warning if habits aren't done.
 */
export async function scheduleStreakWarning(): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Streak at risk!',
        body: "You haven't completed enough habits today. Open Forge to keep your streak alive.",
        data: { type: 'streak_warning' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21, // 9 PM
        minute: 0,
      },
    });
    return id;
  } catch (error) {
    console.error('[Notifications] Failed to schedule streak warning:', error);
    return null;
  }
}

/**
 * Schedule a morning companion greeting notification.
 */
export async function scheduleCompanionGreeting(params: {
  greeting: string;
  companionName: string;
}): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${params.companionName} says good morning!`,
        body: params.greeting,
        data: { type: 'companion_greeting' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 7, // 7 AM
        minute: 0,
      },
    });
    return id;
  } catch (error) {
    console.error('[Notifications] Failed to schedule companion greeting:', error);
    return null;
  }
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Cancel a specific notification by ID.
 */
export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}
