import { FrequencyData } from '@/types/types';
export function calculateFrequency(
  registros: { data: string; horas_trabalhadas: number }[],
  selectedMonth: string,
  horasPorDia: number = 5
): FrequencyData {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth();

  const [anoSelecionado, mesSelecionado] = selectedMonth.split("-").map(Number);
  const isFuturo = anoSelecionado > anoAtual || (anoSelecionado === anoAtual && mesSelecionado > mesAtual + 1);

  const registrosDoMes = registros.filter(r => r.data.startsWith(selectedMonth));
  const diasComRegistro = new Set(registrosDoMes.map(r => r.data));

  const horasTrabalhadas = registrosDoMes.reduce(
    (total, r) => total + r.horas_trabalhadas,
    0
  );

  const ultimoDia = new Date(anoSelecionado, mesSelecionado, 0).getDate();
  const totalDias = ultimoDia;

  const totalPresencas = isFuturo ? 0 : diasComRegistro.size;
  const totalFaltas = isFuturo ? 0 : totalDias - totalPresencas;

  const horasMensais = totalDias * horasPorDia;

  return {
    horasMensais,
    horasTrabalhadas,
    totalDias,
    totalFaltas,
    totalPresencas,
    porcentagemPresencas: Math.floor((totalPresencas / totalDias) * 100),
    porcentagemFaltas: Math.floor((totalFaltas / totalDias) * 100),
  };
}
