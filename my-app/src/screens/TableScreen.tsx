import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import {
  Text,
  ScrollView,
  YStack,
  XStack,
  Input,
  Button,
  View,
  Spinner,
} from "tamagui";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/types/types";
import Loading from "@/components/Loading";
import FetchError from "@/components/FetchError";

export default function TableScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useFuncionarios();

  if (isLoading) {
    return <Loading>Carregando funcionários..."</Loading>;
  }

  if (isError) {
    return (
      <FetchError>
        Erro ao carregar dados. Tente novamente mais tarde.
      </FetchError>
    );
  }

  const filteredData =
    data?.filter((item) =>
      item.nome.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

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
              Horas
            </Text>
          </View>
          <View flex={1}>
            <Text fontWeight="bold" color="white" textAlign="right">
              Faltas
            </Text>
          </View>
        </XStack>

        {filteredData?.map((item, index) => (
          <XStack
            key={item.id}
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
                    funcionarioId: item.id,
                  })
                }
              >
                {item.nome}
              </Text>
            </View>
            <View flex={1}>
              <Text textAlign="right">
                {item.horasTrabalhadas}/{item.cargaHoraria}
              </Text>
            </View>
            <View flex={1}>
              <Text textAlign="right">{item.faltas}</Text>
            </View>
          </XStack>
        ))}
      </YStack>
    </ScrollView>
  );
}
