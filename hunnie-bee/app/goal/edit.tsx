import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGoalStore } from '../../stores/goalStore';
import { Input, EmojiPicker, Button } from '../../components';
import { Colors, Spacing, FontSize } from '../../constants';

export default function EditGoalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals, updateGoal } = useGoalStore();

  const goal = goals.find((g) => g.id === id);

  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('');
  const [targetCount, setTargetCount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setEmoji(goal.emoji);
      setTargetCount(String(goal.targetCount));
    }
  }, [goal]);

  if (!goal) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.honey500} />
      </View>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a goal title');
      return;
    }

    const count = parseInt(targetCount, 10);
    if (isNaN(count) || count < 1 || count > 365) {
      setError('Target count must be between 1 and 365');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await updateGoal(goal.id, {
        title: title.trim(),
        emoji,
        targetCount: count,
      });
      router.back();
    } catch (e) {
      setError('Failed to update goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const hasChanges =
    title !== goal.title ||
    emoji !== goal.emoji ||
    targetCount !== String(goal.targetCount);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Goal</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <EmojiPicker selectedEmoji={emoji} onSelect={setEmoji} />

        <Input
          label="Goal Title"
          placeholder="e.g., Read books"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />

        <Input
          label="Target Count"
          placeholder="100"
          value={targetCount}
          onChangeText={setTargetCount}
          keyboardType="number-pad"
          helperText="Complete this many times to achieve your goal!"
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Note: The start and end dates cannot be changed after creation.
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <Text style={styles.previewEmoji}>{emoji}</Text>
            <Text style={styles.previewGoalTitle}>
              {title || 'Goal Title'}
            </Text>
            <Text style={styles.previewDescription}>
              {targetCount || '100'} times
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          size="large"
          loading={isLoading}
          disabled={!title.trim() || !hasChanges}
          style={styles.submitButton}
        />
      </View>
    </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.gray500,
  },
  headerTitle: {
    fontSize: FontSize.h3,
    fontWeight: '600',
    color: Colors.gray700,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.base,
  },
  infoBox: {
    backgroundColor: Colors.honey50,
    borderRadius: 8,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  infoText: {
    fontSize: FontSize.bodyS,
    color: Colors.honey700,
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.bodyS,
    marginBottom: Spacing.base,
  },
  preview: {
    marginTop: Spacing.lg,
  },
  previewTitle: {
    fontSize: FontSize.bodyS,
    fontWeight: '500',
    color: Colors.gray500,
    marginBottom: Spacing.sm,
  },
  previewCard: {
    backgroundColor: Colors.honey50,
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.honey200,
  },
  previewEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  previewGoalTitle: {
    fontSize: FontSize.h2,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  previewDescription: {
    fontSize: FontSize.body,
    color: Colors.gray500,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  submitButton: {
    width: '100%',
  },
});
