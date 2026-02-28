import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Linking, Switch, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoalStore } from '../../stores/goalStore';
import { useBeeStore } from '../../stores/beeStore';
import { useReminderStore } from '../../stores/reminderStore';
import { Colors, Spacing, FontSize } from '../../constants';
import { requestPermissions, scheduleGoalReminder, cancelGoalReminder, cancelAllReminders } from '../../utils/notifications';
import { ReminderToggle } from '../../components/settings/ReminderToggle';

export default function SettingsScreen() {
  const { goals, loadData } = useGoalStore();
  const { bee, loadBeeState, renameBee } = useBeeStore();
  const { settings, setGlobalEnabled, setGoalReminder, loadSettings } = useReminderStore();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadBeeState();
      loadSettings();
    }, [loadBeeState, loadSettings])
  );

  const handleStartEdit = () => {
    setNameInput(bee.name);
    setEditingName(true);
  };

  const handleSaveName = async () => {
    if (nameInput.trim()) {
      await renameBee(nameInput);
    }
    setEditingName(false);
  };

  const handleGlobalToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permissions Required',
          'Please enable notifications in Settings to receive reminders.',
          [{ text: 'OK' }]
        );
        return;
      }
    } else {
      await cancelAllReminders();
    }
    await setGlobalEnabled(enabled);
  };

  const handleReminderToggle = async (goalId: string, enabled: boolean) => {
    await setGoalReminder(goalId, enabled);
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      if (enabled) {
        const reminder = { goalId, enabled: true, hour: 9, minute: 0 };
        await scheduleGoalReminder(goal, reminder);
      } else {
        await cancelGoalReminder(goalId);
      }
    }
  };

  const handleTimeChange = async (goalId: string, hour: number, minute: number) => {
    await setGoalReminder(goalId, true, hour, minute);
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      await scheduleGoalReminder(goal, { goalId, enabled: true, hour, minute });
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Reset Data',
      'All goals and records will be deleted. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await cancelAllReminders();
            await AsyncStorage.clear();
            await loadData();
            Alert.alert('Done', 'All data has been deleted.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Bee Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Bee</Text>
        {editingName ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter name"
              maxLength={20}
              autoFocus
              onBlur={handleSaveName}
              onSubmitEditing={handleSaveName}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveName}
              accessibilityRole="button"
              accessibilityLabel="Save bee name"
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.item}
            onPress={handleStartEdit}
            accessibilityRole="button"
            accessibilityLabel={`Bee name: ${bee.name}. Tap to edit.`}
          >
            <Text style={styles.itemLabel}>Name</Text>
            <View style={styles.editableValue}>
              <Text style={styles.itemValue}>{bee.name}</Text>
              <Text style={styles.editHint}>Tap to edit</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Enable Reminders</Text>
          <Switch
            value={settings.globalEnabled}
            onValueChange={handleGlobalToggle}
            trackColor={{ false: Colors.gray300, true: Colors.honey300 }}
            thumbColor={settings.globalEnabled ? Colors.honey500 : Colors.gray100}
          />
        </View>
        {settings.globalEnabled && goals.length > 0 && (
          <View>
            {goals.map((goal) => {
              const reminder = settings.reminders.find((r) => r.goalId === goal.id);
              return (
                <ReminderToggle
                  key={goal.id}
                  goal={goal}
                  reminder={reminder}
                  onToggle={handleReminderToggle}
                  onTimeChange={handleTimeChange}
                />
              );
            })}
          </View>
        )}
        {settings.globalEnabled && goals.length === 0 && (
          <View style={styles.item}>
            <Text style={styles.emptyHint}>Create goals first to set reminders</Text>
          </View>
        )}
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Version</Text>
          <Text style={styles.itemValue}>1.1.0</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Developer</Text>
          <Text style={styles.itemValue}>Hunnie-Bee Team</Text>
        </View>
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <TouchableOpacity
          style={styles.item}
          onPress={() => Linking.openURL('https://bag-full-of-shit.github.io/hunnie-bee/privacy-policy.html')}
        >
          <Text style={styles.itemLabel}>Privacy Policy</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => Linking.openURL('https://bag-full-of-shit.github.io/hunnie-bee/terms-of-service.html')}
        >
          <Text style={styles.itemLabel}>Terms of Service</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.dangerItem} onPress={handleClearData}>
          <Text style={styles.dangerText}>Delete All Local Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerEmoji}>🐝</Text>
        <Text style={styles.footerText}>
          Build habits, one step at a time
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
    padding: Spacing.base,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: Spacing.base,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FontSize.caption,
    fontWeight: '600',
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: Spacing.base,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.gray50,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  itemLabel: {
    fontSize: FontSize.body,
    color: Colors.gray700,
  },
  itemValue: {
    fontSize: FontSize.body,
    color: Colors.gray500,
    maxWidth: 200,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  nameInput: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.gray800,
    backgroundColor: Colors.gray50,
    padding: Spacing.sm,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: Colors.honey500,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: 8,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: FontSize.body,
    fontWeight: '600',
  },
  editableValue: {
    alignItems: 'flex-end',
  },
  editHint: {
    fontSize: FontSize.caption,
    color: Colors.honey500,
    marginTop: 2,
  },
  emptyHint: {
    fontSize: FontSize.bodyS,
    color: Colors.gray400,
    fontStyle: 'italic',
  },
  linkArrow: {
    fontSize: FontSize.h3,
    color: Colors.gray400,
  },
  dangerItem: {
    padding: Spacing.base,
  },
  dangerText: {
    fontSize: FontSize.body,
    color: Colors.error,
  },
  footer: {
    paddingVertical: Spacing['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  footerText: {
    fontSize: FontSize.body,
    color: Colors.gray500,
    textAlign: 'center',
  },
});
