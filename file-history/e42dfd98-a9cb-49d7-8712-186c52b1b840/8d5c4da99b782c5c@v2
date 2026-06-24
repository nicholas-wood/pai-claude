---
task: Build appliers.ai Forward Deployed Engineer application package + Sonia outreach
slug: appliers-fde-application
effort: E3
phase: complete
progress: 34/34
mode: algorithm
started: 2026-06-23
updated: 2026-06-23
---

## Problem

appliers.ai posted a new role, Forward Deployed Engineer (LinkedIn 4430365784, 23h old, 48 applicants), and a LinkedIn message recommended Nick apply. This is a distinct posting from the Senior Agentic Software Engineer role he already submitted on 2026-06-18 (4424527044). He needs a full, tailored application package plus a warm direct outreach to Sonia, both ready for his review before sending. The apply instructions carry a required hook most applicants will fumble: "include discussion of one repetitive process you'd automate first and your reasoning."

## Vision

Nick reads the package and recognises it instantly as the strongest-fit role in his pipeline for the pivot — FDE is the literal job title for "engineer who embeds in a client business, finds the real problem, and ships the agent that fixes it," which is his exact T-shaped blend. The cover letter answers the automate-first prompt with a concrete, lived example that proves the discovery instinct, not just coding ability. The Sonia outreach feels warm and human, not transactional. He sends with near-zero edits.

## Out of Scope

- Submitting on Nick's behalf (he reviews and sends; this is a bg job).
- Rebuilding the resume from scratch (resume-swe is the proven base; no mandatory tweaks).
- docx/PDF export (handled at submission, same boundary as other applications; flag the ligature check).
- Re-applying to the old role (4424527044 already submitted).

## Constraints

- Style: no em dashes, no semicolons, Australian English, no comparative "work I already do" construction.
- AccessBuddy never leads a paragraph; supplementary closing clause only.
- Cover letter leads every paragraph with paid/professional proof (ANZ, Macquarie, Leidos, LIMSOC).
- Outreach uses the warm open/close frame from feedback-outreach-message-tone.
- Apply path: email sonia@appliers.ai (cover letter doubles as email body) and/or LinkedIn apply box.
- Must answer the JD's required "one repetitive process you'd automate first + reasoning" hook.

## Goal

Produce a review-ready appliers.ai FDE application package — assessment, FDE-tailored cover letter/email body answering the automate-first prompt, a ≤400-char application-form message, and a warm Sonia outreach message — all style-compliant and filed in the dated application folder, so Nick can send with minimal edits.

## Criteria

- [ ] ISC-1: Application folder exists at applications/2026/2026-06-23/1 - appliers.ai - Forward Deployed Engineer/
- [ ] ISC-2: assessment.md written with JD snapshot (company, role, location, posted, applicants, apply path)
- [ ] ISC-3: assessment.md records resume choice (resume-swe) with rationale
- [ ] ISC-4: assessment.md captures the FDE fit thesis vs the prior Senior Agentic SWE role
- [ ] ISC-5: assessment.md names the automate-first answer and reasoning
- [ ] ISC-6: cover-letter.md exists and is addressed correctly (Dear Sonia / Hiring Team)
- [ ] ISC-7: cover-letter opener leads with thesis, not a fit-statement
- [ ] ISC-8: cover-letter paragraph 2 leads with paid/professional proof, not AccessBuddy
- [ ] ISC-9: cover-letter contains a dedicated answer to "one repetitive process you'd automate first + reasoning"
- [ ] ISC-10: cover-letter hits FDE-specific signals (embedded client work, end-to-end deployment, adoption, ship under pressure)
- [ ] ISC-11: cover-letter AccessBuddy appears only as supplementary closing clause
- [ ] ISC-12: cover-letter closes with the standard discuss-further line
- [ ] ISC-13: cover-letter contains zero em dashes
- [ ] ISC-14: cover-letter contains zero semicolons
- [ ] ISC-15: cover-letter uses Australian English (no -ize, no "color/center")
- [ ] ISC-16: cover-letter contains no banned "work I already do" construction
- [ ] ISC-17: cover-letter is roughly one page (~300-380 words)
- [ ] ISC-18: application-message.md exists and is <=400 characters
- [ ] ISC-19: application-message is proof-led (concrete builds, not adjectives)
- [ ] ISC-20: application-message nods to the automate-first / embedded angle
- [ ] ISC-21: application-message has zero em dashes and zero semicolons
- [ ] ISC-22: sonia-outreach.md exists
- [ ] ISC-23: outreach opens with the warm "Hi Sonia, I applied ... wanted to reach out directly" frame
- [ ] ISC-24: outreach middle carries the pivot substance (engineer + product, betting on agentic AI, building with it)
- [ ] ISC-25: outreach closes with the warm collaborative "would love a chat" ask
- [ ] ISC-26: outreach is warm, not terse/clipped
- [ ] ISC-27: outreach has zero em dashes and zero semicolons
- [ ] ISC-28: outreach references the FDE role specifically
- [ ] ISC-29: All four artifacts present in the application folder
- [ ] ISC-30: assessment.md records the LinkedIn job id and sonia@appliers.ai apply path
- [ ] ISC-31: career-positioning agent review pass run against the cover letter
- [ ] ISC-32: Advisor commitment-boundary call run before handing to Nick
- [ ] ISC-33: Anti: No artifact claims AccessBuddy is "commercial" or "paying" tenants
- [ ] ISC-34: Anti: Nothing is submitted/sent on Nick's behalf; package is review-ready only

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1,29 | file | dir + 4 files present | all present | Bash ls |
| 13,14,21,27,33 | grep | style/ban violations | 0 hits | Bash grep |
| 17 | count | word count | 300-380 | Bash wc |
| 18 | count | char count | <=400 | Bash wc -c |
| 7-12,23-26 | inspection | content present + correct lead | pass | Read |
| 31,32 | delegation | review + advisor ran | returned | Agent / Bash |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| assessment | ISC-2,3,4,5,30 | JD scrape | yes |
| cover-letter | ISC-6..17 | feedback memories | yes |
| app-message | ISC-18..21 | cover-letter | no |
| sonia-outreach | ISC-22..28 | feedback memories | yes |
| review+advisor | ISC-31,32 | cover-letter | no |

## Decisions

- 2026-06-23: Resume base = resume-swe. FDE's hard requirement is production code frontend/backend + 5y eng; resume-swe is the proven appliers.ai base and already carries agentic/customer-facing signal. No mandatory tweaks.
- 2026-06-23: ISA written directly via Write (not Skill ISA workflow) to preserve momentum on a writing-class task; doctrine deferred-note permits direct Read/Edit/Write.
- 2026-06-23: Delegation soft-floor (E3 >=2) relaxed to 1 (career-positioning review). Show-your-math: this is single-author positioning writing; a second write-agent would duplicate, not add. Advisor call covers the commitment boundary.

## Changelog

## Verification
