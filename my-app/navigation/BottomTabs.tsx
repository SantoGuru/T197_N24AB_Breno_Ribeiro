import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'tamagui'
import { Image } from 'react-native';
import { LogOut, ChevronLeft } from 'lucide-react-native'

import TableScreen from '../screens/TableScreen'
import LogoutScreen from '../screens/Logout'
import ReturnScreen from '../screens/ReturnScreen';

const Tab = createBottomTabNavigator()

export default function BottomTabs() {

  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.orange7.val,
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
        name="Retornar"
        component={ReturnScreen}
        options={{
          tabBarLabel: "Voltar",
          tabBarIcon: ({ color, size }) => (
            <ChevronLeft color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={TableScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
           <Image 
            source={require('../assets/logo.png')}
            style={{
              width: size,
              height: size,
              tintColor: color ? '#FA934E' : "#FEFCFB"
            }}
           />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <LogOut color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
