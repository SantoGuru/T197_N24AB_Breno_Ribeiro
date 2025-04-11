// hooks/useFrequenciaFuncionario.ts
import { useQuery } from '@tanstack/react-query';
import { fetchFrequenciaFuncionario } from '@/services/funcionariosService';

export function useFrequenciaFuncionario(funcionarioId?: string, mes?: string) {
  return useQuery({
    queryKey: ['frequencia-funcionario', funcionarioId, mes],
    queryFn: () => fetchFrequenciaFuncionario(funcionarioId!, mes!),
    enabled: !!funcionarioId && !!mes,
  });
}
