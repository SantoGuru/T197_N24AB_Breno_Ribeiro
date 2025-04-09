import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import data from "../libs/data.json";
import { funcionario } from "../navigation/HomeStack";

import { Text, ScrollView, YStack, XStack, Input, Button, View } from "tamagui";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";

export default function TableScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [search, setSearch] = useState("");

  const funcionarios: funcionario[] = data;
  const currentMonth = new Date().toISOString().slice(0, 7);

  const filteredData = funcionarios
    .filter((item) => item.nome.toLowerCase().includes(search.toLowerCase()))
    .map((item) => {
      const horas = item.horasTrabalhadas?.[currentMonth] ?? 0;
      const horasMensais = item.horasMensais?.[currentMonth] ?? 160;
      const faltasMes =
        item.faltas?.filter((dataFalta: string) =>
          dataFalta.startsWith(currentMonth)
        ) ?? [];

      return {
        ...item,
        horas,
        horasMensais,
        quantidadeFaltas: faltasMes.length,
      };
    });

  return (
    <ScrollView mt="$10">
      <XStack alignItems="center" gap="$2" px="$4" mb="$4">
        <Input
          flex={1}
          placeholder="Pesquisar..."
          value={search}
          onChangeText={setSearch}
        />
        <Button onPress={() => setSearch("")}>Limpar</Button>
      </XStack>
      <YStack p="$4" gap="$3">
        <XStack bg="$blue10" p="$2" borderRadius="$3" alignItems="center">
          <View flex={1}>
            <Text fontWeight="bold" color="white">
              Nome
            </Text>
          </View>
          <View flex={1}>
            <Text fontWeight="bold" color="white" textAlign="right">
              Horas/Total M.
            </Text>
          </View>
          <View flex={1}>
            <Text fontWeight="bold" color="white" textAlign="right">
              Faltas
            </Text>
          </View>
        </XStack>

        {filteredData.map((item, index) => (
          <XStack
            key={index}
            bg={index % 2 === 0 ? "$gray2" : "$gray8"}
            py="$3"
            px="$2"
            borderRadius="$2"
            alignItems="center"
          >
            <View flex={1}>
              <Text
                color="$blue10"
                onPress={() =>
                  navigation.navigate("EmployeeDetails", {
                    funcionario: {
                      nome: item.nome,
                      horasTrabalhadas: item.horasTrabalhadas,
                      horasMensais: item.horasTrabalhadas,
                      faltas: item.faltas,
                    },
                  })
                }
              >
                {item.nome}
              </Text>
            </View>

            <View flex={1}>
              <Text textAlign="right">
                {item.horas}/{item.horasMensais}
              </Text>
            </View>

            <View flex={1}>
              <Text textAlign="right">{item.quantidadeFaltas}</Text>
            </View>
          </XStack>
        ))}
      </YStack>
    </ScrollView>
  );
}
