import * as Crypto from 'expo-crypto';
import { Goal, GoalRecord, GoalWithProgress } from '../types';
import { DEFAULTS } from '../constants';

// UUID 생성
export const generateId = (): string => Crypto.randomUUID();

// 현재 시간을 ISO 문자열로
export const now = (): string => new Date().toISOString();

// 날짜 포맷팅 (YYYY.MM.DD)
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// 두 날짜 사이의 일수 계산
export const daysBetween = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 남은 일수 계산
export const getRemainingDays = (endDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

// 목표의 진행 상황 계산
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

// 1년 후 날짜 계산
export const getOneYearLater = (startDate?: string): string => {
  const start = startDate ? new Date(startDate) : new Date();
  const end = new Date(start.getTime() + DEFAULTS.yearInMs);
  return end.toISOString();
};

// 오늘 날짜인지 확인
export const isToday = (isoString: string): boolean => {
  const date = new Date(isoString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

// 24시간 이내인지 확인
export const isWithin24Hours = (isoString: string): boolean => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs <= 24 * 60 * 60 * 1000;
};
