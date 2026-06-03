---
name: feedback-iterative-refinement
description: "How Nick collaborates on system-design work — layered refinements, honesty over hand-waving, agent-first execution"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dfac62e4-2b87-40d3-8651-3270110265cd
---

On design/architecture work Nick refines the spec across several messages rather than handing over a finished one. Treat the first request as a starting point: fold each new constraint in and re-verify, don't over-commit to v1.

**Why:** In the 2026-05-28 workspace/agent build he layered ~6 refinements (directory-based agents → onboarding agent → cleanup scope → memory training → claude.md=persona-not-facts → Base/shell-over-built-in). Each reshaped earlier work. Treating any single message as the full scope would have produced churn.

**How to apply:**
- Expect follow-on refinement; keep changes modular so they're cheap to extend.
- Be honest about mechanisms and limits. Surface caveats and uncertainties; don't hand-wave confident answers.
- Default to agent-first, parallel execution and route through represented agents. See [[reference-workspace-agent-system]].
- Confirm consequential or destructive steps before acting.
