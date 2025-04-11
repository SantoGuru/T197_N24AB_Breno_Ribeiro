import { Request, Response } from "express";
import { supabase } from "../services/supabase.service";

export async function listarFuncionarios(req: Request, res: Response) {
  const { data, error } = await supabase.from("funcionarios").select("*");

  if (error) return res.status(500).json({ error: error.message });

  return res.json(data);
}

export async function getFuncionarios(req: Request, res: Response) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data, error } = await supabase
    .from("frequencias_mensais")
    .select(
      `
      horas_trabalhadas,
      faltas,
      funcionario:funcionario_id (
        id,
        nome,
        email,
        carga_horaria,
        numero_telefone
      )
    `
    )
    .eq("mes", currentMonth);

  if (error) return res.status(500).json({ error: error.message });

  const resultado = data.map((item: any) => ({
    id: item.funcionario.id,
    nome: item.funcionario.nome,
    email: item.funcionario.email,
    cargaHoraria: item.funcionario.carga_horaria,
    telefone: item.funcionario.numero_telefone,
    horasTrabalhadas: item.horas_trabalhadas ?? 0,
    faltas: item.faltas ?? 0
  }));

  return res.json(resultado);
}

function getUltimoDiaDoMes(mes: string): string {
  const [ano, mesStr] = mes.split("-");
  const ultimoDia = new Date(Number(ano), Number(mesStr), 0).getDate();
  return `${ano}-${mesStr}-${String(ultimoDia).padStart(2, "0")}`;
}

export async function getFrequenciaFuncionario(req: Request, res: Response) {
  const { funcionarioId, mes } = req.query;
  if (!funcionarioId || !mes) {

    return res.status(400).json({ error: "Parâmetros obrigatórios ausentes" });
  }

  const inicioMes = `${mes}-01`;
  const fimMes = getUltimoDiaDoMes(mes.toString());


  // FIXME: Corrigir essa query
  const { data: registros, error: errorRegistros } = await supabase
    .from("registros_ponto")
    .select("data, entrada, saida_almoco, retorno_almoco, saida")
    .eq("funcionario_id", funcionarioId)
    .gte("data", inicioMes)
    .lte("data", fimMes)

  const { data: faltas, error: errorFaltas } = await supabase
    .from("faltas")
    .select("data")
    .eq("funcionario_id", funcionarioId)
    .gte("data", inicioMes)
    .lte("data", fimMes);

  if (errorRegistros || errorFaltas) {
    return res.status(500).json({ error: "Erro ao buscar dados" });
  }

  return res.json({ registros, faltas });
}
