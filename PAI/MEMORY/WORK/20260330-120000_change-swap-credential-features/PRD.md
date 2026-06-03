---
task: Build change-credential and swap-credential features
slug: 20260330-120000_change-swap-credential-features
effort: advanced
phase: complete
progress: 8/8
mode: interactive
started: 2026-03-30T12:00:00+11:00
updated: 2026-03-30T12:00:30+11:00
---

## Context

Build two admin features for AccessBuddy: (1) Change Credential on a request (update serial/type after programming), and (2) Swap Credential on fob detail (deactivate old, create new). Both need API routes and UI components following existing codebase patterns.

## Criteria

- [x] ISC-1: Change-credential API route created at correct path
- [x] ISC-2: Change-credential API validates permission and status
- [x] ISC-3: Change-credential API creates audit log entry
- [x] ISC-4: Admin-actions UI has Change Credential button and form
- [x] ISC-5: Swap credential API route created at correct path
- [x] ISC-6: Swap credential API deactivates old and creates new in transaction
- [x] ISC-7: SwapCredential UI component created with form
- [x] ISC-8: Fob detail page integrates SwapCredential component

## Decisions

## Verification
