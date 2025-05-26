import { useQuery } from "@tanstack/react-query";
import { fetchFrequenciaFuncionario } from "@/services/funcionariosService";

export function useFrequenciaFuncionario(funcionarioId?: string, mes?: string) {
  return useQuery({
    queryKey: ["frequencia-funcionario", funcionarioId, mes],
    queryFn: () => fetchFrequenciaFuncionario(funcionarioId!, mes!),
    enabled: !!funcionarioId && !!mes,
    initialData: {
      horasTrabalhadas: 0,
      horasMensais: 0,
      porcentagemPresencas: 0,
      porcentagemFaltas: 0,
      totalPresencas: 0,
      totalFaltas: 0,
      diasMarcados: {},
      pontosPorDia: {},
    },
  });
}
