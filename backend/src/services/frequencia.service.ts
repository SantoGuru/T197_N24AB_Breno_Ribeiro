import { calcularHorasTrabalhadas } from "../helpers/calculate-month-days";
import { supabase } from "../services/supabase.service";

export async function atualizarFrequenciaMensal(funcionarioId: string, mes: string) {
  const inicioMes = `${mes}-01`;
  const [ano, mesStr] = mes.split("-");
  const diasNoMes = new Date(Number(ano), Number(mesStr), 0).getDate();
  const hoje = new Date();
  const ultimoDiaConsiderado =
    hoje.getFullYear() === Number(ano) && hoje.getMonth() + 1 === Number(mesStr)
      ? hoje.getDate()
      : diasNoMes;

  const { data: registros } = await supabase
    .from("registros_ponto")
    .select("data, entrada, saida_almoco, retorno_almoco, saida")
    .eq("funcionario_id", funcionarioId)
    .gte("data", inicioMes)
    .lte("data", `${ano}-${mesStr}-${String(ultimoDiaConsiderado).padStart(2, "0")}`);

  const presencas = registros ? registros.length : 0;

  const faltas = ultimoDiaConsiderado - presencas;

  const horasTrabalhadas = calcularHorasTrabalhadas(registros ?? []);

  await supabase
    .from("frequencias_mensais")
    .upsert([
      {
        funcionario_id: funcionarioId,
        mes,
        presencas,
        faltas,
        horas_trabalhadas: horasTrabalhadas,
        horas_mensais: ultimoDiaConsiderado * 8, 
      },
    ], { onConflict: 'funcionario_id, mes' });
}