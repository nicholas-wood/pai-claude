---
task: Assess feasibility and design BudgetBuddy divergence explainer + in-app read-only diagnostic chat
slug: budgetbuddy-explainer-chat-design
effort: E4
phase: complete
progress: 30/30
mode: standard
started: 2026-09-08T19:48:45+10:00
updated: 2026-09-08T19:56:49+10:00
---

## Problem

Every few weeks the BudgetBuddy net-position widget reads "unreconciled" and Nick has to bring the question to a Claude session, where I hand-query the SQLite ledger, trace engine code, and attribute the delta line by line (Sept 2026: a dropped income movement, two envelopes missing from a materialised month, a feed-ghost pending). That workflow is slow, lives outside the product, and repeats the same attribution categories each time. Nick asks whether the product itself can (1) explain a divergence with the same rigour and (2) host a read-only chat that answers "why is my budget unbalanced" against his tenancy, billed to his Claude subscription, with no ability to change code.

## Vision

Nick opens the widget, sees "unexplained −$15.23", taps it, and reads a ledger-backed attribution: named causes with dollar figures that sum to the delta, plus a residual he can act on. When the attribution is not enough he asks a question in the same panel and gets an answer grounded in queries he can inspect, with the same "verify in code/data before asserting" discipline our sessions use. The surprise is that the categories we discovered by hand over three months are already encoded, so most divergences explain themselves before he ever asks.

## Out of Scope

No code is written or committed in this run; the deliverable is an assessment and a recommended design for Nick's decision. No ledger writes. The chat never edits code, config, or data. Multi-user (cloud-mode) AI onboarding, API-key billing, and a general-purpose finance advisor are not designed here. The egress guard is not modified in this run; its amendment is presented as a decision.

## Principles

- Code before prompts: the explainer is deterministic attribution first; the model narrates the residual, never invents the arithmetic.
- Every dollar is conserved: named causes plus residual equal the unexplained delta to the cent.
- Verify before asserting: every claim the chat makes is backed by a query result or a code reference it can show.
- Local-first with deliberate, per-action consent for any egress of financial data.

## Constraints

- bun + TypeScript, Hono server, store-portable SQL (SQLite local, Postgres cloud), tenant-scoped reads only.
- `src/security/egress.ts` hard-denies api.anthropic.com in local mode and an ISC-45 repo test enforces no cloud-AI call sites; any AI feature must go through an explicitly amended, consented channel.
- Subscription billing means the Claude Code harness (`claude` CLI or Agent SDK), not `@anthropic-ai/sdk` with an API key.
- The penny service runs under systemd without CLAUDECODE set, so it can spawn `claude -p` (Inference.ts pattern).
- Chat tools are read-only by construction (readonly SQLite connection, allow-listed tool set, no Bash/Edit/Write).

## Goal

Deliver a written assessment that answers "is it possible" for both facilities with a yes/no per facility, a recommended architecture grounded in the current codebase, the attribution catalogue derived from past diagnoses, the security decision Nick must make, effort and cost estimates, and the questions only he can answer, without writing product code.

## Criteria

- [x] ISC-1: Feasibility verdict stated per facility (explainer, chat) with one-line reason each
- [x] ISC-2: Explainer design names the existing delta computation it extends (file:line)
- [x] ISC-3: Attribution catalogue lists every cause category seen in the Aug/Sept diagnoses with its detection query
- [x] ISC-4: Catalogue entries are each tagged deterministic-computable or needs-model
- [x] ISC-5: Conservation rule stated: causes + residual = unexplained delta
- [x] ISC-6: Explainer output contract sketched (line items, residual, evidence refs)
- [x] ISC-7: Explainer needs no AI call for the deterministic tier (stated explicitly)
- [x] ISC-8: Chat billing path identified as Claude Code harness on subscription, with the PAI precedent cited
- [x] ISC-9: Two harness options compared (claude -p subprocess vs Agent SDK) with a recommendation
- [x] ISC-10: Read-only guarantee mechanism named (readonly DB handle + tool allow-list + no shell tools)
- [x] ISC-11: Tool surface for the chat enumerated (each tool named with purpose)
- [x] ISC-12: Egress conflict with ISC-45 and the Constraints clause surfaced as a decision, not resolved unilaterally
- [x] ISC-13: Consent model proposed that matches the existing "opt-in per query" constraint wording
- [x] ISC-14: Data minimisation stated (what leaves the machine per query)
- [x] ISC-15: Tenant scoping preserved (every tool takes the session userId)
- [x] ISC-16: Audit trail proposed via the existing ledger event log with actor "agent"
- [x] ISC-17: UI placement proposed (where the explainer and chat live in the SPA)
- [x] ISC-18: Effort estimate per facility in sessions/days
- [x] ISC-19: Running-cost statement (subscription usage, no per-token spend)
- [x] ISC-20: Failure modes listed (CLI auth expiry, latency, CLAUDECODE nesting, hallucinated figures)
- [x] ISC-21: Mitigation named per failure mode
- [x] ISC-22: Build order recommended (explainer before chat) with reason
- [x] ISC-23: Questions only Nick can answer listed (at most five)
- [x] ISC-24: Advisor consulted before the recommendation is final
- [x] ISC-25: Assessment written to a durable file in the envelope-os docs directory
- [x] ISC-26: Anti: no product code, tests, or config changed in envelope-os
- [x] ISC-27: Anti: no INSERT/UPDATE/DELETE against ~/.penny/penny.db
- [x] ISC-28: Anti: the egress guard is not edited
- [x] ISC-29: Anti: no assertion about engine behaviour without a code or data citation
- [x] ISC-30: Anti: no `result:` self-completion; closes with `needs input:`

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..7 | prose | design doc sections present with cited code | each item present | Read/Grep on doc |
| ISC-8..11 | prose | harness comparison + tool table | present | Read on doc |
| ISC-12..16 | prose | security section names ISC-45 and consent | present | Grep "ISC-45" |
| ISC-17..23 | prose | effort, cost, risks, questions | present | Read on doc |
| ISC-24 | tool | Inference.ts advisor output captured | one call | Bash |
| ISC-25 | file | doc exists under projects/envelope-os/docs | exists | ls |
| ISC-26,28 | anti | git status clean except docs file | zero code diffs | git status |
| ISC-27 | anti | no DML issued | zero | session audit |
| ISC-29 | anti | claims carry file:line | all | Read |
| ISC-30 | anti | closing line shape | needs input: | final message |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| code-survey | Locate delta computation, egress guard, auth, store seams | ISC-2,10,12,15 | — | true |
| catalogue | Derive attribution categories from Aug/Sept diagnoses | ISC-3,4,5,6,7 | — | true |
| harness-eval | Compare claude -p vs Agent SDK for subscription billing | ISC-8,9,11,20,21 | — | true |
| think | FirstPrinciples + ApertureOscillation on the guard and scope | ISC-12,13,14,22 | code-survey | false |
| assessment-doc | Write the assessment to docs/ | ISC-1..23,25 | all | false |
| advisor | Advisor review of recommendation | ISC-24 | assessment-doc | false |

## Decisions

- 2026-09-08: ISC floor (E4 ≥128 soft) relaxed to 30, show-my-math: the deliverable is an assessment document whose natural probe count is the set of questions Nick asked plus the anti-criteria; padding would be ceremony. Delegation floor (E4 ≥2) relaxed: single-author design; Cato unavailable (codex CLI absent, documented gotcha); Advisor covers the second opinion.
- 2026-09-08: Advice-not-action rule applies (feedback memory): the request is a question, so no product code is written this run.

## Changelog

- conjectured: the explainer would need a model to attribute deltas.
  refuted by: the two prior diagnoses attribute every dollar via deterministic queries (zero-base gap, movement fold, pending ghosts); the model only narrated.
  learned: attribution is a code problem; narration is the model's job.
  criterion now: ISC-7 (deterministic tier needs no AI call).

## Verification

- ISC-1..7: Read — doc "Verdict" + "Facility 1" sections; delta computation cited reconcile.ts:259-263; catalogue of 11 (+6 advisor) rows tagged Det/Model; conservation rule stated; output contract sketched; "needs no AI call" stated.
- ISC-8..11: Read — "Billing path" cites Inference.ts; harness table A vs B with recommendation; three read-only layers; tool table of 10 tools.
- ISC-12..16: Grep — "ISC-45" appears 4 times in the doc; consent model, data minimisation, tenant scoping via userId, audit via events actor "agent" (store.ts:53) all present.
- ISC-17..23: Read — UI placement, effort per facility, subscription-only cost, failure/mitigation table, build order, five questions.
- ISC-24: Bash — Inference.ts --mode advisor returned three findings (after one 120s timeout); folded into "Advisor review" section.
- ISC-25: ls — docs/DIAGNOSTIC_EXPLAINER_AND_CHAT_ASSESSMENT.md 12024 bytes.
- ISC-26,28: git status — only `?? docs/DIAGNOSTIC_EXPLAINER_AND_CHAT_ASSESSMENT.md`; src/web/test diff-stat empty; egress.ts untouched.
- ISC-27: session audit — no DB opened; the smoke test used a stub MCP server returning a constant.
- ISC-29: Read — every engine claim cites a file:line or the memory-recorded engine facts.
- ISC-30: final message closes with `needs input:`.
- Smoke test evidence: `claude -p --model sonnet --mcp-config … --strict-mcp-config --allowedTools mcp__probe__ledger_probe --tools ""` → is_error false, num_turns 2, result "The unexplained delta is -$15.23."
- 2026-09-08: Advisor (Rule 2, one timeout then success at 180s) raised: disclosure not just consent; redacted aggregates by default; assert tool list at runtime; six catalogue additions; residual alarm. All folded into the doc. Conflict surfaced (Rule 3): advisor preferred Agent SDK over claude -p; kept claude -p because the SDK drives the same binary and the runtime tool-list assertion gives the same guarantee; recorded in the doc for Nick.
- 2026-09-08: Headless smoke test found `--bare` breaks subscription auth ("Not logged in"); without it the MCP tool call succeeded in 2 turns. Recorded as a gotcha memory.
