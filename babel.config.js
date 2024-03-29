module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'nativewind/babel',
    [
      'module-resolver',
      {
        extensions: [
          '.ios.js',
          '.android.js',
          '.ios.jsx',
          '.android.jsx',
          '.js',
          '.jsx',
          '.json',
          '.ts',
          '.tsx',
        ],
        root: ['.'],
        alias: {
          '@assets': './src/assets',
          '@screens': './src/screens',
          '@components': './src/components',
          '@store': './src/store',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@navigators': './src/navigators',
        },
      },
    ],
  ],
};
