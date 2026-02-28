import * as Crypto from 'expo-crypto';
import { Goal, GoalRecord, GoalWithProgress } from '../types';
import { DEFAULTS } from '../constants';

// Generate UUID
export const generateId = (): string => Crypto.randomUUID();

// Get current time as ISO string
export const now = (): string => new Date().toISOString();

// Format date (YYYY.MM.DD)
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// Calculate days between two dates
export const daysBetween = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Calculate remaining days
export const getRemainingDays = (endDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

// Calculate goal progress
export const calculateProgress = (
  goal: Goal,
  records: GoalRecord[]
): GoalWithProgress => {
  const goalRecords = records.filter((r) => r.goalId === goal.id);
  const currentCount = goalRecords.length;
  const progressPercent = Math.round((currentCount / goal.targetCount) * 100);
  const remainingCount = Math.max(0, goal.targetCount - currentCount);
  const remainingDays = getRemainingDays(goal.endDate);

  return {
    ...goal,
    currentCount,
    progressPercent,
    remainingCount,
    remainingDays,
  };
};

// Calculate date one year from now
export const getOneYearLater = (startDate?: string): string => {
  const start = startDate ? new Date(startDate) : new Date();
  const end = new Date(start.getTime() + DEFAULTS.yearInMs);
  return end.toISOString();
};

// Calculate end of current year (Dec 31, 23:59:59)
export const getEndOfYear = (): string => {
  const now = new Date();
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  return endOfYear.toISOString();
};

// Check if date is today
export const isToday = (isoString: string): boolean => {
  const date = new Date(isoString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

// Check if within 24 hours
export const isWithin24Hours = (isoString: string): boolean => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs <= 24 * 60 * 60 * 1000;
};

// Insights utility functions
export const getWeekLabel = (date: Date): string => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const startMonth = startOfWeek.toLocaleDateString('en', { month: 'short' });
  const startDay = startOfWeek.getDate();
  const endDay = endOfWeek.getDate();

  return `${startMonth} ${startDay}-${endDay}`;
};

export const getWeekKey = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const calculateStreaks = (
  recordDates: string[]
): { currentStreak: number; bestStreak: number } => {
  if (recordDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const uniqueDays = [...new Set(
    recordDates.map((d) => {
      const date = new Date(d);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    })
  )].sort();

  const dayDates = uniqueDays.map((d) => {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m, day);
  });

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dayDates.length; i++) {
    const diffMs = dayDates[i].getTime() - dayDates[i - 1].getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  // Check if current streak is still active (last record was today or yesterday)
  const lastDate = dayDates[dayDates.length - 1];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffFromToday = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffFromToday > 1) {
    currentStreak = 0;
  }

  return { currentStreak, bestStreak };
};

// Bee mood types
export type BeeMood = 'thriving' | 'happy' | 'normal' | 'worried' | 'sad';

export interface BeeStatus {
  mood: BeeMood;
  score: number;
  emoji: string;
  message: string;
}

// Calculate expected progress for a single goal
const getExpectedProgress = (goal: Goal): number => {
  const start = new Date(goal.startDate);
  const end = new Date(goal.endDate);
  const today = new Date();

  const totalDays = Math.max(1, daysBetween(goal.startDate, goal.endDate));
  const elapsedDays = Math.max(0, daysBetween(goal.startDate, today.toISOString()));

  const elapsedRatio = Math.min(elapsedDays / totalDays, 1);
  return elapsedRatio * 100;
};

// Calculate overall diligence score across all goals
export const calculateDiligenceScore = (goals: GoalWithProgress[]): number => {
  if (goals.length === 0) return 0;

  let totalScore = 0;

  for (const goal of goals) {
    const expectedProgress = getExpectedProgress(goal);
    const actualProgress = goal.progressPercent;
    const diff = actualProgress - expectedProgress;
    totalScore += diff;
  }

  return Math.round(totalScore / goals.length);
};

// Get bee status based on diligence score
export const getBeeStatus = (goals: GoalWithProgress[]): BeeStatus => {
  if (goals.length === 0) {
    return {
      mood: 'normal',
      score: 0,
      emoji: '🐝',
      message: 'Create your first goal!',
    };
  }

  const score = calculateDiligenceScore(goals);

  if (score >= 20) {
    return {
      mood: 'thriving',
      score,
      emoji: '🐝✨',
      message: 'Your bee is thriving! Amazing work!',
    };
  }
  if (score >= 5) {
    return {
      mood: 'happy',
      score,
      emoji: '🐝😊',
      message: 'Keep up the great work!',
    };
  }
  if (score >= -5) {
    return {
      mood: 'normal',
      score,
      emoji: '🐝',
      message: "You're on track!",
    };
  }
  if (score >= -20) {
    return {
      mood: 'worried',
      score,
      emoji: '🐝😟',
      message: 'Your bee misses you...',
    };
  }
  return {
    mood: 'sad',
    score,
    emoji: '🐝😢',
    message: 'Your bee needs attention!',
  };
};
