---
name: project-accessbuddy-pr141-member-emails-merge
description: AccessBuddy member emails (one primary) and irreversible member merge, PR #141, live in v1.27.0 since 23 Nov 2026; Interceptor pass and prod duplicate report owed
metadata:
  type: project
---

PR #141 (`feat/member-emails-and-merge`, worktree `.worktrees/member-emails-merge`, ISC-269..309 in the project ISA) merged into main as 46073ba on 23 Nov 2026 on Nick's instruction; release PR #142 merged the same evening on his instruction; v1.27.0 live 23 Nov 2026 (migration 0023 applied, no errors in startup logs). Nick asked for several emails per member with one primary, and merging two member accounts.

Shape: `users.email` stays the primary untouched; migration 0023 adds `user_alternate_emails` and `user_merges` only. One resolver in `lib/services/user-emails.ts` backs sign-in, OTP, request submit, orphan matching, lockers and search. Merge (`lib/services/member-merge.ts`) is one transaction: clear unique collisions, move every reference, delete the duplicate; old member URL redirects.

Open with Nick (my defaults, not his decisions): added addresses can sign in unverified; email changes on club admins need manage admins and are refused for multi-club members (tightens the existing edit form); merge is single-club only; admin-only, no member self-service.

Owed: Nick runs `docs/sql/duplicate-emails-report.sql` against production before release; real-Chrome (Interceptor) pass after release; merge and the global email tables need a privileged path at the RLS role cutover.

**How to apply:** any new migration that adds a user column or a unique index over one must be registered in the merge lists; the coverage test in `member-merge.test.ts` fails otherwise (it caught #139's index on rebase). Do not run `next build` while a dev server shares the worktree's `.next` (false "/_document" failure). Related: [[gotcha-accessbuddy-prod-access]], [[project-accessbuddy-lockers-module]].
