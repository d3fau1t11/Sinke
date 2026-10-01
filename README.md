# Senik (ስንᅅ)

**Hyperlocal Ethiopian Delivery Platform**

Senik is a modern delivery platform connecting customers with local businesses in Addis Ababa's condominium zones. Order food, groceries, pharmacy items, and more — delivered fast by local riders.

## Features

- **Customer App** (Android): Browse businesses, place orders, live tracking, chat with riders
- **Merchant App** (Android): Receive orders, manage menu, track sales
- **Rider App** (Android**: Accept jobs, navigate deliveries, track earnings
- **Admin Portal** (Web): Manage platform, view analytics, handle disputes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Mobile | Capacitor 8 (Android) |
| Backend | Supabase (PostgreSQL, Auth, Realtime, Edge Functions) |
| State | Zustand + TanStack Query |
| i18n | react-i18next (Amharic + English) |
| Testing | Vitest, Playwright |
| CI/CD | GitLab CI |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Android Studio (for mobile apps)
- Supabase CLI (for local development)

### Installation

```bash
# Clone repository
git clone https://gitlab.com/senik/senik.git
cd senik

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development
pnpm dev
```

### Database Setup

```bash
# Start local Supabase
supabase start

# Run migrations
supabase db push

# Seed database
supabase db seed
```

## Project Structure

```
senik/
├── apps/
│   ├── customer/          # Customer Android app
│   ├── merchant/          # Merchant Android app
│   ├── rider/             # Rider Android app
│   └── admin/             # Admin web portal
├── packages/
│   ├── ui/                # Shared components
│   ├── api/               # Supabase client + hooks
│   ├── types/             # Database types
│   ├── i18n/              # Translations
│   ├── utils/             # Utilities
│   └── config/            # Shared configs
├── supabase/
│   ├── migrations/        # Database migrations
│   ├── seed/              # Seed data
│   ├── functions/         # Edge Functions
│   └── tests/             # Policy tests
└── docs/                  # Documentation
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript compiler |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm security` | Run security checks |
| `pnpm verify` | Run all checks (lint, typecheck, test, build, security) |

## Documentation

- [Architecture](docs/architecture.md) — System design and data flow
- [Security](docs/security.md) — RLS model and secret handling
- [Payments](docs/payments.md) — Payment provider integration
- [Contributing](docs/contributing.md) — Development guidelines

## Contributing

See [CONTRIBUTING.md](docs/contributing.md) for guidelines.

## License

Private — All rights reserved.

## Contact

- **Website**: [senik.com](https://senik.com)
- **Email**: hello@senik.com
- **Phone**: +251 11 882 0000

---

Made with ❤️ in Ethiopia 🇪🇹