import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, ScrollView, TouchableOpacity } from 'react-native';
import { useGoalStore } from '../../stores/goalStore';
import { Colors, Spacing, FontSize } from '../../constants';
import { formatDate } from '../../utils';
import { OverviewCards } from '../../components/insights/OverviewCards';
import { WeeklyTrendChart } from '../../components/insights/WeeklyTrendChart';
import { DayOfWeekHeatmap } from '../../components/insights/DayOfWeekHeatmap';
import { StreakList } from '../../components/insights/StreakList';

type ViewMode = 'stats' | 'history';
type HistoryMode = 'byDate' | 'byGoal';

export default function InsightsScreen() {
  const { records, goals, getInsightsData } = useGoalStore();
  const [viewMode, setViewMode] = useState<ViewMode>('stats');
  const [historyMode, setHistoryMode] = useState<HistoryMode>('byDate');

  const insightsData = useMemo(() => getInsightsData(), [records, goals]);

  const getGoalInfo = (goalId: string) => {
    return goals.find((g) => g.id === goalId);
  };

  // Group by date
  const recordsByDate = useMemo(() => {
    const grouped: Record<string, typeof records> = {};
    records.forEach((record) => {
      const dateKey = formatDate(record.recordedAt);
      if (!grouped[dateKey]) grouped[dateKey] = [];
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
      if (!grouped[record.goalId]) grouped[record.goalId] = [];
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

  const renderStatsView = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.statsContent}>
      <OverviewCards
        totalRecords={insightsData.totalRecords}
        completionRate={insightsData.overallCompletionRate}
        activeGoals={insightsData.activeGoalCount}
      />
      <WeeklyTrendChart data={insightsData.weeklyTrends} />
      <DayOfWeekHeatmap data={insightsData.dayOfWeekActivity} />
      <StreakList streaks={insightsData.goalStreaks} />
    </ScrollView>
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
        <Text style={styles.checkmark}>&#x2713;</Text>
      </View>
    );
  };

  const renderGoalItem = ({ item }: { item: typeof records[0] }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordContent}>
        <Text style={styles.recordDate}>{formatDate(item.recordedAt)}</Text>
      </View>
      <Text style={styles.checkmark}>&#x2713;</Text>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string; data: typeof records } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length}x</Text>
    </View>
  );

  const renderHistoryHeader = () => (
    <View style={styles.historyHeaderContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.headerTitle}>Activity Log</Text>
        <Text style={styles.headerCount}>{records.length} total</Text>
      </View>
      <View style={styles.subTabContainer} accessibilityRole="tablist">
        <TouchableOpacity
          style={[styles.subTab, historyMode === 'byDate' && styles.activeSubTab]}
          onPress={() => setHistoryMode('byDate')}
          accessibilityRole="tab"
          accessibilityState={{ selected: historyMode === 'byDate' }}
        >
          <Text style={[styles.subTabText, historyMode === 'byDate' && styles.activeSubTabText]}>
            By Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTab, historyMode === 'byGoal' && styles.activeSubTab]}
          onPress={() => setHistoryMode('byGoal')}
          accessibilityRole="tab"
          accessibilityState={{ selected: historyMode === 'byGoal' }}
        >
          <Text style={[styles.subTabText, historyMode === 'byGoal' && styles.activeSubTabText]}>
            By Goal
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistoryView = () => {
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

    return (
      <SectionList
        sections={historyMode === 'byDate' ? recordsByDate : recordsByGoal}
        keyExtractor={(item) => item.id}
        renderItem={historyMode === 'byDate' ? renderDateItem : renderGoalItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHistoryHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Top-level tab toggle */}
      <View style={styles.topTabContainer}>
        <View style={styles.tabRow} accessibilityRole="tablist">
          <TouchableOpacity
            style={[styles.topTab, viewMode === 'stats' && styles.activeTopTab]}
            onPress={() => setViewMode('stats')}
            accessibilityRole="tab"
            accessibilityState={{ selected: viewMode === 'stats' }}
          >
            <Text style={[styles.topTabText, viewMode === 'stats' && styles.activeTopTabText]}>
              Stats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topTab, viewMode === 'history' && styles.activeTopTab]}
            onPress={() => setViewMode('history')}
            accessibilityRole="tab"
            accessibilityState={{ selected: viewMode === 'history' }}
          >
            <Text style={[styles.topTabText, viewMode === 'history' && styles.activeTopTabText]}>
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'stats' ? renderStatsView() : renderHistoryView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  topTabContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.gray200,
    borderRadius: 8,
    padding: 4,
  },
  topTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTopTab: {
    backgroundColor: Colors.white,
  },
  topTabText: {
    fontSize: FontSize.body,
    color: Colors.gray500,
    fontWeight: '500',
  },
  activeTopTabText: {
    color: Colors.gray700,
  },
  statsContent: {
    padding: Spacing.base,
  },
  listContent: {
    padding: Spacing.base,
  },
  historyHeaderContainer: {
    marginBottom: Spacing.base,
  },
  historyHeader: {
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
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray200,
    borderRadius: 8,
    padding: 4,
  },
  subTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSubTab: {
    backgroundColor: Colors.white,
  },
  subTabText: {
    fontSize: FontSize.body,
    color: Colors.gray500,
    fontWeight: '500',
  },
  activeSubTabText: {
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
