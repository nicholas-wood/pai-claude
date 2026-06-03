---
name: feedback-delegate-aggressively
description: Standing rule — Jarvis delegates aggressively to SME agents; compose one when none fits; never handle substantive work inline
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 667f6e64-b3ad-4f2e-939c-07505d330f27
---

Nick's standing rule (2026-06-03): **always delegate aggressively.** Every substantive task goes to a subject-matter-expert agent, not handled inline in the main session — even when Jarvis could answer it in one pass. The point of PAI is leverage and a clean audit trail, not main-session convenience.

**Why:** Nick designed PAI as a chief-of-staff delegation model (see [[reference-workspace-agent-system]] and DA_IDENTITY chief-of-staff section). When Jarvis handled a Home Assistant task inline, Nick pushed back — the value is in routing to SMEs, and inline execution defeats the system's purpose.

**How to apply:**
- Real/substantive work → delegate to the right project/SME agent.
- No agent fits → compose one via `pai-agent-onboarder` BEFORE doing the work, don't pick it up yourself.
- Only handle inline: greetings, pure acknowledgements, trivial single-fact lookups, and meta-questions about the system itself.
- The missing-SME gap is itself a signal: a recurring thread with no owning agent means onboard one.
