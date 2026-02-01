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
import { HoneycombGrid, ProgressDisplay, Button } from '../../components';
import { Colors, Spacing, FontSize } from '../../constants';
import { formatDate, isToday } from '../../utils';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGoalWithProgress, addRecord, deleteGoal, loadData, records } = useGoalStore();
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
        <Text style={styles.errorText}>목표를 찾을 수 없습니다</Text>
      </View>
    );
  }

  const handleRecord = async () => {
    if (isRecording || justRecorded || hasRecordedToday) return;

    setIsRecording(true);
    try {
      await addRecord(goal.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setJustRecorded(true);

      // 잠시 후 버튼 상태 복원
      setTimeout(() => {
        setJustRecorded(false);
      }, 2000);
    } catch (error) {
      Alert.alert('오류', '기록에 실패했습니다');
    } finally {
      setIsRecording(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '목표 삭제',
      `"${goal.title}" 목표와 모든 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
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
            <Text style={styles.infoLabel}>남은 기간</Text>
            <Text style={styles.infoValue}>
              {goal.remainingDays > 0 ? `${goal.remainingDays}일` : '종료됨'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>시작일</Text>
            <Text style={styles.infoValue}>{formatDate(goal.startDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>종료일</Text>
            <Text style={styles.infoValue}>{formatDate(goal.endDate)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>목표 삭제</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={
            justRecorded || hasRecordedToday
              ? '오늘 기록 완료! ✓'
              : isCompleted
              ? '목표 달성! 🎉'
              : '오늘 했어요! 🐝'
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
