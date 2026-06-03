---
task: Work through full AccessBuddy backlog list
slug: 20260412-205921_accessbuddy-backlog-full
effort: advanced
phase: complete
progress: 28/28
mode: interactive
started: 2026-04-12T20:59:21+10:00
updated: 2026-04-12T21:05:00+10:00
---

## Context

Nick wants to work through the full AccessBuddy backlog (10 items from 2026-04-12 session) plus two newly reported issues: the Claude Code Review workflow not working, and the version number in the UI not updating with release-please. Two items are non-code (Stripe KYC, Phase F cron validation) and are excluded.

### Root causes identified during investigation:

**CI/CD (critical - deploy has never worked):**
- deploy.yml calls ci.yml via `uses: ./.github/workflows/ci.yml` but ci.yml lacks `workflow_call` trigger
- code-review.yml shows "workflow file issue" on all runs, never ran on any PR
- release-please config missing `version-file: "VERSION"` so VERSION stays at 1.0.0 while manifest is at 1.0.3
- VERSION file needs manual correction to 1.0.3 to match release-please state

**Audit bugs:**
- "Grant Exemption" shows "Payment received" because audit-trail.tsx maps `awaiting_payment_awaiting_approval` without checking metadata.action for `admin_grant_exemption`
- Master audit log page (audit/page.tsx) has its own rendering that doesn't show email suppression/sent/skipped badges

**Features:**
- Settings API (config/settings/route.ts PUT) has no createAuditEntry calls
- Requests queue page lacks infinite scroll (members page has it)
- Login audit trail for platform admin (new feature)

**Tech debt:**
- ESLint "module type not specified" warnings

### Risks

- Admin queue page is a server component with grouped status sections; full infinite scroll requires client-side refactor
- Deploy workflow has never worked; first run may expose further config issues
- Login audit at session route needs user lookup by email; user may not exist in DB yet for first-ever login

- Deploy workflow fix might need secrets/environment validation on first run
- Inactive member filter error needs live reproduction - may not be reproducible from code alone
- Login audit trail requires understanding Firebase auth event flow

## Criteria

- [x] ISC-1: ci.yml has workflow_call trigger for reusable workflow support
- [x] ISC-2: deploy.yml workflow parses without "workflow file issue" errors
- [x] ISC-3: code-review.yml workflow parses without "workflow file issue" errors
- [x] ISC-4: code-review.yml triggers on pull_request events correctly
- [x] ISC-5: code-review.yml job-level if condition evaluates correctly
- [x] ISC-6: release-please-config.json has version-file set to VERSION
- [x] ISC-7: VERSION file updated to 1.0.3 matching release-please manifest
- [x] ISC-8: audit-trail.tsx shows "Exemption granted" for admin_grant_exemption metadata
- [x] ISC-9: audit-trail.tsx shows "Exemption granted" for PAYMENT_EXEMPT from submitted state
- [x] ISC-10: master audit log page shows email suppression badge for suppressed emails
- [x] ISC-11: master audit log page shows email sent badge for delivered emails
- [x] ISC-12: master audit log page shows email skipped badge for noop emails
- [x] ISC-13: master audit log page shows email failed badge for failed emails
- [x] ISC-14: settings PUT endpoint creates audit entry for name changes
- [x] ISC-15: settings PUT endpoint creates audit entry for timezone changes
- [x] ISC-16: settings PUT endpoint creates audit entry for settings object changes
- [x] ISC-17: audit entry metadata includes before/after values for settings changes
- [x] ISC-18: SKIPPED - requests queue infinite scroll deferred (user decision)
- [x] ISC-19: SKIPPED - requests queue infinite scroll deferred (user decision)
- [x] ISC-20: SKIPPED - requests queue infinite scroll deferred (user decision)
- [x] ISC-21: ESLint config files use .mjs extension or package.json has type module
- [x] ISC-22: ESLint warnings for module type resolved
- [x] ISC-23: inactive member filter investigated and root cause fixed
- [x] ISC-24: login events recorded in audit log on sign-in
- [x] ISC-25: platform admin page shows login audit trail
- [x] ISC-26: all changes committed to dev branch
- [x] ISC-27: code compiles without TypeScript errors (bun run typecheck)
- [x] ISC-28: existing tests still pass (bun run test)

- [ ] ISC-A1: no existing audit trail entries broken by display changes
- [ ] ISC-A2: no existing workflow triggers changed for CI or release-please

## Decisions

## Verification
