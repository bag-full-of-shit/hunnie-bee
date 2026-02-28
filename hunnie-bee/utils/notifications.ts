import * as Notifications from 'expo-notifications';
import { Goal, GoalReminder } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

export const scheduleGoalReminder = async (
  goal: Goal,
  reminder: GoalReminder
): Promise<string | null> => {
  if (!reminder.enabled) return null;

  try {
    // Cancel existing notification for this goal first
    await cancelGoalReminder(goal.id);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${goal.emoji} ${goal.title}`,
        body: 'Time to work on your goal!',
        data: { goalId: goal.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.hour,
        minute: reminder.minute,
      },
      identifier: `goal-reminder-${goal.id}`,
    });

    return id;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
};

export const cancelGoalReminder = async (goalId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(`goal-reminder-${goalId}`);
  } catch (error) {
    // Notification may not exist, ignore
  }
};

export const cancelAllReminders = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
