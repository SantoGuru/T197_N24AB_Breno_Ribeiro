import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { ScrollView, YStack, Text, XStack, Progress } from "tamagui";
import { Calendar } from "react-native-calendars";
import { HomeStackParamList } from "../navigation/HomeStack";
import { RouteProp } from "@react-navigation/native";
import { useEmployeeFrequency } from "../hooks/useEmployeeFrequency";

type DetailScreenRouteProp = RouteProp<HomeStackParamList, "EmployeeDetails">;

export default function EmployeeDetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const { funcionario } = route.params;

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const {
    horasMensais,
    horasTrabalhadas,
    totalFaltas,
    totalPresencas,
    porcentagemPresencas,
    porcentagemFaltas,
    diasMarcados,
    faltasFormatadas,
  } = useEmployeeFrequency(funcionario, selectedMonth);

  const handleMonthChange = (month: { year: number; month: number }) => {
    const formatted = `${month.year}-${String(month.month).padStart(2, "0")}`;
    setSelectedMonth(formatted);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView f={1} px="$4" py="$10">
        <YStack gap="$4">
          <YStack>
            <Text fontSize="$8" fontWeight="bold">
              {funcionario.nome}
            </Text>
            <Text color="$gray10">Horas Trabalhadas: {horasTrabalhadas}</Text>
            <Text color="$gray10">Horas Mensais: {horasMensais}</Text>
            <Text color="$gray10">Faltas: {faltasFormatadas.join(", ")}</Text>
          </YStack>

          <YStack>
            <Text fontSize="$6" mb="$2">
              Frequência
            </Text>

            <Progress
              value={porcentagemPresencas}
              backgroundColor="$gray6"
              height={20}
              borderRadius={10}
            >
              <Progress.Indicator backgroundColor="$green10" />
            </Progress>

            <Progress
              value={porcentagemFaltas}
              backgroundColor="$gray6"
              height={20}
              borderRadius={10}
              mt="$2"
            >
              <Progress.Indicator backgroundColor="$red10" />
            </Progress>

            <XStack justifyContent="space-between" mt="$2">
              <Text color="$gray10">Presenças: {totalPresencas}</Text>
              <Text color="$gray10">Faltas: {totalFaltas}</Text>
            </XStack>
          </YStack>

          <YStack>
            <Text fontSize="$6" mb="$2">
              Calendário
            </Text>
            <Calendar
              markedDates={diasMarcados}
              onMonthChange={handleMonthChange}
              theme={{
                selectedDayBackgroundColor: "#D92B06",
                todayTextColor: "#FA934E",
                arrowColor: "#FA934E",
              }}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  );
}
