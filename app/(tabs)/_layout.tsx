import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image} from 'react-native';
import { HapticTab } from '@/src/components/HapticTab';
import TabBarBackground from '@/src/components/ui/TabBarBackground';
import { Colors } from '@/src/constants/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
        ios: {
          position: 'absolute',
        },
        default: {},
          }),
        }}>
        <Tabs.Screen
          name="calendar"
          options={{
        title: 'Calendrier',
        tabBarIcon: ({ color }) => (
          <Image 
            source={require('@/assets/images/icons/tabBar/calendar.png')} 
            style={{ width: 28, height: 28, tintColor: color }} 
          />
        ),
          }}
        />
        <Tabs.Screen
          name="competition"
          options={{
        title: 'Compétition',
        tabBarIcon: ({ color }) => 
          <Image 
              source={require('@/assets/images/icons/tabBar/competition.png')} 
              style={{ width: 28, height: 28, tintColor: color }} 
            />,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
        title: 'Carte',
        tabBarIcon: ({ color }) => 
          <Image 
            source={require('@/assets/images/icons/tabBar/map.png')} 
            style={{ width: 28, height: 28, tintColor: color }} 
          />,
          }}
        />
        <Tabs.Screen
          name="other"
          options={{
        title: 'Autre',
        tabBarIcon: ({ color }) => 
          <Image 
            source={require('@/assets/images/icons/tabBar/other.png')} 
            style={{ width: 28, height: 28, tintColor: color }} 
          />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}