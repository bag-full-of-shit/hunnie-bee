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
