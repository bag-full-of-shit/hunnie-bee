// 색상 팔레트
export const Colors = {
  // Honey Palette
  honey50: '#FFFBEB',
  honey100: '#FEF3C7',
  honey200: '#FDE68A',
  honey300: '#FCD34D',
  honey400: '#FBBF24',
  honey500: '#F59E0B',
  honey600: '#D97706',
  honey700: '#B45309',
  honey800: '#92400E',
  honey900: '#78350F',

  // Neutral
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Common
  white: '#FFFFFF',
  black: '#000000',
} as const;

// 간격 시스템
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

// 폰트 크기
export const FontSize = {
  display: 36,
  h1: 28,
  h2: 24,
  h3: 20,
  bodyL: 18,
  body: 16,
  bodyS: 14,
  caption: 12,
} as const;

// 기본 이모지 목록
export const DEFAULT_EMOJIS = [
  '📚', '🏃', '🎸', '✍️', '🧘', '💪',
  '🎨', '💻', '🌱', '☕', '📝', '🎵',
  '🚴', '🧠', '💼', '🏋️', '🥗', '💤',
  '📖', '🎯',
] as const;

// 기본값
export const DEFAULTS = {
  targetCount: 100,
  emoji: '🐝',
  yearInMs: 365 * 24 * 60 * 60 * 1000,
} as const;
