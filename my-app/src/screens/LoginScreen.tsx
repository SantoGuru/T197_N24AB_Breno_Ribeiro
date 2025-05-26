import React, { useState } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/types";
import { Stack, YStack, Text, Button } from "tamagui";

import TextInput from "@/components/TextInput";
import Header from "@/components/Header";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
})

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  const handleLogin = async () => {
    const resultado = LoginSchema.safeParse({ email, senha });

    if (!resultado.success) {
      const erroMsg = resultado.error.issues[0].message;
      Alert.alert("Erro", erroMsg);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      Alert.alert("Erro ao entrar: ", error.message);
      return;
    }

    Alert.alert("Bem-vindo de volta!", "Você foi autenticado com sucesso.");
  }

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

            <TextInput
              id="login-email"
              name="email"
              placeholder="Digite seu email..."
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              id="login-password"
              name="senha"
              password
              placeholder="Digite sua senha..."
              value={senha}
              onChangeText={setSenha}
            />

            <Button
              alignSelf="center"
              mt="$6"
              bg="$blue10"
              color="$background"
              size="$6"
              width="$20"
              onPress={handleLogin}
            >
              Entrar
            </Button>
            <Text textAlign="center">
              Não possui conta?{" "}
              <Text
                color="$blue10"
                onPress={() => navigation.navigate("CreateAccount")}
              >
                Cadastre-se
              </Text>
            </Text>
          </YStack>
        </Stack>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
