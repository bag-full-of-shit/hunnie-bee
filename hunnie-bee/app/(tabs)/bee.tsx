import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useBeeStore } from '../../stores/beeStore';
import { Colors, Spacing, FontSize } from '../../constants';
import { BeeMood } from '../../types';

const moodBackgrounds: Record<BeeMood, string> = {
  happy: Colors.honey100,
  content: Colors.gray50,
  grumpy: Colors.gray200,
  upset: Colors.gray300,
};

const moodColors: Record<BeeMood, string> = {
  happy: Colors.honey500,
  content: Colors.gray600,
  grumpy: Colors.gray500,
  upset: Colors.gray400,
};

export default function BeeScreen() {
  const {
    bee,
    isLoading,
    loadBeeState,
    feedBee,
    makeExcuse,
    getBeeStatus,
    isGrumpy,
  } = useBeeStore();

  const [excuseText, setExcuseText] = useState('');
  const [showExcuseInput, setShowExcuseInput] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBeeState();
    }, [])
  );

  const beeStatus = getBeeStatus();
  const grumpy = isGrumpy();

  const handleFeed = async () => {
    if (bee.honeyCount <= 0) {
      Alert.alert(
        'No Honey',
        'Complete your goals to earn more honey!',
        [{ text: 'OK' }]
      );
      return;
    }

    const success = await feedBee();
    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleExcuse = async () => {
    if (!excuseText.trim()) {
      Alert.alert('Write something', 'Tell your bee why you were busy!');
      return;
    }

    if (bee.honeyCount < 1) {
      Alert.alert(
        'No Honey',
        'You need honey to make up with your bee. Complete some goals first!',
        [{ text: 'OK' }]
      );
      return;
    }

    const success = await makeExcuse(excuseText);
    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setExcuseText('');
      setShowExcuseInput(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: moodBackgrounds[beeStatus.mood] }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Bee Name */}
      <Text style={styles.beeName}>{bee.name}</Text>

      {/* Bee Display */}
      <View style={styles.beeContainer}>
        <TouchableOpacity
          onPress={() => setShowSpeechBubble(!showSpeechBubble)}
          activeOpacity={0.8}
        >
          <Text style={styles.beeEmoji}>{beeStatus.emoji}</Text>
        </TouchableOpacity>
        {showSpeechBubble && (
          <View style={[styles.speechBubble, !beeStatus.canChat && styles.speechBubbleGrumpy]}>
            <Text style={[styles.beeMessage, !beeStatus.canChat && styles.beeMessageGrumpy]}>
              "{beeStatus.message}"
            </Text>
          </View>
        )}
        {!showSpeechBubble && (
          <Text style={styles.tapHint}>Tap to talk</Text>
        )}
      </View>

      {/* Bond Bar */}
      <View style={styles.bondContainer}>
        <View style={styles.bondHeader}>
          <Text style={styles.bondLabel}>Bond</Text>
          <Text style={[styles.bondValue, { color: moodColors[beeStatus.mood] }]}>
            {bee.bond}%
          </Text>
        </View>
        <View style={styles.bondBarContainer}>
          <View
            style={[
              styles.bondBar,
              { width: `${bee.bond}%`, backgroundColor: moodColors[beeStatus.mood] },
            ]}
          />
        </View>
      </View>

      {/* Honey Count */}
      <View style={styles.honeyContainer}>
        <Text style={styles.honeyEmoji}>🍯</Text>
        <Text style={styles.honeyCount}>{bee.honeyCount}</Text>
        <Text style={styles.honeyLabel}>honey</Text>
      </View>

      {/* Actions */}
      {grumpy ? (
        // Grumpy state: Show excuse input
        <View style={styles.excuseContainer}>
          {!showExcuseInput ? (
            <TouchableOpacity
              style={styles.excuseButton}
              onPress={() => setShowExcuseInput(true)}
            >
              <Text style={styles.excuseButtonEmoji}>🙏</Text>
              <Text style={styles.excuseButtonText}>Make an excuse</Text>
              <Text style={styles.excuseButtonSubtext}>Your bee is upset. Explain yourself!</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.excuseInputContainer}>
              <Text style={styles.excusePrompt}>Tell your bee why you were busy:</Text>
              <TextInput
                style={styles.excuseInput}
                placeholder="I was really busy because..."
                placeholderTextColor={Colors.gray400}
                value={excuseText}
                onChangeText={setExcuseText}
                multiline
                maxLength={100}
              />
              <View style={styles.excuseActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowExcuseInput(false);
                    setExcuseText('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, !excuseText.trim() && styles.submitButtonDisabled]}
                  onPress={handleExcuse}
                  disabled={!excuseText.trim()}
                >
                  <Text style={styles.submitButtonText}>Send (🍯 1)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        // Normal state: Show feed button
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              bee.honeyCount <= 0 && styles.actionButtonDisabled,
            ]}
            onPress={handleFeed}
            disabled={bee.honeyCount <= 0}
          >
            <Text style={styles.actionEmoji}>🍯</Text>
            <Text style={styles.actionText}>Give Honey</Text>
            <Text style={styles.actionSubtext}>Bond +20</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tip */}
      <Text style={styles.tipText}>
        {grumpy
          ? "Your bee needs attention! Make an excuse to cheer them up."
          : "Complete goals to earn honey!"}
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.base,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSize.body,
    color: Colors.gray500,
    marginTop: 100,
  },
  beeName: {
    fontSize: FontSize.h2,
    fontWeight: '700',
    color: Colors.gray800,
    marginTop: Spacing.xl,
    marginBottom: Spacing.base,
  },
  beeContainer: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  beeEmoji: {
    fontSize: 80,
    marginBottom: Spacing.sm,
  },
  tapHint: {
    fontSize: FontSize.caption,
    color: Colors.gray400,
    marginTop: Spacing.xs,
  },
  speechBubble: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 16,
    maxWidth: '80%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  speechBubbleGrumpy: {
    backgroundColor: Colors.gray100,
  },
  beeMessage: {
    fontSize: FontSize.bodyL,
    color: Colors.gray700,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  beeMessageGrumpy: {
    color: Colors.gray500,
  },
  bondContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bondHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  bondLabel: {
    fontSize: FontSize.body,
    color: Colors.gray600,
    fontWeight: '500',
  },
  bondValue: {
    fontSize: FontSize.body,
    fontWeight: '700',
  },
  bondBarContainer: {
    height: 12,
    backgroundColor: Colors.gray200,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bondBar: {
    height: '100%',
    borderRadius: 6,
  },
  honeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 20,
    marginBottom: Spacing.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  honeyEmoji: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  honeyCount: {
    fontSize: FontSize.h1,
    fontWeight: '700',
    color: Colors.honey600,
    marginRight: Spacing.xs,
  },
  honeyLabel: {
    fontSize: FontSize.body,
    color: Colors.gray500,
  },
  actionsContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  actionButton: {
    backgroundColor: Colors.honey400,
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.gray300,
    opacity: 0.7,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  actionText: {
    fontSize: FontSize.bodyL,
    fontWeight: '600',
    color: Colors.white,
  },
  actionSubtext: {
    fontSize: FontSize.caption,
    color: Colors.white,
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  excuseContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  excuseButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray300,
    borderStyle: 'dashed',
  },
  excuseButtonEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  excuseButtonText: {
    fontSize: FontSize.bodyL,
    fontWeight: '600',
    color: Colors.gray700,
  },
  excuseButtonSubtext: {
    fontSize: FontSize.caption,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  excuseInputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.base,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  excusePrompt: {
    fontSize: FontSize.body,
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  excuseInput: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: FontSize.body,
    color: Colors.gray800,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  excuseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  cancelButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  cancelButtonText: {
    fontSize: FontSize.body,
    color: Colors.gray500,
  },
  submitButton: {
    backgroundColor: Colors.honey500,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
  submitButtonText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.white,
  },
  tipText: {
    fontSize: FontSize.bodyS,
    color: Colors.gray500,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
