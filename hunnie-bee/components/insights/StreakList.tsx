import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GoalStreak } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';

interface Props {
  streaks: GoalStreak[];
}

export const StreakList: React.FC<Props> = ({ streaks }) => {
  if (streaks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Streaks</Text>
        <Text style={styles.emptyText}>Complete goals on consecutive days to build streaks!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Streaks</Text>
      {streaks.map((streak) => (
        <View key={streak.goalId} style={styles.streakItem}>
          <Text style={styles.emoji}>{streak.goalEmoji}</Text>
          <View style={styles.streakContent}>
            <Text style={styles.goalTitle} numberOfLines={1}>
              {streak.goalTitle}
            </Text>
            <View style={styles.streakValues}>
              {streak.currentStreak > 0 && (
                <Text style={styles.currentStreak}>
                  {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''} active
                </Text>
              )}
            </View>
          </View>
          <View style={styles.bestBadge}>
            <Text style={styles.bestLabel}>Best</Text>
            <Text style={styles.bestValue}>{streak.bestStreak}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: FontSize.bodyS,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.bodyS,
    color: Colors.gray400,
    textAlign: 'center',
    paddingVertical: Spacing.base,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  emoji: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  streakContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: FontSize.bodyS,
    fontWeight: '500',
    color: Colors.gray700,
  },
  streakValues: {
    flexDirection: 'row',
    marginTop: 2,
  },
  currentStreak: {
    fontSize: FontSize.xs,
    color: Colors.honey600,
  },
  bestBadge: {
    alignItems: 'center',
    backgroundColor: Colors.honey50,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  bestLabel: {
    fontSize: 10,
    color: Colors.honey600,
  },
  bestValue: {
    fontSize: FontSize.bodyS,
    fontWeight: '700',
    color: Colors.honey700,
  },
});
