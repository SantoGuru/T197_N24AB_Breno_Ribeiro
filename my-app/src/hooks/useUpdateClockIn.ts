import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clockIn } from "@/services/clockInService";

export function useRegistrarOuAtualizarPonto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clockIn,
    onSuccess: (_: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['frequencia-funcionario', variables.funcionario_id] });
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
    },
  });
}