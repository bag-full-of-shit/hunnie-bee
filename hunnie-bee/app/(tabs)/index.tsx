import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useGoalStore } from '../../stores/goalStore';
import { useBeeStore } from '../../stores/beeStore';
import { GoalCard, BeeStatus } from '../../components';
import { Colors, Spacing, FontSize } from '../../constants';
import { calculateDiligenceScore } from '../../utils';

export default function HomeScreen() {
  const router = useRouter();
  const { isLoading, getAllGoalsWithProgress, loadData } = useGoalStore();
  const { getBeeStatus, loadBeeState, checkAndApplyDecay } = useBeeStore();
  const goals = getAllGoalsWithProgress();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBeeState();
      checkAndApplyDecay();
    }, [loadBeeState, checkAndApplyDecay])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadData(), loadBeeState()]);
    setRefreshing(false);
  }, [loadData, loadBeeState]);

  const beeStatus = getBeeStatus();
  const diligenceScore = useMemo(() => calculateDiligenceScore(goals), [goals]);

  const handleGoalPress = (goalId: string) => {
    router.push(`/goal/${goalId}`);
  };

  const handleCreateGoal = () => {
    router.push('/goal/create');
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.honey500} />
      </View>
    );
  }

  if (goals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🐝</Text>
        <Text style={styles.emptyTitle}>No goals yet</Text>
        <Text style={styles.emptyDescription}>
          Create your first goal{'\n'}and start raising your bee!
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGoal}
          accessibilityRole="button"
          accessibilityLabel="Create your first goal"
        >
          <Text style={styles.createButtonText}>Create First Goal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GoalCard goal={item} onPress={() => handleGoalPress(item.id)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.honey500}
            colors={[Colors.honey500]}
          />
        }
        ListHeaderComponent={
          <View>
            <BeeStatus beeStatus={beeStatus} diligenceScore={diligenceScore} />
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Active Goals</Text>
              <Text style={styles.headerCount}>{goals.length}</Text>
            </View>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateGoal}
        accessibilityRole="button"
        accessibilityLabel="Add new goal"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: 100,
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
    color: Colors.gray500,
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
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  createButton: {
    backgroundColor: Colors.honey500,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    borderRadius: 12,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: FontSize.bodyL,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: Spacing.base,
    bottom: Spacing.base,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.honey500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: '300',
  },
});
