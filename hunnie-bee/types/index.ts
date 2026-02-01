// Goal: 사용자가 설정한 연간 목표
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

// Record: 목표에 대한 개별 실천 기록
export interface GoalRecord {
  id: string;
  goalId: string;
  recordedAt: string; // ISO 8601
  note?: string;
}

// 앱 전체 상태
export interface AppState {
  goals: Goal[];
  records: GoalRecord[];
  onboardingCompleted: boolean;
}

// 목표 생성 입력
export interface CreateGoalInput {
  title: string;
  emoji?: string;
  targetCount?: number;
  startDate?: string;
  endDate?: string;
}

// 목표 업데이트 입력
export interface UpdateGoalInput {
  title?: string;
  emoji?: string;
  targetCount?: number;
}

// 목표와 진행 상황을 포함한 뷰 모델
export interface GoalWithProgress extends Goal {
  currentCount: number;
  progressPercent: number;
  remainingCount: number;
  remainingDays: number;
}
