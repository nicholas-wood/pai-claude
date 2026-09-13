---
name: project-helm-trading-engine
description: Helm, Nick's deterministic daily trading engine (ASX via IBKR, US via Alpaca/FMP), built 12-13 Sep 2026; state, findings, next steps
metadata:
  type: project
---

Helm lives at `~/Documents/workspace/projects/helm` (git, master). Bun/TypeScript, SQLite store, six layers: data (Yahoo/EODHD bars, ASX announcements via markitdigital plus the asx.com.au v2 statistics HTML table), features (PAI Inference.ts announcement classifier with keyword fallback and cache), strategies (momentum and announcement-momentum, inverse-vol, top 8, tradeability gate, vol floor, rank hysteresis), replay (next-open fills, spread-aware ASX cost model, participation cap, HTML report), risk (caps, vol target, daily loss and drawdown halts, KILL file, loosening deferral), execution (router, PaperBroker, IBKR Client Portal adapter verified against IBKR OpenAPI 2.39, reconciler), ops (daily run, propose-then-approve, watchdog, parcel ledger, notify), US path under `src/markets/us` (NYSE calendar, Alpaca broker/bars/news, FMP screener, microcap cost model). Project ISA at `helm/ISA.md`; runbook has a Known limitations section.

Deployed on the Linux box: `helm-daily.timer` Mon-Fri 16:30 Sydney (paper mode) and `helm-watchdog.timer` 18:30, installed by `deploy/install.sh` (idempotent).

**Findings (2026-06-10..09-10 replay, 59 ASX large caps, benchmark STW +1.5%):** daily rebalance lost ~9% with 5.7% in costs; weekly ~-5.3% with 2.7% costs; model-classified announcement tilt did worse than pure momentum (no leakage edge). Rank hysteresis added to cut churn. The replay is a plumbing and cost proof, not validation.

**Gotchas:** PAI_DIR is `~/.claude/PAI` (Inference.ts path); older ASX announcement PDFs are unreachable, headline-only for history; Inference.ts fallbacks rise under concurrency (retry serially); config paths resolve relative to the config file (use `config/helm.keyword.toml` for the keyword-only control); ElevenLabs quota is zero so voice cues are silent.

**Next steps (owner Nick):** read the VA securities trading policy; choose ASX (IBKR) or US microcaps (Alpaca, keys in .env); watch the forward paper record; consider a weight-drift band if re-sizing churn dominates; do not loosen risk limits after seeing a replay.

Related: [[project-algo-trading-advice]], [[gotcha-cato-codex-cli-missing]], [[gotcha-pulse-latch-voice-quota]].
