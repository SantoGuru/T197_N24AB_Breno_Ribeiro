import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';

import { Stack, YStack, Text, Button } from "tamagui";

import Header from '../components/Header';
import TextInput from "../components/TextInput";


type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export default function CreateAccount({ navigation }: Props) {
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
              Crie sua conta!
            </Text>

            <TextInput name="email" placeholder="Digite seu email..." />
            <TextInput
              name="senha"
              password
              placeholder="Digite sua senha..."
            />
            <TextInput
              name="Confirmar senha"
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
              Já possui conta? <Text color="$blue10" onPress={() => navigation.navigate('Login')}>Entre aqui</Text>
            </Text>
          </YStack>
        </Stack>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
