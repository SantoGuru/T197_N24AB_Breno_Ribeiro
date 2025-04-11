import { FuncionarioResumo } from "@/types/types";
import { API_URL } from "app.config";

import { calcularHorasTrabalhadas, getDiasUteisNoMes } from "@/helpers/calculate-month-days";

export async function fetchFuncionarios(): Promise<
  FuncionarioResumo[]
> {
  const response = await fetch(API_URL + "/api/funcionarios/mes-atual");

  if (!response.ok) {
    throw new Error("Erro ao buscar funcionários");
  }

  const data: FuncionarioResumo[] = await response.json();

  const resumo: FuncionarioResumo[] = data.map((funcionario) => ({
    id: funcionario.id,
    nome: funcionario.nome,
    email: funcionario.email,
    cargaHoraria: funcionario.cargaHoraria,
    telefone: funcionario.telefone,
    horasTrabalhadas: funcionario.horasTrabalhadas,
    faltas: funcionario.faltas,
  }))

  return resumo;
}

export async function fetchFrequenciaFuncionario(funcionarioId: string, mes: string) {
  const response = await fetch(API_URL + `/api/frequencia?funcionarioId=${funcionarioId}&mes=${mes}`)

  if (!response.ok) {
    const errorText = await response.text();
    console.error("erro na resposta:", errorText);
    throw new Error("Erro ao buscar frequência do funcionário");
  }

  const data = await response.json();

  const registros = data.registros ?? [];
  const faltas = data.faltas ?? [];

  const [ano, mesStr] = mes.split("-");
  const totalDiasUteis = getDiasUteisNoMes(Number(ano), Number(mesStr));
  const horasMensais = totalDiasUteis * 8;

  const horasTrabalhadas = calcularHorasTrabalhadas(registros);

  const totalPresencas = registros.length;
  const totalFaltas = faltas.length;
  
  const porcentagemPresencas = Math.floor((totalPresencas / totalDiasUteis) * 100);
  const porcentagemFaltas = Math.floor((totalFaltas / totalDiasUteis) * 100);

  const diasMarcados: Record<string, any> = {};

  registros.forEach((registro: any) => {
    diasMarcados[registro.data] = {
      marked: true,
      dotColor: "#22c55e",
    };
  });

  faltas.forEach((falta: any) => {
    diasMarcados[falta.data] = {
      marked: true,
      dotColor: "#ef4444",
    };
  })

  return {
    horasTrabalhadas,
    horasMensais,
    porcentagemFaltas,
    porcentagemPresencas,
    totalPresencas,
    totalFaltas,
    diasMarcados,
  };
}