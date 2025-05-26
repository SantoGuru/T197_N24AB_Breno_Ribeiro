import { API_URL } from "app.config";

export async function clockIn({
  funcionario_id,
  data,
  entrada,
  saida_almoco,
  retorno_almoco,
  saida,
}: {
  funcionario_id: string;
  data: string;
  entrada?: string;
  saida_almoco?: string;
  retorno_almoco?: string;
  saida?: string;
}) {
  const response = await fetch(API_URL + "/api/registros-ponto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ funcionario_id, data, entrada, saida_almoco, retorno_almoco, saida }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao registrar/atualizar ponto");
  }

  return await response.json();
}

