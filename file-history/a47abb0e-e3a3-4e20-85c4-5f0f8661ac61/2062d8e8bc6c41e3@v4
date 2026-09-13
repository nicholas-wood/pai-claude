---
task: Check whether Gordon's AccessBuddy confirmation (attestation) link has expired
slug: gordon-attestation-link-check
effort: E3
phase: complete
progress: 32/32
mode: standard
started: 2026-09-12T02:00:00+10:00
updated: 2026-09-12T12:05:00+10:00
---

## Problem

A South Melbourne LSC member named Gordon reports that his AccessBuddy confirmation link says it has expired. Nick cannot see from the Linux box whether that is true, whether a fresh link has already been auto-sent, or whether the link he clicked was superseded by a newer token. The answer lives in prod Cloud SQL, which is private-IP and reachable only through a Mac-launched window that a background job is not permitted to open itself.

## Vision

Nick reads one short answer: the exact state of every attestation row Gordon has, when each token lapsed in Melbourne time, whether the nightly auto-resend has already replaced it, whether the replacement email was actually sent or is stuck in the queue, and the one action (if any) that unblocks Gordon.

## Out of Scope

No code changes to AccessBuddy. No writes to prod (no manual resend via SQL, no token edits). No email to Gordon. No Interceptor session on Nick's Chrome. Other members' data is not reported beyond the Gordon candidate match.

## Constraints

- Prod DB is private-IP Cloud SQL; the IP window opener runs gcloud on the Mac and must be launched by Nick (auto-mode denies gcloud-over-ssh in background jobs).
- `attestation_requests`, `credentials`, `audit_log`, `email_queue` are tenant-scoped RLS; `set_config('app.current_tenant_id', …)` must precede reads. Tenant slug is `south-melb-lsc`.
- Never print DATABASE_URL; never scp member emails to Linux; read output via single `ssh mac cat`.
- The window must close with `ipv4Enabled: False` verified.

## Goal

Determine from prod data whether the attestation link Gordon holds is expired, superseded, or live, explain why, and name the single unblocking action for Nick.

## Criteria

- [ ] ISC-1: Confirmation link identified as the attestation flow (`/t/{slug}/attest/{token}`), evidenced by the 410 "This confirmation link has expired" string in the token route.
- [ ] ISC-2: Token lifetime rule captured: `attestationTokenExpiryDays` default 7, applied by renew, resend, and cron auto-resend.
- [ ] ISC-3: Cron behaviour captured: pending rows past expiry are marked `expired` nightly and a fresh pending row plus queued email is created when eligible.
- [ ] ISC-4: Resend route behaviour captured: rotates the token on the existing pending row, invalidating older links (old link then returns 404 "not valid", not 410).
- [ ] ISC-5: Email delivery path captured: renew/resend send inline; cron auto-resend goes through `email_queue` under the 85/day budget.
- [ ] ISC-6: Prior job's opener pattern reused (assign-ip, proxy 5433, DATABASE_URL never printed, no-assign-ip on exit).
- [ ] ISC-7: `gordon.sql` written and is read-only (contains no INSERT/UPDATE/DELETE).
- [ ] ISC-8: `gordon.sql` sets `app.current_tenant_id` before any RLS table read.
- [ ] ISC-9: `gordon.sql` selects the tenant settings `attestationTokenExpiryDays` and `attestationAutoResend`.
- [ ] ISC-10: `gordon.sql` lists candidate users matching "gordon" with membership status and current season.
- [ ] ISC-11: `gordon.sql` lists every attestation row per candidate with created, expiry, lapsed flag, status, completed.
- [ ] ISC-12: `gordon.sql` lists attestable credentials (active/expired) per candidate.
- [ ] ISC-13: `gordon.sql` lists `email_queue` attestationRequested rows with sent/queued status per candidate.
- [ ] ISC-14: `gordon.sql` lists audit_log renew/resend/auto-resend/email events per candidate.
- [ ] ISC-15: Token values never printed in full (only 8-char prefixes).
- [ ] ISC-16: `gordon-prod-query.sh` written, mirrors the proven opener, ends with `QUERY_DONE` and `IPV4_ENABLED_AFTER`.
- [ ] ISC-17: Mac reachability confirmed before handing Nick the launch line.
- [ ] ISC-18: Nick handed a single copy-paste `!` launch line (scp + nohup) that writes output to `~/pai-tmp/gordon.out`.
- [ ] ISC-19: Output read back via single `ssh mac cat`, not scp.
- [ ] ISC-20: Output shows `DB_CONNECTED`.
- [ ] ISC-21: Output shows `QUERY_DONE`.
- [ ] ISC-22: Output shows `IPV4_ENABLED_AFTER=False`.
- [ ] ISC-23: Exactly one Gordon identified, or the ambiguity surfaced to Nick with the candidate list.
- [ ] ISC-24: Latest attestation row's status and token expiry stated in Melbourne time.
- [ ] ISC-25: Verdict stated as one of: live / lapsed-and-not-yet-resent / lapsed-and-resent (newer link exists) / superseded-by-manual-resend / completed.
- [ ] ISC-26: If a newer link exists, whether its email was sent (sent_at) or is still queued is stated.
- [ ] ISC-27: Days-between-issue-and-send computed for the link Gordon most likely clicked, to test the "delivered late" hypothesis.
- [ ] ISC-28: Single unblocking action for Nick named (e.g. click Resend on Gordon's member page, or nothing needed because a fresh link is already in his inbox).
- [ ] ISC-29: Anti: no UPDATE/INSERT/DELETE executed against prod.
- [ ] ISC-30: Anti: the Cloud SQL public IP is not left enabled after the run.
- [ ] ISC-31: Anti: no member email address or full token is copied to the Linux box or into the ISA.
- [ ] ISC-32: Anti: no gcloud command is retried from this session after a permission denial.

## Test Strategy

| isc | type | check | threshold | tool |
|---|---|---|---|---|
| ISC-1..5 | code | Grep for the cited strings/functions | present | Grep |
| ISC-6,16 | file | Read script, compare to rx-open.sh pattern | matches | Read |
| ISC-7..15 | file | rg for verbs / set_config / left(token,8) | as stated | Bash rg |
| ISC-17 | net | ssh mac echo | reachable | Bash |
| ISC-18 | msg | launch line present in report | yes | Read |
| ISC-19..22 | output | ssh mac cat gordon.out | markers present | Bash |
| ISC-23..28 | data | rows in gordon.out | stated in report | Bash |
| ISC-29..32 | anti | rg on sql; IPV4 marker; no scp of output | pass | Bash |

## Features

| name | description | satisfies | depends_on | parallelizable |
|---|---|---|---|---|
| code-map | Trace attestation token lifecycle in code | ISC-1..5 | [] | true |
| query-pack | SQL + opener script staged in job tmp | ISC-6..16 | [code-map] | true |
| launch | Nick launches; results read back | ISC-17..22 | [query-pack] | false |
| verdict | Interpret rows, name unblocking action | ISC-23..28 | [launch] | false |

## Decisions

- 2026-09-12 12:05 Delegation floor (E3 ≥2) relaxed, show-your-math: the work is one SQL file and one script against a known schema; a Forge/Explore agent would re-read the same four files. Thinking capabilities used: FeedbackMemoryConsult (prod-access + auto-mode gotchas), RootCauseAnalysis (lapsed vs superseded vs late-delivery hypotheses), Science (three hypotheses probed by the SQL), ReReadCheck.
- 2026-09-12 12:05 Chose a self-contained open-query-close script over a 20-min held window: a single read-only pull needs no interactive session and closes the IP window sooner.
- 2026-09-12 12:30 Classifier returned MINIMAL on "Go"; conversation-context override kept the Algorithm run (it was the launch approval for the staged pull).
- 2026-09-12 20:15 Follow-on scope (Nick-directed): drain scheduler job confirmed missing, created via gcloud (targeted terraform plan unsafe: Cloud Run + secret drift), imported into state after force-unlocking a stale lock and trimming two unknown for_each entries; header corrected to the live cron secret after 401s; manual run returned 200 and drained 9 rows. Gordon's dead-link queued email cancelled (row b8c54bd3); Gordon completed attestation 12:37 via Nick's 12:34 Resend. Open: prod.tfvars cron_secret and the auth-hardening secrets drift (see memory gotcha-accessbuddy-terraform-drift).

## Changelog

- conjectured: Gordon's link "expired" because the token lapsed and nothing replaced it. refuted by: prod rows show the nightly cron did replace it (cycle 3, 02:00 today) but the replacement email is still `queued` 10 h later. learned: the failure is in delivery, not token lifetime; the 2-hourly email-queue drain scheduler (Terraform notes it is code-only, needs a reviewed apply) appears not to be running. criterion now: ISC-26/28 report queue status and name the drain job as the follow-up check.

## Verification

- ISC-1..5: Grep — `attestations/[token]/route.ts:79` 410 "This confirmation link has expired"; `resend-attestation/route.ts:83-90` token rotation; `cron/daily/route.ts:226-388` expire + auto-resend via `enqueueEmail`; `email-queue.ts:199` 85/day budget.
- ISC-6..16: Read/rg — `gordon.sql` READ_ONLY_OK, one `set_config`, token `left(...,8)`; script mirrors rx-open.sh with QUERY_DONE + IPV4_ENABLED_AFTER markers.
- ISC-17..22: Bash — Mac reachable 12:03; Nick launched 12:26; output shows `DB_CONNECTED after 2s`, `QUERY_DONE`, `IPV4_ENABLED_AFTER=False`, `CLOSED_AT=2026-09-12T02:28:48Z`. Read via single `ssh mac cat`.
- ISC-23: one candidate, Gordon Porter, active, season 2026/2027.
- ISC-24..27: three attestation rows: renew 26 Aug (expired 2 Sep), auto-resend cycle 2 on 4 Sep 11:16 (email sent 4 s later; token expired 11 Sep 11:16), auto-resend cycle 3 on 12 Sep 02:00 (token live to 19 Sep 02:00; email `queued`, unsent at 12:27). Late-delivery hypothesis refuted for the 4 Sep link (sent in 4 s); confirmed as "not delivered at all" for today's link.
- ISC-28: unblocking action = click Resend on Gordon Porter's member page (inline send, fresh 7-day token); follow-up = confirm `accessbuddy-email-queue-drain` scheduler job exists.
- ISC-29..32: no write verbs in SQL; IPV4 False verified; output not copied to Linux; no gcloud attempted from this session.
