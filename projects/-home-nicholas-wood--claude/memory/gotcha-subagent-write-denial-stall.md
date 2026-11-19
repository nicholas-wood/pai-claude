---
name: gotcha-subagent-write-denial-stall
description: In bg jobs a subagent's Write into a workspace worktree can hit an unanswered permission prompt, get a generic denial and stall the build for days; brief agents to report denials immediately and test the same write from the main session
metadata:
  type: reference
---

16-19 Nov 2026, AccessBuddy lockers build: an `accessbuddy-feature-dev` subagent's first Write-tool call into `projects/accessbuddy/.worktrees/lockers` returned the generic "Permission for this tool use was denied" (no rule, hook or reason). It stopped a third of the way through with nothing committed, and the job sat for nearly three days before the notification surfaced. Its earlier writes via shell heredocs had all been allowed, and a Write to the same path from the main session succeeded at once (the directory was then added as a working directory).

**How to apply:**
- In every build brief for a background subagent: commit early and often, and "if any tool call is denied, stop and report the verbatim message immediately".
- When a subagent reports a denial with no stated reason, get the verbatim text, then try the same write from the main session. Allowed there means a stalled prompt, not a decision; refused there means ask Nick.
- Creating the target file as a stub from the main session lets the subagent carry on.
- Do not leave a long build unobserved across days: a silent stall looks identical to a long run.

Related: [[gotcha-automode-blocks-prod-db-window]], [[gotcha-accessbuddy-prod-access]].
