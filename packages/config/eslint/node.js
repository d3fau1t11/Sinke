const base = require('./base');

module.exports = {
  ...base,
  env: { node: true, es2022: true },
  parserOptions: {
    ...base.parserOptions,
    project: ['../tsconfig/node.json']
  },
  rules: {
    ...base.rules,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off'
  }
};