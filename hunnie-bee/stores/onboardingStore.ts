import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@hunnie-bee/onboarding-completed';

interface OnboardingStore {
  isCompleted: boolean;
  isLoading: boolean;
  loadOnboardingState: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  isCompleted: false,
  isLoading: true,

  loadOnboardingState: async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      set({ isCompleted: value === 'true', isLoading: false });
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
      set({ isCompleted: false, isLoading: false });
    }
  },

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      set({ isCompleted: true });
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  },
}));
