import { TamaguiProvider, Text, View } from 'tamagui'
import config from './tamagui.config'
import Navigation from './navigation/Navigation'

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <Navigation />
    </TamaguiProvider>
  )
}
