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

export default function CreateGoalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createGoal = useGoalStore((state) => state.createGoal);

  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState(DEFAULTS.emoji);
  const [targetCount, setTargetCount] = useState(String(DEFAULTS.targetCount));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('목표 제목을 입력해 주세요');
      return;
    }

    const count = parseInt(targetCount, 10);
    if (isNaN(count) || count < 1 || count > 365) {
      setError('목표 횟수는 1~365 사이여야 합니다');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createGoal({
        title: title.trim(),
        emoji,
        targetCount: count,
      });
      router.back();
    } catch (e) {
      setError('목표 생성에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
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
        <Text style={styles.headerTitle}>새 목표 만들기</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <EmojiPicker selectedEmoji={emoji} onSelect={setEmoji} />

        <Input
          label="목표 제목"
          placeholder="예: 책 읽기"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />

        <Input
          label="목표 횟수"
          placeholder="100"
          value={targetCount}
          onChangeText={setTargetCount}
          keyboardType="number-pad"
          helperText="1년 동안 이 횟수를 달성하면 성공!"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.preview}>
          <Text style={styles.previewTitle}>미리보기</Text>
          <View style={styles.previewCard}>
            <Text style={styles.previewEmoji}>{emoji}</Text>
            <Text style={styles.previewGoalTitle}>
              {title || '목표 제목'}
            </Text>
            <Text style={styles.previewDescription}>
              1년에 {targetCount || '100'}번 하기
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
        <Button
          title="목표 만들기 🐝"
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
