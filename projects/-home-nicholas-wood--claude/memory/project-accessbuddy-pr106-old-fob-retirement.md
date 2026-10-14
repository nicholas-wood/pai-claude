---
name: project-accessbuddy-pr106-old-fob-retirement
description: "AccessBuddy PR #106 (14 Oct 2026) retires the old fob on return/change_type and auto-closes uncollected returns; merged and live as v1.20.0; six Interceptor probes and the prod report script still owed"
metadata:
  node_type: memory
  type: project
  originSessionId: a8dd5d82-30c8-4251-9e5c-2159efebc5a4
  modified: 2026-10-14T11:10:07.326Z
---

Built and shipped 14 Oct 2026 from Nick's question "do we ask the issuer about the original fob?". Trace showed lost/damaged was fine (paired deactivation request) but `change_type` and `return` never touched the old credential and `selectedFobIds` was discarded at submit. Scoped as ISC-46..86 in `~/Documents/workspace/projects/accessbuddy/ISA.md`, built on `feat/old-fob-retirement`, PR #106 merged (43352bc), released as **v1.20.0, live** on Cloud Run revision 00071 (image b254b67). Release PR #108 (1.20.1, carries #102) was left open for Nick.

Design that shipped: return fans out to one request per fob (same shape as lost/damaged deactivation), PROGRAM → credential `deactivated`, ISSUE is a collection confirm → `returned`; change_type leaves the old fob active until the exchange at ISSUE, then `returned` + `programmingRequired` so the programmer removes it from Integriti via the existing dashboard list; return auto-close via daily cron with tenant `returnAutoCloseDays` (default 30) and an explicit `auto_closed_at` column (migration 0017). ISSUE on return/change_type refuses without `collected: true`. change_type stays payment-exempt (Nick's call).

**Why:** Nick's requirement was "we want the fob back, and the old one has to stay active until the new one is issued".

**How to apply:**
- Still owed post-deploy: Interceptor probes for ISC-53/58/61/76/77/82 (listed in the PR #106 body), and `packages/db/src/report-unretired-exchange-fobs.ts` in a prod DB window (see [[gotcha-accessbuddy-prod-access]]) to find SMLSC credentials still active after historical exchanges.
- Two defects in this build were only catchable against migrated-data shape, not the ORM: the first auto-close marker used null `issuedBy` (migration scripts never set it) and the first cron selection would have mass-closed legacy returns with no credential link. For any new AccessBuddy cron pass or status heuristic, read `migrate-smlsc.ts`/`migrate-data.ts` for what the legacy rows look like before trusting a green suite.
- **Release race gotcha:** merging anything else to main while a Release Please run's `Deploy` is in flight cancels the deploy (concurrency on main), and the next run skips Deploy because `release_created` is false. Result: a GitHub release with nothing deployed. Fix is `gh run rerun <release run id> --failed`, which keeps `release_created=true` and redeploys that exact commit. After merging a release PR, wait for "Deploy to Cloud Run: success" before merging more.
- Version probe: `curl accessbuddy.com.au | grep -oE "1\.[0-9]+\.[0-9]+" | head -1` is wrong (matches a library version first); use `grep -c 1.20.0`-style exact match or `gcloud run services describe … --format="value(status.latestReadyRevisionName,spec.template.spec.containers[0].image)"` (image tag = merge SHA).
- Embedded Postgres recipe for DB-backed tests on the Linux box: `/tmp/ab-pg-scratch/run.ts` (embedded-postgres, port 54329, user accessbuddy, db `accessbuddy_test`), `DATABASE_URL=postgres://accessbuddy:testpassword@127.0.0.1:54329/accessbuddy_test bun run test -- --force`; run `db:migrate` first after a rebase.
- Shipping from a bg job: push branch from Linux, `gh pr create` / `gh pr merge` over `ssh mac` with `GH_TOKEN=$(cat ~/.gh-token)` (the keychain token is invalid over SSH); `rg` is not on the Mac's non-interactive PATH, use `grep`.
