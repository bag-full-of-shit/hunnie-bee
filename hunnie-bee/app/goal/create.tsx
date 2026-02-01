import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGoalStore } from '../../stores/goalStore';
import { Input, EmojiPicker, Button } from '../../components';
import { Colors, Spacing, FontSize, DEFAULTS } from '../../constants';
import { getEndOfYear, getOneYearLater } from '../../utils';

type DurationType = 'endOfYear' | 'oneYear';

export default function CreateGoalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createGoal = useGoalStore((state) => state.createGoal);

  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState(DEFAULTS.emoji);
  const [targetCount, setTargetCount] = useState(String(DEFAULTS.targetCount));
  const [durationType, setDurationType] = useState<DurationType>('oneYear');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
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
      const endDate = durationType === 'endOfYear' ? getEndOfYear() : getOneYearLater();
      await createGoal({
        title: title.trim(),
        emoji,
        targetCount: count,
        endDate,
      });
      router.back();
    } catch (e) {
      setError('Failed to create goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const getDurationLabel = () => {
    if (durationType === 'endOfYear') {
      const year = new Date().getFullYear();
      return `Until Dec 31, ${year}`;
    }
    return 'For 1 year';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Goal</Text>
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

        <View style={styles.durationSection}>
          <Text style={styles.durationLabel}>Duration</Text>
          <View style={styles.durationOptions}>
            <TouchableOpacity
              style={[
                styles.durationOption,
                durationType === 'endOfYear' && styles.durationOptionActive,
              ]}
              onPress={() => setDurationType('endOfYear')}
            >
              <Text
                style={[
                  styles.durationOptionText,
                  durationType === 'endOfYear' && styles.durationOptionTextActive,
                ]}
              >
                Until End of Year
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.durationOption,
                durationType === 'oneYear' && styles.durationOptionActive,
              ]}
              onPress={() => setDurationType('oneYear')}
            >
              <Text
                style={[
                  styles.durationOptionText,
                  durationType === 'oneYear' && styles.durationOptionTextActive,
                ]}
              >
                For 1 Year
              </Text>
            </TouchableOpacity>
          </View>
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
              {targetCount || '100'} times · {getDurationLabel()}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
        <Button
          title="Create Goal 🐝"
          onPress={handleCreate}
          size="large"
          loading={isLoading}
          disabled={!title.trim()}
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
  durationSection: {
    marginBottom: Spacing.base,
  },
  durationLabel: {
    fontSize: FontSize.bodyS,
    fontWeight: '500',
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  durationOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  durationOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray300,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  durationOptionActive: {
    borderColor: Colors.honey500,
    backgroundColor: Colors.honey50,
  },
  durationOptionText: {
    fontSize: FontSize.body,
    color: Colors.gray600,
    fontWeight: '500',
  },
  durationOptionTextActive: {
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
