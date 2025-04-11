
import { useQuery } from "@tanstack/react-query";
import { fetchFuncionarios } from "@/services/funcionariosService";
import { FuncionarioResumo } from "@/types/types";

export function useFuncionarios() {
  return useQuery<FuncionarioResumo[]>({
    queryKey: ["funcionarios"],
    queryFn: fetchFuncionarios,
    staleTime: 1000 * 60 * 5,
  });
}
