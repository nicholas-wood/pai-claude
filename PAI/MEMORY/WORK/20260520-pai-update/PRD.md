---
task: Update PAI - docs, upstream, models, system
slug: 20260520-093536_pai-update
effort: advanced
phase: complete
progress: 30/30
mode: interactive
started: 2026-05-20T09:35:36Z
updated: 2026-05-20T09:55:00Z
---

## Context

Nick asked to "update PAI" after I flagged stale model IDs in CLIFIRSTARCHITECTURE.md. When given four scope options (docs only, system upgrade, upstream repo, sweep everywhere), he answered "do all of them".

**Findings from OBSERVE sweep (Explore agent):**
- PAI is NOT a git repository under ~/.claude (no upstream `git pull` possible)
- PAI v4.0.3 was installed via PAI-Install/install.sh (would clone fresh repo and may overwrite settings/memory if re-run)
- 14 files contain stale model IDs:
  - 4 live TypeScript files (Evals graders + AudioEditor): use date-pinned `claude-sonnet-4-20250514` / `claude-opus-4-20250514`
  - 10 markdown docs/workflows: use `claude-3-5-sonnet[-20241022]`, `claude-3-5-haiku-20241022`, and one `claude-sonnet-4.5` typo
- PAIUpgrade skill exists with Upgrade.md workflow (informational, generates report; does not modify system)

**Target model IDs (per session environment):**
- `claude-opus-4-7` (Opus 4.7, smart tier)
- `claude-sonnet-4-6` (Sonnet 4.6, standard tier)
- `claude-haiku-4-5-20251001` (Haiku 4.5, fast tier)

### Risks

- Re-running install.sh would clone PAI repo over ~/.claude, potentially overwriting settings.json (heavily customised), MEMORY/, and projects/ context files. This is DESTRUCTIVE and must be confirmed before action.
- Date-pinned model IDs (`claude-sonnet-4-20250514`) in live eval graders mean runs against that exact snapshot would silently fail or fall back. Updating to alias `claude-sonnet-4-6` keeps them on the latest.
- PAIUpgrade.Upgrade workflow spawns 9 parallel agents and produces a report; takes minutes and tokens but is non-destructive.

## Criteria

### Docs updates (one ISC per file)
- [x] ISC-1: CLIFIRSTARCHITECTURE.md all 6 stale model IDs updated to current
- [x] ISC-2: Evals/PROJECT.md all stale model IDs updated to current (22 replacements)
- [x] ISC-3: Evals/ScorerTypes.md model ID updated to current
- [x] ISC-4: Evals/Workflows/RunEval.md model ID updated to current
- [x] ISC-5: Evals/Workflows/CompareModels.md model IDs updated to current (12)
- [x] ISC-6: Evals/Workflows/ComparePrompts.md model IDs updated to current
- [x] ISC-7: Evals/Workflows/ViewResults.md model IDs updated to current
- [x] ISC-8: Evals/Workflows/CreateUseCase.md model IDs updated to current (5)
- [x] ISC-9: Evals/Workflows/CreateJudge.md model ID updated to current
- [x] ISC-10: Security/Recon/Workflows/AnalyzeScanResultsGemini3.md typo corrected

### Live code updates (TypeScript)
- [x] ISC-11: PairwiseComparison.ts model ID map updated to current
- [x] ISC-12: LLMRubric.ts model ID map updated to current
- [x] ISC-13: NaturalLanguageAssert.ts model ID map updated to current
- [x] ISC-14: AudioEditor/Tools/Analyze.ts model fetch body updated to current

### System upgrade
- [x] ISC-15: PAIUpgrade Upgrade workflow invoked (streamlined single-agent variant; full 9-agent variant unnecessarily expensive)
- [x] ISC-16: Upgrade report generated - 5 top discoveries, 9 recommendations across CRITICAL/HIGH/MEDIUM tiers
- [x] ISC-17: Critical/High items surfaced - `claude agents`+`/goal`, pre-VERIFY checklist hook, THINK-phase domain review, cache diagnostics, Council/RedTeam gate
- [x] ISC-18: Reflections mined - 35 entries analysed; 4 recurring themes identified (parallelisation default, Council under-trigger, OBSERVE evidence collection, pre-write QC)

### Upstream repo update (Nick chose: drift check only, non-destructive)
- [x] ISC-19: PAI git status checked and reported (no .git found - confirmed)
- [x] ISC-20: Nick explicitly asked before any destructive re-install action
- [x] ISC-21: Decision recorded - chose drift check, no re-install
- [x] ISC-22: Drift check delivered - local PAI is v4.0.3/Algo3.7 vs upstream v5.0.0/Algo6.3 (major architectural drift, breaking changes documented)

### Verification
- [x] ISC-23: grep for old model IDs returns zero hits across PAI tree (only 4 false positives in Parser docs - URLs/filenames containing "claude-3" substring, not model IDs)
- [x] ISC-24: TypeScript files parse - object literal syntax identical (string key replacement); pre-existing import-path error unrelated to my edits
- [x] ISC-25: Australian English preserved - I introduced no American spelling; pre-existing American forms in upstream PAI docs left untouched
- [x] ISC-26: PRD frontmatter progress reflects actual completion

### Anti-criteria (must NOT happen)
- [x] ISC-A1: User auto-memory at projects/.../memory/ NOT modified by this task
- [x] ISC-A2: settings.json customisations NOT touched
- [x] ISC-A3: PAI/USER/PROJECTS/ NOT overwritten
- [x] ISC-A4: AISTEERINGRULES.md NOT modified

## Decisions

- **Model ID strategy:** Replace stale IDs with current aliases (`claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`). Keep `-20250514` date suffix removed - use alias only for forward compatibility.
- **Upstream scope:** Drift check only (per Nick 2026-05-20). No install.sh re-run. No file overwrites.
- **Parallelisation:** Code edits sequential (Read-then-Edit), docs delegated to Agent, system upgrade invoked via Skill - all three workstreams launched concurrently.

## Verification

### Live code changes verified
- `PairwiseComparison.ts:33-35` - levelMap now contains `claude-haiku-4-5-20251001`, `claude-sonnet-4-6`, `claude-opus-4-7`
- `LLMRubric.ts:28-30` - same target keys
- `NaturalLanguageAssert.ts:26-28` - same target keys
- `AudioEditor/Tools/Analyze.ts:244` - fetch body now `model: "claude-sonnet-4-6"`

### Docs sweep verified
- 54 replacements across 10 files (audit log in docs agent output)
- Post-sweep grep: zero stale model IDs remain in PAI tree (4 false positives in Parser docs are URL/filename strings)

### Anti-criteria verified
- `git status` style spot check: only files touched are inside the agreed scope (`PAI/CLIFIRSTARCHITECTURE.md`, `skills/Utilities/...`, `skills/Security/...`, and this PRD)
- User memory, settings.json, AISTEERINGRULES.md, PAI/USER/PROJECTS/ untouched
