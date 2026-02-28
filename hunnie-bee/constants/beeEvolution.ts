import { BeeLevel } from '../types';

export const BEE_LEVELS: BeeLevel[] = [
  {
    level: 1,
    name: 'Egg',
    emoji: '🥚',
    minHoney: 0,
    personality: ['...', 'Hmm?', '*crack*', 'Zzz...'],
  },
  {
    level: 2,
    name: 'Baby Bee',
    emoji: '🐛',
    minHoney: 10,
    personality: ['Bzz!', "I'm learning!", 'More honey please!', 'So exciting!'],
  },
  {
    level: 3,
    name: 'Worker Bee',
    emoji: '🐝',
    minHoney: 30,
    personality: ["Let's work hard today!", 'Buzz buzz!', 'I believe in you!', 'Together we can do it!'],
  },
  {
    level: 4,
    name: 'Queen Bee',
    emoji: '👑🐝',
    minHoney: 60,
    personality: ["You're doing amazing!", 'We rule this hive!', 'Nothing can stop us!', 'Royal effort!'],
  },
  {
    level: 5,
    name: 'Golden Bee',
    emoji: '✨🐝✨',
    minHoney: 100,
    personality: ["We've achieved greatness!", 'Golden days ahead!', 'Legend status!', 'Unstoppable!'],
  },
];

export const getLevelForHoney = (totalHoneyEarned: number): BeeLevel => {
  for (let i = BEE_LEVELS.length - 1; i >= 0; i--) {
    if (totalHoneyEarned >= BEE_LEVELS[i].minHoney) {
      return BEE_LEVELS[i];
    }
  }
  return BEE_LEVELS[0];
};

export const getNextLevel = (currentLevel: BeeLevel): BeeLevel | null => {
  const index = BEE_LEVELS.findIndex((l) => l.level === currentLevel.level);
  if (index < BEE_LEVELS.length - 1) {
    return BEE_LEVELS[index + 1];
  }
  return null;
};

export const getLevelProgress = (
  totalHoneyEarned: number
): { current: BeeLevel; next: BeeLevel | null; progress: number } => {
  const current = getLevelForHoney(totalHoneyEarned);
  const next = getNextLevel(current);

  if (!next) {
    return { current, next: null, progress: 100 };
  }

  const range = next.minHoney - current.minHoney;
  const earned = totalHoneyEarned - current.minHoney;
  const progress = Math.round((earned / range) * 100);

  return { current, next, progress: Math.min(100, progress) };
};
