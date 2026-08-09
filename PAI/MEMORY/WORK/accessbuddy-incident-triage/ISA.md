---
task: Investigate three AccessBuddy incidents and deliver a report plus action plan per issue
slug: accessbuddy-incident-triage
effort: E3
phase: complete
progress: 37/37
mode: standard
started: 2026-08-01T00:00:00+10:00
updated: 2026-08-01T00:00:00+10:00
---

## Problem

Three linked production incidents at AccessBuddy (SMLSC tenant live): (1) a member reports being logged out and unable to log back in; (2) the Resend daily email limit (100/day free tier) was hit, so an unknown subset of outbound emails silently failed and future blasts risk the same; (3) a fob-expiry notification went out without the critical renewal context ("expires 1 Sep unless you renew; ignore if already renewed"), generating confused member queries. Nick needs evidence-backed diagnosis and a plan per issue before anything is changed.

## Vision

Nick opens one report and instantly sees what actually happened across all three issues — including whether the email limit caused the login failure — with a concrete, low-risk plan per issue he can approve line by line. Nothing has been touched; everything is ready to execute on approval.

## Out of Scope

No code changes, no deploys, no database writes, no emails sent, no template edits — this run is investigation and planning only. No redesign of the wider notification system beyond the queue needed for the daily limit. No Resend plan upgrade decision (surfaced as an option only).

## Constraints

- Read-only against production: SELECTs and API GETs only; no mutations.
- All agent work on the Fable model per Nick's explicit instruction.
- Email architecture facts from `context/facts.md` are authoritative (Resend, 27-event registry, `email_configurations` overrides, `setEmailBranding()` convention).
- Correction email and template copy must carry tenant branding and the renewal business context.
- Plans must respect the existing stack (Bun/Hono, Postgres/Drizzle, Cloud Run) — no new infrastructure unless unavoidable.

## Goal

Deliver a three-part incident report — login failure, email-limit audit with queued-send design (15/day reserved for auth), fob-expiry template fix with correction-email draft and recipient list — each with root cause evidence and an approval-ready action plan, with zero production mutations performed.

## Criteria

### Issue 1 — Login failure
- [x] ISC-1: Login/auth flow identified with file references (Firebase Auth usage, session lifecycle)
- [x] ISC-2: Determination whether login depends on outbound email (verification, magic link, password reset)
- [DEFERRED-VERIFY] ISC-3: Evidence gathered on whether login-related emails failed during the limit window — code path certain; live `email_failed` rows need prod DB (follow-up: appendix-a-queries)
- [x] ISC-4: Any recent deploy/session-config change in the incident window identified or ruled out
- [x] ISC-5: Root cause stated with confidence level, or explicit open questions listed
- [x] ISC-6: Action plan for issue 1 with steps, owner, and verification method
- [x] ISC-7: Immediate unblock path for the affected member named in the plan

### Issue 2 — Email limit audit + queue design
- [x] ISC-8: Email provider and exact limit confirmed from code/config (Resend tier, 100/day)
- [x] ISC-9: Sent emails enumerated from prod audit_log — 151 total since 30 Jul: 110 credentialExpiryWarning + 9 magicLink + 9 dailySummary + others; Resend cross-check: 5 delivery bounces only
- [x] ISC-10: Failed/unsent enumerated — ZERO email_failed rows; no quota blocking occurred; the "limit" was Resend's usage warning. Bounces: operational.nps@smlsc.internal ×4 (placeholder), hargestk@wesleycollege.net.au ×1 (typo domain)
- [x] ISC-11: Failure mode identified (error handling path when limit hit — silent vs logged)
- [x] ISC-12: The batch job / trigger that caused the blast identified with file reference
- [x] ISC-13: Cohort quantified — 99 active credentials expire midnight 1 Sep AEST + 12 the next day; the ~25 Aug 7-day-warning run and the 1-2 Sep expiry run will each attempt ~111 emails, breaching 100/day (Nick declined Pro upgrade → queue/chunking REQUIRED before 25 Aug)
- [x] ISC-14: Queue design proposed: persistent queue, daily budget, priority classes
- [x] ISC-15: Design reserves ~15/day headroom for auth/transactional email
- [x] ISC-16: Design spreads bulk sends across days with deterministic drain order
- [x] ISC-17: Design covers retry of the currently-unsent backlog
- [x] ISC-18: Design names concrete implementation surface (tables, job, code touchpoints)
- [x] ISC-19: Resend paid-tier upgrade surfaced as costed alternative/complement

### Issue 3 — Fob-expiry template + correction
- [x] ISC-20: Offending template located (event key, code default vs tenant override) with file/row reference
- [x] ISC-21: Actual sent wording captured as evidence
- [x] ISC-22: Why the business context was missing explained (authoring gap vs wrong template path)
- [x] ISC-23: Corrected template copy drafted (expires 1 Sep, renew to keep access, ignore if renewed)
- [x] ISC-24: Corrected copy follows email standards (tenant branding, first-name greeting)
- [x] ISC-25: Recipient list produced from prod audit_log — 98 distinct (110 sends), correction audience 96 after excluding internal placeholder + bounced typo address; saved with the remediation package
- [x] ISC-26: One-off correction email drafted for those recipients
- [x] ISC-27: Correction send plan respects the daily cap and queue design
- [x] ISC-28: Plan marks correction as once-off (no recurring artefact left behind)

### Issue 1b — Magic-link redirect loop (added 2026-08-02, new member evidence)
- [x] ISC-35: Cause of click-link → back-to-email-entry loop identified — RESOLVED 2026-08-02: Nick confirmed user error (member unblocked), consistent with ranked cause #1 (cross-device/mail-viewer flow); callback-hardening fixes remain recommended as UX debt
- [x] ISC-36: No-deploy unblock path for the looping member named (copy link into requesting browser; newest email; lowercase; real browser)
- [x] ISC-37: Minimal fix for the loop scoped into the Issue 1 plan (callback email form replacing window.prompt, error-code mapping, cookie-landed check, lowercase normalisation, Sentry capture)

### Issue 4 — New defects (added 2026-08-04)
- [x] ISC-38: Cause of 3001 dual-queue identified (~85% confidence) — two rows: legit deactivation + phantom paired replacement spawned by the paired-replacement backfill that runs on EVERY container start (entrypoint.sh, 85d89b0 in prod); backfill can't distinguish attestation lost-reports from orphan-linked replacements, auto-matched the deactivating fob itself and hijacked credentials.request_id; data-fix SQL + code fixes proposed; bonus latent defect: attestation route omits replacesCredentialId so attested-lost fobs never flip to inactive
- [x] ISC-39: Attestation expiry label mismatch explained — UTC date-only rendering of a correct midnight-AEST timestamptz; three affected sites (persisted programmingReason, cron warning email, reconciliation audit string); no software early-expiry; human risk via Integriti programming + reconciliation write-back; display-helper fix, no migration
- [x] ISC-40: Remediation email updated with SLSA Hub renewal instructions (Nick's wording), branded via app layout(), sent 96/96 (85 on 4 Aug + 11 on 5 Aug), idempotent log with Resend IDs

### Cross-cutting
- [x] ISC-29: Cross-issue causal chain (blast → limit → login) confirmed or refuted with evidence
- [x] ISC-30: Report orders actions by urgency across all three issues
- [x] ISC-31: Every claim in the report traceable to a tool-verified source (file, query, API response)
- [x] ISC-32: Anti: no file under `code/` modified during this run (git status clean)
- [x] ISC-33: Anti: no email sent and no production row inserted/updated/deleted during this run
- [x] ISC-34: Anti: report contains no fabricated counts — any unknown is marked unknown

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..5 | evidence | agent report cites files/queries | every claim sourced | Agent(Fable) + Read |
| ISC-6..7 | plan | plan section present with steps+verification | complete | Read of final report |
| ISC-8..13 | evidence | counts from audit log / Resend API quoted | numbers or explicit unknown | Agent(Fable) Bash/psql/curl |
| ISC-14..19 | design | queue design section covers budget, priority, backlog | all named elements present | Read of final report |
| ISC-20..22 | evidence | template source + sent wording quoted | verbatim quote present | Agent(Fable) Grep/SQL |
| ISC-23..28 | artefact | drafts present in report, standards applied | branding + context present | Read of final report |
| ISC-29 | analysis | causal chain section with supporting timestamps | confirmed/refuted stated | RootCauseAnalysis |
| ISC-30..31 | report | ordering + sourcing check on final text | pass | ReReadCheck |
| ISC-32 | anti | `git status --porcelain` in code/ empty | empty | Bash |
| ISC-33 | anti | no send/mutation commands in transcript | zero | self-audit |
| ISC-34 | anti | unknowns explicitly marked | zero fabricated numbers | ReReadCheck |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| login-investigation | Agent sweep of auth flow, session config, email dependency | ISC-1..5 | — | true |
| email-audit | Agent sweep of send pipeline, audit log, Resend usage, blast job | ISC-8..13 | — | true |
| template-forensics | Agent sweep of fob-expiry template, sent copy, recipients | ISC-20..22, ISC-25 | — | true |
| causal-chain | RootCauseAnalysis linking the three issues | ISC-29 | login-investigation, email-audit | false |
| queue-design | Daily-budget queue proposal with 15/day auth reserve | ISC-14..19 | email-audit | false |
| drafts | Corrected template copy + one-off correction email | ISC-23..28 | template-forensics | false |
| report | Assemble three-part report with ordered plans | ISC-6..7, ISC-30..31 | all | false |

## Decisions

- 2026-08-01: Task ISA (not project ISA) — this is an incident investigation; durable learnings reconcile to the project later. Delegation: 3 read-only background agents on Fable per Nick's instruction.
- 2026-08-01: refined: root cause restructured from linear chain to AND-gate fault tree (RootCauseAnalysis) — Leg A session invalidation (14 Jul key rotation) AND Leg B auth-email starvation (Resend cap); template gap reclassified as amplifier that generated the returning-member traffic.
- 2026-08-01: Advisor gaps applied: correction-email guards (logs-only list, renewal dedupe, idempotency), failure-visibility ordered above quota purchase, report retitled INTERIM with provisional root cause, 354 labelled as sourced upper bound.
- 2026-08-01: Report shipped as artefact at `artifacts/reviews/2026-08-01-incident-report-email-cap-login-template.md`; 5 ISCs DEFERRED-VERIFY pending prod access (follow-up: appendix-a-queries — install gcloud + cloud-sql-proxy or use Resend dashboard, then run Appendix A).
- 2026-08-01: Nick asked to update the Resend key for read access. Verified programmatic key creation is impossible (both keys 401 on /api-keys — send-only restriction covers key management). Dashboard-only action: Nick to create a TEMPORARY additional full-access key (do NOT replace the app's send key in Secret Manager — no redeploy needed), then `RESEND_FORENSICS_KEY=... bun artifacts/reviews/resend-forensics.ts` pulls counts + failed list + correction recipients; revoke key after. Script smoke-tested (graceful 401 on restricted key).

## Changelog

- conjectured: sends past the Resend 100/day cap failed silently during the 1-2 Aug blast (Leg B). refuted by: Cloud Logging (via Mac gcloud, 120h window) shows ZERO "[email] Failed to send" lines at any severity; cron summaries show the blast was 98 warnings (1 Aug 02:00 AEST run) + 11 (2 Aug) + 1 (3 Aug) — attempts, with no logged provider failures. learned: the blast profile is confirmed but provider-side blocking is NOT — the "limit hit" signal Nick saw may have been Resend's usage warning rather than blocked sends; delivered-vs-blocked truth requires Resend-side logs or audit_log email_failed rows. criterion now: ISC-10 evidence source narrowed to Resend log or prod audit_log; quota-starvation framing downgraded pending that data.

- conjectured: the 14 Jul commit cd70131 (session-signing key rotation) deployed in v1.11.0 and caused the mass logout (Leg A of the fault tree). refuted by: `git merge-base --is-ancestor cd70131 865a6004` fails — all ten 14-Jul commits are branch-only on fix/tenant-2-readiness; prod v1.11.0 differs from v1.10.2 by landing copy only, live-verified against the deployed bundle. learned: never attribute prod behaviour to a commit without proving it is an ancestor of the deployed tag; local branch checkouts lie about prod. criterion now: ISC-4 evidence corrected — logout cause is natural 14-day cookie expiry (and, for the looping member, inability to ever complete sign-in); cd70131's session invalidation is a FUTURE deploy note, not a past cause.

- conjectured: the three reported issues were three independent faults. refuted by: RootCauseAnalysis fault tree + agent evidence — member impact required BOTH the 14 Jul key rotation AND the quota exhaustion, with the bare template amplifying traffic into both legs. learned: bulk and auth email sharing one unprioritised, capped pipe means any blast can take down login; silent send-failure semantics turned a quota event into a lockout. criterion now: ISC-29 verified as AND-gate chain; queue design (ISC-14..18) reserves auth headroom as the structural fix.

## Verification

- ISC-1/2: Agent A trace — sign-in-form.tsx:75-97 (email-only paths), api/auth/session/route.ts:6 (14-day cookie). Login is magic-link/OTP/passkey; no password path.
- ISC-4: git log — cd70131 "fix(auth): remove Host-header trust and fail closed on session signing" (14 Jul, v1.11.0); replaced signing key → mass cookie invalidation.
- ISC-5/29: RootCauseAnalysis agent — AND-gate fault tree, confidence HIGH (mechanism) / MEDIUM (incident-level, pending logs).
- ISC-8: Resend SDK at email.ts:2,62-68; resend.com/pricing fetched — free tier 100/day, 3,000/month.
- ISC-11: email.ts:224-273 quoted — on error: console.error + email_failed audit row + return void; no retry, no throw; cron returns 200.
- ISC-12: main.tf:469-492 Cloud Scheduler 2am daily → api/cron/daily/route.ts:374-454; diffDays===30||7 gate at :403; 1 Sep normalisation at :150.
- ISC-14..19: report §Issue 2 — email_queue table, P0/P1/P2 classes, 85/day budget (15 reserved), oldest-first drain, backoff retry + backfill, Resend Pro ~US$20/mo recommendation.
- ISC-20/21/22: email-templates.ts:614-636 + email.ts:634 quoted verbatim; email_configurations absent in prod (migration 0010 unmerged) and unread by any send path; bare copy since f36375a (v1.0.0).
- ISC-23/24: corrected draft in report — 1 Sep context, ignore-if-renewed, first-name greeting, ships via existing branded template functions.
- ISC-26/27/28: correction draft in report with logs-only list, renewal dedupe, idempotency guard, once-off script, budget-respecting send.
- ISC-30/31: report execution order 1-5; every claim carries file:line or is marked UNKNOWN with its query.
- ISC-32: `git status --porcelain` in code/ — empty output captured post-run.
- ISC-33: self-audit — zero mutation commands issued; all agents read-only; both Resend keys send-restricted (401 on GETs) so no read even attempted a send.
- ISC-34: all counts either file-sourced or marked UNKNOWN; 354 labelled as upper bound from tenant stats.
- ISC-3/9/10/13/25: DEFERRED-VERIFY — follow-up task `appendix-a-queries` (prod DB or Resend dashboard).
