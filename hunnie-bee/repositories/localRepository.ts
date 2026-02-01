import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, GoalRecord, CreateGoalInput, UpdateGoalInput } from '../types';
import { IGoalRepository } from './types';
import { generateId, now, getOneYearLater } from '../utils';
import { DEFAULTS } from '../constants';

const STORAGE_KEYS = {
  GOALS: '@hunnie-bee/goals',
  RECORDS: '@hunnie-bee/records',
} as const;

export class LocalRepository implements IGoalRepository {
  // Goals
  async getAllGoals(): Promise<Goal[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get goals:', error);
      return [];
    }
  }

  async getGoalById(id: string): Promise<Goal | null> {
    const goals = await this.getAllGoals();
    return goals.find((g) => g.id === id) || null;
  }

  async createGoal(input: CreateGoalInput): Promise<Goal> {
    const goals = await this.getAllGoals();
    const currentTime = now();
    const startDate = input.startDate || currentTime;

    const newGoal: Goal = {
      id: generateId(),
      title: input.title,
      emoji: input.emoji || DEFAULTS.emoji,
      targetCount: input.targetCount || DEFAULTS.targetCount,
      startDate,
      endDate: input.endDate || getOneYearLater(startDate),
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.GOALS,
      JSON.stringify([...goals, newGoal])
    );

    return newGoal;
  }

  async updateGoal(id: string, input: UpdateGoalInput): Promise<Goal | null> {
    const goals = await this.getAllGoals();
    const index = goals.findIndex((g) => g.id === id);

    if (index === -1) return null;

    const updatedGoal: Goal = {
      ...goals[index],
      ...input,
      updatedAt: now(),
    };

    goals[index] = updatedGoal;
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));

    return updatedGoal;
  }

  async deleteGoal(id: string): Promise<boolean> {
    try {
      const goals = await this.getAllGoals();
      const filteredGoals = goals.filter((g) => g.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filteredGoals));

      // Also delete related records
      const records = await this.getAllRecords();
      const filteredRecords = records.filter((r) => r.goalId !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(filteredRecords));

      return true;
    } catch (error) {
      console.error('Failed to delete goal:', error);
      return false;
    }
  }

  // Records
  async getAllRecords(): Promise<GoalRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get records:', error);
      return [];
    }
  }

  async getRecordsByGoalId(goalId: string): Promise<GoalRecord[]> {
    const records = await this.getAllRecords();
    return records.filter((r) => r.goalId === goalId);
  }

  async createRecord(goalId: string, note?: string): Promise<GoalRecord> {
    const records = await this.getAllRecords();

    const newRecord: GoalRecord = {
      id: generateId(),
      goalId,
      recordedAt: now(),
      note,
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.RECORDS,
      JSON.stringify([...records, newRecord])
    );

    return newRecord;
  }

  async deleteRecord(id: string): Promise<boolean> {
    try {
      const records = await this.getAllRecords();
      const filteredRecords = records.filter((r) => r.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(filteredRecords));
      return true;
    } catch (error) {
      console.error('Failed to delete record:', error);
      return false;
    }
  }
}
