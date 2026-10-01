module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'customer',
        'merchant',
        'rider',
        'admin',
        'ui',
        'api',
        'types',
        'i18n',
        'utils',
        'config',
        'supabase',
        'ci',
        'docs',
        'deps',
        'auth',
        'orders',
        'payments',
        'tracking',
        'chat',
        'notifications'
      ]
    ],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100]
  }
};