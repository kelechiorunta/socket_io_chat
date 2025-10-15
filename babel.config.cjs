// module.exports = {
//   presets: [['@babel/preset-env', '@babel/preset-react', { targets: { node: 'current' } }]]
// };
module.exports = {
  presets: [
    '@babel/preset-env', // Transpile modern JS for Node.js
    '@babel/preset-react' // Convert JSX to standard JavaScript
  ],
  targets: { node: 'current' }
};
