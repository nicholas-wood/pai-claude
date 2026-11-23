---
name: project-accessbuddy-pr139-duplicate-attestations
description: AccessBuddy PR #139 stops duplicate pending renewal attestations; merged and live as v1.26.1 on 23 Nov 2026 (migration 0022 ran); Interceptor pass and Helen Osman check still owed
metadata:
  type: project
---

Nick, 22 Nov 2026: "check why Helen Osman's attestation is showing up twice in the list? She only has one fob", then "go, build the fix". PR https://github.com/nicholas-wood/accessbuddy/pull/139, branch `fix/renew-duplicate-attestations` (bdb7421), worktree `code/.worktrees/renew-dup`.

Cause: `POST /members/[id]/renew` inserted a pending attestation on every call, the member page Re-send called Renew, and the member page showed only one pending renewal, so the duplicate was visible on the Requests page only. Prod request log showed three members with two 200 Renew calls 4 to 6 s apart (11, 15, 18 Nov). Helen's own rows were never confirmed (logs carry no names, Interceptor extension would not connect).

Fix: Renew re-issues the link on the existing pending renewal (repeat inside 60 s sends nothing); migration 0022 expires older duplicates and adds partial unique index `attestation_requests_one_pending_renewal` (pending, credential_ids null); Re-send uses `resend-attestation`; Renew button hard-reloads; cron skips a member with a pending renewal; Requests row names fob confirmations.

**How to apply:**
- After Nick merges and the release deploys: Interceptor pass on `/t/south-melb-lsc/admin` and a member page, and confirm Helen shows once. Members holding two emails must use the newer link (older row is marked expired by the migration).
- Any test or script that inserts two pending non-scoped attestations for one member and season now hits the unique index (fixed one such loop in `lockers-season.test.ts`).
- Diagnosis without DB or browser: `gcloud logging read` over `ssh mac` on POSTs to `/renew`, then the `members?q=` search just before each one names the member the admin was on. Related: [[gotcha-accessbuddy-prod-access]], [[project-accessbuddy-pr111-expiry-update-stage]].
- The "Claude Code Review" check passing in under 20 s is not a review.

**Shipped 23 Nov 2026:** Nick: "merge that PR and the release PR". #139 merged (4196956), release PR #140 merged (e61803b), v1.26.1 live, revision accessbuddy-production-00085-b7k, prod migration log "Migrations complete" 10:16Z, no errors after. Release PRs in this repo carry no checks (bot PR workflows sit at action_required); gate on the CI run for the merge commit on main instead. `gh pr merge --match-head-commit` needs the full 40-char SHA. Deploy took about 12 min from release merge. Interceptor extension was still disconnected on 23 Nov, so the live browser pass and the Helen check were not done.
