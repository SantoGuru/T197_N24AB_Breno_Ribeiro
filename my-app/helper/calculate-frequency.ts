type FrequencyData = {
    horasMensais: number;
    horasTrabalhadas: number;
    faltasDoMes: string[];
    totalDias: number;
    totalFaltas: number;
    totalPresencas: number;
    porcentagemPresencas: number;
    porcentagemFaltas: number;
  };
  
  export function calculateFrequency(
    funcionario: {
      faltas: string[];
      horasMensais: Record<string, number>;
      horasTrabalhadas: Record<string, number>;
    },
    selectedMonth: string
  ): FrequencyData {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();
  
    const [anoSelecionado, mesSelecionado] = selectedMonth
      .split("-")
      .map(Number);
  
    const isFuturo =
      anoSelecionado > anoAtual ||
      (anoSelecionado === anoAtual && mesSelecionado > mesAtual + 1);
  
    const faltasDoMes = funcionario.faltas.filter((falta) =>
      falta.startsWith(selectedMonth)
    );
  
    const date = new Date(anoSelecionado, mesSelecionado, 0); // dia 0 do mês seguinte = último dia do mês atual
    const totalDias = date.getDate();
  
    const horasMensais = funcionario.horasMensais[selectedMonth] ?? 0;
    const horasTrabalhadas = funcionario.horasTrabalhadas[selectedMonth] ?? 0;
  
    const totalFaltas = isFuturo ? 0 : faltasDoMes.length;
    const totalPresencas = isFuturo ? 0 : totalDias - totalFaltas;
  
    const porcentagemPresencas = Math.floor((totalPresencas / totalDias) * 100);
    const porcentagemFaltas = Math.floor((totalFaltas / totalDias) * 100);
  
    return {
      horasMensais,
      horasTrabalhadas,
      faltasDoMes,
      totalDias,
      totalFaltas,
      totalPresencas,
      porcentagemPresencas,
      porcentagemFaltas,
    };
  }
  