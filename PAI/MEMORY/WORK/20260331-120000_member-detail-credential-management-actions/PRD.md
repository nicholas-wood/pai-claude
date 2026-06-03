---
task: Add credential management actions to member detail page
slug: 20260331-120000_member-detail-credential-management-actions
effort: advanced
phase: observe
progress: 0/12
mode: interactive
started: 2026-03-31T12:00:00+11:00
updated: 2026-03-31T12:00:00+11:00
---

## Context

The admin member detail page at `apps/web/src/app/t/[slug]/admin/members/[id]/page.tsx` displays member information and their credentials but lacks inline credential management actions. This task adds Add, Revoke, and Swap credential actions directly on the member detail page, enabling admins to manage credentials without navigating to the fob detail page.

The existing swap-credential component at `apps/web/src/app/t/[slug]/admin/fobs/[id]/swap-credential.tsx` provides a reference implementation for the fob selection UI pattern (allowFobCreationAtProgramming toggle between Input and Select).

### Key Technical Decisions
- APIs already exist: POST `/api/v1/t/{slug}/credentials` (manual add), POST `.../credentials/{id}/revoke`, POST `.../credentials/{id}/swap`
- Swap endpoint requires `reason` field (swapCredentialSchema)
- Manual add uses `Permission.MANUAL_ADD`, revoke/swap use `Permission.PROGRAM`
- The page is a server component; actions go in a new client component

### Risks
- Must not modify shared package schemas or DB schema
- Must handle `allowFobCreationAtProgramming` setting correctly for both add and swap flows
- Swap schema requires `reason` field - must include it in the form

## Criteria

- [ ] ISC-1: CredentialActions client component file created at correct path
- [ ] ISC-2: Add Credential button renders when canProgram is true
- [ ] ISC-3: Add Credential form shows credential type dropdown
- [ ] ISC-4: Add Credential form shows access level dropdown
- [ ] ISC-5: Add Credential serial number shows dropdown when allowFobCreation is false
- [ ] ISC-6: Add Credential serial number shows text input when allowFobCreation is true
- [ ] ISC-7: Add Credential POSTs to correct API endpoint with correct body
- [ ] ISC-8: Revoke button renders for each active credential
- [ ] ISC-9: Revoke form includes reason textarea
- [ ] ISC-10: Revoke POSTs to correct API endpoint with reason
- [ ] ISC-11: Swap button renders for each active credential
- [ ] ISC-12: Swap form shows credential type dropdown defaulting to current
- [ ] ISC-13: Swap form shows serial number input respecting allowFobCreation
- [ ] ISC-14: Swap form includes reason textarea
- [ ] ISC-15: Swap POSTs to correct API endpoint with correct body
- [ ] ISC-16: Member detail page fetches credential types for dropdown
- [ ] ISC-17: Member detail page fetches access levels for dropdown
- [ ] ISC-18: Member detail page fetches unallocated fobs
- [ ] ISC-19: Member detail page reads allowFobCreationAtProgramming from tenant settings
- [ ] ISC-20: Member detail page checks PROGRAM permission and passes canProgram prop
- [ ] ISC-21: CredentialActions component integrated into member detail page
- [ ] ISC-22: Page refreshes after successful add/revoke/swap action
- [ ] ISC-23: Error states displayed for all three actions
- [ ] ISC-24: Build passes with no TypeScript errors

## Decisions

## Verification
