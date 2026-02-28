import { useEffect, useState } from 'react';
import { Stack, Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useGoalStore } from '../stores/goalStore';
import { useBeeStore } from '../stores/beeStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useReminderStore } from '../stores/reminderStore';
import { Colors } from '../constants';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const loadData = useGoalStore((state) => state.loadData);
  const loadBeeState = useBeeStore((state) => state.loadBeeState);
  const { isCompleted, loadOnboardingState } = useOnboardingStore();
  const loadSettings = useReminderStore((state) => state.loadSettings);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        loadData(),
        loadBeeState(),
        loadOnboardingState(),
        loadSettings(),
      ]);
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.honey500} />
      </View>
    );
  }

  if (!isCompleted) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, title: '' }}
      />
      <Stack.Screen
        name="goal/create"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="goal/[id]"
        options={{
          title: 'Goal Details',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="goal/edit"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false }}
        redirect={true}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.honey50,
  },
});
