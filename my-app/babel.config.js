module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
        },
      ],
      'nativewind/babel',
      ['@tamagui/babel-plugin', {
        components: ['tamagui'],
        config: './tamagui.config.ts',
        logTimings: true
      }],
      'react-native-reanimated/plugin'
    ]
  }
}
