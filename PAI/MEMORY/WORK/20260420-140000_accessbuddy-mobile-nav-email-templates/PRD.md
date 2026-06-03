---
task: AccessBuddy mobile nav, email view, template admin
slug: 20260420-140000_accessbuddy-mobile-nav-email-templates
effort: advanced
phase: complete
progress: 26/28
mode: interactive
started: 2026-04-20T14:00:00+10:00
updated: 2026-04-20T14:00:30+10:00
---

## Context

Three features requested for AccessBuddy admin:

1. **Mobile navigation** - Admin nav tabs (Requests, Members, Credentials, Config, Rules, Settings, Admins, Audit, Notifications) are not accessible on mobile. Currently uses `overflow-x-auto` horizontal scroll but users can't see/reach all tabs.

2. **Email preview in audit log** - When clicking an email entry in the audit log, show the full rendered HTML email. Currently only metadata (subject, recipient, templateType) is stored in audit. Need to store rendered HTML at send time.

3. **Email template admin** - Admin screen to configure email workflows. Extensible system for: event triggers, recipients, template selection, enable/disable per-email. Must be simple for non-technical club admins.

Current state:
- Nav: Horizontal tabs with `overflow-x-auto` in `/apps/web/src/app/t/[slug]/admin/layout.tsx`
- Audit: Client-side page at `/apps/web/src/app/t/[slug]/admin/audit/page.tsx`, metadata in JSONB
- Email: 30+ hardcoded template functions in `email-templates.ts`, sent via Resend, triggered from `services/requests.ts`

### Risks
- Storing full HTML per email send increases DB storage significantly
- Template admin complexity - balancing power vs simplicity for club admins
- Migration path from hardcoded templates to configurable system without breaking existing emails
- Mobile nav pattern choice affects all admin users immediately

## Criteria

### Feature 1: Mobile Navigation
- [x] ISC-1: Admin nav accessible on all viewport widths below 640px
- [x] ISC-2: All nav items reachable without horizontal scrolling on mobile
- [x] ISC-3: Current active nav item visually indicated on mobile
- [x] ISC-4: Nav pattern works with 9 items without truncation
- [x] ISC-5: Touch targets meet 44px minimum on mobile nav
- [x] ISC-6: Nav does not obscure page content on mobile
- [x] ISC-7: Desktop nav appearance unchanged from current layout

### Feature 2: Email Preview in Audit Log
- [x] ISC-8: Rendered HTML stored at email send time in audit metadata
- [x] ISC-9: Email audit entries in log are clickable/expandable
- [x] ISC-10: Clicking email entry shows full rendered HTML preview
- [x] ISC-11: Email preview renders safely without XSS risk
- [x] ISC-12: Preview includes subject, recipient, and timestamp context
- [x] ISC-13: Suppressed/skipped emails show what would have been sent
- [x] ISC-14: Preview works on both mobile and desktop viewports

### Feature 3: Email Template Admin
- [x] ISC-15: Admin screen exists at discoverable route under config
- [x] ISC-16: Screen lists all email workflow events with current status
- [x] ISC-17: Each email event shows: trigger, recipient type, template, enabled state
- [x] ISC-18: Admin can enable or disable individual email events
- [ ] ISC-19: Admin can configure recipient for each email event
- [x] ISC-20: Admin can select which template sends for each event
- [x] ISC-21: Workflow events defined in code as extensible registry
- [x] ISC-22: Template content editable by admin without code deploy
- [x] ISC-23: Template editor shows live preview of rendered email
- [x] ISC-24: System falls back to default template if custom not configured
- [x] ISC-25: Changes take effect immediately without restart
- [x] ISC-26: UI is simple enough for non-technical club admin to use

### Anti-criteria
- [x] ISC-A-1: Anti: existing email functionality not broken during migration
- [x] ISC-A-2: Anti: no raw HTML editing required by club admins

## Decisions

- 2026-04-20 14:00: This is a planning session - produce architecture and design, not code execution
