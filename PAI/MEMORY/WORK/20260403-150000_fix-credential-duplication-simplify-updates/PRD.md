---
task: Fix credential duplication and simplify update flows
slug: 20260403-150000_fix-credential-duplication-simplify-updates
effort: deep
phase: complete
progress: 52/52
mode: interactive
started: 2026-04-03T15:00:00+10:00
updated: 2026-04-03T15:10:00+10:00
---

## Context

Four bugs were identified in AccessBuddy's credential handling, all stemming from the same design issue: credential updates (expiry, access level) are routed through the request pipeline which creates new credentials on ISSUE, causing duplicates. Nick's direction: credential updates should modify the existing credential directly. A `programmingRequired` flag on the credential lets them appear in the programming queue alongside new-fob requests.

### Scope
1. Add `programmingRequired` fields to credentials schema
2. Fix attestation: direct credential update + programmingRequired instead of new request
3. Fix lost/damaged submit: mark credential status immediately
4. Fix PROGRAM/ISSUE handlers: access_update updates existing credential, not create/deactivate
5. Fix permission expiry cron: direct credential update + programmingRequired
6. New confirm-programming endpoint for credentials
7. Update queue to show credentials needing reprogramming
8. Fix docs (SUBMITTED vs AWAITING_PAYMENT, swap, attestation, access update)
9. Comprehensive flow tests

### Risks
- Changing ISSUE behaviour for access_update could break existing in-flight requests
- Queue UI changes needed to show two entity types
- Migration needed for new schema fields

### Plan

**Phase 1: Schema** - Add programmingRequired fields, generate migration
**Phase 2: Core fixes** - Fix PROGRAM/ISSUE handlers, lost/damaged, attestation, permission cron
**Phase 3: New endpoints** - Confirm-programming endpoint, updated queue
**Phase 4: Docs** - Update all affected flow documentation
**Phase 5: Tests** - Comprehensive flow test suite

## Criteria

### Schema
- [x] ISC-1: credentials table has programming_required boolean column defaulting false
- [x] ISC-2: credentials table has programming_reason text column nullable
- [x] ISC-3: credentials table has programming_requested_at timestamp column nullable
- [x] ISC-4: Drizzle migration generated and applies cleanly

### Attestation fix (Bug 1)
- [x] ISC-5: Attestation confirmed path does NOT create fobRequest
- [x] ISC-6: Attestation confirmed path updates credential expiresAt directly
- [x] ISC-7: Attestation confirmed path sets programmingRequired true on credential
- [x] ISC-8: Attestation confirmed path sets programmingReason with season context
- [x] ISC-9: Attestation confirmed path creates audit entry for credential update

### Lost/damaged fix (Bug 2)
- [x] ISC-10: Submit route marks credential as LOST for replacement_lost immediately
- [x] ISC-11: Submit route marks credential as DAMAGED for replacement_damaged immediately
- [x] ISC-12: PROGRAM handler deactivates old credential for replacement_lost type
- [x] ISC-13: PROGRAM handler deactivates old credential for replacement_damaged type
- [x] ISC-14: Deactivated credential gets correct status (LOST not DEACTIVATED for lost)

### ISSUE handler fix
- [x] ISC-15: ISSUE for access_update type does NOT create new credential
- [x] ISC-16: ISSUE for access_update type does NOT deactivate existing credential
- [x] ISC-17: ISSUE for new/replacement types still creates credential correctly
- [x] ISC-18: ISSUE activates PENDING_PROGRAMMING credentials correctly (swap flow)

### PROGRAM handler fix for access_update
- [x] ISC-19: PROGRAM for access_update does NOT deactivate existing credential
- [x] ISC-20: PROGRAM for access_update updates credential expiresAt from request
- [x] ISC-21: PROGRAM for access_update updates credential accessLevelId from request

### Permission expiry cron fix
- [x] ISC-22: Cron does NOT create fobRequest for permission expiry
- [x] ISC-23: Cron updates credential accessLevelId directly
- [x] ISC-24: Cron updates credential expiresAt directly
- [x] ISC-25: Cron sets programmingRequired true on credential
- [x] ISC-26: Cron sets programmingReason with expiry context

### Confirm programming endpoint
- [x] ISC-27: POST endpoint exists at /credentials/[id]/confirm-programming
- [x] ISC-28: Endpoint requires program permission
- [x] ISC-29: Endpoint clears programmingRequired and programmingReason
- [x] ISC-30: Endpoint creates audit entry

### Queue update
- [x] ISC-31: Queue endpoint returns credentials with programmingRequired true
- [x] ISC-32: Queue response distinguishes requests from credential updates

### Documentation updates
- [x] ISC-33: Attestation flow docs updated with direct credential update
- [x] ISC-34: New fob request docs show SUBMITTED as initial state for payment
- [x] ISC-35: Swap docs show two-request creation accurately
- [x] ISC-36: Access update docs show credential update not replacement
- [x] ISC-37: Permission expiry docs show direct credential update
- [x] ISC-38: New credential reprogramming queue concept documented

### Tests
- [x] ISC-39: Test: new fob request creates credential on ISSUE
- [x] ISC-40: Test: attestation confirmed sets programmingRequired not new credential
- [x] ISC-41: Test: attestation denied creates REPLACEMENT_LOST request
- [x] ISC-42: Test: lost fob submit marks credential as LOST immediately
- [x] ISC-43: Test: damaged fob submit marks credential as DAMAGED immediately
- [x] ISC-44: Test: PROGRAM for replacement_lost deactivates old credential
- [x] ISC-45: Test: ISSUE for access_update does NOT create new credential
- [x] ISC-46: Test: confirm-programming clears flag and audits
- [x] ISC-47: Test: permission expiry updates credential directly
- [x] ISC-48: Test: swap creates two requests and PENDING_PROGRAMMING credential
- [x] ISC-49: Test: queue includes both requests and credential updates
- [x] ISC-50: Test: serial number uniqueness per active credential per member
- [x] ISC-51: Test: payment determination for all request types
- [x] ISC-52: Test: hold/resume with approve/program/issue permissions

### Anti-criteria
- [x] ISC-A-1: No flow creates duplicate active credentials for same fob

## Decisions

- 2026-04-03 15:00: Credential updates (expiry, access level) use direct credential modification + programmingRequired flag instead of creating new requests/credentials. Reason: prevents duplicate credentials and simplifies flows.
- 2026-04-03 15:00: Keep request pipeline for new fobs, replacements, and member-initiated access updates (which need approval). Only system-initiated updates (attestation, permission expiry) bypass requests.
- 2026-04-03 15:00: For member-initiated access_update requests: keep the request for approval workflow, but ISSUE updates existing credential instead of creating new one.
- 2026-04-03 15:00: Lost/damaged credential status marked immediately on submit (not waiting for programmer). Programmer still needed to deactivate in access control system.
