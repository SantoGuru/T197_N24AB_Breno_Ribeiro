import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@/hooks/useAuth";
import CreateAccount from "@/screens/CreateAccount";
import LoginScreen from "@/screens/LoginScreen";
import BottomTabs from "./BottomTabs";
import { RootStackParamList } from "@/types/types";
import Loading from "@/components/Loading";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { user, loading } = useAuth();

  if (loading) return <Loading>Aguarde...</Loading>;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <Stack.Screen name="Tabs" component={BottomTabs} />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Entrar" }}
            />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccount}
              options={{ title: "Criar Conta" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
