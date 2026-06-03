---
task: Implement F7 manual add member and credential endpoints
slug: 20260331-120000_f7-manual-add-member-credential
effort: advanced
phase: verify
progress: 20/20
mode: interactive
started: 2026-03-31T12:00:00+10:00
updated: 2026-03-31T12:00:01+10:00
---

## Context

Implement two API endpoints for AccessBuddy's manual member/credential add feature (F7). The `manual_add` permission already exists. Schemas `manualAddMemberSchema` and `manualAddCredentialSchema` exist in `@accessbuddy/shared`. The members route already has a GET handler that must be preserved; the credentials route does not yet exist at the collection level.

### Risks
- Users table is global (not tenant-scoped) but inserts work within withTenant transactions per existing orphan approval pattern
- Must handle unique constraint on tenantMemberships (tenantId + userId) gracefully
- Must verify credential type and access level exist and are active before credential creation
- fobRequests table has specific required fields that must be populated correctly

### Plan
1. Add POST handler to existing `apps/web/src/app/api/v1/t/[slug]/members/route.ts`
2. Create new `apps/web/src/app/api/v1/t/[slug]/credentials/route.ts` with POST handler
3. Follow established patterns: getAuthUser -> resolveTenant -> checkPermission -> withTenant

## Criteria

- [x] ISC-1: POST /members requires manual_add permission check
- [x] ISC-2: POST /members validates body with manualAddMemberSchema
- [x] ISC-3: POST /members finds existing user by email when present
- [x] ISC-4: POST /members creates new user with pending_ firebaseUid when not found
- [x] ISC-5: POST /members creates tenant membership with active status
- [x] ISC-6: POST /members creates audit entry for member creation
- [x] ISC-7: POST /credentials requires manual_add permission check
- [x] ISC-8: POST /credentials validates body with manualAddCredentialSchema
- [x] ISC-9: POST /credentials verifies owner has membership in tenant
- [x] ISC-10: POST /credentials verifies credentialType and accessLevel exist and are active
- [x] ISC-11: POST /credentials creates credential record with status active
- [x] ISC-12: POST /credentials handles accessStartsAt with parseDateWithTimezone
- [x] ISC-13: POST /credentials handles expiresAt with parseDateWithTimezone
- [x] ISC-14: POST /credentials creates fob_request with awaiting_programming status
- [x] ISC-15: POST /credentials creates audit entry for credential creation
- [x] ISC-16: POST /credentials creates audit entry for request creation
- [x] ISC-17: Existing GET /members handler preserved unchanged
- [x] ISC-18: POST /members returns created user and membership
- [x] ISC-19: POST /credentials returns created credential
- [x] ISC-20: POST /members handles already-a-member case gracefully
- [x] ISC-A1: No modifications to schema files in shared package
- [x] ISC-A2: No modifications to database schema files

## Decisions

## Verification
