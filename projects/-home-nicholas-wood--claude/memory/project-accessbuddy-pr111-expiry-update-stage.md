---
name: project-accessbuddy-pr111-expiry-update-stage
description: "AccessBuddy PR #111 (open 18 Oct 2026) adds an expiry_update stage to Add Credential for a fob the member already holds; staged via pendingExpiresAt + programmingRequired, no request; QA found two blockers fixed in commit 2; live Interceptor probe deferred"
metadata:
  node_type: memory
  type: project
  originSessionId: 3895ea31-b902-4050-8e28-cfbee513d73e
  modified: 2026-10-18T09:18:03.143Z
---

PR https://github.com/nicholas-wood/accessbuddy/pull/111, branch `feat/add-fob-reissue-expiry` in worktree `.worktrees/fob-reissue` (two commits: e63b7bd feature, then the QA-round fix). Nick's ask: "when I add a fob, I need an option to put it into the update expiry flow (they already have the fob, it is just expired and had been removed from the member previously)". ISC-106..144 in the project ISA.

Design that shipped: fourth stage `expiry_update` on `POST /credentials` (function `stageExpiryUpdate` in `credentials/route.ts`). Re-attaches the existing (tenant,type,serial) row to the member, forces `status: expired`, stages `pendingExpiresAt` (membership-year default for everyone, past dates refused), `programmingRequired` + reason naming serial and previous deactivation reason, no `fob_requests` row, audit `manual_expiry_update` with a snapshot. The UNCHANGED confirm-programming route then reactivates and emails `credentialReactivated`. Refusals are a typed `ManualAddRefused` → 400 (the wrapper otherwise returns a bare 500). Member page offers the member's own expired/returned fobs under "This member's previous fobs" only for this stage.

**Why:** "update expiry flow" in this codebase is the staged-expiry path, not a request type; forcing `expired` is what `resolveConfirmProgramming` reactivates from, so no downstream route changed and no migration was needed.

**How to apply:**
- Merge is Nick's. After release: Interceptor probe (ISC-142) on an SMLSC member page: fourth stage, own-fob group, stage one, row on `/admin` credential updates, audit line "Re-added to member - expiry update staged for …".
- Another session's branch in the main checkout also edits `packages/shared/src/schemas.ts` and `audit-trail.tsx`; second to merge rebases.
- Decisions Nick may want to overturn (in the PR body): no payment for this stage; cancel-programming leaves the fob on the member; revoked (free-text reason) fobs are eligible with the reason surfaced.
- Lesson: a background typecheck started before the last file is written proves nothing; the QA agent caught a TS error in the test file after I had claimed "typecheck clean". Run the gate on the final tree with `--force`.
- Lesson: the embedded test Postgres wrapper (`/tmp/ab-pg-scratch/run.ts`) can be alive while the server is shut down; `bun run test` then reports green with 68 DB-gated tests silently skipped. Check `ss -ltn | grep 54329` and "0 skipped" before trusting a baseline. See [[project-accessbuddy-pr106-old-fob-retirement]] for the recipe.

**Follow-up 19 Oct 2026 (branch `feat/expiry-update-member-confirm`, Nick: "the member should have to confirm they have it first"):** the stage no longer flags the programmer. It re-attaches the row (expired, deactivation fields kept) and raises a SCOPED renewal attestation (`attestation_requests.credential_ids`, migration 0020) emailing `credentialHeldConfirmation`; the attest page lists only that fob; "yes" stages the season expiry + programmingRequired (quoting the old deactivation reason), "no" leaves the fob expired, logs "Member confirmed they no longer have the fob. Member must submit a new request", and the page tells the member to submit a new request (Nick's call, 19 Oct); weekly auto-resend capped at 4; admin Re-send / Cancel confirmation / Member confirmed in person on the member page (`cancel-confirmation`, `confirm-on-behalf` routes). QA caught two highs before merge: scoped yes had no owner/status re-check, and the attestation POST wrote `tenantMemberships.currentSeason`. Open for Nick: whether the #111 custom expiry date should return (season end only now). ISC-145..173 in the project ISA; PR #117 merged from Linux and released as v1.23.0 (live 19 Oct); live probe ISC-162 (needs a member mailbox) still owed.

**Post-deploy defect 19 Oct:** "went straight to programming" = the form's preselected "Send for Programming" stage with a previously revoked fob (production request log: the add call created a request; the expiry-update path never does). Fix branch `fix/add-credential-explicit-stage`: no default stage, previously-held fob auto-selects expiry-update. Diagnosis tip that worked without the DB or Interceptor: `gcloud logging read` on `httpRequest.requestUrl:"/t/<slug>/"` around the POST shows the page the admin landed on and any new ids the refreshed page prefetched.
