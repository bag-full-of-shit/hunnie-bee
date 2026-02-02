import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BeeStatusInfo, BeeMood } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';

interface BeeStatusProps {
  beeStatus: BeeStatusInfo;
  diligenceScore: number;
}

const moodColors: Record<BeeMood, string> = {
  happy: Colors.honey500,
  content: Colors.honey400,
  grumpy: Colors.gray500,
  upset: Colors.error,
};

const moodBackgrounds: Record<BeeMood, string> = {
  happy: Colors.honey100,
  content: Colors.honey50,
  grumpy: Colors.gray100,
  upset: '#FEE2E2',
};

const getDiligenceColor = (score: number): string => {
  if (score >= 5) return Colors.honey500;
  if (score >= -5) return Colors.gray500;
  return Colors.error;
};

export const BeeStatus: React.FC<BeeStatusProps> = ({ beeStatus, diligenceScore }) => {
  const bgColor = moodBackgrounds[beeStatus.mood];
  const textColor = moodColors[beeStatus.mood];
  const scoreColor = getDiligenceColor(diligenceScore);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.emoji}>{beeStatus.emoji}</Text>
      <View style={styles.content}>
        <Text style={[styles.message, { color: textColor }]}>{beeStatus.message}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Progress: </Text>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>
            {diligenceScore > 0 ? '+' : ''}{diligenceScore}
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
