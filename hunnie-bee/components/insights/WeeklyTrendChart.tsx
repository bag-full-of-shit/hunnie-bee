import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { WeeklyTrend } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';

interface Props {
  data: WeeklyTrend[];
}

const CHART_HEIGHT = 120;

export const WeeklyTrendChart: React.FC<Props> = ({ data }) => {
  const maxCount = Math.max(...data.map((d) => d.completionCount), 1);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - Spacing.base * 4;
  const barWidth = Math.floor((chartWidth - (data.length - 1) * 4) / data.length);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Activity</Text>
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={CHART_HEIGHT}>
          {data.map((item, index) => {
            const barHeight = (item.completionCount / maxCount) * (CHART_HEIGHT - 20);
            const x = index * (barWidth + 4);
            const y = CHART_HEIGHT - 20 - barHeight;

            return (
              <React.Fragment key={index}>
                <Rect
                  x={x}
                  y={item.completionCount > 0 ? y : CHART_HEIGHT - 24}
                  width={barWidth}
                  height={item.completionCount > 0 ? barHeight : 4}
                  rx={4}
                  fill={item.completionCount > 0 ? Colors.honey400 : Colors.gray200}
                />
              </React.Fragment>
            );
          })}
        </Svg>
        <View style={[styles.labelsRow, { width: chartWidth }]}>
          {data.map((item, index) => (
            <Text
              key={index}
              style={[styles.label, { width: barWidth + 4 }]}
              numberOfLines={1}
            >
              {item.completionCount}
            </Text>
          ))}
        </View>
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
  chartContainer: {
    alignItems: 'center',
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    fontSize: 10,
    color: Colors.gray500,
    textAlign: 'center',
  },
});
