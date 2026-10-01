const base = require('./base');

module.exports = {
  ...base,
  parserOptions: {
    ...base.parserOptions,
    project: ['../tsconfig/react-app.json']
  },
  rules: {
    ...base.rules,
    'react-hooks/exhaustive-deps': 'warn'
  }
};