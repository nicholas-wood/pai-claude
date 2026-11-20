---
name: project-accessbuddy-lockers-module
description: "AccessBuddy Lockers module LIVE in v1.24.0 (20 Nov 2026) but switched OFF for every club: per-tenant flag set only by global admin, approve_lockers / update_lockers permissions, request via the fob form + QR, season keep question, armed renewal cutoff; SMLSC enablement, import and Interceptor pass still owed"
metadata:
  type: project
---

Nick, 16 Nov 2026: bring the legacy SMLSC locker Apps Script into AccessBuddy. Source script at `lifesaving/smlsc/club-renewal/artifacts/legacy-lockers/lockers/`; data in "SMLSC Locker Request (Responses).xlsx" (Mac Downloads; real member PII, never commit). Spec at `projects/accessbuddy/artifacts/2026-11-16-lockers-build-spec.md`; ISC-204..268 in the project ISA.

**Decisions Nick made (16 Nov):** approve and allocate are one step; revoke sits under Approve lockers (not Update); lockers are requested through the same public form as fobs so details are entered once, with a QR like the Front Door one; a locker shows on the member profile like a credential; no hard per-member limit; the season confirmation asks holders whether they keep their locker; a club-set cutoff (SMLSC: 1 December) releases lockers of unrenewed members to the Update lockers holders for clean-out and label clearing.

**State 20 Nov:** #133 then #132 merged, release #134 → v1.24.0 live (migration 0021 applied, 29 tables, no errors), Lockers OFF for SMLSC (public-config 404). Earlier state, 19 Nov: PR https://github.com/nicholas-wood/accessbuddy/pull/132 (`feat/lockers`, worktree `projects/accessbuddy/.worktrees/lockers`, migration 0021) ready for review, CI green, 630 tests. Related: #130 cross-tenant role join fix merged and live as v1.23.5; #133 email escaping across all templates open (same template file as lockers, second to merge rebases).

**How to apply:**
- Owed after merge: Interceptor pass in real Chrome (Mac dropped off Tailscale during the attempt; headless Chromium screenshots stood in); enable Lockers for SMLSC on the platform Tenants page; upload the policy PDF; importer dry run against production (`bun run db:import-lockers`, dry run by default, `--commit` refuses a tenant that already has lockers), review the unmatched-holder report, then commit in a DB window Nick opens.
- Cutoff arming: a cutoff saved (or the module switched on) after that season's date first applies next season. For lockers to be released on 1 Dec in a given year the cutoff must be saved before 1 Dec.
- Cutoff never releases a holder with no season recorded, an unlinked legacy holder, a later-season renewal, a locker allocated after the cutoff, or one kept for the season. The first two are listed for manual checking.
- Importer dry-run counts on the sheet: 2 areas, 84 lockers, 14 single use, 28 allocations, 5 pending requests (one extra skipped: same email twice), 8 label flags.
- Not built, offered to Nick: a pre-cutoff reminder to members and locker managers; a cap on how many lockers one cutoff run may release (declined by me, reviewer wanted it).
- Lesson: I put a real member's phone number into the spec as a worked example and it reached a test; rewrote the unpushed branch. Use synthetic values in specs, and grep the diff for sheet values before any push.
- Lesson: independent review + QA + looking at rendered screens each found defects the previous layer missed (nine, six, two). The season-comparison defects were in my spec, not just the code.

Related: [[gotcha-subagent-write-denial-stall]], [[gotcha-accessbuddy-prod-access]].

- Lesson (20 Nov): merging main into the branch was textually clean but broke two tests; always re-run the full gate on the merged tree before merging a PR that sat beside another one. A test that calls the real nightly cron route acts on every tenant in the shared test database; test cron steps through a function that takes the tenant list.
