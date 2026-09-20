---
name: project-accessbuddy-contact-form-fix
description: AccessBuddy landing contact form was rejecting every enquiry in prod (blank destination); fixed in v1.18.2 live 20 Sep 2026 via global-admin fallback; end-to-end delivery not yet probed
metadata:
  type: project
---

On 2026-09-20 the landing page contact form at accessbuddy.com.au was returning 503 "temporarily unavailable" for every submission. Prod has no `CONTACT_EMAIL` env var and the landing admin "Destination email" field was blank. Cloud Logging showed Belinda Porter (SMLSC) rejected twice at 01:01Z that day; her message text was not logged.

Fix in PR #100 (branch `fix/contact-form-never-unavailable`, worktree `projects/accessbuddy/code-contact-fix`): destination resolves env var, then landing setting, then every global admin's login email. Pure rule in `contact-destination.ts` with unit tests. CI green. Nick said "merge it and deploy": PR #100 and release PR #101 merged via gh on the Mac, v1.18.2 live 2026-09-20 (revision 00069-gj6, no error logs). Release-branch CI always fails with zero jobs, that is the standing pattern and not a blocker. No live submission was made, so end-to-end delivery is unprobed.

**Why:** the original code deliberately refused a hardcoded fallback inbox that might not exist, so the fallback uses global admin emails, which are verified reachable. `support@accessbuddy.com.au` is unverified.

**How to apply:** the fallback reads `admin_assignments` on the bare `db` handle, so it goes silent at the `accessbuddy_app` RLS cutover. Set `CONTACT_EMAIL` before that cutover. See [[project-accessbuddy-v1181-pickup-location]] and [[gotcha-accessbuddy-prod-access]]. Worktree removed after merge.
