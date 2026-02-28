// Goal: User's annual goal
export interface Goal {
  id: string;
  title: string;
  emoji: string;
  targetCount: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
}

// Record: Individual completion record for a goal
export interface GoalRecord {
  id: string;
  goalId: string;
  recordedAt: string; // ISO 8601
  note?: string;
}

// App state
export interface AppState {
  goals: Goal[];
  records: GoalRecord[];
  onboardingCompleted: boolean;
}

// Goal creation input
export interface CreateGoalInput {
  title: string;
  emoji?: string;
  targetCount?: number;
  startDate?: string;
  endDate?: string;
}

// Goal update input
export interface UpdateGoalInput {
  title?: string;
  emoji?: string;
  targetCount?: number;
}

// View model with goal and progress
export interface GoalWithProgress extends Goal {
  currentCount: number;
  progressPercent: number;
  remainingCount: number;
  remainingDays: number;
}

// Bee interaction state (simplified with single "bond" value)
export interface BeeState {
  name: string;
  bond: number; // 0-100, represents relationship/trust level
  honeyCount: number;
  totalHoneyEarned: number; // Lifetime honey earned (for evolution system)
  lastInteractionAt: string; // ISO 8601
  lastCheckedAt: string; // ISO 8601 - for daily decay calculation
}

// Bee evolution level
export interface BeeLevel {
  level: number;
  name: string;
  emoji: string;
  minHoney: number;
  personality: string[];
}

// Bee mood status
export type BeeMood = 'happy' | 'content' | 'grumpy' | 'upset';

export interface BeeStatusInfo {
  mood: BeeMood;
  emoji: string;
  message: string;
  canChat: boolean; // true if bee is willing to communicate
}

// Insights types
export interface WeeklyTrend {
  weekLabel: string;
  completionCount: number;
}

export interface DayOfWeekActivity {
  day: number; // 0=Sun, 6=Sat
  label: string;
  count: number;
}

export interface GoalStreak {
  goalId: string;
  goalTitle: string;
  goalEmoji: string;
  currentStreak: number;
  bestStreak: number;
}

export interface InsightsData {
  weeklyTrends: WeeklyTrend[];
  dayOfWeekActivity: DayOfWeekActivity[];
  goalStreaks: GoalStreak[];
  overallCompletionRate: number;
  totalRecords: number;
  activeGoalCount: number;
}

// Reminder types
export interface GoalReminder {
  goalId: string;
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface ReminderSettings {
  globalEnabled: boolean;
  reminders: GoalReminder[];
}
