import { create } from 'zustand';
import { Goal, GoalRecord, GoalWithProgress, CreateGoalInput, UpdateGoalInput, InsightsData } from '../types';
import { repository } from '../repositories';
import { calculateProgress, getWeekKey, getWeekLabel, calculateStreaks } from '../utils';

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
  getInsightsData: () => InsightsData;
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

  getInsightsData: (): InsightsData => {
    const { goals, records } = get();

    // Weekly trends (last 8 weeks)
    const now = new Date();
    const weeklyMap: Record<string, { label: string; count: number }> = {};

    for (let i = 7; i >= 0; i--) {
      const weekDate = new Date(now);
      weekDate.setDate(weekDate.getDate() - i * 7);
      const key = getWeekKey(weekDate);
      weeklyMap[key] = { label: getWeekLabel(weekDate), count: 0 };
    }

    records.forEach((record) => {
      const date = new Date(record.recordedAt);
      const key = getWeekKey(date);
      if (weeklyMap[key]) {
        weeklyMap[key].count++;
      }
    });

    const weeklyTrends = Object.values(weeklyMap).map((w) => ({
      weekLabel: w.label,
      completionCount: w.count,
    }));

    // Day of week activity
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCounts = new Array(7).fill(0);
    records.forEach((record) => {
      const day = new Date(record.recordedAt).getDay();
      dayCounts[day]++;
    });
    const dayOfWeekActivity = dayLabels.map((label, i) => ({
      day: i,
      label,
      count: dayCounts[i],
    }));

    // Goal streaks
    const goalStreaks = goals.map((goal) => {
      const goalRecords = records
        .filter((r) => r.goalId === goal.id)
        .map((r) => r.recordedAt);
      const { currentStreak, bestStreak } = calculateStreaks(goalRecords);
      return {
        goalId: goal.id,
        goalTitle: goal.title,
        goalEmoji: goal.emoji,
        currentStreak,
        bestStreak,
      };
    }).filter((s) => s.bestStreak > 0)
      .sort((a, b) => b.bestStreak - a.bestStreak);

    // Overall completion rate
    const totalTarget = goals.reduce((sum, g) => sum + g.targetCount, 0);
    const totalCurrent = records.length;
    const overallCompletionRate = totalTarget > 0
      ? Math.round((totalCurrent / totalTarget) * 100)
      : 0;

    return {
      weeklyTrends,
      dayOfWeekActivity,
      goalStreaks,
      overallCompletionRate,
      totalRecords: records.length,
      activeGoalCount: goals.length,
    };
  },
}));
