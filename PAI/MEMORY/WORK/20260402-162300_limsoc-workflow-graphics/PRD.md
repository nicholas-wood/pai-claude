---
task: Create LIMSOC workflow and project allocation graphics
slug: 20260402-162300_limsoc-workflow-graphics
effort: extended
phase: complete
progress: 22/22
mode: interactive
started: 2026-04-02T16:23:00+11:00
updated: 2026-04-02T16:16:00+11:00
---

## Context

Nick needs two professional diagrams to capture LIMSOC's ways of working for stakeholders (dev team, product, state representatives, management group). These will document:

1. **Status Workflow** - Full ticket lifecycle from intake through Done, with ownership at each transition
2. **Project Allocation** - How tickets get assigned to projects (High Impact Bugs, Minor Enhancements, Support Requests, Initiative Projects) and the rules governing when Candidate can be bypassed

Key flow elements confirmed through discussion:
- Triage (dev team) routes to: urgent bugs (High Impact Bugs/TODO), refinement (state rep), candidate (direct), support request (state rep approval)
- Refinement has 5 business day SLA, state rep assigned
- Support requests with no dev change go Refinement to Done directly
- Candidate worked through at weekly LIMSOC Extended Standup: TODO, Backlog (could do), or Cancelled (should not do)
- Dev pipeline: TODO to In Progress to In QA to Product Review to External Review to Done
- External Review rejection: bug back to dev, functional back to product
- All tickets must be in a project before TODO
- Agreed project scope can bypass Candidate at product team/tech lead discretion
- LIMSOC Management Group notified of High Impact Bugs

### Risks
- Mermaid rendering can clip text in certain node shapes - mitigated by using descriptive multi-line text
- Diagrams must be consistent in colour coding across both visuals

## Criteria

- [x] ISC-1: Status workflow diagram shows Triage as entry point for user feedback
- [x] ISC-2: Team-created ticket entry points shown bypassing Triage
- [x] ISC-3: Triage to High Impact Bugs TODO path with urgency indicator shown
- [x] ISC-4: LIMSOC Management Group notification annotated on urgent bug path
- [x] ISC-5: Triage to Refinement path shown with state rep assignment
- [x] ISC-6: Triage to Candidate direct path shown for items needing no rep input
- [x] ISC-7: Triage to Support Request path shown with state rep approval
- [x] ISC-8: Refinement five business day SLA annotated on diagram
- [x] ISC-9: Refinement to Candidate transition shown as normal flow
- [x] ISC-10: Refinement to Done shortcut for support requests without dev change shown
- [x] ISC-11: Weekly LIMSOC Extended Standup annotated at Candidate stage
- [x] ISC-12: Three Candidate outcomes shown as TODO and Backlog and Cancelled
- [x] ISC-13: Backlog to TODO transition shown with product team or tech lead ownership
- [x] ISC-14: Full dev pipeline shown TODO to In Progress to In QA to Product Review to External Review to Done
- [x] ISC-15: External Review bug rejection path back to In Progress shown
- [x] ISC-16: External Review functional rejection path back to Product Review shown
- [x] ISC-17: Ownership and responsibility annotated at each major transition
- [x] ISC-18: Project allocation diagram shows all four project types
- [x] ISC-19: Must be in project before TODO rule shown in project allocation diagram
- [x] ISC-20: Candidate bypass rule for agreed project scope shown
- [x] ISC-21: Relationship between project allocation and status workflow shown
- [x] ISC-22: Both diagrams professionally styled and readable by non-technical audience

## Decisions

- 2026-04-02 16:23: Used programmatic Mermaid.js rendering over AI image generation for text accuracy on complex diagrams
- 2026-04-02 16:24: Colour scheme: Blue=Dev Team, Green=Product Team, Orange=State Rep, Purple=Governance gates, Red=Urgent/Cancelled
- 2026-04-02 16:25: Removed disconnected PROJECT_GATE from status workflow (covered in project allocation diagram)
- 2026-04-02 16:26: Added descriptive subtitle text to terminal nodes to force wider rendering and avoid text clipping

## Verification

- ISC-1 through ISC-17: Verified visually against rendered status-workflow.png
- ISC-18 through ISC-21: Verified visually against rendered project-allocation.png
- ISC-22: Both diagrams use consistent colour coding, readable text, and professional styling
- All capabilities invoked: Thinking/FirstPrinciples (flow validation), Media/Mermaid (diagram creation)
