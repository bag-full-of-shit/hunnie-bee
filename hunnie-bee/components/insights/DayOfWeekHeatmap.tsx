import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DayOfWeekActivity } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';

interface Props {
  data: DayOfWeekActivity[];
}

const getHeatColor = (count: number, maxCount: number): string => {
  if (count === 0) return Colors.gray100;
  const ratio = count / maxCount;
  if (ratio > 0.75) return Colors.honey500;
  if (ratio > 0.5) return Colors.honey400;
  if (ratio > 0.25) return Colors.honey300;
  return Colors.honey200;
};

export const DayOfWeekHeatmap: React.FC<Props> = ({ data }) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Most Active Days</Text>
      <View style={styles.heatmapRow}>
        {data.map((item) => (
          <View key={item.day} style={styles.dayColumn}>
            <View
              style={[
                styles.heatCell,
                { backgroundColor: getHeatColor(item.count, maxCount) },
              ]}
            >
              <Text style={[styles.countText, item.count > 0 && styles.countTextActive]}>
                {item.count}
              </Text>
            </View>
            <Text style={styles.dayLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: FontSize.bodyS,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Spacing.md,
  },
  heatmapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  heatCell: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  countText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.gray400,
  },
  countTextActive: {
    color: Colors.honey800,
  },
  dayLabel: {
    fontSize: 10,
    color: Colors.gray500,
  },
});
