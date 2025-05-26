import { Request, Response } from "express";
import { supabase } from "../services/supabase.service";
import { atualizarFrequenciaMensal } from "../services/frequencia.service";

export async function registrarOuAtualizarPonto(req: Request, res: Response) {
  const { funcionario_id, data, entrada, saida_almoco, retorno_almoco, saida } = req.body;

  if (!funcionario_id || !data) {
    return res.status(400).json({ error: "funcionario_id e data são obrigatórios" });
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
    if (saida_almoco !== undefined) camposParaAtualizar.saida_almoco = saida_almoco;
    if (retorno_almoco !== undefined) camposParaAtualizar.retorno_almoco = retorno_almoco;
    if (saida !== undefined) camposParaAtualizar.saida = saida;

    const { error } = await supabase
      .from("registros_ponto")
      .update(camposParaAtualizar)
      .eq("id", registrosExistentes.id);

    errorOperacao = error;
  } else {
    const { error } = await supabase
      .from("registros_ponto")
      .insert([{ funcionario_id, data, entrada, saida_almoco, retorno_almoco, saida }]);
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

  return res.status(200).json({ message: "Registro de ponto atualizado/criado, falta removida e frequência mensal atualizada." });
}

export async function obterRegistrosPonto(req: Request, res: Response) {
  const { funcionario_id, data, mes } = req.query;

  if (!funcionario_id) {
    return res.status(400).json({ error: "funcionario_id é obrigatório" });
  }

  let query = supabase
    .from("registros_ponto")
    .select("*")
    .eq("funcionario_id", funcionario_id);

  if (data) {
    query = query.eq("data", data);
  } else if (mes) {
   
    query = query.gte("data", `${mes}-01`).lte("data", `${mes}-31`);
  }

  const { data: registros, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(registros);
}