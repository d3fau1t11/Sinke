# Contributing to Senik

Thank you for your interest in contributing to Senik! This document outlines the process for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Android Studio (for mobile apps)
- Supabase CLI (for local development)

### Setup

```bash
# Clone the repository
git clone https://gitlab.com/senik/senik.git
cd senik

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development servers
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

## Development Workflow

### Branching

- `main` — Production-ready code
- `develop` — Integration branch
- `feature/*` — New features
- `bugfix/*` — Bug fixes
- `hotfix/*` — Critical production fixes

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add phone OTP login
fix: resolve cart total calculation bug
docs: update API documentation
style: format code with prettier
refactor: extract payment logic to service
test: add order creation tests
chore: update dependencies
```

### Pull Requests

1. Create a branch from `develop`
2. Make your changes
3. Run `pnpm verify` (must pass)
4. Push to GitLab
5. Create MR with template
6. Request review
7. Address feedback
8. Merge after approval

## Code Standards

### TypeScript

- Strict mode enabled
- No `any` types (use `unknown` + type guards)
- Explicit return types on exported functions
- No `console.log` in production code (use `logger`)

### React

- Functional components only
- Hooks at top level (no conditional hooks)
- Max 150 lines per component
- Props typed with interfaces
- No business logic in components

### File Structure

```
src/features/{name}/
├── components/     # Presentational (max 150 lines)
├── hooks/          # Custom hooks
├── services/       # API calls
└── store/          # Zustand slices
```

### Naming

- Components: `PascalCase` (`UserProfile.tsx`)
- Hooks: `camelCase` with `use` prefix (`useAuth.ts`)
- Services: `camelCase` (`orderService.ts`)
- Stores: `camelCase` with `Store` suffix (`cartStore.ts`)
- Files: `PascalCase` for components, `camelCase` for others

## Testing

### Unit Tests

```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode
pnpm test -- --coverage # With coverage
```

### E2E Tests

```bash
pnpm test:e2e          # Run Playwright tests
pnpm test:e2e --ui     # With UI
```

### Test Requirements

- All new features must have tests
- Bug fixes must have regression tests
- Aim for 80%+ coverage

## Security

### Reporting Vulnerabilities

Report security vulnerabilities to [security@senik.com](mailto:security@senik.com). Do NOT create public issues for security bugs.

### Security Checklist

- [ ] No secrets in code
- [ ] Input validation on all user inputs
- [ ] SQL injection prevention (use Supabase parameterized queries)
- [ ] XSS prevention (React escapes by default)
- [ ] CSRF protection (Supabase handles this)
- [ ] Rate limiting on API calls

## Documentation

### When to Update Docs

- New features → Update `docs/architecture.md`
- API changes → Update API docs
- Security changes → Update `docs/security.md`
- Payment changes → Update `docs/payments.md`

### Doc Standards

- Markdown format
- Clear examples
- Keep it up to date

## Release Process

1. Create release branch: `release/v1.2.3`
2. Update version in `package.json`
3. Run full verification: `pnpm verify`
4. Create Git tag: `git tag v1.2.3`
5. Push tag: `git push origin v1.2.3`
6. CI/CD builds and deploys
7. Create release notes in GitLab

## Getting Help

- **Questions**: Create a GitLab issue with `question` label
- **Bugs**: Create a GitLab issue with `bug` label
- **Features**: Create a GitLab issue with `enhancement` label
- **Chat**: Join our [Discord/Slack] (TBD)

## Code of Conduct

Be respectful, inclusive, and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).