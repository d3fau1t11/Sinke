# Senik (ስንቅ)

A delivery monorepo with Customer, Merchant and Rider Android apps and an Admin web app.
All four apps support English and Amharic, share Supabase data and offer an explicit local demo.
Live payments, production signing and hosted service setup require the configuration below.

## Run an app

Use Node.js 22.12 or newer and pnpm 9.1.4. Install dependencies at the repository root:

```sh
git clone https://github.com/d3fau1t11/Sinke.git
cd Sinke
pnpm install --frozen-lockfile
```

Copy the selected app's `.env.example` to `.env.dev.local` in that app directory.
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your project's public connection values.
Never put service-role, Firebase private or payment-provider keys in app configuration.

| App      | Development         | Build                 | Android test APK        |
| -------- | ------------------- | --------------------- | ----------------------- |
| Customer | `pnpm dev:customer` | `pnpm build:customer` | `pnpm android:customer` |
| Merchant | `pnpm dev:merchant` | `pnpm build:merchant` | `pnpm android:merchant` |
| Rider    | `pnpm dev:rider`    | `pnpm build:rider`    | `pnpm android:rider`    |
| Admin    | `pnpm dev:admin`    | `pnpm build:admin`    | Web app                 |

Each app has its own entry point, environment, output and deployment. Admin hosting needs
SPA route fallback to `index.html`. Android builds require Android SDK and Java 21.

## Structure and data flow

```text
apps/customer, apps/merchant, apps/rider  Capacitor Android apps
apps/admin                              Vite React web app
packages/ui                             Shared UI and brand assets
packages/api                            Supabase access, queries and demo services
packages/types                          Database and domain types
packages/i18n                           English/Amharic feature dictionaries
packages/native                         Android GPS, camera and runtime integration
packages/config, packages/utils         Shared tooling and utilities
supabase/migrations                     Numbered database migrations
supabase/functions                      Server-side integrations
supabase/tests                          Policy and order-flow checks
tests/e2e                               Browser regressions
scripts                                 Build and publication checks
```

Customer places a cash order; Merchant prepares it and marks it ready; an online Rider claims,
picks up and delivers it. All roles read the same order. Database functions enforce roles,
serialize competing delivery claims and record status history. Cash checkout calculates
product/option prices on the server and saves order, items and history atomically. Retrying the
same request key returns the same order.

Amharic fonts and logos are bundled. Customer/Rider use GPS; Merchant supports camera/gallery;
all three Android apps support Back, keyboard, connectivity events and push registration.
Rider GPS currently runs in the foreground. Background tracking needs a separate foreground
service, permissions and privacy disclosures.

## Demo mode

Use the named demo sign-in button to explore sample orders, dishes, accounts and withdrawals.
Demo data is stored locally and kept separate from Supabase authentication. Reset clears sample
changes. Demo checkout and withdrawals move no money. Browser regressions reject backend calls
during demo flows. Live sign-in requires actual accounts and their assigned roles.

## Hosted Supabase setup

Back up the database and inspect applied migrations before changing it. Apply missing numbered
migrations in order, through the Dashboard SQL Editor or an authenticated Supabase CLI.
Do not rerun already-applied migrations blindly.

- Migration 002 fixes a duplicate policy name in a fresh installation; 004 repairs missing policies.
- Migration 005 adds authenticated delivery/GPS functions, profile-role protection, relevant
  participant access, Admin policies and device language storage.
- Migration 006 adds `create_cash_order` and revokes direct client order/item inserts.
  Deploy it before live checkout with these apps. The older cash `create-order` Edge Function
  is superseded by this atomic operation.
- Migration 007 restricts chat insertion to the customer or assigned rider for that order.
- Enable phone authentication and a working SMS provider for Customer OTP (`+251…` format).
- Provision staff email/password accounts with matching `profiles` rows and roles:
  `merchant_staff`, `rider`, or `admin`. Link Merchants through `business_staff`; create the
  corresponding `riders` rows. Assign active businesses and zones through trusted admin tools.
- Run pgTAP tests in a suitable test database and regenerate database types from the deployed schema.
  Hosted database lint and policy execution require access to that environment.

To repeat the isolated local PostgreSQL order/role checks with Deno:

```sh
deno run --no-lock --node-modules-dir=none --allow-read --allow-env --allow-net --allow-sys ./supabase/tests/local_android_integration.ts
```

That test uses in-memory PostgreSQL with stubbed Auth and omits unused extensions. It checks
role isolation, competing claims, status transitions, GPS/contact privacy, database prices,
idempotency and invalid-item rejection. It does not certify the hosted database.

## Push notifications

Register the three Android apps/flavors in one Firebase project. Development package IDs are
`com.senik.customer.dev`, `com.senik.merchant.dev` and `com.senik.rider.dev`.
Keep each matching `google-services.json` in its ignored Android source set, then rebuild.

Enable FCM HTTP v1 and store `FCM_SERVICE_ACCOUNT_JSON` and a random
`ORDER_NOTIFICATION_WEBHOOK_SECRET` as Edge Function secrets. Deploy `order-notification` and
`send-notification`. Create an INSERT/UPDATE webhook on `public.orders` targeting the former
function, with the `x-senik-webhook-secret` header. The webhook checks its secret and reads the
authoritative order. Direct notification requests require an Admin session. Messages use the
device's selected language; taps open the role's order page.

## Payments and release signing

Live checkout currently supports cash on delivery. CBE/telebirr online payments, withdrawals,
settlement and refunds need approved merchant accounts, implemented provider API calls,
private server credentials and verified callbacks. A logo or UI flag does not enable payments.
The `payment-initiate` and `payment-webhook` endpoints return HTTP 503 without accessing the
database or a provider. The provider factory also fails closed. Enable online payments only
after implementing cryptographic webhook verification, amount/currency matching, idempotent
atomic settlement and real refund handling. Mock verification must never settle a live order.

Android development builds use debug signing and `.dev` package IDs. Production builds require
an exact Git version tag, separate signing keys per app and app-local production environments:

```sh
pnpm android:customer prod release
pnpm android:merchant prod release
pnpm android:rider prod release
```

Provide app-specific `SENIK_<ROLE>_KEYSTORE_PATH`, `KEYSTORE_PASSWORD`, `KEY_ALIAS` and
`KEY_PASSWORD` environment variables. Releases enable minification/resource shrinking and
produce AAB files. Use separate dev/staging/prod projects. Complete Play Console privacy/data
safety forms and validate permissions, GPS, camera, notification taps/logout, connectivity,
rotation, accessibility and background behavior on actual phones before release.

## Verification and publication policy

```sh
pnpm verify
pnpm security
pnpm security:database
```

Verification covers tooling/app lint, strict TypeScript, unit tests, all builds, secret and
dependency scans, and Playwright regressions against the compiled apps. Git commit hooks run
the verification gate.
The security scanner requires Gitleaks; the local script can also use its ignored cached
Windows binary. Only explicit public Supabase anonymous JWTs are allowed in compiled apps;
private/session tokens are rejected. High/critical dependency findings fail the gate.
Review any remaining lower-severity audit findings and hosted checks before production release.
`pnpm security:database` requires a running local Supabase stack (`pnpm exec supabase start`)
and runs database lint plus pgTAP. The in-memory role tests above are supplementary and do not
replace that gate. Fresh installations keep PostGIS in the extensions schema so database lint
covers application functions in public. The fixed local SMS test code has been removed.

Only the root `README.md` is published as Markdown. Local agent rules, design notes and setup
documents remain ignored on disk. Environment files, signing keys, Firebase configuration,
build outputs and scratch files are excluded. The publication scanner enforces that boundary.
Existing repository history is preserved. Use conventional commits and update this README
when architecture, security, setup or release behavior changes.

## Brand asset sources

Senik uses the supplied app mark. Payment artwork identifies providers and does not claim a
partnership. Preserve its colors/proportions:

- [telebirr](https://www.ethiotelecom.et/logos/) — provider's official artwork.
- [CBE](https://combanketh.et/) — bank's official horizontal logo for bank payouts.
- [CBE Birr vector](https://github.com/Chapa-Et/ethiopianlogos/blob/main/logos/cbe_birr_light/cbe_birr_light.svg)
  — wallet mark from Chapa's collection, cross-checked against
  [CBE's publication](https://combanketh.et/uploads/2018_V7_No2_93472d4a11_813e9381ee.pdf).
