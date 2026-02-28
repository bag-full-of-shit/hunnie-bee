import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { BeeLevel } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';

interface Props {
  visible: boolean;
  newLevel: BeeLevel;
  onDismiss: () => void;
}

export const LevelUpModal: React.FC<Props> = ({ visible, newLevel, onDismiss }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.emoji}>{newLevel.emoji}</Text>
          <Text style={styles.title}>Level Up!</Text>
          <Text style={styles.levelName}>
            Lv.{newLevel.level} {newLevel.name}
          </Text>
          <Text style={styles.description}>
            Your bee has evolved! New personality unlocked.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>Amazing!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing['2xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: '700',
    color: Colors.honey600,
    marginBottom: Spacing.xs,
  },
  levelName: {
    fontSize: FontSize.bodyL,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.body,
    color: Colors.gray500,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.honey500,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: 12,
  },
  buttonText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.white,
  },
});
