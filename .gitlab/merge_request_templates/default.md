## Description

<!-- Describe your changes in detail -->

## Related Issue

<!-- Link to the issue this MR addresses -->
Closes #

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test updates

## Checklist

### Structure & Refactoring

- [ ] Code follows feature-based folder structure (`src/features/{name}/{components,hooks,services,store}`)
- [ ] Files are under 200 lines (components under 150 lines)
- [ ] One component per file
- [ ] No business logic in components (moved to hooks/services)
- [ ] No direct Supabase imports outside `packages/api` and `supabase/functions`
- [ ] No circular dependencies
- [ ] No deep imports into packages

### Code Quality

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
- [ ] Code follows project naming conventions
- [ ] No `console.log` statements (use `logger` instead)
- [ ] No `any` types (use `unknown` + type guards)

### Security

- [ ] No secrets committed (gitleaks passes)
- [ ] Input validation on all user inputs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting considered
- [ ] `pnpm security` passes

### Database

- [ ] Migration is reversible
- [ ] RLS policies added for new tables
- [ ] pgTAP tests added for new policies
- [ ] Indexes added for query performance
- [ ] No breaking schema changes (or documented)

### Testing

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated (if applicable)
- [ ] Test coverage maintained or improved
- [ ] Manual testing completed

### Documentation

- [ ] README updated (if needed)
- [ ] `docs/architecture.md` updated (if needed)
- [ ] `docs/security.md` updated (if needed)
- [ ] `docs/payments.md` updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] Code comments added for complex logic

### Mobile (if applicable)

- [ ] Tested on Android device/emulator
- [ ] Back button handling works correctly
- [ ] Safe area insets respected
- [ ] Dark mode support verified
- [ ] Accessibility labels added

## Screenshots / Recordings

<!-- Add screenshots or recordings if applicable -->

## Deployment Notes

<!-- Any special deployment considerations -->

## Reviewers

<!-- Tag specific reviewers if needed -->

/label ~"needs review"