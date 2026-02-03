import { supabase } from '../lib/supabase';
import { Goal, GoalRecord, CreateGoalInput, UpdateGoalInput, BeeState } from '../types';
import { IRepository } from './types';
import { getOneYearLater } from '../utils';
import { DEFAULTS } from '../constants';

// Helper: Map DB snake_case to TypeScript camelCase
const mapGoalFromDb = (row: any): Goal => ({
  id: row.id,
  title: row.title,
  emoji: row.emoji,
  targetCount: row.target_count,
  startDate: row.start_date,
  endDate: row.end_date,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapRecordFromDb = (row: any): GoalRecord => ({
  id: row.id,
  goalId: row.goal_id,
  recordedAt: row.recorded_at,
  note: row.note,
});

const mapBeeStateFromDb = (row: any): BeeState => ({
  name: row.name,
  bond: row.bond,
  honeyCount: row.honey_count,
  lastInteractionAt: row.last_interaction_at,
  lastCheckedAt: row.last_checked_at,
});

export class SupabaseRepository implements IRepository {
  // Goals
  async getAllGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get goals:', error);
      throw error;
    }

    return (data || []).map(mapGoalFromDb);
  }

  async getGoalById(id: string): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows
      console.error('Failed to get goal:', error);
      throw error;
    }

    return data ? mapGoalFromDb(data) : null;
  }

  async createGoal(input: CreateGoalInput): Promise<Goal> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const now = new Date().toISOString();
    const startDate = input.startDate || now;

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: userData.user.id,
        title: input.title,
        emoji: input.emoji || DEFAULTS.emoji,
        target_count: input.targetCount || DEFAULTS.targetCount,
        start_date: startDate,
        end_date: input.endDate || getOneYearLater(startDate),
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create goal:', error);
      throw error;
    }

    return mapGoalFromDb(data);
  }

  async updateGoal(id: string, input: UpdateGoalInput): Promise<Goal | null> {
    const updateData: Record<string, any> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.emoji !== undefined) updateData.emoji = input.emoji;
    if (input.targetCount !== undefined) updateData.target_count = input.targetCount;

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows
      console.error('Failed to update goal:', error);
      throw error;
    }

    return data ? mapGoalFromDb(data) : null;
  }

  async deleteGoal(id: string): Promise<boolean> {
    // Records will be cascade deleted due to FK constraint
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete goal:', error);
      return false;
    }

    return true;
  }

  // Records
  async getAllRecords(): Promise<GoalRecord[]> {
    const { data, error } = await supabase
      .from('goal_records')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (error) {
      console.error('Failed to get records:', error);
      throw error;
    }

    return (data || []).map(mapRecordFromDb);
  }

  async getRecordsByGoalId(goalId: string): Promise<GoalRecord[]> {
    const { data, error } = await supabase
      .from('goal_records')
      .select('*')
      .eq('goal_id', goalId)
      .order('recorded_at', { ascending: false });

    if (error) {
      console.error('Failed to get records:', error);
      throw error;
    }

    return (data || []).map(mapRecordFromDb);
  }

  async createRecord(goalId: string, note?: string): Promise<GoalRecord> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('goal_records')
      .insert({
        user_id: userData.user.id,
        goal_id: goalId,
        note,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create record:', error);
      throw error;
    }

    return mapRecordFromDb(data);
  }

  async deleteRecord(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('goal_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete record:', error);
      return false;
    }

    return true;
  }

  // Bee State
  async getBeeState(): Promise<BeeState | null> {
    const { data, error } = await supabase
      .from('bee_states')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows
      console.error('Failed to get bee state:', error);
      throw error;
    }

    return data ? mapBeeStateFromDb(data) : null;
  }

  async saveBeeState(state: BeeState): Promise<BeeState> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    // Upsert: insert if not exists, update if exists
    const { data, error } = await supabase
      .from('bee_states')
      .upsert({
        user_id: userData.user.id,
        name: state.name,
        bond: state.bond,
        honey_count: state.honeyCount,
        last_interaction_at: state.lastInteractionAt,
        last_checked_at: state.lastCheckedAt,
      }, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save bee state:', error);
      throw error;
    }

    return mapBeeStateFromDb(data);
  }
}
