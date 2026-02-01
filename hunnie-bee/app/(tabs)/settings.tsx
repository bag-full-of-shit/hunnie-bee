import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoalStore } from '../../stores/goalStore';
import { Colors, Spacing, FontSize } from '../../constants';

export default function SettingsScreen() {
  const loadData = useGoalStore((state) => state.loadData);

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
            await AsyncStorage.clear();
            await loadData();
            Alert.alert('Done', 'All data has been deleted.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Version</Text>
          <Text style={styles.itemValue}>1.0.0</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Developer</Text>
          <Text style={styles.itemValue}>Hunnie-Bee Team</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.dangerItem} onPress={handleClearData}>
          <Text style={styles.dangerText}>Delete All Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerEmoji}>🐝</Text>
        <Text style={styles.footerText}>
          Build habits, one step at a time
        </Text>
      </View>
    </View>
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
  },
  dangerItem: {
    padding: Spacing.base,
  },
  dangerText: {
    fontSize: FontSize.body,
    color: Colors.error,
  },
  footer: {
    flex: 1,
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
