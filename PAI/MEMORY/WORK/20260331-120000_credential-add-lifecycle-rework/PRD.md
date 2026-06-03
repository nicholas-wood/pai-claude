---
task: Rework credential add lifecycle POST endpoint and UI
slug: 20260331-120000_credential-add-lifecycle-rework
effort: advanced
phase: verify
progress: 28/28
mode: interactive
started: 2026-03-31T12:00:00+11:00
updated: 2026-03-31T12:01:00+11:00
---

## Context

Reworking the credential add lifecycle in AccessBuddy. The POST endpoint at `/api/v1/t/[slug]/credentials/route.ts` and the add credential UI in `credential-actions.tsx` have multiple bugs that need a cohesive fix. The member detail page (`page.tsx`) also needs query updates.

Key issues: status not matching stage correctly, credential status staying deactivated on reassignment, new fobs created even when tenant disallows it, no expiry calculation for pickup/issued stages, incomplete audit trail, and UI not showing preview info.

### Risks
- Breaking existing swap/revoke credential flows by changing shared types
- Incorrect expiry calculation timezone handling
- Missing import of `midnightInTimezone` in the POST handler
- Build failures from type mismatches after adding new props/fields
- Need to clear deactivatedAt/deactivatedBy when reassigning a deactivated fob
- The AvailableFob type change affects FobPicker which is shared with SwapCredentialForm

## Criteria

### POST Endpoint - Status Mapping
- [x] ISC-1: Programming stage sets request status to awaiting_programming
- [x] ISC-2: Pickup stage sets request status to awaiting_pickup
- [x] ISC-3: Issued stage sets request status to issued
- [x] ISC-4: Programming stage sets credential status to pending_programming
- [x] ISC-5: Pickup stage sets credential status to active
- [x] ISC-6: Issued stage sets credential status to active
- [x] ISC-A-1: Request status never set to submitted in manual add

### POST Endpoint - Reassignment
- [x] ISC-7: Existing deactivated fob update includes correct credential status
- [x] ISC-8: Reassignment creates audit entry with previousOwnerId metadata
- [x] ISC-9: Response includes wasReassignment boolean flag

### POST Endpoint - Fob Creation Guard
- [x] ISC-10: New credential created only when allowFobCreationAtProgramming is true
- [x] ISC-11: Error returned when fob not found and creation not allowed

### POST Endpoint - Expiry Calculation
- [x] ISC-12: Staff members get null expiry on pickup or issued stage
- [x] ISC-13: Board members get null expiry on pickup or issued stage
- [x] ISC-14: Regular members get Sep 1 expiry based on rollover logic
- [x] ISC-15: Month >= July calculates Sep 1 next year expiry
- [x] ISC-16: Month < July calculates Sep 1 this year expiry
- [x] ISC-17: Programming stage skips expiry calculation

### POST Endpoint - Audit Trail
- [x] ISC-18: Reassignment audit entry uses Credential reassigned metadata
- [x] ISC-19: Activation audit entry includes expiresAt and stage metadata
- [x] ISC-20: New allocation audit entry includes ownerId and stage metadata

### POST Endpoint - Response
- [x] ISC-21: Response includes credential record
- [x] ISC-22: Response includes calculated expiresAt value
- [x] ISC-23: Response includes access level name

### UI - Add Credential Form
- [x] ISC-24: Pickup or issued stage shows access level and expiry preview
- [x] ISC-25: Fob with previous owner shows reassignment note in picker
- [x] ISC-26: AvailableFob type includes previousOwnerName field

### Member Page
- [x] ISC-27: Fob query joins users table for previous owner name
- [x] ISC-28: memberAccessLevelName prop passed to CredentialActions

## Decisions

## Verification
