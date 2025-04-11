import React from 'react'
import { View, Text, Button } from 'tamagui'
import { useNavigation } from '@react-navigation/native'

export default function ProfileScreen() {
  const navigation = useNavigation()

  return (
    <View flex={1} justifyContent="center" alignItems="center" bg="$background">
      <Text fontSize={24} fontWeight="bold" color="$color">
        Perfil do Usuário
      </Text>

      <Button
        mt="$4"
        size="$3"
        onPress={() => navigation.goBack()}
      >
        Voltar
      </Button>
    </View>
  )
}
