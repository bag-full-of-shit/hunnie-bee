import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BeeStatus as BeeStatusType } from '../../utils';
import { Colors, Spacing, FontSize } from '../../constants';

interface BeeStatusProps {
  status: BeeStatusType;
}

const moodColors: Record<BeeStatusType['mood'], string> = {
  thriving: Colors.honey500,
  happy: Colors.honey400,
  normal: Colors.gray500,
  worried: Colors.warning,
  sad: Colors.error,
};

const moodBackgrounds: Record<BeeStatusType['mood'], string> = {
  thriving: Colors.honey100,
  happy: Colors.honey50,
  normal: Colors.gray100,
  worried: '#FEF3C7',
  sad: '#FEE2E2',
};

export const BeeStatus: React.FC<BeeStatusProps> = ({ status }) => {
  const bgColor = moodBackgrounds[status.mood];
  const textColor = moodColors[status.mood];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.emoji}>{status.emoji}</Text>
      <View style={styles.content}>
        <Text style={[styles.message, { color: textColor }]}>{status.message}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Diligence Score: </Text>
          <Text style={[styles.scoreValue, { color: textColor }]}>
            {status.score > 0 ? '+' : ''}{status.score}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: 16,
    marginBottom: Spacing.base,
  },
  emoji: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: FontSize.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: FontSize.bodyS,
    color: Colors.gray500,
  },
  scoreValue: {
    fontSize: FontSize.bodyS,
    fontWeight: '700',
  },
});
