export type FrequencyData = {
  horasMensais: number;
  horasTrabalhadas: number;
  totalDias: number;
  totalFaltas: number;
  totalPresencas: number;
  porcentagemPresencas: number;
  porcentagemFaltas: number;
};

export type RootStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  Tabs: undefined;
};

export type HomeStackParamList = {
  Table: undefined;
  EmployeeDetails: { funcionarioId: string };
};

export type FuncionarioFormatado = {
  id: string;
  nome: string;
  email: string;
  cargaHoraria: number;
  telefone: string;
  horasTrabalhadas: number;
  faltas: {data: string}[];
  registros: {
    data: string;
    horas_trabalhadas: number;
  }[];
};

export type FuncionarioResumo = {
  id: string;
  nome: string;
  email: string;
  cargaHoraria: number;
  telefone: string;
  horasTrabalhadas: number;
  faltas: number;
}
