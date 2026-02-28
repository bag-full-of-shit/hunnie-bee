import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize } from '../../constants';

interface Props {
  totalRecords: number;
  completionRate: number;
  activeGoals: number;
}

export const OverviewCards: React.FC<Props> = ({
  totalRecords,
  completionRate,
  activeGoals,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.cardValue}>{totalRecords}</Text>
        <Text style={styles.cardLabel}>Total Records</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardValue}>{completionRate}%</Text>
        <Text style={styles.cardLabel}>Completion</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardValue}>{activeGoals}</Text>
        <Text style={styles.cardLabel}>Goals</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardValue: {
    fontSize: FontSize.h2,
    fontWeight: '700',
    color: Colors.honey600,
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: FontSize.xs,
    color: Colors.gray500,
  },
});
