---
name: feedback-nick-decision-style
description: "Nick prefers conversational option-prompts over the AskUserQuestion tool UI, and strongly favours momentum"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: aa57fd93-cb32-4a60-8608-0a6e4850db78
---

When a decision needs Nick's input, present the options conversationally in the message and let him reply in prose. He has repeatedly declined the AskUserQuestion tool UI (preferring to answer directly, e.g. "go with Path A"). Reserve AskUserQuestion for genuinely high-stakes irreversible forks, if at all.

He strongly favours momentum: "just proceed", "get this done", "yes". When an action is reversible and low-risk, build it and report, rather than asking. Save the questions for genuine forks that change the architecture or are hard to undo.

But: he also values grounded pushback. When proceeding would create something broken (e.g. a remote agent that can't see local files), stop and say so - he respects that over blind execution. The balance: pushback on real blockers, momentum on everything else.

**Why:** He is an experienced operator who finds option-UIs and excessive confirmation slow. **How to apply:** default to conversational prompts + build-over-ask for reversible work; escalate to an explicit question only for irreversible/architectural forks. See also [[feedback-nick-communication-rules]].
