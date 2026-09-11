---
name: project-algo-trading-advice
description: Personal automated trading system advice given 11 Sep 2026; verified broker/data/tax facts and open questions
metadata:
  type: project
---

On 2026-09-11 Nick asked how best to build a system that reviews market data and executes trades. Recommendation delivered (not built) at `PAI/MEMORY/WORK/algo-trading-solution-advice/recommendation.md`: daily-cadence deterministic rules engine, risk layer first, paper 3 months then propose-then-approve, LLM off the order path, TS for execution and Python only for backtesting.

Verified facts worth not re-researching: IBKR Australia is the only mainstream AU broker with an ASX API (Tiger is the alternative, has a TS SDK); IBKR offers no OAuth to individuals so a persistent Gateway process is needed; IBKR ASX Total data is AUD 25/month; Alpaca AU live eligibility is unconfirmed (paper is open to anyone); TypeScript has no credible backtester (vectorbt alive, backtrader dead, Nautilus mid-v2 rewrite); own-money algo trading needs no AFSL; frequent trading risks ATO share-trader status and loss of the CGT discount.

**Open questions Nick owns:** VA employee securities trading policy (read first), asset class choice, Alpaca AU support answer.

**How to apply:** if this resumes as a build, start from the recommendation file and the ISA, not from scratch. Related: [[feedback-advice-not-action]], [[gotcha-cato-codex-cli-missing]].
