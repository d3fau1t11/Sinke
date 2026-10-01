module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: ['./tsconfig/**.json'],
    tsconfigRootDir: __dirname
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'security'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:security/recommended',
    'prettier'
  ],
  settings: {
    react: { version: '18.3' },
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    }
  },
  rules: {
    'max-lines': ['error', 200],
    'max-lines-per-function': ['error', { max: 60, skipComments: true, skipBlankLines: true }],
    complexity: ['error', 10],
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-regexp': 'off',
    'security/detect-unsafe-regex': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
    'import/no-deep-imports': ['error', { patterns: ['@senik/*/src/**'] }],
    'import/no-cycle': 'error',
    'import/no-unresolved': 'error',
    'jsx-a11y/anchor-is-valid': 'off'
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: { 'max-lines': ['error', 300], 'max-lines-per-function': ['error', 80] }
    },
    {
      files: ['**/*.d.ts'],
      rules: { 'max-lines': 'off' }
    }
  ],
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '*.config.*', 'coverage/', '.turbo/']
};