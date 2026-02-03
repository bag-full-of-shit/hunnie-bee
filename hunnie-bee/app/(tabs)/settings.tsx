import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoalStore } from '../../stores/goalStore';
import { useBeeStore } from '../../stores/beeStore';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSize } from '../../constants';

export default function SettingsScreen() {
  const loadData = useGoalStore((state) => state.loadData);
  const { bee, loadBeeState, renameBee } = useBeeStore();
  const { user, signOut } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBeeState();
    }, [loadBeeState])
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

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsSigningOut(true);
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
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
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Email</Text>
          <Text style={styles.itemValue} numberOfLines={1}>
            {user?.email || 'Not signed in'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.signOutItem}
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color={Colors.error} />
          ) : (
            <Text style={styles.signOutText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>

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

      {/* App Info Section */}
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
  signOutItem: {
    padding: Spacing.base,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: FontSize.body,
    color: Colors.error,
    fontWeight: '500',
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
