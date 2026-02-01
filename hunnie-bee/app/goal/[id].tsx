import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useGoalStore } from '../../stores/goalStore';
import { useBeeStore } from '../../stores/beeStore';
import { HoneycombGrid, ProgressDisplay, Button } from '../../components';
import { Colors, Spacing, FontSize } from '../../constants';
import { formatDate, isToday } from '../../utils';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGoalWithProgress, addRecord, deleteGoal, loadData, records } = useGoalStore();
  const { earnHoney } = useBeeStore();
  const [isRecording, setIsRecording] = useState(false);
  const [justRecorded, setJustRecorded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const goal = getGoalWithProgress(id);
  const hasRecordedToday = records.some(
    (r) => r.goalId === id && isToday(r.recordedAt)
  );

  if (!goal) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Goal not found</Text>
      </View>
    );
  }

  const handleRecord = async () => {
    if (isRecording || justRecorded || hasRecordedToday) return;

    setIsRecording(true);
    try {
      await addRecord(goal.id);
      await earnHoney(1); // Earn 1 honey for completing a goal
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setJustRecorded(true);

      // Reset button state after a moment
      setTimeout(() => {
        setJustRecorded(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to record');
    } finally {
      setIsRecording(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      `"${goal.title}" and all its records will be deleted. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteGoal(goal.id);
            router.back();
          },
        },
      ]
    );
  };

  const isCompleted = goal.currentCount >= goal.targetCount;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressDisplay goal={goal} />

        <HoneycombGrid
          totalCells={goal.targetCount}
          filledCells={goal.currentCount}
        />

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Days Remaining</Text>
            <Text style={styles.infoValue}>
              {goal.remainingDays > 0 ? `${goal.remainingDays} days` : 'Ended'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start Date</Text>
            <Text style={styles.infoValue}>{formatDate(goal.startDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>End Date</Text>
            <Text style={styles.infoValue}>{formatDate(goal.endDate)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Goal</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={
            justRecorded || hasRecordedToday
              ? 'Done for today! ✓'
              : isCompleted
              ? 'Goal achieved! 🎉'
              : 'Done today! 🐝'
          }
          onPress={handleRecord}
          size="large"
          loading={isRecording}
          disabled={isCompleted || justRecorded || hasRecordedToday}
          style={[
            styles.recordButton,
            (justRecorded || hasRecordedToday) && styles.recordedButton,
          ]}
        />
      </View>
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
  },
  errorText: {
    fontSize: FontSize.body,
    color: Colors.gray500,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: 100,
  },
  infoSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.base,
    marginTop: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  infoLabel: {
    fontSize: FontSize.body,
    color: Colors.gray500,
  },
  infoValue: {
    fontSize: FontSize.body,
    fontWeight: '500',
    color: Colors.gray700,
  },
  deleteButton: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.base,
  },
  deleteText: {
    fontSize: FontSize.body,
    color: Colors.error,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  recordButton: {
    width: '100%',
  },
  recordedButton: {
    backgroundColor: Colors.success,
  },
});
