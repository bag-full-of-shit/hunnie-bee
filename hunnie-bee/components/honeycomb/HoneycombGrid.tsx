import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { Colors } from '../../constants';

interface HoneycombGridProps {
  totalCells?: number;
  filledCells: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 32;
const COLS = 10;
const ROWS = 10;

// Calculate hexagon cell size
const CELL_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2) / (COLS + 0.5);
const CELL_HEIGHT = CELL_WIDTH * 0.866; // Hexagon height ratio

// Generate hexagon points
const getHexPoints = (cx: number, cy: number, size: number): string => {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
};

export const HoneycombGrid: React.FC<HoneycombGridProps> = ({
  totalCells = 100,
  filledCells,
}) => {
  const cells = Array.from({ length: totalCells }, (_, i) => i);
  const size = CELL_WIDTH * 0.45;

  return (
    <View style={styles.container}>
      <Svg
        width={SCREEN_WIDTH - GRID_PADDING}
        height={ROWS * CELL_HEIGHT + CELL_HEIGHT / 2}
      >
        {cells.map((index) => {
          const row = Math.floor(index / COLS);
          const col = index % COLS;

          // Offset for odd rows
          const offsetX = row % 2 === 1 ? CELL_WIDTH / 2 : 0;

          const cx = col * CELL_WIDTH + CELL_WIDTH / 2 + offsetX;
          const cy = row * CELL_HEIGHT + CELL_HEIGHT / 2;

          const isFilled = index < filledCells;
          const isLatest = index === filledCells - 1;

          return (
            <Polygon
              key={index}
              points={getHexPoints(cx, cy, size)}
              fill={isFilled ? Colors.honey400 : Colors.gray100}
              stroke={
                isLatest
                  ? Colors.honey500
                  : isFilled
                  ? Colors.honey500
                  : Colors.gray200
              }
              strokeWidth={isLatest ? 2 : 1}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
