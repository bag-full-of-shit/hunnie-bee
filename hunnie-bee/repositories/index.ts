import { LocalRepository } from './localRepository';
import { SupabaseRepository } from './supabaseRepository';
import { IRepository } from './types';

// Repository instances
const localRepository = new LocalRepository();
const supabaseRepository = new SupabaseRepository();

// Current repository reference (can be switched at runtime)
let currentRepository: IRepository = localRepository;

// Get the current repository
export const getRepository = (): IRepository => currentRepository;

// Switch to Supabase repository (call when user logs in)
export const useSupabaseRepository = (): void => {
  currentRepository = supabaseRepository;
};

// Switch to local repository (call when user logs out or for offline mode)
export const useLocalRepository = (): void => {
  currentRepository = localRepository;
};

// Check if using Supabase
export const isUsingSupabase = (): boolean => {
  return currentRepository === supabaseRepository;
};

// Default export for backward compatibility
// Uses a Proxy to always delegate to the current repository
export const repository: IRepository = new Proxy({} as IRepository, {
  get(_, prop) {
    return (currentRepository as any)[prop];
  },
});

export * from './types';
