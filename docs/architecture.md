# Senik Architecture

## Overview

Senik is a hyperlocal delivery platform for Addis Ababa, Ethiopia. It connects customers with local restaurants, grocery stores, pharmacies, and other businesses through a network of delivery riders.

## Monorepo Structure

```
senik/
├── apps/
│   ├── customer/          # Capacitor Android app for customers
│   ├── merchant/          # Capacitor Android app for business owners
│   ├── rider/             # Capacitor Android app for delivery riders
│   └── admin/             # Vite web app for administrators
├── packages/
│   ├── ui/                # Shared React components
│   ├── api/               # Supabase client + TanStack Query hooks
│   ├── types/             # Generated database types
│   ├── i18n/              # Internationalization (Amharic + English)
│   ├── utils/             # Pure TypeScript utilities
│   └── config/            # Shared tooling configs
├── supabase/
│   ├── migrations/        # Database migrations
│   ├── seed/              # Seed data
│   ├── functions/         # Edge Functions (Deno)
│   └── tests/             # pgTAP policy tests
└── docs/                  # Documentation
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Mobile | Capacitor 8 (Android) |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions) |
| State | Zustand (client), TanStack Query (server) |
| Routing | React Router |
| i18n | react-i18next |
| Validation | Zod |
| Testing | Vitest, Playwright |
| CI/CD | GitLab CI |

## Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Customer  │────▶│  Supabase   │◀────│   Merchant  │
│    App      │     │   Realtime  │     │    App      │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  PostgreSQL  │
                    │  + RLS       │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴────┐ ┌────┴────┐
        │  Orders   │ │Payments│ │ Messages│
        └───────────┘ └────────┘ └─────────┘
```

## Roles & Permissions

| Role | Description | Access |
|------|-------------|--------|
| `customer` | End user ordering food/goods | Own orders, addresses, profile |
| `merchant_staff` | Business owner/manager | Business orders, menu management |
| `rider` | Delivery person | Assigned orders, location tracking |
| `admin` | Platform administrator | Full access to all data |

## Security Model

### Row Level Security (RLS)

Every table has RLS enabled. Policies are defined per role:

- **Customers**: Can only read/write their own data (orders, addresses, messages)
- **Merchants**: Can only access their business's orders and products
- **Riders**: Can only see assigned orders and update their location
- **Admins**: Full access (bypasses RLS via service role)

### Secrets Management

- **Never** commit secrets to git
- CI/CD variables: masked + protected
- Apps use only `VITE_*` environment variables
- Edge Functions use Supabase Vault for service-role key
- `pnpm security` checks for secrets in `dist/` after build

## API Architecture

### Edge Functions

| Function | Purpose |
|----------|---------|
| `create-order` | Server-side order creation with price calculation |
| `validate-promo` | Promo code validation |
| `assign-rider` | Rider assignment logic |
| `update-order-status` | Status transition validation |
| `payment-initiate` | Payment provider integration |
| `payment-webhook` | Payment callback handler |
| `send-notification` | Push notification dispatch |

### Realtime Subscriptions

- Order status changes → Customer, Merchant apps
- Rider location updates → Customer app
- New messages → Customer, Rider apps
- New orders → Merchant app

## Feature Folder Convention

Each feature follows this structure:

```
src/features/{name}/
├── components/     # Presentational components (max 150 lines)
├── hooks/          # Custom hooks (useAuth, useCart, etc.)
├── services/       # API calls, business logic
└── store/          # Zustand store slices
```

## Build & Deployment

### Development

```bash
pnpm install
pnpm dev              # Start all apps
```

### Build

```bash
pnpm build            # Build all apps + packages
pnpm verify           # Full verification (lint, typecheck, test, build, security)
```

### Deployment

- **Apps**: Capacitor → Android APK/AAB → Play Store
- **Admin**: Vite → Static hosting (Vercel/Netlify)
- **Supabase**: Migrations applied via CI/CD
- **Edge Functions**: Deployed via Supabase CLI

## Environment Variables

### Apps (VITE_*)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_SENTRY_DSN` | Sentry error tracking |
| `VITE_POSTHOG_KEY` | PostHog analytics |

### Edge Functions (Supabase Vault)

| Variable | Description |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key |
| `PAYMENT_PROVIDER` | `mock`, `chapa`, or `telebirr` |
| `CHAPA_API_KEY` | Chapa payment API key |
| `TELEBIRR_API_KEY` | telebirr API key |
| `FCM_SERVER_KEY` | Firebase Cloud Messaging key |

## Monitoring & Observability

- **Sentry**: Error tracking in all apps + Edge Functions
- **PostHog**: Product analytics
- **Supabase Dashboard**: Database monitoring
- **GitLab CI**: Build and deployment logs