/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies are not allowed',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'no-app-to-app',
      severity: 'error',
      comment: 'Apps cannot import from other apps',
      from: {
        path: '^apps/[^/]+'
      },
      to: {
        path: '^apps/[^/]+',
        pathNot: '^apps/${source.path.split(\"/\")[1]}'
      }
    },
    {
      name: 'no-package-to-app',
      severity: 'error',
      comment: 'Packages cannot import from apps',
      from: {
        path: '^packages/'
      },
      to: {
        path: '^apps/'
      }
    },
    {
      name: 'no-deep-imports',
      severity: 'error',
      comment: 'No deep imports into packages',
      from: {},
      to: {
        path: '^packages/[^/]+/src/',
        pathNot: '^packages/[^/]+$'
      }
    },
    {
      name: 'no-supabase-outside-api',
      severity: 'error',
      comment: 'Supabase can only be imported in packages/api and supabase/functions',
      from: {
        pathNot: '^packages/api|^supabase/functions'
      },
      to: {
        path: '@supabase/supabase-js'
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json'
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'default']
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      },
      archi: {
        collapsePattern: '^(packages|src|lib|app)/[^/]+'
      }
    }
  }
};