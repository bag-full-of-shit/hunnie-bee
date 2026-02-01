import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Hunnie-Bee 🐝',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bee"
        options={{
          title: 'My Bee',
          headerTitle: 'My Bee 🐝',
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
