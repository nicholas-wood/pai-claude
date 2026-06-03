---
task: Implement mined fixes - OBSERVE recon, artefact-quality hook, capability-consumption
slug: 20260528-214307_implement-mined-fixes
effort: advanced
phase: complete
progress: 27/27
mode: interactive
started: 2026-05-28T11:43:07Z
updated: 2026-05-28T11:50:00Z
---

## Context

Implementing 3 of the 6 mined upgrade candidates (Nick approved #1, #4, #6):
- #1 OBSERVE codebase recon (the ~8x highest-frequency miss)
- #4 write-time artefact-quality hook (enforces Nick's em-dash / AU-spelling / no-Downloads rules)
- #6 capability-to-consumption check (root-fix for phantom capabilities)

### Verified (OBSERVE)
- Hook I/O contract (from PRDSync + SkillGuard): read stdin via readFileSync(0); tool_input.file_path; PostToolUse can feed the agent via {decision:"block", reason} (self-correction prompt) or pass with {continue:true}.
- PostToolUse runs AFTER the write, so the file is on disk - read file_path from disk to support both Write and Edit uniformly.
- Existing PostToolUse Write/Edit matcher already runs PRDSync; add ArtefactQuality alongside it.
- v3.7.0.md OBSERVE anchors confirmed: insert recon between EFFORT LEVEL (l.165) and ISC Generation (l.167); insert #6 after SELECTION METHODOLOGY step 4 (l.204).

### Key safety decisions
- The hook fires on EVERY write (high blast radius). It MUST never break a write: any error -> {continue:true}, exit 0.
- Content checks ONLY on prose artefacts (.md/.markdown/.mdx/.txt). NEVER on code (US spelling like "color" in CSS is required, not a bug).
- Strip fenced ``` and inline `code` before scanning, so "color" inside a markdown code block is not falsely flagged.
- Exclude node_modules, .git, and PAI-internal paths (~/.claude) from content checks. Downloads-path check applies to all writes.
- Block only on high-confidence findings (em dash U+2014, Downloads path, curated US spellings outside code).

### Risks
- False-positive blocking annoys / loops -> mitigated by prose-only scope, code-strip, curated spelling list.
- settings.json corruption -> back up first, validate JSON after.

## Criteria
- [x] ISC-1: settings.json backed up before edit
- [x] ISC-2: hooks/ArtefactQuality.hook.ts created
- [x] ISC-3: Hook reads stdin JSON per house contract
- [x] ISC-4: Hook reads file content from disk (Write + Edit safe)
- [x] ISC-5: Content checks scoped to .md/.markdown/.mdx/.txt only
- [x] ISC-6: Excludes node_modules/.git/PAI-internal from content checks
- [x] ISC-7: Strips fenced + inline code before scanning
- [x] ISC-8: Em dash (U+2014) detection on prose artefacts
- [x] ISC-9: Downloads-path write detection (any file type)
- [x] ISC-10: Curated US-spelling scan on code-stripped prose
- [x] ISC-11: Outputs {decision:block, reason} when issues found
- [x] ISC-12: Outputs {continue:true} exit 0 when clean
- [x] ISC-13: Never breaks a write on error (try/catch -> continue)
- [x] ISC-14: Registered in settings.json PostToolUse Write
- [x] ISC-15: Registered in settings.json PostToolUse Edit
- [x] ISC-16: Hook parses without syntax error (bun build)
- [x] ISC-17: Test - em dash file blocked with offending line shown
- [x] ISC-18: Test - clean prose file continues, no block
- [x] ISC-19: Test - Downloads path blocked
- [x] ISC-20: Test - "color" inside code fence NOT flagged
- [x] ISC-21: Test - code file (.ts) with "color" NOT flagged
- [x] ISC-22: #1 Codebase Recon step added to OBSERVE
- [x] ISC-23: #6 capability-to-consumption step added to SELECTION METHODOLOGY
- [x] ISC-24: Algorithm edits additive, nothing deleted
- [x] ISC-A1: No em dashes in added text/comments
- [x] ISC-A2: Hook never blocks on code files
- [x] ISC-A3: settings.json remains valid JSON

## Decisions
- Hook reads the written file from disk (not tool_input.content) so one code path covers Write and Edit.
- Block (not silent warn): {decision:"block",reason} feeds the agent a self-correction prompt without undoing the write. Reason text tells the agent it may proceed if a flagged spelling is a proper noun/quote, preventing loops.
- Spelling list kept small + unambiguous; code stripped before scanning; code files never content-scanned. Three independent false-positive guards.
- /simplify found one real bug: stripCode collapsed newlines so em-dash line numbers were wrong after code blocks. Fixed by blanking code to spaces while preserving newlines. Re-verified line 8 reports correctly.

## Verification
- settings.json valid JSON after edit; hook registered on Write + Edit alongside PRDSync.
- Hook parses (bun build). Test matrix all correct: em dash blocks (accurate line), clean AU prose passes, color-in-code-fence passes, US spelling blocks, .ts code file passes, ~/Downloads blocks.
- Algorithm: CODEBASE RECON added to OBSERVE, CONSUMPTION CHECK added to SELECTION METHODOLOGY (2/2 markers).
- /simplify invoked via real Skill tool call (dogfooded the new mandatory gate); one fix applied.
- Backups: settings.json.bak-20260528, PAI/Algorithm/v3.7.0.md.bak-20260528.
