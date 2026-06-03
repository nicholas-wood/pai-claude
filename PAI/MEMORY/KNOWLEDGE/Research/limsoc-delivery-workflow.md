---
title: LIMSOC 10-Phase Project Delivery Workflow
type: process-document
domain: surf-lifesaving / incident-management / governance
organisation: SLSA / LIMSOC
created: 2026-06-02
---

# LIMSOC 10-Phase Project Delivery Workflow

## Summary

Nick defined a formalised 10-phase project delivery process for LIMSOC features, providing consistent gates with clear ownership at each phase. The workflow was produced as part of the national IMS consulting engagement and governs how features move from idea to production. Features are assigned a target release month at the Scoping phase, and releases target the second week of each month (monthly release train).

## Key Facts

**The 10 phases:**

1. **Strategic Alignment** (Product Team) -- agree it is worth pursuing at Extended Standup
2. **Scoping** (Product Team) -- feature brief, user stories, acceptance criteria, target release month assigned
3. **Technical Assessment** (Dev Team) -- architecture, estimation, risks, dependencies
4. **Approval** (Stakeholders) -- 5-point gate: clear requirements, strategic alignment, timeline aligned to release month, funding, capacity
5. **Development** (Dev Team) -- active build; weekly check-ins, bi-weekly stakeholder updates, iterative testing
6. **Verification and Validation** (Product Team) -- verification (meets requirements) then validation (solves the problem)
7. **Final Acceptance** (Stakeholders) -- presented at Extended Standup; formal sign-off
8. **Configuration** (Dev Team) -- environment prep, migration, feature flags
9. **Release** (Product Team) -- mandatory communication plan, deployment
10. **Done** -- post-implementation review (PIR), lessons learned

**Release cadence:** feature releases target the second week of each month; each feature is assigned a target release month at Scoping.

**Why it matters:** formalises end-to-end delivery so features move through consistent gates with clear ownership, replacing an ad-hoc process.

**Workflow artefacts:**
- Diagrams (drawio + png): `~/workspace/limsoc-project-workflow/`
- Source: `~/.claude/MEMORY/WORK/20260421_limsoc-project-workflow/` (html, mmd, drawio, png)

## Source

`~/Documents/workspace/limsoc-national-ims/context/project_limsoc_delivery_workflow.md`
and `~/Documents/workspace/limsoc-national-ims/context/facts.md`
