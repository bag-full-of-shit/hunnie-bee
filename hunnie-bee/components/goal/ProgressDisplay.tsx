import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GoalWithProgress } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';

interface ProgressDisplayProps {
  goal: GoalWithProgress;
}

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ goal }) => {
  const getEncouragementMessage = (): string => {
    if (goal.currentCount >= goal.targetCount) {
      return '목표를 달성했어요! 대단해요!';
    }
    if (goal.progressPercent >= 80) {
      return '거의 다 왔어요! 조금만 더!';
    }
    if (goal.progressPercent >= 50) {
      return '반을 넘었어요! 잘하고 있어요!';
    }
    if (goal.progressPercent >= 25) {
      return '좋은 시작이에요! 계속 가요!';
    }
    return `${goal.remainingCount}번 더 하면 목표 달성!`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{goal.emoji}</Text>
      <Text style={styles.title}>{goal.title}</Text>

      <View style={styles.countContainer}>
        <Text style={styles.currentCount}>{goal.currentCount}</Text>
        <View style={styles.divider} />
        <Text style={styles.targetCount}>{goal.targetCount}</Text>
      </View>

      <Text style={styles.percent}>{goal.progressPercent}% 달성</Text>
      <Text style={styles.encouragement}>{getEncouragementMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Spacing.lg,
  },
  countContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  currentCount: {
    fontSize: FontSize.display,
    fontWeight: '700',
    color: Colors.honey700,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.gray300,
    marginVertical: Spacing.xs,
  },
  targetCount: {
    fontSize: FontSize.h2,
    fontWeight: '600',
    color: Colors.gray500,
  },
  percent: {
    fontSize: FontSize.h3,
    color: Colors.gray600,
    marginBottom: Spacing.sm,
  },
  encouragement: {
    fontSize: FontSize.body,
    color: Colors.gray500,
  },
});
