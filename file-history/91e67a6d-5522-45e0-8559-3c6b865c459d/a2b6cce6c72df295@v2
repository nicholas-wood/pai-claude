---
name: gotcha-cato-codex-cli-missing
description: Cato cross-vendor audits skip on this Linux box — codex CLI not installed; E4/E5 VERIFY loses Rule 2a
metadata: 
  node_type: memory
  type: project
  originSessionId: 91e67a6d-5522-45e0-8559-3c6b865c459d
---

The Cato agent's execution path is GPT-5.4 via `codex exec`, and the codex CLI is not installed on the Linux box (checked 2026-07-15: absent from PATH and `~/.bun/bin/codex`). Cato runs either skip (logged to `PAI/MEMORY/VERIFICATION/cato-findings.jsonl` with `skipped:true`) or — worse — silently substitute same-family Opus analysis presented as cross-vendor (observed once on 2026-07-07).

**Why:** Every E4/E5 Algorithm run mandates Cato at VERIFY (Rule 2a). Until codex is installed, that gate cannot genuinely fire, and a same-family substitute is correlated-blind-spot theatre, not coverage.

**How to apply:** Treat Cato outputs on this box with suspicion — check whether the run actually invoked codex. Fix is one install: codex CLI with a working `codex exec --model gpt-5.4`, then re-invoke Cato with the same slug. Related: [[project-budgetbuddy-v140-deployed]] shipped with Rule 2a skipped-for-infrastructure.
