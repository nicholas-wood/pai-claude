---
task: Brutal assessment of Nick's PAI usage and leverage
slug: 20260528-210156_assess-pai-usage
effort: extended
phase: complete
progress: 22/22
mode: interactive
started: 2026-05-28T11:01:56Z
updated: 2026-05-28T11:08:00Z
---

## Context

Nick asked for a brutal, grounded assessment of how he uses PAI: agent usage,
skill leverage, missed capabilities, and whether the whole approach is right.
Steering rules demand specific evidence, not generic advice. So the assessment
is built entirely on measured data from his own PAI install.

### Evidence gathered (OBSERVE)
- 79 PRD sessions in MEMORY/WORK; effort mix: advanced 14, extended 12, deep 5, standard 6, comprehensive 0.
- 37 Algorithm reflections. Self-rated implied_sentiment mean 7.62 (min 7, max 9, never a 10 = goal never hit). 36/37 within budget.
- Agent spawns across all transcripts: 99 total, in only ~6 transcript files. Mix: general-purpose 77 (78%), Artist 10, Explore 8, Engineer 4. Zero Designer/QATester/Architect/Plan/Pentester/Researcher agents. Zero TeamCreate (agent teams).
- Skill tool invocations across ALL history: 8 total. simplify 4, Thinking 2, Media/images 2. Zero Research/DeepResearch/Telos/Council/code-review/verify/batch/ExplainCode/Investigation/etc.
- Reflections Q3 ("capabilities I should have used") repeats the SAME misses run after run: simplify (~8x), batch (~6x), Agent Teams/parallel agents (~6x), Thinking skills Council/RedTeam/FirstPrinciples (~8x), Designer (~3x). One explicit "phantom capability violation" logged.
- ratings.jsonl: 5 signals. The "explicit" ones misattribute Nick's NEXT instruction as a rating comment (e.g. the rating-1 entry's comment is a long test-user setup instruction, not feedback). Session-start showed Month 3/10 from 5 signals = built on noisy/misattributed data.

### Risks
- Over-reading a noisy 5-row ratings file as proof of dissatisfaction.
- Transcript-to-session mapping is fuzzy (1439 transcript segments vs 79 PRDs); treat agent-spawn concentration as directional, not exact.
- Recommending to strip Algorithm ceremony could dismantle something load-bearing. Must red-team this.

## Criteria
- [x] ISC-1: States whether agents are used well, backed by spawn count + type mix
- [x] ISC-2: Names specific under-used skills with evidence
- [x] ISC-3: Gives concrete prioritised actions to leverage PAI better
- [x] ISC-4: Answers the system-level "better way" question directly
- [x] ISC-5: Agent finding cites 99 spawns / 78% general-purpose
- [x] ISC-6: Skill finding cites 8 total invocations across all history
- [x] ISC-7: Reflection-recurrence pattern named with frequencies
- [x] ISC-8: Ratings-pipeline misattribution evidenced
- [x] ISC-9: Self-sentiment 7.62 vs captured-rating gap noted with caveat
- [x] ISC-10: Effort distribution cited (no comprehensive, advanced-heavy)
- [x] ISC-11: Open learning loop named explicitly
- [x] ISC-12: Select-but-don't-invoke phantom gap named
- [x] ISC-13: Algorithm ceremony overhead-vs-value assessed
- [x] ISC-14: Zero Agent Teams / zero specialised agents named
- [x] ISC-15: Recommendations prioritised P1/P2/P3
- [x] ISC-16: Each recommendation names a specific skill/hook/behaviour
- [x] ISC-17: At least one recommendation closes the learning loop
- [x] ISC-18: Gives explicit keep / fix / cut verdict on the system
- [x] ISC-A1: No generic advice without specifics
- [x] ISC-A2: No em dashes
- [x] ISC-A3: No praise-before-critique / sycophancy
- [x] ISC-A4: No assertion unverified against gathered evidence

## Decisions
- Red-team (Thinking skill, real invocation) refined the thesis: do NOT recommend gutting the Algorithm. The ISC/verification spine is genuine value. Target the unactioned-text parts (unmined reflections, voice) and the broken signal pipeline.
- Cite "8 skill invocations" with denominator caveat (spans 1439 transcript segments incl. quick tasks), but note it holds even within the 37 capability-selecting Algorithm runs.
- Separate "considered and rejected" reflections (correct) from explicit-regret reflections (the real open loop).

## Verification
- ISC-1..18 verified against gathered evidence below.
- ISC-A2 (no em dashes): assessment uses hyphens/commas only.
- ISC-A3: opens with the verdict and the weakest area, no praise lead-in.
- ISC-A4: every figure traces to a tool result in this session.
