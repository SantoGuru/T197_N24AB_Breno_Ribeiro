import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "app.config";

async function removerCampoPonto({
  funcionario_id,
  data,
  campo,
}: {
  funcionario_id: string;
  data: string;
  campo: "entrada" | "saida_almoco" | "retorno_almoco" | "saida";
}) {
  const response = await fetch(`${API_URL}/api/registros-ponto/remover-campo`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ funcionario_id, data, campo }),
  });
  if (!response.ok) {
    throw new Error("Erro ao remover campo");
  }
  return await response.json();
}

export function useRemoverCampoPonto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removerCampoPonto,
    onSuccess: (_data: any, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: ["registro-ponto-dia", variables.funcionario_id, variables.data],
      });
      queryClient.invalidateQueries({
        queryKey: ["frequencia-funcionario", variables.funcionario_id],
      });
    },
  });
}