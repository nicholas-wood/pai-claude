---
task: Build member-facing UI pages and request form
slug: 20260329-190000_member-ui-pages
effort: advanced
phase: complete
progress: 26/26
mode: interactive
started: 2026-03-29T19:00:00+11:00
updated: 2026-03-29T19:00:00+11:00
---

## Context

Building the member-facing web UI for AccessBuddy. Mobile-friendly, clean, modern. Uses shadcn/ui + Tailwind. Pages: club landing (QR destination), request form, member dashboard with request list and credential list, self-service actions.

## Criteria

### Setup
- [ ] ISC-1: shadcn/ui initialised with components
- [ ] ISC-2: Clerk sign-in/sign-up pages configured

### Club Landing
- [ ] ISC-3: /t/[slug] page shows club name and entry points
- [ ] ISC-4: Login and request buttons visible
- [ ] ISC-5: Mobile-friendly responsive layout

### Request Form
- [ ] ISC-6: /t/[slug]/request page with multi-step form
- [ ] ISC-7: Request type selection step
- [ ] ISC-8: Personal details step (name, email, phone, DOB)
- [ ] ISC-9: Credential type selection step
- [ ] ISC-10: Confirmation step with summary
- [ ] ISC-11: Form submits to POST /api/v1/t/{slug}/requests
- [ ] ISC-12: Stripe payment redirect when payment required

### Member Dashboard
- [ ] ISC-13: /t/[slug]/dashboard layout with navigation
- [ ] ISC-14: Dashboard home shows summary cards
- [ ] ISC-15: Request list page shows all member requests
- [ ] ISC-16: Each request shows status badge and key dates
- [ ] ISC-17: Request detail view with timeline/audit trail
- [ ] ISC-18: Cancel request action from detail view

### Credential List
- [ ] ISC-19: Credentials page shows active credentials
- [ ] ISC-20: Each credential shows type, access level, expiry
- [ ] ISC-21: Report lost action on credential
- [ ] ISC-22: Report damaged action on credential

### Profile
- [ ] ISC-23: Profile page shows current details
- [ ] ISC-24: Update email and phone number

### UX
- [ ] ISC-25: Status badges with colour coding across all views
- [ ] ISC-26: Loading states and error handling on all pages
