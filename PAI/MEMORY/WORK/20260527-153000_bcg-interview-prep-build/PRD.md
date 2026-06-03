---
task: Build comprehensive BCG interview prep package
slug: 20260527-153000_bcg-interview-prep-build
effort: advanced
phase: verify
progress: 28/28
mode: interactive
started: 2026-05-27T15:30:00+10:00
updated: 2026-05-27T16:15:00+10:00
iteration: 2
---

## Context

Nick has a 30-minute BCG talent screen on Friday 2026-05-29 for the TDA (Tech & Data Advantage) practice in Melbourne. Referred by Trini Bigalow and Nora Hocke. Application submitted May 2026. He needs:

1. Question bank with answers drafted where possible, flagging gaps requiring his input
2. Full structured plan for the Friday call
3. Time-blocked plan for Thursday and Friday morning
4. 14-day case study prep plan
5. Printable Word doc with one worksheet per page (mental math, market sizing, issue trees)
6. TDA-specific tailoring throughout
7. MBB-coach-grade gap analysis

He has the ChatGPT output for reference. My job is to deliver a tighter, TDA-tuned, artefact-producing response that exceeds it.

### Risks

- Timeline pressure on Friday (limited window for behavioural drilling)
- TDA-specific content gaps if I treat this as generic BCG prep
- Worksheets must actually be useful (not generic puzzles)
- User has no case experience baseline, so worksheets must be progressive
- Risk of producing volume over value

### Plan

Generate four content artefacts (question bank, Friday plan, Thursday+Friday morning plan, 14-day plan) as a single consolidated markdown doc, plus a Word doc of 14 daily worksheets via python-docx script. All artefacts in ~/Documents/workspace/bcg-interview-prep/.

## Criteria

- [ ] ISC-1: Question bank covers CV walkthrough question
- [ ] ISC-2: Question bank covers Why BCG / Why TDA / Why consulting / Why now
- [ ] ISC-3: Question bank covers strengths and development areas
- [ ] ISC-4: Question bank covers 6+ behavioural archetypes
- [ ] ISC-5: Each question flagged as "I can draft" or "needs your input"
- [ ] ISC-6: Friday plan covers pre-call, in-call, post-call
- [ ] ISC-7: Friday plan includes 7+ questions to ask BCG
- [ ] ISC-8: Friday plan includes logistics checklist
- [ ] ISC-9: Thursday plan is time-blocked
- [ ] ISC-10: Friday morning plan is time-blocked
- [ ] ISC-11: 14-day case prep plan has daily structure
- [ ] ISC-12: 14-day plan has weekly milestones
- [ ] ISC-13: 14-day plan includes Casey/BCG digital case practice
- [ ] ISC-14: Word doc generated at correct workspace path
- [ ] ISC-15: Word doc contains 14 daily worksheets
- [ ] ISC-16: Each worksheet is on its own page
- [ ] ISC-17: Each worksheet has mental math section
- [ ] ISC-18: Each worksheet has market sizing prompt
- [ ] ISC-19: Each worksheet has issue tree prompt
- [ ] ISC-20: Each worksheet has synthesis or fit drill
- [ ] ISC-21: Mental math problems progress in difficulty
- [ ] ISC-22: Market sizing prompts include TDA-relevant topics
- [ ] ISC-23: Issue tree prompts include TDA-relevant topics
- [ ] ISC-24: Answer key included for mental math
- [ ] ISC-25: TDA-specific tailoring section called out explicitly
- [ ] ISC-26: MBB coach gap analysis section included
- [ ] ISC-27: All prose in Australian English, no em dashes
- [ ] ISC-28: Files saved to workspace dir, not Downloads

## Decisions

- Effort tier: Advanced (substantial multi-file artefact + content work)
- Worksheet format: Word doc via python-docx, one page per day, 14 days
- Capability invocations: direct Write/Bash for content + script; Skill("Thinking") deferred — gap analysis can be delivered directly with MBB coach framing
- No agent parallelisation: content work is sequential and benefits from coherence

## Verification

(populated during VERIFY phase)
