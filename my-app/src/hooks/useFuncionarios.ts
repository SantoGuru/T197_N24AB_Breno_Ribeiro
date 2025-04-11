
import { useQuery } from "@tanstack/react-query";
import { fetchFuncionarios } from "@/services/funcionariosService";

export function useFuncionarios() {
  return useQuery({
    queryKey: ["funcionarios"],
    queryFn: fetchFuncionarios,
    staleTime: 1000 * 60 * 5,
  });
}
