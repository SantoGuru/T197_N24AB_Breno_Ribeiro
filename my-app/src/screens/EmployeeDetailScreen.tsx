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
import Loading from "@/components/Loading";
import FetchError from "@/components/FetchError";
import { Skeleton } from "@/components/Skeleton";

type DetailScreenRouteProp = RouteProp<HomeStackParamList, "EmployeeDetails">;

export default function EmployeeDetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const { funcionarioId } = route.params;

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    () =>
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  const { data: funcionarios, isLoading: isLoadingFuncionarios } =
    useFuncionarios();
  const funcionario = useMemo(
    () => funcionarios?.find((f) => f.id === funcionarioId),
    [funcionarios, funcionarioId]
  );

  const {
    data: frequencia,
    isLoading: isLoadingFrequencia,
    isError,
    error,
  } = useFrequenciaFuncionario(funcionarioId, selectedMonth);

  const handleMonthChange = (month: { year: number; month: number }) => {
    const formatted = `${month.year}-${String(month.month).padStart(2, "0")}`;
    setSelectedMonth(formatted);
  };

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

function EmployeeDetailSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView f={1} px="$4" py="$10">
        <YStack gap="$4">
          <YStack gap="$2">
            <Skeleton width={200} height={20} borderRadius={8} />
            <Text color="$gray10">
              Horas Trabalhadas:{" "}
              <Skeleton width={10} height={14} borderRadius={6} />
            </Text>
            <Text color="$gray10">
              Horas Mensais:{" "}
              <Skeleton width={10} height={14} borderRadius={6} />
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" mb="$2">
              Frequência
            </Text>
            <Skeleton width="100%" height={20} borderRadius={10} />
            <Skeleton width="100%" height={20} borderRadius={10} />
            <XStack justifyContent="space-between" mt="$2">
              <Text color="$gray10">
                Presenças: <Skeleton width={10} height={16} borderRadius={6} />
              </Text>
              <Text color="$gray10">
                Faltas: <Skeleton width={10} height={16} borderRadius={6} />
              </Text>
            </XStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" mb="$2">
              Calendário
            </Text>
            <Skeleton width="100%" height={300} borderRadius={10} />
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  );
}
