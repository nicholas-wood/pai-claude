---
task: Build admin notification preferences page for AccessBuddy
slug: 20260331-120000_admin-notification-preferences-page
effort: advanced
phase: verify
progress: 24/24
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:00:30-05:00
---

## Context

Build a "My Notifications" page for AccessBuddy admins to configure per-notification-type email preferences. The page lives at `/t/[slug]/admin/notifications/` and integrates with the existing GET/PUT API at `/api/v1/t/{slug}/notifications/preferences`. Each notification type shows an email toggle and frequency selector, grouped into 5 sections. Time-critical notifications (imported from `@accessbuddy/shared`) cannot be disabled. Auto-save on each toggle change. A nav link is added to the admin layout.

No Switch component exists in the project. Will use a styled checkbox toggle (consistent with project patterns) rather than creating a new component file. The project uses `@base-ui/react` Select, not Radix.

### Risks
- Select component uses `@base-ui/react` API which differs from Radix -- must follow existing usage pattern from admins page
- No Switch UI component exists -- must implement toggle inline or use checkbox approach
- Build must pass TypeScript compilation

## Criteria

- [x] ISC-1: Page file exists at apps/web/src/app/t/[slug]/admin/notifications/page.tsx
- [x] ISC-2: Page is a client component with "use client" directive
- [x] ISC-3: Page fetches preferences from GET /api/v1/t/{slug}/notifications/preferences on mount
- [x] ISC-4: Loading state shown while preferences are being fetched
- [x] ISC-5: Request Workflow section displays 7 notification types with labels
- [x] ISC-6: Credentials section displays 6 notification types with labels
- [x] ISC-7: Payments section displays 5 notification types with labels
- [x] ISC-8: Programming section displays 1 notification type with label
- [x] ISC-9: Renewals section displays 2 notification types with labels
- [x] ISC-10: Each notification type shows human-readable label not snake_case
- [x] ISC-11: Each notification type shows a brief trigger description
- [x] ISC-12: Email toggle renders as on/off switch for each notification type
- [x] ISC-13: Frequency select shows Realtime and Daily Summary options
- [x] ISC-14: Frequency select only visible when email is enabled
- [x] ISC-15: TIME_CRITICAL_NOTIFICATIONS imported from @accessbuddy/shared
- [x] ISC-16: Time-critical notifications have toggle disabled and forced on
- [x] ISC-17: Time-critical notifications display a visual badge indicator
- [x] ISC-18: Toggle change triggers PUT /api/v1/t/{slug}/notifications/preferences
- [x] ISC-19: PUT body contains notificationType, emailEnabled, frequency fields
- [x] ISC-20: Subtle saved indicator appears after successful preference update
- [x] ISC-21: Nav link added to admin layout navItems array
- [x] ISC-22: Nav link uses Bell icon or similar indicator
- [x] ISC-23: Page uses Card/CardHeader/CardTitle/CardContent components
- [x] ISC-24: Build passes with bun run build (no TypeScript errors)

## Decisions

## Verification
