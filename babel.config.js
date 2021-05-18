module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@controllers': './src/app/controllers',
        '@models': './src/app/models',
        '@database': './src/database',
        '@hooks': './src/hooks',
        '@utils': './src/utils',
        '@middlewares': './src/app/middlewares',
        '@providers': './src/providers'
      }
    },
    ],
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
