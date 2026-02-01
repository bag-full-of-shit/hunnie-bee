import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useGoalStore } from '../stores/goalStore';
import { useBeeStore } from '../stores/beeStore';

export default function RootLayout() {
  const loadData = useGoalStore((state) => state.loadData);
  const loadBeeState = useBeeStore((state) => state.loadBeeState);

  useEffect(() => {
    loadData();
    loadBeeState();
  }, []);

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
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}
