---
name: reference-interview-scanner-false-complete
description: "InterviewScan.ts over-reports template TELOS files as 100% complete; verify real content, not the score"
metadata: 
  node_type: memory
  type: reference
  originSessionId: aa57fd93-cb32-4a60-8608-0a6e4850db78
---

`bun ~/.claude/PAI/TOOLS/InterviewScan.ts` reports completeness from the template *structure*, not from whether the content is real. Bootstrap files full of `(sample)` placeholders show as "100% / review mode" or "99%". This false-positive bit three times on 2026-06-02 (MISSION, then PROBLEMS/STRATEGIES/NARRATIVES/WISDOM, then BOOKS) and was the root cause of Pulse showing "placeholder data".

**How to apply:** Never trust the scanner's % alone. Before treating a TELOS/preference file as filled, grep it for `(sample)` / "SAMPLE TEMPLATE". A file is real only when the sample markers are gone.

Related: Pulse dashboards read source files **live** via `/api/life/*` and `/api/telos`, so placeholder content on Pulse = empty/template source files, not a stale build or cache. The TELOS summary renderer is `GenerateTelosSummary.ts` (NOT `TelosRenderer.ts`, which does not exist). The onboarding banner is driven by the `~/.claude/PAI/USER/.template-mode` marker file. See [[feedback-nick-communication-rules]].
