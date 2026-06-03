---
name: feedback-working-docs-in-workspace
description: "Working documents go in ~/Documents/workspace/<project>/, not PAI/USER/PROJECTS (index cards only)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: aa57fd93-cb32-4a60-8608-0a6e4850db78
---

Full working documents (runbooks, ISAs, deliverables, design docs) belong in `~/Documents/workspace/<project>/`, alongside that project's `ISA.md`, `context/`, `code/`, `artifacts/`. The folder `~/.claude/PAI/USER/PROJECTS/` holds ONLY lightweight one-card-per-project index summaries (career-pivot.md, accessbuddy.md, pai.md, etc.), loaded at session start.

I broke this by writing a full home-box runbook into `~/.claude/PAI/USER/PROJECTS/home-box.md`; Nick caught it. Moved to `~/Documents/workspace/pai/home-box.md`.

**Why:** This is the agreed convergence convention (PROJECTS.md note: "Files stay in ~/Documents/workspace/; only this index, the agent registry, and the knowledge index live under ~/.claude/PAI"). The two trees also back up differently: `~/.claude` → private GitHub; `~/Documents/workspace` → OneDrive/Syncthing.

**How to apply:** New working doc for a project → write it to `~/Documents/workspace/<project>/`. Only put a short pointer/card under PAI if it needs session-start discoverability. Exception: code/config that is part of the running PAI system (e.g. `PAI/Pulse/linux/` units) correctly stays under `~/.claude` because it travels in that repo. Relates to [[reference-workspace-agent-system]].