import { supabase } from "../services/supabase.service";
import { atualizarFrequenciaMensal } from "../services/frequencia.service";

async function atualizarTodosFuncionariosFrequenciaMensal(mes: string) {
  // Busca todos os funcionários
  const { data: funcionarios, error } = await supabase
    .from("funcionarios")
    .select("id");

  if (error) {
    console.error("Erro ao buscar funcionários:", error.message);
    return;
  }

  for (const funcionario of funcionarios ?? []) {
    try {
      console.log(`Atualizando frequência para: ${funcionario.id} (${mes})`);
      await atualizarFrequenciaMensal(funcionario.id, mes);
      console.log(`OK para ${funcionario.id}`);
    } catch (e) {
      console.error(`Erro ao atualizar frequência de ${funcionario.id}:`, e);
    }
  }
}

const mesAtual = new Date().toISOString().slice(0, 7);

atualizarTodosFuncionariosFrequenciaMensal(mesAtual).then(() => {
  console.log("Processo concluído.");
  process.exit(0);
});