import React, { useState } from "react";
import { Text, ScrollView, YStack, XStack, Input, Button } from "tamagui";

const data = [
  { nome: "João Silva", horas: "40h", faltas: "0", horasMensais: "160h" },
  { nome: "Maria Oliveira", horas: "35h", faltas: "2", horasMensais: "160h" },
  { nome: "Carlos Souza", horas: "42h", faltas: "1", horasMensais: "160h" },
  { nome: "Ana Costa", horas: "38h", faltas: "0", horasMensais: "160h" },
  { nome: "Fernanda Lima", horas: "37h", faltas: "1", horasMensais: "160h" },
  { nome: "Bruno Almeida", horas: "44h", faltas: "3", horasMensais: "160h" },
  { nome: "Juliana Martins", horas: "36h", faltas: "0", horasMensais: "160h" },
  { nome: "Tiago Rocha", horas: "39h", faltas: "2", horasMensais: "160h" },
  { nome: "Larissa Ribeiro", horas: "40h", faltas: "0", horasMensais: "160h" },
  { nome: "André Fernandes", horas: "41h", faltas: "1", horasMensais: "160h" },
  { nome: "Patrícia Azevedo", horas: "43h", faltas: "0", horasMensais: "160h" },
  { nome: "Rafael Cardoso", horas: "35h", faltas: "2", horasMensais: "160h" },
  { nome: "Luciana Mendes", horas: "38h", faltas: "0", horasMensais: "160h" },
  { nome: "Gabriel Teixeira", horas: "40h", faltas: "1", horasMensais: "160h" },
  { nome: "Mariana Duarte", horas: "36h", faltas: "2", horasMensais: "160h" },
  { nome: "Eduardo Barros", horas: "39h", faltas: "0", horasMensais: "160h" },
  { nome: "Beatriz Rezende", horas: "42h", faltas: "1", horasMensais: "160h" },
  { nome: "Felipe Batista", horas: "37h", faltas: "3", horasMensais: "160h" },
  { nome: "Isabela Moraes", horas: "38h", faltas: "0", horasMensais: "160h" },
  { nome: "Vinícius Pinto", horas: "40h", faltas: "1", horasMensais: "160h" },
  { nome: "Sofia Nascimento", horas: "34h", faltas: "2", horasMensais: "160h" },
  { nome: "Leonardo Maciel", horas: "43h", faltas: "0", horasMensais: "160h" },
  { nome: "Camila Farias", horas: "36h", faltas: "1", horasMensais: "160h" },
  { nome: "Marcelo Braga", horas: "41h", faltas: "0", horasMensais: "160h" },
  { nome: "Aline Vieira", horas: "39h", faltas: "2", horasMensais: "160h" },
]


export default function TableScreen() {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <ScrollView mt="$10">
    <XStack alignItems="center" gap="$2">
      <Input flex={1} placeholder="Pesquisar..." value={search} onChangeText={setSearch}/>
      <Button onPress={() => setSearch("")}>Limpar</Button> 
    </XStack>
        <YStack p="$4" gap="$4">
          <XStack bg="$blue10" p="$2" borderRadius="$3">
            <Text flex={1} fontWeight="bold" color="white">
              Nome
            </Text>
            <Text flex={1} fontWeight="bold" color="white">
              Horas/Total M.
            </Text>
            <Text flex={1} fontWeight="bold" color="white">
              Faltas
            </Text>
          </XStack>

          {filteredData.map((item, index) => (
            <XStack
              key={index}
              bg={index % 2 === 0 ? "$gray2" : "$gray8"}
              py="$3"
              px="$2"
              borderRadius="$2"
            >
              <Text flex={1}>{item.nome}</Text>
              <Text flex={1}>{item.horas}/{item.horasMensais}</Text>
              <Text flex={1}>{item.faltas}</Text>
            </XStack>
          ))}
        </YStack>
      </ScrollView>
  );
}
