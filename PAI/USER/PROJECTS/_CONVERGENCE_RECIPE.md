# Workspace → PAI Convergence Recipe

> The repeatable per-project procedure proven on AccessBuddy (2026-06-02). Run this once per workspace project to converge it onto PAI conventions in place. Projects stay in `~/Documents/workspace/`; only the durable personal layer and the knowledge index live under `~/.claude/PAI`.

## Per-project steps

1. **Author the project ISA** at `<project>/ISA.md` (twelve sections: Problem, Vision, Out of Scope, Principles, Constraints, Goal, Criteria, Test Strategy, Features, Decisions, Changelog, Verification). Fold `context/{facts,state,references,feedback}.md` into it. Keep `context/` as an appendix until fully absorbed, then retire.
2. **Rebuild agents as PAI-registered subagents.** For each `<project>/agents/<name>/`:
   - Keep the durable `claude.md` (persona) + `memory.md` (learnings) - these beat trait fragments.
   - Create a harness pointer at `<project>/.claude/agents/<project>-<name>.md` (frontmatter: name, description, model, color, and **`tools:`** - scope it; design/review and QA agents must NOT inherit write/deploy. Omitting `tools:` grants ALL tools, which breaks the design→implement handoff. Cato-audit finding from the AccessBuddy pilot). Body: adopt base built-in methodology, read ISA + claude.md + memory.md + context/, follow them, voice completion. Note: lowercase `claude.md` for the persona is deliberate (distinct from the harness `CLAUDE.md`).
   - Assign a distinct PAI voice (IDs from `skills/Agents/Data/Traits.yaml`).
   - Register the set in `USER/SKILLCUSTOMIZATIONS/Agents/NamedAgents.md`.
3. **Wire the knowledge index.** Add a typed note in `MEMORY/KNOWLEDGE/{Ideas|Companies|People|Research}/<slug>.md` (summary + key facts + links to the ISA and the PAI project index). Verify with `bun MemoryRetriever.ts "<query>"`.
4. **Update the PAI project index** `USER/PROJECTS/<name>.md` to point at the ISA.
5. **Retire the bespoke scaffolding** once the ISA is the source of truth: `AGENT_STANDARD.md` is superseded by PAI Agent/Skill docs; the `life/chief-of-staff` agent is superseded by the DA.

## Scaling (parallelisation) - staggered, not blind fan-out

The advisor flagged the **N=1 trap**: AccessBuddy proves the recipe *can* work once, not that it is *repeatable*. Going straight to 9-in-parallel would replicate any latent recipe flaw 9× before it is observable. So:

1. **Validate serially on 1-2 dissimilar projects first** (e.g. a non-code project like `lsv-comms-officer` and a content/personal one). Measure whether the recipe actually reduces effort and produces a usable ISA, not just twelve plausible sections.
2. **Then fan out** the remainder in parallel - one agent per project (the 8-project-migration pattern). Agent rebuilds and index notes pipeline behind each ISA.

### Decisions to lock before fan-out (advisor-flagged)

- **Per-project acceptance metric.** Define "converged" concretely: retrieval precision/recall on a small held-out query set per project, plus the twelve-section completeness gate. "Produced an ISA" is not acceptance.
- **Index topology.** BM25 is lexical and corpus-dependent. Decide shared-vs-isolated KNOWLEDGE index per project up front: a shared index risks cross-project term collision; isolated means N index ops. Default: one shared index, but tag each note with its project and watch acronym/jargon drift.
- **Recipe versioning + rollback.** Durable agents pin a recipe version. When the recipe is fixed mid-flight, live projects must migrate cleanly - version this file and record which project converged under which version.
- **Supervision bandwidth.** Concurrent commitment boundaries become the bottleneck; staggering smooths it. Do not rubber-stamp parallel boundaries.
- **Template lock-in.** Treat the twelve-section schema as a hypothesis until validated on the next 1-2 dissimilar projects; only then freeze it.

## What stays where

| Layer | Home |
|-------|------|
| Identity, TELOS, preferences, project index, knowledge index | `~/.claude/PAI/USER` + `MEMORY/` |
| Project record (ISA), agents, working notes, code | `~/Documents/workspace/<project>/` (in place) |
| Finals / binaries (signed docs, contracts, invoices) | OneDrive via the `onedrive://` convention |

## Projects remaining (9)

lifesaveroncall, limsoc-national-ims (completed - ISA as case-study record), lsv-comms-officer, smlsc-club, career, life, personal, life-os-console, pai.
