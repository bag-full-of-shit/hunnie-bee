import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import { Goal, GoalReminder } from '../../types';
import { Colors, Spacing, FontSize } from '../../constants';

interface Props {
  goal: Goal;
  reminder?: GoalReminder;
  onToggle: (goalId: string, enabled: boolean) => void;
  onTimeChange: (goalId: string, hour: number, minute: number) => void;
}

const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
};

const PRESET_TIMES = [
  { label: 'Morning', hour: 8, minute: 0 },
  { label: 'Noon', hour: 12, minute: 0 },
  { label: 'Evening', hour: 18, minute: 0 },
  { label: 'Night', hour: 21, minute: 0 },
];

export const ReminderToggle: React.FC<Props> = ({
  goal,
  reminder,
  onToggle,
  onTimeChange,
}) => {
  const isEnabled = reminder?.enabled ?? false;
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.emoji}>{goal.emoji}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {goal.title}
        </Text>
        <Switch
          value={isEnabled}
          onValueChange={(value) => onToggle(goal.id, value)}
          trackColor={{ false: Colors.gray300, true: Colors.honey300 }}
          thumbColor={isEnabled ? Colors.honey500 : Colors.gray100}
        />
      </View>

      {isEnabled && (
        <View style={styles.timeSection}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(!showTimePicker)}
          >
            <Text style={styles.timeText}>
              {formatTime(reminder?.hour ?? 9, reminder?.minute ?? 0)}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <View style={styles.presetContainer}>
              {PRESET_TIMES.map((preset) => (
                <TouchableOpacity
                  key={preset.label}
                  style={[
                    styles.presetButton,
                    reminder?.hour === preset.hour && styles.presetButtonActive,
                  ]}
                  onPress={() => {
                    onTimeChange(goal.id, preset.hour, preset.minute);
                    setShowTimePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.presetText,
                      reminder?.hour === preset.hour && styles.presetTextActive,
                    ]}
                  >
                    {preset.label}
                  </Text>
                  <Text style={styles.presetTime}>
                    {formatTime(preset.hour, preset.minute)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: FontSize.bodyS,
    color: Colors.gray700,
  },
  timeSection: {
    marginTop: Spacing.sm,
    marginLeft: 28,
  },
  timeButton: {
    backgroundColor: Colors.honey50,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: FontSize.bodyS,
    color: Colors.honey700,
    fontWeight: '500',
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  presetButton: {
    backgroundColor: Colors.gray100,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: Colors.honey100,
  },
  presetText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    color: Colors.gray600,
  },
  presetTextActive: {
    color: Colors.honey700,
  },
  presetTime: {
    fontSize: 10,
    color: Colors.gray400,
  },
});
