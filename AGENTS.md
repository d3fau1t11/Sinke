# Senik Monorepo — Agent Rules

This file defines mandatory conventions for all AI and human contributors. Every change must comply.

## 1. Repository Structure (Monorepo)

```
senik/
├── apps/
│   ├── customer/          # Capacitor Android (current Sinke code)
│   ├── merchant/          # Capacitor Android
│   ├── rider/             # Capacitor Android
│   └── admin/             # Vite React Web
├── packages/
│   ├── ui/                # Shared React components (Button, Card, Input, etc.)
│   ├── api/               # Typed Supabase client + TanStack Query hooks
│   ├── types/             # Generated Supabase types (source of truth)
│   ├── i18n/              # react-i18next setup, am/en JSON per feature
│   ├── utils/             # Pure TS utilities (dates, formatting, validation)
│   └── config/            # Shared tooling configs (eslint, tsconfig, tailwind, prettier)
├── supabase/
│   ├── migrations/        # Numbered SQL migrations
│   ├── seed/              # SQL seed scripts (from mockData.js)
│   ├── functions/         # Edge Functions (Deno)
│   │   └── _shared/       # Shared Deno code (payments, auth, validation)
│   └── tests/             # pgTAP policy tests
├── docs/
│   ├── architecture.md
│   ├── security.md
│   ├── payments.md
│   └── contributing.md
├── .cursor/rules/         # Cursor rules (symlink to AGENTS.md)
├── AGENTS.md              # This file
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

## 2. File & Component Limits

| Type | Max Lines |
|------|-----------|
| Component file | 150 |
| Hook / utility file | 200 |
| Service / store file | 200 |
| Test file | 300 |
| Migration file | 500 |

**One component per file.** No barrel exports that re-export components.

## 3. Business Logic Separation

- **Components**: Pure presentational. Receive data + callbacks via props. No `useEffect`, no async, no direct Supabase calls.
- **Hooks** (`features/*/hooks`): Encapsulate stateful logic, TanStack Query mutations, subscriptions.
- **Services** (`features/*/services`): Pure async functions calling `packages/api` modules.
- **Stores** (`features/*/store`): Zustand slices for client-only state (cart, UI preferences).
- **packages/api**: Only place importing `@supabase/supabase-js`. Exports typed query/mutation hooks.

## 4. Supabase Access Rules

- **Never** import `@supabase/supabase-js` outside `packages/api` and `supabase/functions`.
- **Never** use service-role key in apps. Only anon key + RLS.
- **Every new table** requires:
  1. Migration with `enable row level security`
  2. Policies per role (customer, merchant_staff, rider, admin)
  3. pgTAP tests in `supabase/tests/`

## 5. Verification Gate (`pnpm verify`)

Run **before every commit/MR**. Must pass all:

```bash
pnpm lint          # ESLint (max-lines 200, complexity, security plugin)
pnpm typecheck     # tsc --noEmit (strict mode)
pnpm test          # Vitest (unit) + Playwright (e2e)
pnpm build         # Turbo build (all apps + packages)
pnpm security      # gitleaks + pnpm audit --audit-level=high + eslint-plugin-security + supabase db lint + dist secret scan
```

## 6. Secrets & Environment

- **Never commit secrets** (`.env`, `google-services.json`, keystores, service-role keys).
- CI/CD variables: masked + protected.
- Apps read only `VITE_*` / `EXPO_PUBLIC_*` / `CAPACITOR_*` vars.
- Edge Functions read `SUPABASE_SERVICE_ROLE_KEY`, `PAYMENT_PROVIDER_*` from Supabase Vault / CI secrets.

## 6. Dependency Rules (enforced by dependency-cruiser)

- Apps **cannot** import from other apps.
- Apps **can** import from `packages/*`.
- Packages **cannot** import from apps.
- No deep imports: `import { Button } from '@senik/ui'` ✅, `import { Button } from '@senik/ui/src/Button'` ❌
- No circular dependencies.

## 7. Code Style

- **TypeScript strict**: `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- **Prettier**: Single quotes, trailing commas, 100 char line width
- **ESLint**: `eslint-plugin-security`, `max-lines: [error, 200]`, `max-lines-per-function: [error, 60]`, `complexity: [error, 10]`
- **Commits**: Conventional Commits enforced by commitlint + Husky pre-commit

## 8. Feature Folder Convention (apps/customer/src)

```
src/
├── app/                    # Router, providers, global layout
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── location/
│   ├── catalog/
│   ├── search/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── tracking/
│   ├── profile/
│   └── chat/
│       ├── components/     # Presentational only
│       ├── hooks/          # useAuth, useLogin, etc.
│       ├── services/       # loginUser, registerDevice, etc.
│       └── store/          # authStore (Zustand)
└── shared/                 # Truly generic hooks/components (useDebounce, ErrorBoundary)
```

## 9. Android Release Requirements

- `minifyEnabled true` + ProGuard rules per app
- Separate signing keystore per app (CI variables)
- `versionCode`/`versionName` from git tags (`v1.2.3` → 10203)
- Build flavors: `dev` / `staging` / `prod` → separate Supabase projects
- Play Console privacy policy + data safety form per app

## 10. Documentation Requirements

Every MR must update relevant docs:
- `docs/architecture.md` — monorepo layout, data flow, roles
- `docs/security.md` — RLS model, secret handling, security check coverage
- `docs/payments.md` — PaymentProvider interface, how to add Chapa/telebirr
- `CONTRIBUTING.md` — setup, branching, MR checklist
- `.gitlab/merge_request_templates/default.md` — checklist covering structure, refactoring, security

---

**Enforcement**: CI fails on any rule violation. No exceptions.