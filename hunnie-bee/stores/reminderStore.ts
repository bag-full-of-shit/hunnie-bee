import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoalReminder, ReminderSettings } from '../types';

const REMINDER_KEY = '@hunnie-bee/reminder-settings';

const getDefaultSettings = (): ReminderSettings => ({
  globalEnabled: false,
  reminders: [],
});

interface ReminderStore {
  settings: ReminderSettings;
  isLoading: boolean;

  loadSettings: () => Promise<void>;
  setGlobalEnabled: (enabled: boolean) => Promise<void>;
  setGoalReminder: (goalId: string, enabled: boolean, hour?: number, minute?: number) => Promise<void>;
  removeGoalReminder: (goalId: string) => Promise<void>;
  getReminderForGoal: (goalId: string) => GoalReminder | undefined;
}

const saveSettings = async (settings: ReminderSettings) => {
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
};

export const useReminderStore = create<ReminderStore>((set, get) => ({
  settings: getDefaultSettings(),
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const data = await AsyncStorage.getItem(REMINDER_KEY);
      if (data) {
        set({ settings: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Failed to load reminder settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setGlobalEnabled: async (enabled: boolean) => {
    const { settings } = get();
    const newSettings: ReminderSettings = { ...settings, globalEnabled: enabled };
    set({ settings: newSettings });
    await saveSettings(newSettings);
  },

  setGoalReminder: async (goalId: string, enabled: boolean, hour = 9, minute = 0) => {
    const { settings } = get();
    const existingIndex = settings.reminders.findIndex((r) => r.goalId === goalId);
    const newReminder: GoalReminder = { goalId, enabled, hour, minute };

    const newReminders = [...settings.reminders];
    if (existingIndex >= 0) {
      newReminders[existingIndex] = newReminder;
    } else {
      newReminders.push(newReminder);
    }

    const newSettings: ReminderSettings = { ...settings, reminders: newReminders };
    set({ settings: newSettings });
    await saveSettings(newSettings);
  },

  removeGoalReminder: async (goalId: string) => {
    const { settings } = get();
    const newSettings: ReminderSettings = {
      ...settings,
      reminders: settings.reminders.filter((r) => r.goalId !== goalId),
    };
    set({ settings: newSettings });
    await saveSettings(newSettings);
  },

  getReminderForGoal: (goalId: string) => {
    const { settings } = get();
    return settings.reminders.find((r) => r.goalId === goalId);
  },
}));
