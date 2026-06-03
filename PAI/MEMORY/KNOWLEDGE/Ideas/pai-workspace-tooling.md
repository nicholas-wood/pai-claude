---
title: PAI Workspace Tooling (pai project)
type: project-knowledge
status: converging
tags: [pai, agents, agent-standard, workspace, meta]
created: 2026-06-02
updated: 2026-06-02
source: convergence run 2026-06-02 from ~/Documents/workspace/pai/context/
---

# PAI Workspace Tooling

## Summary

The `pai` workspace project at `~/Documents/workspace/pai/` is the meta-project for Nick's Personal AI Infrastructure: it holds upgrade planning, version-drift tracking, and the two meta-agents (`agent-onboarder`, `maintainer`) that minted and maintained the workspace agent system. As of 2026-06-02 this project is converging into the live PAI 5.x system at `~/.claude/PAI`, which natively covers all the capabilities the workspace project was managing manually.

## Key Facts

- **AGENT_STANDARD.md** at `~/Documents/workspace/AGENT_STANDARD.md` is the hand-rolled guide that governed agent creation across all 10 workspace projects (15 agents minted to it on 2026-05-28). It is now superseded by PAI 5.x Agent/Skill documentation at `~/.claude/PAI/DOCUMENTATION/Agents/AgentSystem.md`.
- **agent-onboarder** creates new workspace agents conforming to AGENT_STANDARD.md. Single scope: agent architecture and minting. Base: Engineer (PAI-registered). Voice: Baron (`onwK4e9ZLuTAKqWW03F9`). Pointer: `~/Documents/workspace/pai/.claude/agents/pai-agent-onboarder.md`.
- **maintainer** tracks version drift and performs hook/skill/config maintenance on `~/.claude`. Single scope: PAI infrastructure health. Base: Engineer (PAI-registered). Voice: George (`JBFqnCBsd6RMkjVDRZzb`). Pointer: `~/Documents/workspace/pai/.claude/agents/pai-maintainer.md`.
- **OneDrive convention:** `artifacts/onedrive-PAI/` in the workspace project is the OneDrive export of PAI 4.x artefacts (upgrade plans, usage analyses, drift notes). Retained as historical archive; contents not migrated.
- **Version drift (as of 2026-05-20):** local install is PAI v4.0.3 / Algorithm v3.7.0 (frozen March 2026); upstream is v5.0.0 / Algorithm v6.3.0. Drift-check-only stance held; no full reinstall planned.
- **Loop-hardening (2026-05-28):** Algorithm v3.7.0.md gained 8 gates; `ArtefactQuality.hook.ts` blocks prose artefacts with em dashes, US spellings, or `~/Downloads` writes; `RatingCapture.hook.ts` ratings misattribution fixed.
- **Upgrade backlog (critical):** (1) `claude agents` + `/goal` primitive; (2) pre-VERIFY checklist hook (partly live); (3) THINK-phase domain-expert review; (4) Anthropic SDK auto-caching; (5) Council/RedTeam gate for sentiment-risk tasks.

## Links

- Project ISA: `~/Documents/workspace/pai/ISA.md`
- Converges into: `~/.claude/PAI` (PAI 5.x, the canonical live system)
- Agent pointers: `~/Documents/workspace/pai/.claude/agents/pai-agent-onboarder.md`, `~/Documents/workspace/pai/.claude/agents/pai-maintainer.md`
- Agent personas: `~/Documents/workspace/pai/agents/agent-onboarder/claude.md`, `~/Documents/workspace/pai/agents/maintainer/claude.md`
- Upgrade recommendations: `~/Documents/workspace/pai/context/reference_pai_upgrade_recommendations.md`
- Version drift detail: `~/Documents/workspace/pai/context/project_pai_version_drift.md`

## Source

Convergence run 2026-06-02. Source files: `overview.md`, `CLAUDE.md`, `context/facts.md`, `context/state.md`, `context/references.md`, `context/feedback.md`, `context/project_pai_version_drift.md`, `context/project_pai_loop_hardening.md`, `context/reference_pai_upgrade_recommendations.md`, `agents/agent-onboarder/claude.md`, `agents/agent-onboarder/memory.md`, `agents/maintainer/claude.md`, `agents/maintainer/memory.md`.
