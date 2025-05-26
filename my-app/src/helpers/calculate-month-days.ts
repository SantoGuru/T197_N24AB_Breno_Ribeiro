import { useQuery } from "@tanstack/react-query";

export function getDiasUteisNoMesArray(ano: number, mes: number): string[] {
  const diasUteis: string[] = [];
  const ultimoDia = new Date(ano, mes, 0).getDate();

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasUteis.push(data.toISOString().split("T")[0]);
    }
  }

  return diasUteis;
}

export function calcularHorasTrabalhadas(registros: any[]): number {
  let totalHoras = 0;

  registros.forEach((r) => {
    const entrada = new Date(`1970-01-01T${r.entrada}`);
    const saida = new Date(`1970-01-01T${r.saida}`);
    const saidaAlmoco = new Date(`1970-01-01T${r.saida_almoco}`);
    const retornoAlmoco = new Date(`1970-01-01T${r.retorno_almoco}`);

    const horasTrabalhadasManha = (saidaAlmoco.getTime() - entrada.getTime()) / (1000 * 60 * 60);
    const horasTrabalhadasTarde = (saida.getTime() - retornoAlmoco.getTime()) / (1000 * 60 * 60);

    totalHoras += horasTrabalhadasManha + horasTrabalhadasTarde;
  });

  return Number(totalHoras.toFixed(2));
}

