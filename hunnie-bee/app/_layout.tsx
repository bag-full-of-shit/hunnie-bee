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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="goal/create"
        options={{
          presentation: 'modal',
          title: '새 목표 만들기',
        }}
      />
      <Stack.Screen
        name="goal/[id]"
        options={{
          title: '목표 상세',
        }}
      />
    </Stack>
  );
}
