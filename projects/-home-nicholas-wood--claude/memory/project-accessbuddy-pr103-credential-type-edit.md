---
name: project-accessbuddy-pr103-credential-type-edit
description: AccessBuddy PR #103 (open 14 Oct 2026) lets admins change an existing credential's type from the edit form; live probe deferred to the release deploy
metadata:
  type: project
---

PR https://github.com/nicholas-wood/accessbuddy/pull/103 (branch `feat/admin-edit-credential-type`, worktree `.worktrees/credential-type-edit`, commits 66b8c88 + e73c403, CI green) adds `credentialTypeId` to the admin credential PATCH and a "Credential type" Select to `EditCredentialForm`. Nick's ask "update a credential type" meant the credential *record's* type; the type-definition editor on the config page already existed since v1.0.

Design: pure record correction (no status/owner/expiry/programmingRequired change, no email); same-tenant active type with explicit tenantId predicate; `(tenant, type, serial)` unique constraint (migration 0004) pre-checked and Postgres 23505 both mapped to 409; audit `changes.credentialType {from,to}` by name plus `credentialTypeIds`; same type = no-op. Form keeps a retired current type selected (labelled inactive) and sends the field only when changed.

**Why:** Nick merges PRs himself; the live UI probe (ISC-104 in the project ISA) is still deferred.
**How to apply:** after #103 merges and release-please deploys, open an SMLSC fob page with Interceptor, confirm the Select renders and a type change shows "Credential type changed from … to …" in the audit trail, then flip ISC-104. PR #102 (audit-trail.tsx, audit-labels.ts) is independent of #103's files. See [[project-accessbuddy-pr102-audit-log]].
