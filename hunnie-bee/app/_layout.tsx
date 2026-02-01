import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useGoalStore } from '../stores/goalStore';

export default function RootLayout() {
  const loadData = useGoalStore((state) => state.loadData);

  useEffect(() => {
    loadData();
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
