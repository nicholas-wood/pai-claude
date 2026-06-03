---
task: Migrate access level from credentials to memberships
slug: 20260331-120000_access-level-migration-creds-to-memberships
effort: advanced
phase: complete
progress: 30/30
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:00:30-05:00
---

## Context

Access level is moving from being per-credential to per-membership. Each member has ONE access level per tenant, stored on `tenant_memberships`. Credentials inherit from the membership. The approval flow sets it on the membership, not the credential. This touches schema, services, API routes, and UI across 5 parts.

### Risks
- Circular import if memberships.ts imports from credentials.ts (accessLevels)
- Existing credentials with accessLevelId must remain functional (kept for historical)
- The Add Credential form simplification may break if no membership access level set
- Permission gating must not accidentally hide credential actions from programmers

### Plan
1. Schema: add accessLevelId to tenant_memberships, SQL migration, apply to DB
2. Services: APPROVE writes access level to membership; issueCredential falls back to membership
3. Shared: make manualAddCredentialSchema.accessLevelId optional
4. API: POST credentials reads access level from membership when not provided
5. UI: merge credentials sections, simplify Add form, permission-gate member edit
6. Build and verify

## Criteria

- [x] ISC-1: tenant_memberships schema has accessLevelId uuid column referencing accessLevels
- [x] ISC-2: accessLevels imported from credentials.ts into memberships.ts without circular dep
- [x] ISC-3: credentials table accessLevelId column unchanged (kept for historical)
- [x] ISC-4: SQL migration appended to 0002_feature_batch_20260331.sql
- [x] ISC-5: ALTER TABLE applied to local Postgres successfully
- [x] ISC-6: APPROVE event handler sets accessLevelId on tenant_memberships record
- [x] ISC-7: New membership created during APPROVE includes accessLevelId
- [x] ISC-8: Existing membership updated during APPROVE gets accessLevelId set
- [x] ISC-9: approve route.ts passes resolved accessLevelId to transitionRequest
- [x] ISC-10: issueCredential falls back to membership accessLevelId when not provided
- [x] ISC-11: issueCredential still uses explicit accessLevelId when provided (backward compat)
- [x] ISC-12: manualAddCredentialSchema.accessLevelId is optional (z.string().uuid().optional())
- [x] ISC-13: POST credentials API looks up membership accessLevelId when not in request body
- [x] ISC-14: POST credentials API still accepts explicit accessLevelId (backward compat)
- [x] ISC-15: Member detail page shows access level name from membership (joined with access_levels)
- [x] ISC-16: Credentials list and credential actions merged into one Card section
- [x] ISC-17: Add Credential form has only fob picker (no credential type or access level dropdowns)
- [x] ISC-18: Add Credential form sends only ownerId and serialNumber to API
- [x] ISC-19: MemberEdit component only shown when canApprove is true
- [x] ISC-20: ArchiveButton only shown when canApprove is true
- [x] ISC-21: RenewButton visibility unchanged (uses canRenew)
- [x] ISC-22: Credential actions (add/revoke/swap) available when canProgram is true
- [x] ISC-23: Member info (name, email, category, flags) read-only for non-approvers
- [x] ISC-24: canApprove derived from Permission.APPROVE in member detail page
- [x] ISC-25: unallocatedFobs query includes credentialTypeId for type inference
- [x] ISC-26: POST credentials API infers credentialTypeId from selected fob when available
- [x] ISC-27: Swap form retains access level dropdown (swap may change level)
- [x] ISC-28: bun run build completes without errors
- [x] ISC-A1: packages/shared has no schema changes except accessLevelId optional
- [x] ISC-A2: accessLevelId NOT removed from credentials table schema

## Decisions

## Verification

- ISC-1 through ISC-5 (Schema): Verified column exists in DB, import works, credentials unchanged, SQL appended, ALTER TABLE succeeded
- ISC-6 through ISC-9 (Approval): APPROVE handler now sets accessLevelId on both new and existing memberships; approve route already passes resolved accessLevelId
- ISC-10 through ISC-12 (issueCredential + schema): Function falls back to membership lookup; explicit still works; shared schema updated
- ISC-13 through ISC-14 (POST credentials): API resolves from membership when not provided; accepts explicit for backward compat
- ISC-15 (access level display): Member page joins tenantMemberships with accessLevels and shows name
- ISC-16 (merged sections): Credentials list removed from page.tsx; CredentialActions now shows all creds with actions inline
- ISC-17 through ISC-18 (simplified form): Add form has only fob picker; sends only ownerId + serialNumber
- ISC-19 through ISC-24 (permissions): MemberEdit/ArchiveButton gated behind canApprove; RenewButton still uses canRenew; credential actions use canProgram; canApprove derived from Permission.APPROVE
- ISC-25 through ISC-26 (type inference): unallocatedFobs includes credentialTypeId; API looks up fob's credentialTypeId by serial number
- ISC-27 (swap form): Swap retains credential type and access level dropdowns
- ISC-28 (build): bun run build passes cleanly (3 successful tasks)
- ISC-A1, ISC-A2 (anti-criteria): Only manualAddCredentialSchema changed in shared; credentials table accessLevelId untouched
- Simplify review: Fixed operator precedence in `as string | undefined ?? null` -> `(as string | undefined) ?? null`; no other issues found
