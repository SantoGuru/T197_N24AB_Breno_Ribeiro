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

  const { data: registros, error: errorRegistros } = await supabase
    .from("registros_ponto")
    .select("data, entrada, saida_almoco, retorno_almoco, saida")
    .eq("funcionario_id", funcionarioId)
    .gte("data", inicioMes)
    .lte("data", fimMes);

  const { data: faltas, error: errorFaltas } = await supabase
    .from("faltas")
    .select("data, motivo")
    .eq("funcionario_id", funcionarioId)
    .gte("data", inicioMes)
    .lte("data", fimMes);

  if (errorRegistros || errorFaltas) {
    return res.status(500).json({ error: "Erro ao buscar dados" });
  }

  const registrosMap = new Map(registros?.map(r => [r.data, r]) ?? []);
  const faltasMap = new Map(faltas?.map(f => [f.data, f]) ?? []);

  const [ano, mesStr] = mes.toString().split("-");
  const diasNoMes = new Date(Number(ano), Number(mesStr), 0).getDate();
  const hoje = new Date();
  const ultimoDiaConsiderado =
    hoje.getFullYear() === Number(ano) && hoje.getMonth() + 1 === Number(mesStr)
      ? hoje.getDate()
      : diasNoMes;

  const dias: string[] = [];
  for (let i = 1; i <= ultimoDiaConsiderado; i++) {
    const dia = String(i).padStart(2, "0");
    const dataStr = `${ano}-${mesStr}-${dia}`;
    const dataObj = new Date(`${ano}-${mesStr}-${dia}T00:00:00`);
    const diaSemana = dataObj.getDay(); 
    if (diaSemana !== 0 && diaSemana !== 6) {
      dias.push(dataStr);
    }
  }

  const frequencia = dias.map(data => {
    if (registrosMap.has(data)) {
      return { data, status: "presente", registro: registrosMap.get(data) };
    } else if (faltasMap.has(data)) {
      const motivo = faltasMap.get(data)?.motivo;
      return { data, status: motivo ? "justificada" : "falta", motivo };
    } else {
      return { data, status: "falta" };
    }
  });

  return res.json({ frequencia });
}
