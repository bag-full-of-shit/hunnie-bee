import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoalStore } from '../../stores/goalStore';
import { Colors, Spacing, FontSize } from '../../constants';

export default function SettingsScreen() {
  const loadData = useGoalStore((state) => state.loadData);

  const handleClearData = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 목표와 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            await loadData();
            Alert.alert('완료', '모든 데이터가 삭제되었습니다.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>앱 정보</Text>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>버전</Text>
          <Text style={styles.itemValue}>1.0.0</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>개발자</Text>
          <Text style={styles.itemValue}>Hunnie-Bee Team</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>데이터</Text>
        <TouchableOpacity style={styles.dangerItem} onPress={handleClearData}>
          <Text style={styles.dangerText}>모든 데이터 삭제</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerEmoji}>🐝</Text>
        <Text style={styles.footerText}>
          1년에 100번, 꾸준히 모아가는 습관
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
