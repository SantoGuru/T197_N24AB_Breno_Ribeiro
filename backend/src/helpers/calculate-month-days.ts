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
    if (registro.entrada && registro.saida_almoco) {
      const [h1, m1] = registro.entrada.split(":").map(Number);
      const [h2, m2] = registro.saida_almoco.split(":").map(Number);
      const minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (minutos > 0) totalMinutos += minutos;
    }

    if (registro.retorno_almoco && registro.saida) {
      const [h1, m1] = registro.retorno_almoco.split(":").map(Number);
      const [h2, m2] = registro.saida.split(":").map(Number);
      const minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (minutos > 0) totalMinutos += minutos;
    }

    if (registro.entrada && registro.saida) {
      const [h1, m1] = registro.entrada.split(":").map(Number);
      const [h2, m2] = registro.saida.split(":").map(Number);
      let minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (registro.saida_almoco && registro.retorno_almoco) {
        const [ha1, ma1] = registro.saida_almoco.split(":").map(Number);
        const [ha2, ma2] = registro.retorno_almoco.split(":").map(Number);
        minutos -= (ha2 * 60 + ma2) - (ha1 * 60 + ma1);
      }
      
      if (minutos > 0) totalMinutos += minutos;
    }
  });

  return Math.floor((totalMinutos / 60) * 100) / 100;
}
