import { Goal, GoalRecord, CreateGoalInput, UpdateGoalInput } from '../types';

// Repository 인터페이스 - 추후 Supabase 등으로 교체 가능
export interface IGoalRepository {
  // Goals
  getAllGoals(): Promise<Goal[]>;
  getGoalById(id: string): Promise<Goal | null>;
  createGoal(input: CreateGoalInput): Promise<Goal>;
  updateGoal(id: string, input: UpdateGoalInput): Promise<Goal | null>;
  deleteGoal(id: string): Promise<boolean>;

  // Records
  getAllRecords(): Promise<GoalRecord[]>;
  getRecordsByGoalId(goalId: string): Promise<GoalRecord[]>;
  createRecord(goalId: string, note?: string): Promise<GoalRecord>;
  deleteRecord(id: string): Promise<boolean>;
}
