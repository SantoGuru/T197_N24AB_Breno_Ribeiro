// src/navigation/HomeStack.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Pressable } from 'react-native'

import TableScreen from '@/screens/TableScreen'
import EmployeeDetailScreen from '@/screens/EmployeeDetailScreen'
import { ChevronLeft } from 'lucide-react-native'
import { HomeStackParamList } from '@/types/types'

const Stack = createNativeStackNavigator<HomeStackParamList>()

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Table" component={TableScreen} />
      <Stack.Screen name="EmployeeDetails" component={EmployeeDetailScreen} options={({ navigation }) => ({
        title: 'Detalhes', headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} style={{ marginRight: 10}} />
          </Pressable>
        )
      })}/>
    </Stack.Navigator>
  )
}
