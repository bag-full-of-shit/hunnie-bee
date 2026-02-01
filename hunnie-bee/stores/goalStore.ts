import { create } from 'zustand';
import { Goal, GoalRecord, GoalWithProgress, CreateGoalInput, UpdateGoalInput } from '../types';
import { repository } from '../repositories';
import { calculateProgress } from '../utils';

interface GoalState {
  goals: Goal[];
  records: GoalRecord[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadData: () => Promise<void>;
  createGoal: (input: CreateGoalInput) => Promise<Goal>;
  updateGoal: (id: string, input: UpdateGoalInput) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addRecord: (goalId: string, note?: string) => Promise<GoalRecord>;
  deleteRecord: (id: string) => Promise<void>;

  // Selectors
  getGoalWithProgress: (goalId: string) => GoalWithProgress | null;
  getAllGoalsWithProgress: () => GoalWithProgress[];
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  records: [],
  isLoading: false,
  error: null,

  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [goals, records] = await Promise.all([
        repository.getAllGoals(),
        repository.getAllRecords(),
      ]);
      set({ goals, records, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load data', isLoading: false });
    }
  },

  createGoal: async (input: CreateGoalInput) => {
    const newGoal = await repository.createGoal(input);
    set((state) => ({ goals: [...state.goals, newGoal] }));
    return newGoal;
  },

  updateGoal: async (id: string, input: UpdateGoalInput) => {
    const updatedGoal = await repository.updateGoal(id, input);
    if (updatedGoal) {
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updatedGoal : g)),
      }));
    }
  },

  deleteGoal: async (id: string) => {
    await repository.deleteGoal(id);
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
      records: state.records.filter((r) => r.goalId !== id),
    }));
  },

  addRecord: async (goalId: string, note?: string) => {
    const newRecord = await repository.createRecord(goalId, note);
    set((state) => ({ records: [...state.records, newRecord] }));
    return newRecord;
  },

  deleteRecord: async (id: string) => {
    await repository.deleteRecord(id);
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    }));
  },

  getGoalWithProgress: (goalId: string) => {
    const { goals, records } = get();
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return null;
    return calculateProgress(goal, records);
  },

  getAllGoalsWithProgress: () => {
    const { goals, records } = get();
    return goals.map((goal) => calculateProgress(goal, records));
  },
}));
