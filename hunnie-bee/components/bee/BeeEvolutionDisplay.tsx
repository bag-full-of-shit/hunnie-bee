import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BeeLevel } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';

interface Props {
  currentLevel: BeeLevel;
  nextLevel: BeeLevel | null;
  progress: number;
  totalHoneyEarned: number;
}

export const BeeEvolutionDisplay: React.FC<Props> = ({
  currentLevel,
  nextLevel,
  progress,
  totalHoneyEarned,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Lv.{currentLevel.level}</Text>
        <Text style={styles.levelName}>{currentLevel.name}</Text>
      </View>

      {nextLevel && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              {currentLevel.emoji} → {nextLevel.emoji}
            </Text>
            <Text style={styles.progressValue}>
              {totalHoneyEarned} / {nextLevel.minHoney}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressHint}>
            {nextLevel.minHoney - totalHoneyEarned} more honey to evolve
          </Text>
        </View>
      )}

      {!nextLevel && (
        <Text style={styles.maxLevelText}>Max level reached!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  levelText: {
    fontSize: FontSize.bodyS,
    fontWeight: '700',
    color: Colors.honey600,
    backgroundColor: Colors.honey100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  levelName: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.gray700,
  },
  progressSection: {
    marginTop: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: FontSize.bodyS,
    color: Colors.gray600,
  },
  progressValue: {
    fontSize: FontSize.xs,
    color: Colors.gray500,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.honey400,
    borderRadius: 4,
  },
  progressHint: {
    fontSize: FontSize.xs,
    color: Colors.gray400,
    marginTop: 4,
    textAlign: 'center',
  },
  maxLevelText: {
    fontSize: FontSize.bodyS,
    color: Colors.honey600,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
