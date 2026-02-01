import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoalWithProgress } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';

interface GoalCardProps {
  goal: GoalWithProgress;
  onPress: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onPress }) => {
  const progressWidth = `${Math.min(goal.progressPercent, 100)}%`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{goal.emoji}</Text>
          <Text style={styles.title}>{goal.title}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressText}>
          {goal.currentCount}/{goal.targetCount}
        </Text>
      </View>

      <Text style={styles.remaining}>
        {goal.remainingDays > 0 ? `${goal.remainingDays}일 남음` : '기간 종료'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: FontSize.h2,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSize.h3,
    fontWeight: '600',
    color: Colors.gray700,
    flex: 1,
  },
  arrow: {
    fontSize: FontSize.h2,
    color: Colors.gray400,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.honey400,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FontSize.bodyS,
    fontWeight: '600',
    color: Colors.honey700,
    minWidth: 60,
    textAlign: 'right',
  },
  remaining: {
    fontSize: FontSize.caption,
    color: Colors.gray500,
  },
});
