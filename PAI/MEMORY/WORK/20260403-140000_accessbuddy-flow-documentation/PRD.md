---
task: Document all AccessBuddy flows with diagrams
slug: 20260403-140000_accessbuddy-flow-documentation
effort: deep
phase: complete
progress: 48/48
mode: interactive
started: 2026-04-03T14:00:00+10:00
updated: 2026-04-03T14:20:00+10:00
---

## Context

Nick wants comprehensive flow documentation for AccessBuddy covering every workflow in the system. The documentation must serve four audiences: members, admins/approvers/issuers, and developers. It should use Mermaid diagrams grouped by flow domain with persona annotations, keeping each diagram focused on one topic to avoid cognitive overload.

The documentation will live in the AccessBuddy repo as a docs file. Organisation: grouped by flow domain (not by persona or object), with swimlanes showing who performs each action. Each section has a brief text description plus a Mermaid diagram.

### Risks
- Risk of missing flows not visible in code (edge cases handled in frontend only)
- Risk of diagrams being too detailed for non-technical readers
- Risk of state machine diagram being too complex as a single view

## Criteria

- [x] ISC-1: Document covers all four personas with descriptions
- [x] ISC-2: Core request state machine diagram present and accurate
- [x] ISC-3: New fob request flow diagram matches code
- [x] ISC-4: Lost fob report flow (auth'd user) documented
- [x] ISC-5: Lost fob report flow (guest/unauthenticated) documented
- [x] ISC-6: Damaged fob report flow (auth'd user) documented
- [x] ISC-7: Damaged fob report flow (guest) documented
- [x] ISC-8: Damaged fob reader-beeps branching documented
- [x] ISC-9: Additional fob request flow documented
- [x] ISC-10: Return fob flow documented
- [x] ISC-11: Change fob type flow documented
- [x] ISC-12: Access update flow (member-initiated) documented
- [x] ISC-13: Access update flow (admin/system-initiated) documented
- [x] ISC-14: Payment determination logic documented
- [x] ISC-15: Stripe payment flow documented
- [x] ISC-16: Payment exemption request flow documented
- [x] ISC-17: Exemption approval path documented
- [x] ISC-18: Exemption rejection path documented
- [x] ISC-19: Payment refund flow documented
- [x] ISC-20: Request approval flow documented
- [x] ISC-21: Request rejection flow documented
- [x] ISC-22: Programming step flow documented
- [x] ISC-23: Auto-chain SET_PICKUP behaviour documented
- [x] ISC-24: Manual SET_PICKUP (split mode) documented
- [x] ISC-25: Issuing step flow documented
- [x] ISC-26: Hold flow documented with return-to-previous-state
- [x] ISC-27: Resume restrictions documented (approve permission required)
- [x] ISC-28: Cancel request flow documented
- [x] ISC-29: Revoke credential flow documented
- [x] ISC-30: Swap credential flow documented
- [x] ISC-31: Manual add credential flow documented
- [x] ISC-32: Manual add credential stage options documented
- [x] ISC-33: Returned fob reallocation flow documented
- [x] ISC-34: Manual add member flow documented
- [x] ISC-35: Archive member flow documented
- [x] ISC-36: Renewal attestation flow documented
- [x] ISC-37: Force renew flow documented
- [x] ISC-38: Orphaned request linking flow documented
- [x] ISC-39: Credential expiry cron flow documented
- [x] ISC-40: Officer/board permission expiry flow documented
- [x] ISC-41: Access level re-evaluation on permission change documented
- [x] ISC-42: Attestation expiry cleanup documented
- [x] ISC-43: Notification system overview documented
- [x] ISC-44: Daily summary email flow documented
- [x] ISC-45: Each diagram uses Mermaid syntax
- [x] ISC-46: Diagrams annotate which persona performs each action
- [x] ISC-47: No single diagram exceeds reasonable complexity (max ~20 nodes)
- [x] ISC-A-1: No flows are fabricated that don't exist in the code

## Decisions

- 2026-04-03 14:00: Organise by flow domain with persona annotations rather than by persona or by object. Reason: flows cross personas, and object-based grouping creates overlap. Flow-domain grouping keeps each diagram self-contained.
- 2026-04-03 14:00: Use Mermaid flowcharts rather than sequence diagrams. Reason: flowcharts show branching logic better for state-machine-driven workflows.
- 2026-04-03 14:05: Place documentation in repo root as docs/FLOWS.md so it's version-controlled with the code.
