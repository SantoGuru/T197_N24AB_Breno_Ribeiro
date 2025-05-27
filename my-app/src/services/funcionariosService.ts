import { FuncionarioResumo } from "@/types/types";
import { API_URL } from "app.config";

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

export async function fetchFrequenciaFuncionario(funcionarioId: string, mes: string) {
  const response = await fetch(
    `${API_URL}/api/registros-ponto?funcionario_id=${funcionarioId}&mes=${mes}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao buscar registros de ponto");
  }

  return await response.json();
}
