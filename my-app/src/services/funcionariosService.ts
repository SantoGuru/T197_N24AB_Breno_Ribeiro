import { FuncionarioFormatado } from "@/types/types";
import { API_URL } from "app.config";

export async function fetchFuncionarios(): Promise<
  FuncionarioFormatado[]
> {
  const response = await fetch(API_URL + "/api/funcionarios/mes-atual");

  if (!response.ok) {
    throw new Error("Erro ao buscar funcionários");
  }

  const data = await response.json();
  return data;
}

export async function fetchFrequenciaFuncionario(funcionarioId: string, mes: string) {
  const response = await fetch(API_URL + `/api/frequencia?funcionarioId=${funcionarioId}&mes=${mes}`)

  if (!response.ok) {
    const errorText = await response.text();
    console.error("erro na resposta:", errorText);
    throw new Error("Erro ao buscar frequência do funcionário");
  }

  return response.json();
}