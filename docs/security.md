# Senik Security Model

## Overview

Security is enforced at multiple layers: network, application, database, and infrastructure. This document describes the RLS model, secret handling, and security verification.

## Row Level Security (RLS)

### Principles

1. **Every table has RLS enabled** — no exceptions
2. **Least privilege** — users only access what they need
3. **Role-based access** — policies defined per role
4. **Tested** — pgTAP tests verify every policy

### Role Definitions

| Role | Description | Authentication |
|------|-------------|----------------|
| `customer` | End user | Supabase Auth (phone OTP) |
| `merchant_staff` | Business owner/manager | Supabase Auth + business_staff table |
| `rider` | Delivery person | Supabase Auth + riders table |
| `admin` | Platform administrator | Supabase Auth + profiles.role = 'admin' |

### Policy Summary

#### Profiles
- **SELECT**: All authenticated users (public profiles)
- **INSERT/UPDATE**: Own profile only
- **DELETE**: Not allowed (cascade from auth.users)

#### Addresses
- **SELECT/INSERT/UPDATE/DELETE**: Own addresses only

#### Orders
- **SELECT**: Own orders (customer), business orders (merchant), assigned orders (rider)
- **INSERT**: Own orders only (customer)
- **UPDATE**: Status transitions only (validated by Edge Function)

#### Order Items
- **SELECT**: Via parent order access
- **INSERT/UPDATE/DELETE**: Not allowed directly (created by Edge Function)

#### Payments
- **SELECT**: Own payments (customer), business payments (merchant)
- **INSERT/UPDATE**: Not allowed directly (created by Edge Function)

#### Messages
- **SELECT**: Participants in the order (customer + rider)
- **INSERT**: Own messages only
- **UPDATE**: Mark as read only

#### Products
- **SELECT**: All users (public catalog)
- **INSERT/UPDATE/DELETE**: Business staff only

#### Businesses
- **SELECT**: All users (public directory)
- **UPDATE**: Business staff only

#### Zones, Categories
- **SELECT**: All users (public reference data)
- **INSERT/UPDATE/DELETE**: Admin only (via service role)

#### Device Tokens
- **SELECT/INSERT/DELETE**: Own tokens only

### Testing Policies

All policies are tested with pgTAP in `supabase/tests/`:

```sql
-- Example: Test customer can only see own orders
SELECT tests.test('customers can only see own orders', $$
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub = 'customer-uuid';
  SELECT count(*) FROM orders WHERE user_id = 'customer-uuid';
  -- Should return only own orders
$$);
```

Run tests with:
```bash
supabase db test
```

## Secret Management

### Principles

1. **Never commit secrets** — enforced by gitleaks in CI
2. **Environment-specific** — dev/staging/prod use separate projects
3. **Minimal exposure** — apps only get anon key, service role stays server-side
4. **Rotation** — keys rotated on suspicion of compromise

### Secret Types

| Secret | Location | Access |
|--------|----------|--------|
| `SUPABASE_URL` | CI variable (protected) | All apps |
| `SUPABASE_ANON_KEY` | CI variable (protected) | All apps (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Vault | Edge Functions only |
| `PAYMENT_PROVIDER_*` | Supabase Vault | Edge Functions only |
| `FCM_SERVER_KEY` | Supabase Vault | Edge Functions only |
| `SENTRY_DSN` | CI variable (masked) | All apps |
| `POSTHOG_KEY` | CI variable (masked) | All apps |
| `CHAPA_API_KEY` | Supabase Vault | Edge Functions only |
| `TELEBIRR_API_KEY` | Supabase Vault | Edge Functions only |

### CI/CD Variables

All secrets stored in GitLab CI/CD variables:
- **Masked**: Value hidden in logs
- **Protected**: Only available on protected branches/tags
- **Environment-specific**: Separate values per environment

## Security Verification

### `pnpm security`

Runs after every build. Checks:

1. **gitleaks** — Scans for secrets in source code
2. **pnpm audit** — Checks for vulnerable dependencies (audit-level=high)
3. **eslint-plugin-security** — Static analysis for security issues
4. **supabase db lint** — Validates RLS is enabled on all tables
5. **dist/ secret scan** — Ensures no service-role key or non-VITE_ secret in build output

### CI Pipeline Security Jobs

| Job | Description |
|-----|-------------|
| `security:gitleaks` | Secret detection in source |
| `security:audit` | Dependency vulnerability scan |
| `security:sast` | Static application security testing |
| `security:secret-detection` | GitLab secret detection template |
| `security:dependency-scanning` | GitLab dependency scanning template |
| `security:dist-check` | Post-build secret scan |

### Pre-commit Hooks

- **lint-staged**: Runs ESLint + Prettier on staged files
- **commitlint**: Enforces conventional commit format
- **gitleaks**: Prevents committing secrets

## Authentication

### Phone OTP Flow

1. User enters phone number
2. Supabase Auth sends SMS with OTP
3. User enters OTP
4. Supabase verifies and creates session
5. Session token stored in secure storage (Capacitor Preferences)

### Session Management

- **Access token**: Short-lived (1 hour)
- **Refresh token**: Long-lived (30 days), rotated on use
- **Storage**: Encrypted via Capacitor Secure Storage
- **Validation**: Every request validated by Supabase

### Role Assignment

- **Customer**: Default role on signup
- **Merchant**: Added to `business_staff` table by admin
- **Rider**: Added to `riders` table by admin
- **Admin**: Set `profiles.role = 'admin'` by existing admin

## API Security

### Edge Functions

- **Authentication**: Verify JWT from Supabase Auth
- **Authorization**: Check user role before processing
- **Input validation**: Zod schemas for all inputs
- **Rate limiting**: Implemented per function
- **Idempotency**: Orders use idempotency keys

### Realtime

- **Channel naming**: `order-{id}`, `business-{id}`
- **Authentication**: Supabase Realtime validates JWT
- **Authorization**: RLS policies apply to realtime subscriptions

## Infrastructure

### Supabase

- **PostgreSQL 15** with PostGIS extension
- **PITR**: Point-in-time recovery enabled
- **Backups**: Daily automated backups
- **Monitoring**: Supabase Dashboard + PagerDuty alerts

### GitLab CI

- **Runners**: Shared runners with Docker executor
- **Isolation**: Each job runs in isolated container
- **Artifacts**: Encrypted at rest
- **Logs**: Masked variables redacted

## Incident Response

1. **Detection**: Sentry alerts, Supabase monitoring
2. **Containment**: Revoke compromised keys, disable affected accounts
3. **Investigation**: Review logs, identify root cause
4. **Remediation: Fix vulnerability, rotate secrets
5. **Post-mortem**: Document lessons learned

## Compliance

- **Data residency**: All data stored in Supabase (region: Singapore)
- **Privacy**: GDPR-compliant data handling
- **Retention**: Order data retained for 2 years, then archived
- **Right to deletion**: User data deleted on account deletion (cascade)