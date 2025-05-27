import { useMemo, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { ScrollView, YStack, Text, XStack, Progress, Spinner } from "tamagui";
import { Calendar } from "react-native-calendars";
import { RouteProp } from "@react-navigation/native";
import { HomeStackParamList } from "@/types/types";
import "@/helpers/config/config-calendar";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useFrequenciaFuncionario } from "@/hooks/useFrequenciaUsuario";
import FetchError from "@/components/FetchError";
import { EmployeeDetailSkeleton } from "./EmployeeDetailSkeleton";
import PontosSheet from "./DaySheet";

type DetailScreenRouteProp = RouteProp<HomeStackParamList, "EmployeeDetails">;

export default function EmployeeDetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const { funcionarioId } = route.params;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDay(day.dateString);
    setSheetOpen(true);
  };
 
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    () =>
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  const { data: funcionarios, isLoading: isLoadingFuncionarios } =
    useFuncionarios();
  const funcionario = useMemo(
    () => funcionarios?.find((f: any) => f.id === funcionarioId),
    [funcionarios, funcionarioId]
  );

  const {
    data: frequencia,
    isLoading: isLoadingFrequencia,
    isError,
    error,
  } = useFrequenciaFuncionario(funcionarioId, selectedMonth);

  console.log("Frequencia: ", frequencia);

  const handleMonthChange = (month: { year: number; month: number }) => {
    const formatted = `${month.year}-${String(month.month).padStart(2, "0")}`;
    setSelectedMonth(formatted);
  };

  const registroPonto =
    selectedDay && frequencia?.pontosPorDia && frequencia.pontosPorDia[selectedDay]
      ? frequencia.pontosPorDia[selectedDay]
      : undefined;

  if (isLoadingFuncionarios || isLoadingFrequencia) {
    return <EmployeeDetailSkeleton />;
  }

  if (!funcionario) {
    return <FetchError>Funcionário não encontrado!</FetchError>;
  }

  if (isError || !frequencia) {
    return <FetchError>Erro ao carregar dados de frequência</FetchError>;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView f={1} px="$4" py="$10">
        <YStack gap="$4">
          <YStack>
            <Text fontSize="$8" fontWeight="bold">
              {funcionario.nome}
            </Text>
            <Text color="$gray10">
              Horas Trabalhadas: {frequencia.horasTrabalhadas}
            </Text>
            <Text color="$gray10">
              Horas Mensais: {frequencia.horasMensais}
            </Text>
          </YStack>

          <YStack>
            <Text fontSize="$6" mb="$2">
              Frequência
            </Text>

            <Progress
              value={frequencia.porcentagemPresencas}
              backgroundColor="$gray6"
              height={20}
              borderRadius={10}
            >
              <Progress.Indicator backgroundColor="$green10" />
            </Progress>

            <Progress
              value={frequencia.porcentagemFaltas}
              backgroundColor="$gray6"
              height={20}
              borderRadius={10}
              mt="$2"
            >
              <Progress.Indicator backgroundColor="$red10" />
            </Progress>

            <XStack justifyContent="space-between" mt="$2">
              <Text color="$gray10">
                Presenças: {frequencia.totalPresencas}
              </Text>
              <Text color="$gray10">Faltas: {frequencia.totalFaltas}</Text>
            </XStack>
          </YStack>

          <YStack>
            <Text fontSize="$6" mb="$2">
              Calendário
            </Text>
            <Calendar
              markedDates={frequencia.diasMarcados}
              onMonthChange={handleMonthChange}
              onDayPress={handleDayPress}
              theme={{
                selectedDayBackgroundColor: "#D92B06",
                todayTextColor: "#FA934E",
                arrowColor: "#FA934E",
              }}
            />
          </YStack>
        </YStack>
      </ScrollView>
      {sheetOpen && selectedDay && (
        <PontosSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          selectedDay={selectedDay}
          registro={registroPonto}
          funcionarioId={funcionarioId}
        />
      )}
    </View>
  );
}
