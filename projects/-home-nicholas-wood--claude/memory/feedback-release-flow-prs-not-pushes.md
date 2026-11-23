---
name: feedback-release-flow-prs-not-pushes
description: Nick's repos ship by pull request, merge, release-please release PR, merge, deploy (the AccessBuddy flow); never push to main, never merge for him, and set a new repo up this way from the start
metadata:
  type: feedback
---

On 2026-11-23 Nick asked me to "confirm which repo I merge" changes into and to "confirm all the merges would generate a release please which would then trigger a deployment on merge". None of the three LSV POC repos did: the platform's host template had dropped release-please for deploy-on-push, and I had been pushing straight to `main` for two days, so every deploy had bypassed him. His response: "Yes, add release-please to all three and ship handoff as PRs. This should be a part of the skill to set these up as it is what accessbuddy does."

**Why:** the merge is his review and release gate. A deploy he did not merge is a deploy he did not approve, however good the change. (My interpretation: this is his default for any repo that deploys, not only these three.)

**How to apply:**
- For any repo of his that deploys: branch, conventional commits (`feat:`, `fix:`), `gh pr create`, and stop. He merges the change and then the "chore(main): release x.y.z" pull request; that release is what deploys.
- Never `git push origin main` and never merge either pull request, even when the repo is unprotected. Private repos on his GitHub plan cannot have branch protection, so nothing will stop me except this rule.
- When creating or templating a new repo, include release-please (config, manifest, `VERSION`, `release-please.yml` gating `deploy.yml` on `release_created`), turn on "Actions may create pull requests", and create the `production` environment.
- If I find a repo of his deploying on push, say so at once; do not carry on using it.

Related: [[project-lsv-poc-platform]], [[gotcha-accessbuddy-prod-access]] (the gh token and PR recipe from the Mac).
