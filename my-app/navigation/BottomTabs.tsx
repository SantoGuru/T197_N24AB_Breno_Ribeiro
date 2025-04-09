import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {  useTheme } from 'tamagui'
import { Image } from 'react-native';
import { LogOut, House } from 'lucide-react-native'

import LogoutScreen from '../screens/Logout'
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator()

export default function BottomTabs() {

  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.color8.val,
        tabBarInactiveTintColor: theme.color8.val,
        tabBarStyle: {
          backgroundColor: theme.blue10.val,
          borderTopWidth: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: "Sair",
          tabBarIcon: ({ color, size }) => (
            <LogOut color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
