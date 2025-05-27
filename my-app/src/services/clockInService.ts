import { API_URL } from "app.config";

type ClockInParams = {
  funcionario_id: string;
  data: string;
  entrada?: string;
  saida_almoco?: string;
  retorno_almoco?: string;
  saida?: string;
};

export async function clockIn(params: ClockInParams) {
  const body = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined)
  );

  const response = await fetch(API_URL + "/api/registros-ponto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao registrar/atualizar ponto");
  }

  return await response.json();
}