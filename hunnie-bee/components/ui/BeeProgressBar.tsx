import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants';

interface BeeProgressBarProps {
  progress: number; // 0-100
  height?: number;
}

export const BeeProgressBar: React.FC<BeeProgressBarProps> = ({
  progress,
  height = 24,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const beeSize = height + 4;

  return (
    <View style={[styles.container, { height }]}>
      {/* Track background */}
      <View style={[styles.track, { height: height * 0.4, borderRadius: height * 0.2 }]}>
        {/* Honey fill */}
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              borderRadius: height * 0.2,
            },
          ]}
        />
      </View>

      {/* Bee */}
      <View
        style={[
          styles.beeContainer,
          {
            left: `${clampedProgress}%`,
            width: beeSize,
            height: beeSize,
            marginLeft: -beeSize / 2,
          },
        ]}
      >
        <Text style={[styles.bee, { fontSize: beeSize * 0.75 }]}>🐝</Text>
      </View>

      {/* Honey drops trail effect */}
      {clampedProgress > 10 && (
        <View style={[styles.honeyDrop, { left: `${clampedProgress * 0.3}%` }]}>
          <Text style={styles.dropEmoji}>🍯</Text>
        </View>
      )}
      {clampedProgress > 40 && (
        <View style={[styles.honeyDrop, { left: `${clampedProgress * 0.6}%` }]}>
          <Text style={styles.dropEmoji}>🍯</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  track: {
    backgroundColor: Colors.honey100,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.honey400,
  },
  beeContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bee: {
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  honeyDrop: {
    position: 'absolute',
    opacity: 0.6,
  },
  dropEmoji: {
    fontSize: 10,
  },
});
