import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoalWithProgress } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';
import { BeeProgressBar } from '../ui/BeeProgressBar';

interface GoalCardProps {
  goal: GoalWithProgress;
  onPress: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{goal.emoji}</Text>
          <Text style={styles.title}>{goal.title}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>

      <View style={styles.progressSection}>
        <BeeProgressBar progress={goal.progressPercent} height={28} />
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {goal.currentCount}/{goal.targetCount}
          </Text>
          <Text style={styles.percentText}>{goal.progressPercent}%</Text>
        </View>
      </View>

      <Text style={styles.remaining}>
        {goal.remainingDays > 0 ? `${goal.remainingDays} days left` : 'Ended'}
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
  progressSection: {
    marginBottom: Spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  progressText: {
    fontSize: FontSize.bodyS,
    fontWeight: '600',
    color: Colors.honey700,
  },
  percentText: {
    fontSize: FontSize.bodyS,
    color: Colors.gray500,
  },
  remaining: {
    fontSize: FontSize.caption,
    color: Colors.gray500,
  },
});
