module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
  plugins: ['@babel/plugin-syntax-jsx', '@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-optional-chaining']
}
