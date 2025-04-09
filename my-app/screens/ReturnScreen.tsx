import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'

export default function ReturnScreen() {
  const navigation = useNavigation()

  useEffect(() => {
    if(navigation.canGoBack()){
      navigation.goBack()
    }
  }, [])

  return <View /> 
}
