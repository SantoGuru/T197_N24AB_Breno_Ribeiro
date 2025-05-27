import { Button, Sheet, YStack, Text, XStack } from "tamagui";
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Pressable } from "react-native";
import { useRegistrarOuAtualizarPonto } from "@/hooks/useUpdateClockIn";
import { useRegistroPontoDia } from "@/hooks/useRegistroPontoDia";
import transformDate from "@/helpers/date-formatter";
import { useRemoverCampoPonto } from "@/hooks/useRemoverCampoPonto";

type PontosSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDay: string | null;
  registro?: {
    entrada?: string;
    saida_almoco?: string;
    retorno_almoco?: string;
    saida?: string;
  };
  funcionarioId: string;
  onSalvar?: (valores: {
    entrada?: string;
    saida_almoco?: string;
    retorno_almoco?: string;
    saida?: string;
  }) => void;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function parseTime(str?: string) {
  if (!str) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  // Aceita "HH:mm:ss" ou "HH:mm"
  const match = str.match(/^(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = match[3] ? Number(match[3]) : 0;
  const d = new Date();
  d.setHours(h, m, s, 0);
  return d;
}

export default function DaySheet({
  open,
  onOpenChange,
  selectedDay,
  registro,
  funcionarioId,
  onSalvar,
}: PontosSheetProps) {
  const [valores, setValores] = useState({
    entrada: registro?.entrada ?? "",
    saida_almoco: registro?.saida_almoco ?? "",
    retorno_almoco: registro?.retorno_almoco ?? "",
    saida: registro?.saida ?? "",
  });

  const [picker, setPicker] = useState<null | keyof typeof valores>(null);

  const { data: registroDia, isLoading: isLoadingRegistro } =
    useRegistroPontoDia(funcionarioId, selectedDay ?? undefined);

  useEffect(() => {
    setValores({
      entrada: registroDia?.entrada ?? "",
      saida_almoco: registroDia?.saida_almoco ?? "",
      retorno_almoco: registroDia?.retorno_almoco ?? "",
      saida: registroDia?.saida ?? "",
    });
  }, [registroDia, selectedDay]);

  const handleChange = (campo: keyof typeof valores, valor: string) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  };

  const registrarOuAtualizarPonto = useRegistrarOuAtualizarPonto();
  
  const handleSalvar = () => {
    if (!selectedDay) return;
    const payload = Object.fromEntries(
      Object.entries(valores).filter(([_, v]) => v)
    );
    registrarOuAtualizarPonto.mutate(
      {
        funcionario_id: funcionarioId,
        data: selectedDay,
        ...payload,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (err: any) => {
          alert(err.message || "Erro ao salvar ponto");
        },
      }
    );
  };

  const removerCampoPonto = useRemoverCampoPonto();

  const handleRemoverCampo = (campo: keyof typeof valores) => {
    if (!selectedDay) return;
    removerCampoPonto.mutate(
      {
        funcionario_id: funcionarioId,
        data: selectedDay,
        campo,
      },
      {
        onSuccess: () => {
          setValores((prev) => ({ ...prev, [campo]: "" }));
        },
        onError: (err: any) => {
          alert(err.message || "Erro ao remover campo");
        },
      }
    );
  };

  const [dia, mes] = transformDate(selectedDay!);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame>
        <YStack p="$4" gap="$3">
          <Text fontSize="$7" fontWeight="bold">
            {dia} de {mes}
          </Text>

          {isLoadingRegistro ? (
            <Text>Carregando registro...</Text>
          ) : (
            (
              ["entrada", "saida_almoco", "retorno_almoco", "saida"] as const
            ).map((campo) => (
              <Pressable key={campo} onPress={() => setPicker(campo)}>
                <YStack>
                  <Text>
                    {campo === "entrada" && "Entrada"}
                    {campo === "saida_almoco" && "Saída almoço"}
                    {campo === "retorno_almoco" && "Retorno almoço"}
                    {campo === "saida" && "Saída"}
                  </Text>
                  <XStack alignItems="center">
                    <Text
                      color={valores[campo] ? "$color" : "$gray10"}
                      style={{
                        borderBottomWidth: 1,
                        borderColor: "#ccc",
                        paddingVertical: 8,
                        flex: 1,
                      }}
                    >
                      {valores[campo].split(":").slice(0, 2).join(":") ||
                        "Selecionar horário"}
                    </Text>
                    {valores[campo] && (
                      <Button
                        size="$2"
                        ml="$2"
                        onPress={() => handleRemoverCampo(campo)}
                        disabled={removerCampoPonto.isLoading}
                        theme="red"
                      >
                        Remover
                      </Button>
                    )}
                  </XStack>
                </YStack>
                {picker === campo && (
                  <DateTimePicker
                    value={parseTime(valores[campo])}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    themeVariant="light"
                    onChange={(_, selectedDate) => {
                      setPicker(null);
                      if (selectedDate) {
                        handleChange(campo, formatTime(selectedDate));
                      }
                    }}
                  />
                )}
              </Pressable>
            ))
          )}

          <Button onPress={handleSalvar}>Salvar</Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
