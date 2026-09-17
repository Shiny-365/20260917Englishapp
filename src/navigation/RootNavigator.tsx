import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ListeningScreen from '../screens/ListeningScreen';
import SpeakingScreen from '../screens/SpeakingScreen';
import TutorScreen from '../screens/TutorScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { colors } from '../theme';

export type RootTabParamList = {
  Home: undefined;
  Listening: undefined;
  Speaking: undefined;
  Tutor: undefined;
  Progress: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Home: '🏠',
  Listening: '🎧',
  Speaking: '🎤',
  Tutor: '🤖',
  Progress: '📊',
};

const TAB_LABELS: Record<keyof RootTabParamList, string> = {
  Home: '홈',
  Listening: '듣기',
  Speaking: '말하기',
  Tutor: 'AI 튜터',
  Progress: '진행 상황',
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICONS[route.name as keyof RootTabParamList]}</Text>,
          tabBarLabel: TAB_LABELS[route.name as keyof RootTabParamList],
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Listening" component={ListeningScreen} />
        <Tab.Screen name="Speaking" component={SpeakingScreen} />
        <Tab.Screen name="Tutor" component={TutorScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
