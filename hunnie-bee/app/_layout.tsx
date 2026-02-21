import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useGoalStore } from '../stores/goalStore';
import { useBeeStore } from '../stores/beeStore';
import { Colors } from '../constants';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const loadData = useGoalStore((state) => state.loadData);
  const loadBeeState = useBeeStore((state) => state.loadBeeState);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadData(), loadBeeState()]);
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
