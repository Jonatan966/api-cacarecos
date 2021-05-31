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
    'babel-plugin-transform-typescript-metadata',
    [
      'module-resolver', 
      {
        alias: {
          '@controllers': './src/app/controllers',
          '@models': './src/app/models',
          '@database': './src/database',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@middlewares': './src/app/middlewares',
          '@providers': './src/providers',
          '@interfaces': './src/interfaces'
        }
      }
    ],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
