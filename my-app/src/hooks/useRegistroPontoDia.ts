import { useQuery } from "@tanstack/react-query";
import { API_URL } from "app.config";

export async function fetchRegistroPontoDia(funcionarioId: string, data: string) {
  const response = await fetch(
    `${API_URL}/api/registros-ponto?funcionario_id=${funcionarioId}&data=${data}`
  );
  if (!response.ok) throw new Error("Erro ao buscar registro do ponto");
  return await response.json();
}

export function useRegistroPontoDia(funcionarioId?: string, data?: string) {
  return useQuery({
    queryKey: ["registro-ponto-dia", funcionarioId, data],
    queryFn: () => fetchRegistroPontoDia(funcionarioId!, data!),
    enabled: !!funcionarioId && !!data,
  });
}