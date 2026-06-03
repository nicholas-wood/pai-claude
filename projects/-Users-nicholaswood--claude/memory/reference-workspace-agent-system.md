---
name: reference-workspace-agent-system
description: "Where Nick's consolidated projects + represented-agent system live, and the canonical guide for it (set up 2026-05-28)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: dfac62e4-2b87-40d3-8651-3270110265cd
---

On 2026-05-28 all of Nick's PAI work was consolidated into `~/Documents/workspace/`. Each project is a self-contained folder: `overview.md`, `CLAUDE.md` (project operator, auto-loaded when cwd is the project), `context/` (shared foundation: facts/state/references/feedback + migrated memory files), `agents/`, and `code/` (software) or `artifacts/` (content).

Projects: accessbuddy, lifesaveroncall, limsoc-national-ims, smlsc-club, career, gym, personal, pai, docs-cleanup, lsv-notifications.

**Agent system (represented agents):** each agent is a directory `agents/<name>/` with `claude.md` (persona + `Base:` + responsibilities + startup routine + operating rules + memory protocol — DURABLE only, no specific facts), `memory.md` (six sections: Voice/Process/People/Projects/Output/Tools, maintained in place), and optional `context/`. Specific facts/state live in `context`/`memory.md`, never in `claude.md`.

- **Canonical guide:** `~/Documents/workspace/AGENT_STANDARD.md`. Don't deviate without updating it first.
- **Create new agents** via the `agent-onboarder` agent, which assigns a `Base` (a built-in agent the represented agent shells over) and generates an activation pointer inheriting that base.
- **Project-specific memories were migrated OUT of global** into each project's `context/`. Global memory now holds only user-level / cross-cutting entries. See [[feedback-iterative-refinement]] for collaboration style.

Note: as of the 2026-06-02 PAI 5.x convergence, projects converged onto PAI conventions (per-project `ISA.md`, registered subagents). This note records the original workspace layout; verify paths against the live tree before relying on them.
