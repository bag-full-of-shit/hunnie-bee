import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGoalStore } from '../../stores/goalStore';
import { GoalCard } from '../../components';
import { Colors, Spacing, FontSize } from '../../constants';

export default function HomeScreen() {
  const router = useRouter();
  const { isLoading, getAllGoalsWithProgress } = useGoalStore();
  const goals = getAllGoalsWithProgress();

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
        <Text style={styles.emptyTitle}>아직 목표가 없어요</Text>
        <Text style={styles.emptyDescription}>
          1년에 100번, 꾸준히 달성할{'\n'}첫 번째 목표를 만들어 보세요!
        </Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
          <Text style={styles.createButtonText}>첫 목표 만들기</Text>
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
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>진행 중인 목표</Text>
            <Text style={styles.headerCount}>{goals.length}개</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleCreateGoal}>
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
