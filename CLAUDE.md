# Senik Monorepo

This is a pnpm + Turborepo monorepo for the Senik Ethiopian hyperlocal delivery platform.

## Quick Reference

- **Rules**: See `AGENTS.md` at the repo root for all mandatory conventions
- **Structure**: `apps/` (customer, merchant, rider, admin) + `packages/` (ui, api, types, i18n, utils, config)
- **Verify**: `pnpm verify` (lint, typecheck, test, build, security) — run before every commit
- **Database**: Supabase with RLS on every table. Migrations in `supabase/migrations/`
- **API**: Edge Functions in `supabase/functions/`. Shared code in `_shared/`
- **Docs**: `docs/architecture.md`, `docs/security.md`, `docs/payments.md`

## Key Conventions

- Feature-based folders: `src/features/{name}/{components,hooks,services,store}`
- Max 200 lines per file (150 for components)
- One component per file
- No business logic in components — use hooks/services
- No Supabase imports outside `packages/api` and `supabase/functions`
- TypeScript strict mode everywhere
- i18n: Amharic (am) and English (en) via `@senik/i18n`