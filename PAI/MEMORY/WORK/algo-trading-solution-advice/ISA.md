---
task: "Recommend architecture for personal automated trading system"
slug: algo-trading-solution-advice
effort: E4
effort_source: classifier
phase: complete
progress: 24/25
mode: interactive
started: 2026-09-11T10:30:44Z
updated: 2026-09-11T10:49:17Z
---

## Problem

Nick wants a system that reviews market data and executes trades on his behalf, and asked for the best way to build it. No prior PAI work exists on trading. The question is open on asset class (ASX, US equities, crypto), cadence, and how much AI should be in the loop. Without a grounded recommendation he risks over-analysis or building the wrong layer first (a predictive model before a safe execution and risk layer).

## Vision

Nick reads one document and knows exactly which broker to open, which stack to build, in what order, and what not to build. He recognises the central insight instantly: the edge is not prediction, it is disciplined execution of a simple rules-based strategy with hard risk limits, and the AI belongs in research and monitoring, not on the order path.

## Out of Scope

Building the system itself. Choosing a specific strategy or predicting returns. Trading on behalf of anyone else. Tax advice beyond flagging the ATO trader-vs-investor distinction. High-frequency or latency-sensitive trading.

## Principles

- Code before prompts: the trade decision path is deterministic code, never an LLM.
- Recommendation first, then reasoning; trade-offs framed explicitly.
- Paper before live; small before large; kill switch before first live order.
- Precision over vagueness: name brokers, APIs, costs, and risks with verified sources.

## Constraints

- Australian resident individual; must use brokers that onboard Australians.
- PAI stack preference: bun and TypeScript for orchestration; Python only where the quant ecosystem forces it, flagged explicitly.
- No self-marking complete in a background job (needs input close).
- Advice deliverable only; no code, no accounts opened, no trades.

## Goal

Deliver a recommendation Nick can act on: a phased architecture for a personal automated trading system, a broker and data choice grounded in verified 2026 facts for Australian residents, the honest risks, and the first three concrete steps.

## Criteria

- [x] ISC-1: Recommendation opens with a single clear recommended approach before any options.
- [x] ISC-2: Names the recommended broker for ASX and for US equities with a verified source.
- [x] ISC-3: States whether Alpaca onboards Australian residents, with source.
- [x] ISC-4: Lists the IBKR API options (TWS, Client Portal Gateway, Web API OAuth) and which is recommended.
- [x] ISC-5: Names a market-data source and its approximate cost tier.
- [x] ISC-6: Describes a layered architecture: data, strategy, risk, execution, ops, research.
- [x] ISC-7: States the LLM is not on the order path and where AI does belong.
- [x] ISC-8: Recommends a phased rollout: paper, small live, scaled, with a minimum paper duration.
- [x] ISC-9: Lists concrete risk controls (position cap, daily loss limit, kill switch, idempotent orders, reconciliation).
- [x] ISC-9.1: States operator-governance rules: immutable strategy versions, sizing not tied to recent P&L, minimum sample before change.
- [x] ISC-10: Lists backtest pitfalls (lookahead, survivorship, overfitting, costs, slippage).
- [x] ISC-11: Recommends a cadence (daily or slower) and justifies it against intraday.
- [x] ISC-12: Addresses TypeScript vs Python honestly and names where Python is worth approval.
- [x] ISC-13: Names at least two credible alternative approaches with a one-line reason each is not the default.
- [x] ISC-14: Flags the ATO share-trader vs investor treatment and CGT discount consequence.
- [x] ISC-15: States that trading own money needs no AFSL and trading for others does.
- [x] ISC-16: Gives the first three actions Nick should take this week.
- [x] ISC-17: Names the open question that changes the answer most (asset class) and gives the answer per branch.
- [x] ISC-18: Every URL cited was verified live by the research pass.
- [x] ISC-19: Australian English, no em dashes, recommendation-first tone.
- [x] ISC-20: Anti: no claim that the system will be profitable or that AI can predict prices.
- [x] ISC-21: Anti: no code written, no accounts created, no trades placed.
- [x] ISC-22: Anti: no Python-first stack presented as the default without flagging the CLAUDE.md rule.
- [x] ISC-23: Advisor called before committing to the recommendation shape.
- [ ] ISC-24: Job closes with a needs input line, not result.

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..17,19 | inspection | Grep the final message text for the named element | present | rg on draft file |
| ISC-18 | research | Research skill verifier output marks URLs verified | all verified | Research report |
| ISC-20..22 | anti | Grep draft for profit claims, code fences, Python-default | absent | rg |
| ISC-23 | command | Inference.ts advisor output captured | ran | Bash |
| ISC-24 | inspection | Final line starts with needs input | present | self-check |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| research-facts | Verified broker, data, framework, tax facts | ISC-2..5,12,14,15,18 | none | true |
| architecture | Layered design, cadence, risk, AI placement | ISC-6..11 | none | true |
| recommendation-doc | Assemble recommendation-first answer | ISC-1,13,16,17,19..22 | research-facts, architecture | false |
| gates | Advisor, re-read, close signal | ISC-23,24 | recommendation-doc | false |

## Decisions

- 2026-09-11T10:33:32Z: SystemsThinking result adopted. Recommendation leads with operator governance (immutable versions, size decoupled from P&L, change gate) not just exposure limits. Adds ISC-9.1.

- 2026-09-11T10:31:35Z: THINK risks. Alpaca AU onboarding, IBKR Web API without Gateway, and ATO trader status are the three facts the answer hinges on; Research pass verifies them.

- 2026-09-11T10:30:44Z: ISC floor show-your-math. E4 soft floor is 128; the deliverable is a recommendation, not a system. 24 ISCs cover every claim the answer makes. Padding to 128 would be ceremony.
- 2026-09-11T10:30:44Z: Delegation floor met by Research skill (4 agents) plus Advisor. Cato skipped: codex CLI missing on this Linux box (known gotcha), so a cross-vendor audit is impossible here; noted in Verification.
- 2026-09-11T10:30:44Z: Thinking capabilities: FirstPrinciples, SystemsThinking, FeedbackMemoryConsult, ContextSearch, Advisor, ReReadCheck, ISA.

## Changelog

- conjectured: the user wants a build. refuted by: the message is a question ("what would be the best way"), and the advice-not-action feedback memory. learned: deliver assessment, no build. criterion now: ISC-21.

## Verification

- ISC-1..17, 19, 9.1: rg on recommendation.md confirms each named element present (headings: Recommendation, Before anything else, one question table, IBKR constraint, six layers, governance, cadence, AI placement, TS vs Python, pitfalls, tax and legal, alternatives, first three actions).
- ISC-18: Research skill report: 65 URLs curl-verified 200; only those URLs cited.
- ISC-20..22: rg for profit claims, code fences, em dashes returned none; Python flagged as the explicit exception.
- ISC-23: Inference.ts advisor ran (propose-then-approve, VA policy, isolation, fee floor, tax, scheduling adopted).
- ISC-24: pending until final message closes with needs input.
- Cato: SKIPPED, codex CLI absent on this box (known gotcha); no cross-vendor audit possible.
