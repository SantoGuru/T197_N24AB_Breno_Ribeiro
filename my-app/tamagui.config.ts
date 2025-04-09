import { createTamagui } from 'tamagui'
import { config } from '@tamagui/config'

const tamaguiConfig = createTamagui(config)

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
