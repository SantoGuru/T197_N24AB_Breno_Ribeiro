import { Button, Sheet, YStack, Text } from "tamagui";
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Pressable } from "react-native";
import { useRegistrarOuAtualizarPonto } from "@/hooks/useUpdateClockIn";
import { useRegistroPontoDia } from "@/hooks/useRegistroPontoDia";

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
  if (!str) return new Date();
  const [h, m] = str.split(":").map(Number);
  const d = new Date();
  d.setHours(h ?? 0, m ?? 0, 0, 0);
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

  console.log("registro dia: ", registroDia)

  useEffect(() => {
    const registro = Array.isArray(registroDia) && registroDia.length > 0 ? registroDia[0] : undefined;
    setValores({
      entrada: registro?.entrada ?? "",
      saida_almoco: registro?.saida_almoco ?? "",
      retorno_almoco: registro?.retorno_almoco ?? "",
      saida: registro?.saida ?? "",
    });
  }, [registroDia, selectedDay]);

  const handleChange = (campo: keyof typeof valores, valor: string) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  };

  const registrarOuAtualizarPonto = useRegistrarOuAtualizarPonto();

  const handleSalvar = () => {
    if (!selectedDay) return;
    registrarOuAtualizarPonto.mutate(
      {
        funcionario_id: funcionarioId,
        data: selectedDay,
        ...valores,
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame>
        <YStack p="$4" gap="$3">
          <Text fontSize="$7" fontWeight="bold">
            Pontos do dia {selectedDay}
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
                  <Text
                    color={valores[campo] ? "$color" : "$gray10"}
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "#ccc",
                      paddingVertical: 8,
                    }}
                  >
                    {valores[campo] || "Selecionar horário"}
                  </Text>
                </YStack>
                {picker === campo && (
                  <DateTimePicker
                    value={parseTime(valores[campo])}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
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
