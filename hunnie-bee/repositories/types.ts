import { Goal, GoalRecord, CreateGoalInput, UpdateGoalInput } from '../types';

// Repository interface - can be replaced with Supabase etc. later
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
