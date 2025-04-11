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
    nome: item.funcionario.nome,
    email: item.funcionario.email,
    cargaHoraria: item.funcionario.carga_horaria,
    telefone: item.funcionario.numero_telefone,
    horasTrabalhadas: item.horas_trabalhadas ?? 0,
    faltas: item.faltas ?? 0,
    registros: item.funcionario.registros_ponto ?? [],
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

  console.log("funcionarioId cru:", `"${funcionarioId}"`);


  console.log("Chamada para getFrequenciaFuncionario");
  console.log("funcionarioId:", funcionarioId, "mes:", mes);

  if (!funcionarioId || !mes) {
    console.log("Parâmetros ausentes");
    return res.status(400).json({ error: "Parâmetros obrigatórios ausentes" });
  }

  const inicioMes = `${mes}-01`;
  const fimMes = (() => {
    const [ano, mesStr] = (mes as string).split("-");
    const ultimoDia = new Date(Number(ano), Number(mesStr), 0).getDate();
    return `${ano}-${mesStr}-${String(ultimoDia).padStart(2, "0")}`;
  })();


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
    console.log("Erro nos dados", errorRegistros, errorFaltas);
    return res.status(500).json({ error: "Erro ao buscar dados" });
  }

  return res.json({ registros, faltas });
}
