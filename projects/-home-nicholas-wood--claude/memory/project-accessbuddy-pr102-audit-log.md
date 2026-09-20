---
name: project-accessbuddy-pr102-audit-log
description: AccessBuddy PR #102 (20 Sep 2026) fixes two audit log bugs; open, CI green, awaiting Nick's merge
metadata:
  type: project
---

PR #102 on branch `fix/audit-log-resend-and-email-noise` (opened 2026-09-20, CI green, not merged): attestation resend / cron auto-resend / force-complete now label as "Credential confirmation ..." instead of "Member details updated", and the member PUT route diffs against stored values so an email-only edit logs one line.

**Why:** the admin member edit form PUTs every field on every save, so "field present in body" never meant "changed". The same flaw wrote an "access level review required" audit row on every active credential on every save, and blocked non-admin approvers from editing rule-matched members.

**How to apply:** any new audit writer on the member PUT must go through `apps/web/src/lib/member-update-diff.ts`. New `metadata.action` values on generic `update` rows need a label in both `components/audit-trail.tsx` and the admin audit page map, or they fall through to the entity fallback. Still open: the form cannot clear an officer/board expiry, and a duplicate email surfaces as a 500. Shipping recipe is in [[gotcha-accessbuddy-prod-access]].
