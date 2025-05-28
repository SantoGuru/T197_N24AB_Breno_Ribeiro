export function calcularHorasTrabalhadas(registros: any[]): number {
  let totalMinutos = 0;

  registros.forEach(registro => {
    if (registro.entrada && registro.saida) {
      const [hEntrada, mEntrada] = registro.entrada.split(":").map(Number);
      const [hSaida, mSaida] = registro.saida.split(":").map(Number);

      let minutosTrabalhados = (hSaida * 60 + mSaida) - (hEntrada * 60 + mEntrada);

      if (registro.saida_almoco && registro.retorno_almoco) {
        const [hSaidaAlmoco, mSaidaAlmoco] = registro.saida_almoco.split(":").map(Number);
        const [hRetornoAlmoco, mRetornoAlmoco] = registro.retorno_almoco.split(":").map(Number);
        minutosTrabalhados -= (hRetornoAlmoco * 60 + mRetornoAlmoco) - (hSaidaAlmoco * 60 + mSaidaAlmoco);
      }

      totalMinutos += minutosTrabalhados;
    }
  });

  return Math.floor(totalMinutos / 60);
}


export function calcularHoras(registros: any[]): number {
  let totalMinutos = 0;

  registros.forEach((registro) => {
    if (registro.entrada && registro.saida) {
      const [hEntrada, mEntrada] = registro.entrada.split(":").map(Number);
      const [hSaida, mSaida] = registro.saida.split(":").map(Number);
      let minutosTrabalhados = (hSaida * 60 + mSaida) - (hEntrada * 60 + mEntrada);

      if (
        registro.saida_almoco &&
        registro.retorno_almoco &&
        registro.saida_almoco.includes(":") &&
        registro.retorno_almoco.includes(":")
      ) {
        const [hSaidaAlmoco, mSaidaAlmoco] = registro.saida_almoco.split(":").map(Number);
        const [hRetornoAlmoco, mRetornoAlmoco] = registro.retorno_almoco.split(":").map(Number);

        const intervaloAlmoco = (hRetornoAlmoco * 60 + mRetornoAlmoco) - (hSaidaAlmoco * 60 + mSaidaAlmoco);

        if (intervaloAlmoco > 0) {
          minutosTrabalhados -= intervaloAlmoco;
        }
      }

      if (minutosTrabalhados > 0) {
        totalMinutos += minutosTrabalhados;
      }
    }
  });

  return Math.floor((totalMinutos / 60) * 100) / 100;
}
