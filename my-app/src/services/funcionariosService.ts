import { FuncionarioResumo } from "@/types/types";
import { API_URL } from "app.config";

import {
  calcularHorasTrabalhadas,
  getDiasUteisNoMesArray,
} from "@/helpers/calculate-month-days";

export async function fetchFuncionarios(): Promise<FuncionarioResumo[]> {
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
  }));

  return resumo;
}

export async function fetchFrequenciaFuncionario(
  funcionarioId: string,
  mes: string
) {
  const response = await fetch(
    API_URL + `/api/frequencia?funcionarioId=${funcionarioId}&mes=${mes}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("erro na resposta:", errorText);
    throw new Error("Erro ao buscar frequência do funcionário");
  }

  const data = await response.json();

  const frequencia = data.frequencia ?? [];

  const pontosPorDia: Record<string, {
    entrada?: string;
    saida_almoco?: string;
    retorno_almoco?: string;
    saida?: string;
  }> = {};
  frequencia.forEach((registro: any) => {
    pontosPorDia[registro.data] = {
      entrada: registro.entrada,
      saida_almoco: registro.saida_almoco,
      retorno_almoco: registro.retorno_almoco,
      saida: registro.saida,
    };
  });

  const diasMarcados: Record<string, any> = {};
  let totalPresencas = 0;
  let totalFaltas = 0;

  const hoje = new Date();

  frequencia.forEach((dia: any) => {
    const dataDia = new Date(dia.data);

    if (dia.status === "presente") {
      totalPresencas++;
      diasMarcados[dia.data] = { marked: true, dotColor: "#22c55e" };
    } else if (dia.status === "justificada") {
      diasMarcados[dia.data] = { marked: true, dotColor: "#fbbf24" };
    } else if (dia.status === "falta" ) {
      if (dataDia <= hoje) {
        totalFaltas++;
        diasMarcados[dia.data] = { marked: true, dotColor: "#ef4444" };
      }
    }
  });

  const [ano, mesStr] = mes.split("-");
  const diasUteisArray = getDiasUteisNoMesArray(Number(ano), Number(mesStr));
  const diasUteis = diasUteisArray.length;
  const horasMensais = diasUteis * 8;
  console.log("Dias uteis: ", diasUteis);

  const horasTrabalhadas = calcularHorasTrabalhadas(
    frequencia
      .filter((dia: any) => dia.status === "presente")
      .map((dia: any) => dia.registro)
  );

  const porcentagemPresencas = Math.floor(
    (totalPresencas / diasUteis) * 100
  );
  const faltasLimitadas = Math.min(totalFaltas, diasUteis);
  const porcentagemFaltas = Math.floor((faltasLimitadas / diasUteis) * 100);

  return {
    horasTrabalhadas,
    horasMensais,
    porcentagemFaltas,
    porcentagemPresencas,
    totalPresencas,
    totalFaltas,
    diasMarcados,
    pontosPorDia,
  };
}
