---
task: Implement revoke and swap credential enhancements
slug: 20260331-120000_revoke-swap-credential-enhancements
effort: advanced
phase: verify
progress: 24/24
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:00:10-05:00
---

## Context

Implement F6: Revoke Access & Swap Credential enhancements for AccessBuddy. Two major changes:

1. **New Revoke Endpoint** - POST handler that deactivates a credential immediately, creates an informational programming request for the physical access control system, sends notification email to the credential owner.

2. **Enhanced Swap Endpoint** - Deactivate-when-programmed model: old credential stays active until programmer confirms physical deactivation. New credential created as `pending_programming` until programmer confirms physical activation. Two linked programming requests created.

3. **transitionRequest enhancements** - When PROGRAM fires on a request with `replacesCredentialId` (access_update type), deactivate that old credential. When ISSUE fires, if there's a credential in `pending_programming` linked to the request, activate it.

### Risks
- Swap endpoint currently deactivates immediately; changing to deactivate-on-program could leave stale active credentials if programmer never acts
- The `transitionRequest` PROGRAM event already has auto-chain logic; new logic must not conflict
- Need to ensure `pending_programming` credentials don't appear as usable in member views
- `credentials.issuedAt` is NOT NULL - pending_programming credentials will use creation time as issuedAt
- ISSUE auto-chain: existing issueCredential check uses `request.serialNumber` which won't be set on swap activation requests, so no duplicate creation
- New credential linked to activation request via `requestId` field for ISSUE lookup

## Criteria

- [x] ISC-1: Revoke endpoint file exists at correct API route path
- [x] ISC-2: Revoke endpoint requires PROGRAM permission via checkPermission
- [x] ISC-3: Revoke endpoint validates body with revokeCredentialSchema from shared
- [x] ISC-4: Revoke endpoint fetches credential and verifies active status
- [x] ISC-5: Revoke endpoint deactivates credential with status, timestamps, reason
- [x] ISC-6: Revoke endpoint creates fob_request with access_update type and awaiting_programming status
- [x] ISC-7: Revoke endpoint creates audit entry for credential status change
- [x] ISC-8: Revoke endpoint creates audit entry for new request creation
- [x] ISC-9: Revoke endpoint sends accessRevoked email to credential owner
- [x] ISC-10: Revoke endpoint returns updated credential in response
- [x] ISC-11: Swap endpoint uses swapCredentialSchema from shared instead of local bodySchema
- [x] ISC-12: Swap endpoint keeps old credential active instead of deactivating immediately
- [x] ISC-13: Swap endpoint creates new credential with pending_programming status
- [x] ISC-14: Swap endpoint creates deactivation request for old credential with access_update type
- [x] ISC-15: Swap endpoint creates activation request for new credential with new type
- [x] ISC-16: Swap activation request links to deactivation request via relatedRequestId
- [x] ISC-17: Swap endpoint includes reason in both requests accessUpdateReason field
- [x] ISC-18: Swap endpoint audit entries include swap reason in metadata
- [x] ISC-19: transitionRequest PROGRAM event deactivates credential when request has replacesCredentialId
- [x] ISC-20: transitionRequest PROGRAM deactivation sets status, deactivatedAt, deactivatedBy on credential
- [x] ISC-21: transitionRequest ISSUE event activates pending_programming credential linked to request
- [x] ISC-22: transitionRequest ISSUE activation sets status to active and issuedAt on credential
- [x] ISC-23: No modifications to packages/db schema files
- [x] ISC-24: No modifications to packages/shared schema files

## Decisions

### Plan
1. Create revoke endpoint following existing route patterns (report-lost + swap hybrid)
2. Refactor swap endpoint: replace local schema with shared, change to deactivate-when-programmed model
3. Enhance transitionRequest: add PROGRAM->deactivate and ISSUE->activate logic
4. Key design: new credential's `requestId` points to the activation fob_request so ISSUE handler can find it
5. Deactivation request's `replacesCredentialId` points to old credential so PROGRAM handler can find it

## Verification
