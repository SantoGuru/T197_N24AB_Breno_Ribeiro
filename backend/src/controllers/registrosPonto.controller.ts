import { Request, Response } from "express";
import { supabase } from "../services/supabase.service";
import { atualizarFrequenciaMensal } from "../services/frequencia.service";
import { calcularHoras } from "../helpers/calculate-month-days";

export async function registrarOuAtualizarPonto(req: Request, res: Response) {
  const { funcionario_id, data, entrada, saida_almoco, retorno_almoco, saida } =
    req.body;

  if (!funcionario_id || !data) {
    return res
      .status(400)
      .json({ error: "funcionario_id e data são obrigatórios" });
  }

  const { data: registrosExistentes, error: errorBusca } = await supabase
    .from("registros_ponto")
    .select("*")
    .eq("funcionario_id", funcionario_id)
    .eq("data", data)
    .maybeSingle();

  if (errorBusca) {
    return res.status(500).json({ error: errorBusca.message });
  }

  let errorOperacao;

  if (registrosExistentes) {
    const camposParaAtualizar: any = {};
    if (entrada !== undefined) camposParaAtualizar.entrada = entrada;
    if (saida_almoco !== undefined)
      camposParaAtualizar.saida_almoco = saida_almoco;
    if (retorno_almoco !== undefined)
      camposParaAtualizar.retorno_almoco = retorno_almoco;
    if (saida !== undefined) camposParaAtualizar.saida = saida;

    await supabase
      .from("registros_ponto")
      .update(camposParaAtualizar)
      .eq("id", registrosExistentes.id);
  } else {
    const { error } = await supabase
      .from("registros_ponto")
      .insert([
        { funcionario_id, data, entrada, saida_almoco, retorno_almoco, saida },
      ]);
    errorOperacao = error;
  }

  if (errorOperacao) {
    return res.status(500).json({ error: errorOperacao.message });
  }

  await supabase
    .from("faltas")
    .delete()
    .eq("funcionario_id", funcionario_id)
    .eq("data", data);

  const mes = data.slice(0, 7);
  await atualizarFrequenciaMensal(funcionario_id, mes);

  return res
    .status(200)
    .json({
      message:
        "Registro de ponto atualizado/criado, falta removida e frequência mensal atualizada.",
    });
}

export async function obterRegistrosPonto(req: Request, res: Response) {
  const { funcionario_id, data, mes } = req.query;

  if (!funcionario_id) {
    return res.status(400).json({ error: "funcionario_id é obrigatório" });
  }

  const mesString =
    typeof mes === "string"
      ? mes
      : Array.isArray(mes) && typeof mes[0] === "string"
      ? mes[0]
      : new Date().toISOString().slice(0, 7);
  const [ano, mesStr] = mesString.split("-");
  const diasNoMes = new Date(Number(ano), Number(mesStr), 0).getDate(); 
  const ultimoDiaStr = String(diasNoMes).padStart(2, "0");
  const dataFinal = `${ano}-${mesStr}-${ultimoDiaStr}`;

  let query = supabase
    .from("registros_ponto")
    .select("*")
    .eq("funcionario_id", funcionario_id);

  if (data) {
    query = query.eq("data", data);
  } else if (mes) {
    query = query.gte("data", `${mes}-01`).lte("data", dataFinal);
  }

  const { data: registros, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const { data: funcionarioData, error: errorFuncionario } = await supabase
    .from("funcionarios")
    .select("criado_em")
    .eq("id", funcionario_id)
    .maybeSingle();

  if (errorFuncionario) {
    return res.status(500).json({ error: errorFuncionario.message });
  }

  const criadoEm = funcionarioData?.criado_em
    ? new Date(funcionarioData.criado_em)
    : null;

  const hoje = new Date();
  const diasUteis: string[] = [];
  const hojeDate = new Date();
  for (let i = 1; i <= diasNoMes; i++) {
    const dataObj = new Date(Number(ano), Number(mesStr) - 1, i);
    const diaSemana = dataObj.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) {
      if (dataObj <= hojeDate && (!criadoEm || dataObj >= criadoEm)) {
        diasUteis.push(dataObj.toISOString().slice(0, 10));
      }
    }
  }

  const registrosMap = new Map(registros?.map(r => [r.data, r]) ?? []);

  let totalPresencas = 0;
  let totalFaltas = 0;
  const diasMarcados: Record<string, any> = {};
  const pontosPorDia: Record<string, any> = {};
  const registrosComStatus: any[] = [];

  diasUteis.forEach((data) => {
    const registro = registrosMap.get(data);
    if (registro && (registro.entrada || registro.saida || registro.saida_almoco || registro.retorno_almoco)) {
      totalPresencas++;
      diasMarcados[data] = { marked: true, dotColor: "#22c55e" };
      pontosPorDia[data] = {
        entrada: registro.entrada,
        saida_almoco: registro.saida_almoco,
        retorno_almoco: registro.retorno_almoco,
        saida: registro.saida,
      };
      registrosComStatus.push({ ...registro, status: "presente" });
    } else {
      totalFaltas++;
      diasMarcados[data] = { marked: true, dotColor: "#ef4444" };
      pontosPorDia[data] = {};
      registrosComStatus.push({ data, status: "falta" });
    }
  });

  const horasTrabalhadas = calcularHoras(
    registrosComStatus
      .filter((d: any) => d.status === "presente")
      .map((d: any) => d)
  );

  const horasMensais = diasUteis.length * 8;
  const porcentagemPresencas = Math.floor((totalPresencas / diasUteis.length) * 100);
  const porcentagemFaltas = Math.floor((totalFaltas / diasUteis.length) * 100);

  if (data) {
    // Retorna apenas o registro do dia solicitado
    const registroDoDia = registrosComStatus.find((r) => r.data === data);
    return res.json(registroDoDia ?? {});
  } else {
    // Retorna o resumo do mês inteiro
    return res.json({
      horasTrabalhadas,
      horasMensais,
      porcentagemPresencas,
      porcentagemFaltas,
      totalPresencas,
      totalFaltas,
      diasMarcados,
      pontosPorDia,
      registros: registrosComStatus,
    });
  }
}

export async function removerCampoPonto(req: Request, res: Response) {
  const { funcionario_id, data, campo } = req.body;

  const camposValidos = ["entrada", "saida_almoco", "retorno_almoco", "saida"];
  if (!funcionario_id || !data || !camposValidos.includes(campo)) {
    return res.status(400).json({ error: "funcionario_id, data e campo válido são obrigatórios" });
  }

  const { error } = await supabase
    .from("registros_ponto")
    .update({ [campo]: null })
    .eq("funcionario_id", funcionario_id)
    .eq("data", data);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const { data: registroAtualizado } = await supabase
    .from("registros_ponto")
    .select("id, entrada, saida_almoco, retorno_almoco, saida")
    .eq("funcionario_id", funcionario_id)
    .eq("data", data)
    .maybeSingle();

  if (
    registroAtualizado &&
    !registroAtualizado.entrada &&
    !registroAtualizado.saida_almoco &&
    !registroAtualizado.retorno_almoco &&
    !registroAtualizado.saida
  ) {
    await supabase
      .from("registros_ponto")
      .delete()
      .eq("id", registroAtualizado.id);
  }

  const mes = data.slice(0, 7);
  await atualizarFrequenciaMensal(funcionario_id, mes);

  return res.status(200).json({ message: `Campo ${campo} removido do registro de ponto.` });
}
