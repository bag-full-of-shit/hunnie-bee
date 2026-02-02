import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BeeState, BeeStatusInfo } from '../types';

const BEE_STORAGE_KEY = '@hunnie-bee/bee-state';

// Constants for bee mechanics
const BOND_DECAY_PER_DAY = 15;
const BOND_PER_HONEY = 20;
const BOND_PER_EXCUSE = 15;
const EXCUSE_HONEY_COST = 1;

// Default initial state
const getDefaultBeeState = (): BeeState => {
  const now = new Date().toISOString();
  return {
    name: 'Honey',
    bond: 50, // Start at neutral
    honeyCount: 3, // Start with 3 honey
    lastInteractionAt: now,
    lastCheckedAt: now,
  };
};

interface BeeStore {
  bee: BeeState;
  isLoading: boolean;

  // Actions
  loadBeeState: () => Promise<void>;
  feedBee: () => Promise<boolean>;
  makeExcuse: (excuse: string) => Promise<boolean>;
  earnHoney: (amount?: number) => Promise<void>;
  checkAndApplyDecay: () => Promise<void>;
  renameBee: (name: string) => Promise<void>;

  // Selectors
  getBeeStatus: () => BeeStatusInfo;
  isGrumpy: () => boolean;
}

// Calculate days between two dates
const getDaysDiff = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Grumpy/upset messages (bee won't communicate properly)
const GRUMPY_MESSAGES = [
  "...",
  "Hmph.",
  "Whatever.",
  "I don't want to talk.",
  "...*buzz*",
];

// Upset messages (very low bond)
const UPSET_MESSAGES = [
  "Did you forget about me...?",
  "I don't even know anymore...",
  "...",
];

// Happy messages (bee communicates well)
const HAPPY_MESSAGES = [
  "Let's do our best today!",
  "I'm so happy you're here!",
  "We make a great team!",
  "Today feels like a good day!",
];

// Content messages (moderate bond)
const CONTENT_MESSAGES = [
  "How's your day going?",
  "Nice to see you!",
  "What should we do today?",
];

const getRandomMessage = (messages: string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};

export const useBeeStore = create<BeeStore>((set, get) => ({
  bee: getDefaultBeeState(),
  isLoading: false,

  loadBeeState: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(BEE_STORAGE_KEY);
      if (stored) {
        const beeState = JSON.parse(stored) as BeeState;
        // Migration: if old format (has fullness/affection), convert to new
        if ('fullness' in beeState && !('bond' in beeState)) {
          const oldState = beeState as any;
          const migratedState: BeeState = {
            name: oldState.name || 'Honey',
            bond: Math.round((oldState.fullness + oldState.affection) / 2),
            honeyCount: oldState.honeyCount || 3,
            lastInteractionAt: oldState.lastInteractionAt || new Date().toISOString(),
            lastCheckedAt: oldState.lastCheckedAt || new Date().toISOString(),
          };
          set({ bee: migratedState });
          await AsyncStorage.setItem(BEE_STORAGE_KEY, JSON.stringify(migratedState));
        } else {
          set({ bee: beeState });
        }
        // Apply decay after loading
        await get().checkAndApplyDecay();
      } else {
        // First time - save default state
        const defaultState = getDefaultBeeState();
        await AsyncStorage.setItem(BEE_STORAGE_KEY, JSON.stringify(defaultState));
        set({ bee: defaultState });
      }
    } catch (error) {
      console.error('Failed to load bee state:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  feedBee: async () => {
    const { bee } = get();
    if (bee.honeyCount <= 0) {
      return false; // No honey to feed
    }

    const now = new Date().toISOString();
    const newBond = Math.min(100, bee.bond + BOND_PER_HONEY);
    const newState: BeeState = {
      ...bee,
      bond: newBond,
      honeyCount: bee.honeyCount - 1,
      lastInteractionAt: now,
    };

    set({ bee: newState });
    await AsyncStorage.setItem(BEE_STORAGE_KEY, JSON.stringify(newState));
    return true;
  },

  makeExcuse: async (excuse: string) => {
    const { bee, isGrumpy } = get();

    // Can only make excuse when grumpy
    if (!isGrumpy()) {
      return false;
    }

    // Need honey to make excuse
    if (bee.honeyCount < EXCUSE_HONEY_COST) {
      return false;
    }

    const now = new Date().toISOString();
    const newBond = Math.min(100, bee.bond + BOND_PER_EXCUSE);
    const newState: BeeState = {
      ...bee,
      bond: newBond,
      honeyCount: bee.honeyCount - EXCUSE_HONEY_COST,
      lastInteractionAt: now,
    };

    set({ bee: newState });
    await AsyncStorage.setItem(BEE_STORAGE_KEY, JSON.stringify(newState));
    return true;
  },

  earnHoney: async (amount = 1) => {
    const { bee } = get();
    const now = new Date().toISOString();
    const newState: BeeState = {
      ...bee,
      honeyCount: bee.honeyCount + amount,
      lastInteractionAt: now, // Completing goals counts as interaction
    };

    set({ bee: newState });
    await AsyncStorage.setItem(BEE_STORAGE_KEY, JSON.stringify(newState));
  },

  checkAndApplyDecay: async () => {
    const { bee } = get();
    const now = new Date().toISOString();
    const daysSinceCheck = getDaysDiff(bee.lastCheckedAt, now);

    if (daysSinceCheck <= 0) {
      return; // Already checked today
    }

    // Apply decay for each day missed
    const bondDecay = daysSinceCheck * BOND_DECAY_PER_DAY;

    const newState: BeeState = {
      ...bee,
      bond: Math.max(0, bee.bond - bondDecay),
      lastCheckedAt: now,
    };

    set({ bee: newState });
    await AsyncStorage.setItem(BEE_STORAGE_KEY, JSON.stringify(newState));
  },

  renameBee: async (name: string) => {
    const { bee } = get();
    const trimmedName = name.trim().slice(0, 20); // Limit to 20 chars
    if (!trimmedName) return;

    const newState: BeeState = {
      ...bee,
      name: trimmedName,
    };

    set({ bee: newState });
    await AsyncStorage.setItem(BEE_STORAGE_KEY, JSON.stringify(newState));
  },

  getBeeStatus: (): BeeStatusInfo => {
    const { bee } = get();

    // Upset: very low bond (0-19)
    if (bee.bond < 20) {
      return {
        mood: 'upset',
        emoji: '🐝😢',
        message: getRandomMessage(UPSET_MESSAGES),
        canChat: false,
      };
    }

    // Grumpy: low bond (20-39)
    if (bee.bond < 40) {
      return {
        mood: 'grumpy',
        emoji: '🐝😤',
        message: getRandomMessage(GRUMPY_MESSAGES),
        canChat: false,
      };
    }

    // Content: moderate bond (40-69)
    if (bee.bond < 70) {
      return {
        mood: 'content',
        emoji: '🐝',
        message: getRandomMessage(CONTENT_MESSAGES),
        canChat: true,
      };
    }

    // Happy: high bond (70+)
    return {
      mood: 'happy',
      emoji: '🐝✨',
      message: getRandomMessage(HAPPY_MESSAGES),
      canChat: true,
    };
  },

  isGrumpy: (): boolean => {
    const { bee } = get();
    return bee.bond < 40;
  },
}));
