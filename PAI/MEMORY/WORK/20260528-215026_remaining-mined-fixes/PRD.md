---
task: Implement remaining mined fixes - assumption audit, compression, domain pre-check
slug: 20260528-215026_remaining-mined-fixes
effort: extended
phase: complete
progress: 19/19
mode: interactive
started: 2026-05-28T11:50:26Z
updated: 2026-05-28T11:52:00Z
---

## Context

Implementing the final 3 mined candidates (Nick approved all). All are additive
prose edits to PAI/Algorithm/v3.7.0.md:
- #2 Assumption audit (~6x miss): surface material assumptions (recipient, signatory, scope, data-model) and ask BEFORE BUILD.
- #3 Phase compression (~5x miss): skip BUILD for single-file/simple tasks, do not re-read in-memory files, skip formal Thinking framework when inline suffices.
- #5 Domain pre-check (~3x miss): run domain/review agent at end of THINK, not VERIFY, for artefact-producing specialised tasks.

### Verified anchors (OBSERVE)
- OBSERVE REVERSE ENGINEERING output ends l.159; EFFORT LEVEL at l.161 -> insert #2 between them.
- Execution section "ALL WORK INSIDE THE ALGORITHM" at l.116 -> insert #3 after it as a global rule.
- THINK ISC REFINEMENT at l.313 -> insert #5 bullet after it.
- v3.7.0.md.bak-20260528 is the pre-session restore point. Edits are additive.

### Key constraints
- #3 compression must NOT weaken the mandatory simplify/batch gates, the ISC count gate, or capability-consumption check for Advanced+ work. Compression applies to Standard/advisory scope only.
- #2 must respect CLAUDE.md ordering: complete the phase output first, then AskUserQuestion. And not re-ask what prior sessions already established.

## Criteria
- [x] ISC-1: ASSUMPTION AUDIT block added to OBSERVE after REVERSE ENGINEERING
- [x] ISC-2: Enumerates material assumption types (recipient, signatory, scope, data-model)
- [x] ISC-3: Instructs AskUserQuestion for material assumptions before BUILD
- [x] ISC-4: Includes do-not-re-ask-prior-session sub-rule
- [x] ISC-5: Respects complete-output-then-ask ordering
- [x] ISC-6: PHASE COMPRESSION rule added to Execution section
- [x] ISC-7: Allows skipping BUILD for single-file/simple tasks
- [x] ISC-8: Allows not re-reading files already in context
- [x] ISC-9: Allows skipping formal Thinking framework when inline suffices
- [x] ISC-10: Compression explicitly does not weaken Advanced+ gates/ISC
- [x] ISC-11: DOMAIN PRE-CHECK bullet added to THINK
- [x] ISC-12: Targets artefact-producing specialised-domain tasks
- [x] ISC-13: Runs domain/review agent at end of THINK not VERIFY
- [x] ISC-14: References the existing pattern (fabricator-review style)
- [x] ISC-15: All three edits additive, nothing deleted
- [x] ISC-16: All three markers present (grep)
- [x] ISC-17: Sections read coherently in surrounding flow
- [x] ISC-A1: No em dashes in added text
- [x] ISC-A2: Compression does not override simplify/batch/ISC-count gates

## Decisions
- #3 compression explicitly fenced: never applies to Advanced+, never overrides ISC-count / simplify / batch / consumption gates. This prevents the compression from becoming a verification-skipping loophole.
- #2 ordered to respect CLAUDE.md (finish OBSERVE output, then AskUserQuestion) and to check prior sessions/project files before asking, since re-asking settled questions is itself a low-rating pattern.
- Left the 44 pre-existing em dashes in the spec untouched (not requested; reformatting them is scope creep). Only ensured my added text is clean.

## Verification
- 3 new markers present; all 8 session Algorithm edits confirmed present (grep count 8).
- My three added blocks verified em-dash clean; edits additive, nothing deleted.
- Compression block contains the explicit Advanced+/gates carve-out (ISC-10, ISC-A2).
