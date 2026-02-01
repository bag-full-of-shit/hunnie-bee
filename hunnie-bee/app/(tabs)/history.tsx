import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, FlatList, TouchableOpacity } from 'react-native';
import { useGoalStore } from '../../stores/goalStore';
import { Colors, Spacing, FontSize } from '../../constants';
import { formatDate } from '../../utils';

type ViewMode = 'byDate' | 'byGoal';

export default function HistoryScreen() {
  const { records, goals } = useGoalStore();
  const [viewMode, setViewMode] = useState<ViewMode>('byDate');

  const getGoalInfo = (goalId: string) => {
    return goals.find((g) => g.id === goalId);
  };

  // Group by date
  const recordsByDate = useMemo(() => {
    const grouped: Record<string, typeof records> = {};

    records.forEach((record) => {
      const dateKey = formatDate(record.recordedAt);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(record);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({
        title: date,
        data: items.sort(
          (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
        ),
      }));
  }, [records]);

  // Group by goal
  const recordsByGoal = useMemo(() => {
    const grouped: Record<string, typeof records> = {};

    records.forEach((record) => {
      if (!grouped[record.goalId]) {
        grouped[record.goalId] = [];
      }
      grouped[record.goalId].push(record);
    });

    return Object.entries(grouped)
      .map(([goalId, items]) => {
        const goal = getGoalInfo(goalId);
        return {
          goalId,
          goal,
          title: goal ? `${goal.emoji} ${goal.title}` : 'Deleted Goal',
          data: items.sort(
            (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
          ),
        };
      })
      .sort((a, b) => b.data.length - a.data.length);
  }, [records, goals]);

  if (records.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={styles.emptyTitle}>No records yet</Text>
        <Text style={styles.emptyDescription}>
          Complete your goals{'\n'}and your records will appear here!
        </Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity Log</Text>
        <Text style={styles.headerCount}>{records.length} total</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'byDate' && styles.activeTab]}
          onPress={() => setViewMode('byDate')}
        >
          <Text style={[styles.tabText, viewMode === 'byDate' && styles.activeTabText]}>
            By Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'byGoal' && styles.activeTab]}
          onPress={() => setViewMode('byGoal')}
        >
          <Text style={[styles.tabText, viewMode === 'byGoal' && styles.activeTabText]}>
            By Goal
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDateItem = ({ item }: { item: typeof records[0] }) => {
    const goal = getGoalInfo(item.goalId);
    if (!goal) return null;

    return (
      <View style={styles.recordItem}>
        <Text style={styles.emoji}>{goal.emoji}</Text>
        <View style={styles.recordContent}>
          <Text style={styles.recordTitle}>{goal.title}</Text>
        </View>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    );
  };

  const renderGoalItem = ({ item }: { item: typeof records[0] }) => {
    return (
      <View style={styles.recordItem}>
        <View style={styles.recordContent}>
          <Text style={styles.recordDate}>{formatDate(item.recordedAt)}</Text>
        </View>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string; data: typeof records } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length}x</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={viewMode === 'byDate' ? recordsByDate : recordsByGoal}
        keyExtractor={(item) => item.id}
        renderItem={viewMode === 'byDate' ? renderDateItem : renderGoalItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
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
  headerContainer: {
    marginBottom: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray200,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: FontSize.body,
    color: Colors.gray500,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.gray700,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.gray700,
  },
  sectionCount: {
    fontSize: FontSize.caption,
    color: Colors.gray500,
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
    fontSize: FontSize.body,
    color: Colors.gray600,
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
