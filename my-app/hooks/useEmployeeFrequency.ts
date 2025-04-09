import { useEffect, useState } from "react";
import { calculateFrequency } from "../helper/calculate-frequency";
import transformDate from "../helper/date-formatter";

export function useEmployeeFrequency(funcionario: any, selectedMonth: string) {
  const [horasMensais, setHorasMensais] = useState(0);
  const [horasTrabalhadas, setHorasTrabalhadas] = useState(0);

  const [totalFaltas, setTotalFaltas] = useState(0);
  const [totalPresencas, setTotalPresencas] = useState(0);
  const [porcentagemPresencas, setPorcentagemPresencas] = useState(0);
  const [porcentagemFaltas, setPorcentagemFaltas] = useState(0);
  const [diasMarcados, setDiasMarcados] = useState<Record<string, any>>({});
  const [faltasFormatadas, setFaltasFormatadas] = useState<string[]>([]);

  useEffect(() => {
    const {
      horasMensais,
      horasTrabalhadas,
      faltasDoMes,
      totalFaltas,
      totalPresencas,
      porcentagemPresencas,
      porcentagemFaltas,
    } = calculateFrequency(funcionario, selectedMonth);

    setHorasMensais(horasMensais);
    setHorasTrabalhadas(horasTrabalhadas);
    setTotalFaltas(totalFaltas);
    setTotalPresencas(totalPresencas);
    setPorcentagemPresencas(porcentagemPresencas);
    setPorcentagemFaltas(porcentagemFaltas);

    const dias: Record<string, any> = {};
    const formatadas: string[] = [];

    faltasDoMes.forEach((data: string) => {
      dias[data] = { marked: true, dotColor: "red" };
      formatadas.push(transformDate(data));
    });

    setDiasMarcados(dias);
    setFaltasFormatadas(formatadas);
  }, [funcionario, selectedMonth]);

  return {
    horasMensais,
    horasTrabalhadas,
    totalFaltas,
    totalPresencas,
    porcentagemPresencas,
    porcentagemFaltas,
    diasMarcados,
    faltasFormatadas,
  };
}
