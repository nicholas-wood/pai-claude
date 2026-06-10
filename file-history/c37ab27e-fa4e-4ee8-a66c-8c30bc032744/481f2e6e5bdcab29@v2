---
name: feedback-status-updates-must-persist-to-project-files
description: "When Nick pastes a factual status update on a tracked project, write the changes into the project's system-of-record file. Do not treat \"noting\" or \"for context\" as session-only."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c37ab27e-fa4e-4ee8-a66c-8c30bc032744
---

When Nick pastes a project status update — application outcomes, new rejections, runway changes, strategic shifts, anything that changes the factual state of a tracked project — the default response is to **edit the relevant project file**, not to acknowledge in chat and move on.

Tracked project files live primarily in `~/.claude/PAI/USER/PROJECTS/` (e.g. `career-pivot.md`, `accessbuddy.md`, `limsoc-national-ims.md`) and ISA files inside `~/Documents/workspace/<project>/ISA.md`. These are the system of record. If a fact is not written there, future sessions will not know about it.

**Why:** Recorded failure 2026-06-09, session `dd4900dc-59ed-43c5-8931-f5dd10e4ec6f.jsonl`. Nick pasted: BCG TDA rejected post-TA-chat, Canva rejected, McKinsey low likelihood, 0 live prospects, mid-July checkpoint. Closed with "This is just for an update / Close out." The assistant produced text-only ack ("Read. Got the full picture..."), offered two next-action workflows, then accepted "no action right now" as "no persistence at all" and closed with `result: Context absorbed`. **Zero file writes. Zero memory writes.** Next-day session (2026-06-10) opened with `career-pivot.md` still showing BCG TDA as LIVE and BCG case prep as an open action — eleven days stale and producing wrong-track recommendations until Nick manually corrected.

**How to apply:**

1. If the paste contains factual state changes — outcomes (rejected/accepted/silent), dates, runway numbers, scope shifts, posture changes — identify the project file(s) it belongs to. The PROJECTS.md index is the entry point.
2. Edit those files to reflect the changes. Keep prior history (don't delete the past; mark it as past). Add a `Last updated YYYY-MM-DD` marker so future readers know recency.
3. Then offer follow-up actions if any are warranted, and let Nick accept/decline.
4. "Close out" / "no action" / "just for an update" applies to the **offered follow-up workflows**, not to the foundational persistence step. The persistence step is mandatory whenever facts have changed.

**The shorthand:** "Note this" means "make this durable so future sessions know about it." Acknowledgement in chat is not durable — only file edits are.

Related: [[reference-perplexity-library-import-flow]] (another path for capturing factual context into MEMORY); [[feedback-outbound-explicit-approval]] (don't confuse this rule with that one — persisting facts to internal project files is not an outbound action).
