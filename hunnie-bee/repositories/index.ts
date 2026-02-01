import { LocalRepository } from './localRepository';
import { IGoalRepository } from './types';

// Currently using local storage
// To switch to Supabase etc., only modify this file
export const repository: IGoalRepository = new LocalRepository();

export * from './types';
