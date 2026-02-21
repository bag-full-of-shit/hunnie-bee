import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELEBRATION_EMOJIS = ['🍯', '🐝', '✨', '🎉', '💛'];
const NUM_PARTICLES = 12;
import * as Haptics from 'expo-haptics';
import { useGoalStore } from '../../stores/goalStore';
import { useBeeStore } from '../../stores/beeStore';
import { HoneycombGrid, ProgressDisplay, Button } from '../../components';
import { Colors, Spacing, FontSize } from '../../constants';
import { formatDate, isToday } from '../../utils';

// Celebration particle component
const CelebrationParticle = ({ emoji, delay, startX }: { emoji: string; delay: number; startX: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const xOffset = (Math.random() - 0.5) * 150;

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -200 - Math.random() * 100,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: xOffset,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, scale, translateX, translateY]);

  return (
    <Animated.Text
      style={[
        styles.particle,
        {
          left: startX,
          opacity,
          transform: [{ translateY }, { translateX }, { scale }],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGoalWithProgress, addRecord, deleteGoal, loadData, records } = useGoalStore();
  const { earnHoney } = useBeeStore();
  const [isRecording, setIsRecording] = useState(false);
  const [justRecorded, setJustRecorded] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; emoji: string; delay: number; startX: number }>>([]);

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

  const triggerCelebration = () => {
    const newParticles = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
      id: Date.now() + i,
      emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
      delay: i * 50,
      startX: SCREEN_WIDTH / 2 - 15 + (Math.random() - 0.5) * 60,
    }));
    setParticles(newParticles);
    setShowCelebration(true);

    // Clean up particles after animation
    setTimeout(() => {
      setShowCelebration(false);
      setParticles([]);
    }, 2000);
  };

  const handleRecord = async () => {
    if (isRecording || justRecorded || hasRecordedToday) return;

    setIsRecording(true);
    try {
      await addRecord(goal.id);
      await earnHoney(1); // Earn 1 honey for completing a goal
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      triggerCelebration();
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

        <View
          accessible={true}
          accessibilityLabel={`Progress grid: ${goal.currentCount} of ${goal.targetCount} completed`}
        >
          <HoneycombGrid
            totalCells={goal.targetCount}
            filledCells={goal.currentCount}
          />
        </View>

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

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push(`/goal/edit?id=${goal.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${goal.title}`}
        >
          <Text style={styles.editText}>Edit Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${goal.title}`}
        >
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
          style={{
            ...styles.recordButton,
            ...((justRecorded || hasRecordedToday) ? styles.recordedButton : {}),
          }}
        />
      </View>

      {/* Celebration particles */}
      {showCelebration && (
        <View style={styles.celebrationContainer} pointerEvents="none">
          {particles.map((particle) => (
            <CelebrationParticle
              key={particle.id}
              emoji={particle.emoji}
              delay={particle.delay}
              startX={particle.startX}
            />
          ))}
        </View>
      )}
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
  editButton: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.base,
    backgroundColor: Colors.gray100,
    borderRadius: 8,
  },
  editText: {
    fontSize: FontSize.body,
    color: Colors.gray700,
    fontWeight: '500',
  },
  deleteButton: {
    alignItems: 'center',
    marginTop: Spacing.sm,
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
  celebrationContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  particle: {
    position: 'absolute',
    bottom: 80,
    fontSize: 28,
  },
});
