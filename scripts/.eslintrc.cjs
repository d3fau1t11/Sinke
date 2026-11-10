module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['security'],
  extends: ['eslint:recommended', 'plugin:security/recommended', 'prettier'],
  rules: {
    'max-lines': ['error', 200],
    'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
    complexity: ['error', 10],
  },
};
