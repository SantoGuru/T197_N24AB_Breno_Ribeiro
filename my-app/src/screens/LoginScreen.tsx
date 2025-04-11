import React from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/types";
import { Stack, YStack, Text, Button } from "tamagui";

import TextInput from "@/components/TextInput";
import Header from "@/components/Header";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Stack f={1}>
          <Header title="Entrar" />

          <YStack f={1} jc="center" px="$4" gap="$4">
            <Text textAlign="center" color="$blue10" fontSize="$8" mb="$10">
              Seja bem-vindo de volta
            </Text>

            <TextInput id="login-email" name="email" placeholder="Digite seu email..." />
            <TextInput
              id="login-password"
              name="senha"
              password
              placeholder="Digite sua senha..."
            />

            <Button
              alignSelf="center"
              mt="$6"
              bg="$blue10"
              color="$background"
              size="$6"
              width="$20"
              onPress={() => navigation.navigate("Tabs")}
            >
              Entrar
            </Button>
            <Text textAlign="center">
              Não possui conta? <Text color="$blue10" onPress={() => navigation.navigate('CreateAccount')}>Cadastre-se</Text>
            </Text>
          </YStack>
        </Stack>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
