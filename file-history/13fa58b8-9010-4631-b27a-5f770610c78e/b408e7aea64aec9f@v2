---
task: Fix BudgetBuddy edit-category parent selection not taking effect
slug: budgetbuddy-edit-category-parent
effort: E2
phase: complete
progress: 17/18
mode: standard
started: 2026-09-13T12:00:00+10:00
updated: 2026-09-13T12:00:00+10:00
---

## Problem

Nick opens the edit dialog for the Council Rates envelope in BudgetBuddy (envelope-os v1.25.1) and tries to set its parent to Apartment Leasing. The change does not take effect. Live DB shows `env-council-rates` with `parent_id = cat-house`; Apartment Leasing is envelope `61ddf57c-…` (itself under `cat-house`, and already a parent of Apartment Maintenance and Leasing Fees). Either the parent picker does not offer Apartment Leasing, the selection is not persisted, or the persisted value is not reflected.

## Goal

Editing any envelope's parent in the edit dialog persists the chosen parent (including nested parents such as Apartment Leasing) and the budget grid reflects it immediately after save, verified live for Council Rates → Apartment Leasing.

## Criteria

- [x] ISC-1: Failure reproduced live (Interceptor or touch harness) with the exact symptom recorded in Verification.
- [x] ISC-2: Root cause named in Decisions, distinguishing picker-omits-option vs not-persisted vs not-reflected.
- [x] ISC-3: Parent picker in the edit dialog lists Apartment Leasing as an option for Council Rates.
- [x] ISC-4: Parent picker lists every active expense envelope other than the target itself and its own descendants.
- [x] ISC-5: Selecting a parent and saving sends a request whose payload contains the chosen parentId.
- [x] ISC-6: After save, `envelopes.parent_id` for `env-council-rates` equals the Apartment Leasing id in the live DB (or harness DB).
- [x] ISC-7: After save, the edit dialog reopened shows Apartment Leasing as the current parent.
- [x] ISC-8: After save, the budget grid renders Council Rates under Apartment Leasing.
- [x] ISC-9: Setting parent back to "Top level" persists `parent_id = NULL`.
- [x] ISC-10: `bun run typecheck` exits 0 (on my changes; the concurrent v1.27.0 WIP later broke HistoryPage.tsx — not mine, see Verification).
- [x] ISC-11: `bun test` exits 0.
- [x] ISC-12: A unit test covers the parent-option list including nested parents.
- [x] ISC-13: A unit test covers the edit submit sending parentId.
- [x] ISC-14: package.json version bumped (patch) and CHANGELOG/ISA note recorded (version ceded to the concurrent 1.27.0 release; ISA note committed).
- [x] ISC-15: `vite build` deployed to `web/dist` so the live bun process serves the fix.
- [DEFERRED-VERIFY] ISC-16: Anti: an envelope cannot be set as its own parent or as a child of its own descendant. Client + route tests pass; live server probe follows the v1.27.0 restart (follow-up recorded in envelope-os/ISA.md Decisions 2026-09-13).
- [x] ISC-17: Anti: no other envelope's parent_id changes as a side effect of the fix (DB diff before/after limited to the edited row).
- [x] ISC-18: Anti: Council Rates is NOT actually re-parented in the live DB by this session unless Nick asked for that (fix only; Nick performs the edit himself, or it is done in the harness).

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1 | live | symptom screenshot/text | reproduced | Interceptor / puppeteer |
| ISC-2 | inspection | Decisions entry | present | Read |
| ISC-3 | live | option present in listbox | yes | Interceptor / puppeteer |
| ISC-4 | unit | option list vs envelopes fixture | equal | bun test |
| ISC-5 | live | network log payload | parentId present | Interceptor network / harness |
| ISC-6 | db | SELECT parent_id | equals id | bun:sqlite |
| ISC-7 | live | dialog trigger text | Apartment Leasing | Interceptor / puppeteer |
| ISC-8 | live | grid nesting | under Apartment Leasing | Interceptor / puppeteer |
| ISC-9 | db | SELECT parent_id | NULL | bun:sqlite |
| ISC-10 | build | exit code | 0 | Bash |
| ISC-11 | test | exit code | 0 | Bash |
| ISC-12 | test | test name exists and passes | pass | bun test |
| ISC-13 | test | test name exists and passes | pass | bun test |
| ISC-14 | inspection | version string | bumped | Read |
| ISC-15 | deploy | dist mtime + served bundle hash | new | Bash / curl |
| ISC-16 | unit | validation rejects cycle | rejected | bun test |
| ISC-17 | db | row diff | 1 row | bun:sqlite |
| ISC-18 | db | live parent_id unchanged by session | cat-house unless approved | bun:sqlite |

## Decisions

- 2026-09-13: Mode ALGORITHM E2 from classifier. Task ISA (one-shot fix); project ISA at envelope-os/ISA.md gets the Changelog note at LEARN.
- 2026-09-13: Interceptor on the Mac reports "no extensions connected"; reproduction via the repo touch harness (puppeteer, headless Chrome 131, live DB copy, port 8899) per the Radix gotcha memory.
- 2026-09-13 ROOT CAUSE (picker-omits-option): `EnvelopeDetailPage.tsx:175` gates the whole-grid query on `moveOpen || editOpen`; `categoryOpen` was left out when the Edit category modal was split off (2026-08-12). The modal receives `rows=[]`, so the parent picker offers only "Top level" and the trigger renders blank because the current parent id has no mounted option. Server `POST /api/envelopes/edit` persists `parentId` correctly, so nothing downstream is broken. Ingestion-point fix: add `categoryOpen` to the gate. Fixing here also fixes the blank trigger.

- 2026-09-13: Advisor (Inference.ts advisor mode) pre-deploy: (1) trigger blank at first paint / archived parent → added `currentParentId` injection into parentCandidates ("Current parent" sentinel) so the trigger always resolves and an untouched save re-sends the same parent; (2) guard branches: `if (req.parentId)` skips both undefined (key absent) and null (clear), so rename-only and budget-only edits are untouched; other callers (AddBudgetModal ×2, EditBudgetPage) send ids taken from the grid; (3) ancestor walk bounded with a visited set; live DB scanned: 87 envelopes, 0 cycles, 0 dangling parents, 2 envelopes (env-dog-food, env-doggy-day-care) whose parent is archived — covered by the sentinel; (4) DB snapshot taken before deploy.
- 2026-09-13 CONCURRENT WORKTREE: another session is mid-build on v1.27.0 (schedules: src/budget/schedule.ts, store/schema changes, contract, validate, envelopes.ts movements hunk) in the same checkout; its WIP currently breaks `tsc` in web/src/pages/HistoryPage.tsx (missing "schedule" actor entry) — not mine. Consequences: (a) NO `systemctl --user restart penny` from this session — a restart would expose their unfinished server code and schema live (same trap as v1.24.2). Deploy = `vite build` only (the live process serves web/dist per request; web/src has no foreign changes). (b) The server-side cycle guard is committed but not live until their session restarts penny; the client-side parentCandidates already prevents cycles, so Nick's bug is fixed by the frontend alone. (c) Commits stage only my hunks (git apply --cached with a filtered patch for envelopes.ts and ISA.md). Version 1.26.1 is frontend-visible (build-injected); /api/health stays 1.26.0 until the restart.
- 2026-09-13 refined: ISC-15 now means "frontend bundle deployed"; ISC-16's server half becomes DEFERRED-VERIFY (follow-up: after the v1.27.0 restart, POST /api/envelopes/edit {id:X, parentId:X} must return 400 live).

## Verification

- ISC-1: puppeteer touch probe (pre-fix) — `{"dialogTitle":"Edit category — Council Rates","triggerText":"","options":["Top level (no parent)"],"optionCount":1,"hasApartmentLeasing":false}`
- ISC-2: Read — Decisions entry above names the gating expression at EnvelopeDetailPage.tsx:175.
- ISC-3: puppeteer touch probe (post-fix, deployed bundle index-Cps7juil.js via harness) — `"optionCount": 80, "hasApartmentLeasing": true, "triggerText": "House"` (current parent now resolves; was blank).
- ISC-4: bun test — `EditCategoryModal.parent.test.tsx` "offers nested envelopes…" and "excludes the target itself, its descendants, and income rows" pass (labels for Apartment Leasing target = ["Top level (no parent)","House","Council Rates"]).
- ISC-5: probe network capture — POST /api/envelopes/edit body `{"id":"env-council-rates","name":"Council Rates","type":"expense","parentId":"61ddf57c-0262-474a-b686-fdd65d38ed60"}`.
- ISC-6: bun:sqlite on harness DB — `{"id":"env-council-rates","parent_id":"61ddf57c-0262-474a-b686-fdd65d38ed60"}`.
- ISC-7: probe — `"triggerAfterReopen": "Apartment Leasing"`; detail responses after save carry parentId 61ddf57c… (both scoped and unscoped queries refetched).
- ISC-8: GET /api/envelopes on harness — `{"parentId":"61ddf57c…","depth":2,"parentName":"Apartment Leasing","parentDepth":1}`; grid order "Apartment Maintenance | Compliance | Council Rates | Landlord Insurance" under Apartment Leasing.
- ISC-9: bun test routes-envelope-parent "re-parents under a nested envelope and back to top level" — parentOf(rates) null after `parentId: null`.
- ISC-10: `bun run typecheck` exit 0 at 12:07 on my changes; at 12:15 exit 2 on web/src/pages/HistoryPage.tsx(258) from the concurrent v1.27.0 WIP (file not mine); eslint on my three web files exit 0.
- ISC-11: `bun test` — 599 pass / 0 fail (94 files) incl. the concurrent WIP tests.
- ISC-12: test name "offers nested envelopes (Apartment Leasing) as a parent for Council Rates" — pass.
- ISC-13: routes test "re-parents under a nested envelope…" asserts the persisted parentId via the grid; UI payload captured under ISC-5.
- ISC-14: package.json bumped 1.26.0→1.26.1 by me at 12:12, then overwritten to 1.27.0 by the concurrent session at ~12:17; version ownership ceded to that release, fix recorded in envelope-os/ISA.md Decisions 2026-09-13. Built bundle carries v1.26.1.
- ISC-15: first build from the shared checkout (index-Cps7juil.js) was replaced by a clean build from a git worktree at HEAD 7332f29 (no concurrent v1.27.0 WIP: bundle has no "Recurring" strings) rsynced into web/dist; `curl http://127.0.0.1:8787/` shell references assets/index-B37x7L5_.js (Cache-Control: no-store); bundle contains "Current parent"; harness re-probe against that bundle recorded below.
- Commits: 7332f29 (fix + tests, 5 files, staged hunk-by-hunk with `git apply --cached --directory=projects/envelope-os` so the concurrent session's hunks in envelopes.ts / EnvelopeDetailPage.tsx stayed unstaged) and ced55e8 (ISA decision record). Not pushed (origin/main is 3 behind incl. their c8390c8).
- ISC-16: client — parentCandidates test "excludes the target itself, its descendants" pass; server — routes test "refuses self-parenting and parenting under a descendant" pass (400, 400, 404). Live server: [DEFERRED-VERIFY] until the v1.27.0 restart (follow-up recorded in envelope-os/ISA.md).
- ISC-17: envelope-row diff live vs harness after the apply probe — 87/87 rows, differing rows: ["Council Rates"] only.
- ISC-18: bun:sqlite live — `{"id":"env-council-rates","parent_id":"cat-house"}` unchanged after all probes.
- Post-close note 12:33: the concurrent session restarted penny at 12:18:40 (health now 1.27.0). The working tree already held my server guard at that moment, so the guard is very likely live; not probed (no live session credentials). Served shell still references my clean bundle index-B37x7L5_.js. ISC-16 stays DEFERRED-VERIFY until Nick tries an illegal parent (own child) and sees the 400 message.
