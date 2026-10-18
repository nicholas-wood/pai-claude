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
