import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/types";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
} from "react-native";
import { z } from 'zod';
import { Stack, YStack, Text, Button } from "tamagui";
import { supabase } from '@/lib/supabase';

import Header from "@/components/Header";
import TextInput from "@/components/TextInput";

type Props = NativeStackScreenProps<RootStackParamList, "CreateAccount">;

const CreateAccountSchema = z
  .object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })

export default function CreateAccount({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleCriarConta = async () => {
    const resultado = CreateAccountSchema.safeParse({ email, senha, confirmarSenha});

    if (!resultado.success) {
      const erroMsg = resultado.error.issues[0].message;
      Alert.alert('Erro', erroMsg);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: "https://google.com/"
      }
    });
    
    if (error) {
      Alert.alert('Erro ao cadastrar: ', error.message);
      return;
    }

    Alert.alert('Conta criada!', 'Verifique seu e-mail para confirmar o cadastro');
    navigation.navigate('Login');
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Stack f={1}>
          <Header title="Cadastrar" />

          <YStack f={1} jc="center" px="$4" gap="$4">
            <Text textAlign="center" color="$blue10" fontSize="$8" mb="$10">
              Crie sua conta!
            </Text>

            <TextInput
              name="email"
              placeholder="Digite seu email..."
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              name="senha"
              password
              placeholder="Digite sua senha..."
              value={senha}
              onChangeText={setSenha}
            />
            <TextInput
              name="Confirmar senha"
              password
              placeholder="Digite sua senha..."
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            <Button
              alignSelf="center"
              mt="$6"
              bg="$blue10"
              color="$background"
              size="$6"
              width="$20"
              onPress={handleCriarConta}
            >
              Criar Conta
            </Button>
            <Text textAlign="center">
              Já possui conta?{" "}
              <Text
                color="$blue10"
                onPress={() => navigation.navigate("Login")}
              >
                Entre aqui
              </Text>
            </Text>
          </YStack>
        </Stack>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
