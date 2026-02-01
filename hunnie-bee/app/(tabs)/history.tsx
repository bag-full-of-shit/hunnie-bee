import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useGoalStore } from '../../stores/goalStore';
import { Colors, Spacing, FontSize } from '../../constants';
import { formatDate } from '../../utils';

export default function HistoryScreen() {
  const { records, goals } = useGoalStore();

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );

  const getGoalInfo = (goalId: string) => {
    return goals.find((g) => g.id === goalId);
  };

  if (sortedRecords.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={styles.emptyTitle}>아직 기록이 없어요</Text>
        <Text style={styles.emptyDescription}>
          목표를 실천하면{'\n'}여기에 기록이 쌓여요!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const goal = getGoalInfo(item.goalId);
          if (!goal) return null;

          return (
            <View style={styles.recordItem}>
              <Text style={styles.emoji}>{goal.emoji}</Text>
              <View style={styles.recordContent}>
                <Text style={styles.recordTitle}>{goal.title}</Text>
                <Text style={styles.recordDate}>
                  {formatDate(item.recordedAt)}
                </Text>
              </View>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          );
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>실천 기록</Text>
            <Text style={styles.headerCount}>총 {records.length}회</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  listContent: {
    padding: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  headerTitle: {
    fontSize: FontSize.h3,
    fontWeight: '600',
    color: Colors.gray700,
  },
  headerCount: {
    fontSize: FontSize.body,
    color: Colors.honey600,
    fontWeight: '500',
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  recordContent: {
    flex: 1,
  },
  recordTitle: {
    fontSize: FontSize.body,
    fontWeight: '500',
    color: Colors.gray700,
  },
  recordDate: {
    fontSize: FontSize.caption,
    color: Colors.gray500,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    color: Colors.success,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
    backgroundColor: Colors.gray50,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.h2,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: FontSize.body,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
  },
});
