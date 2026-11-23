---
name: feedback-separate-apps-stay-separate
description: "Follow project X's patterns" means treat X as a read-only reference and never graft a new app into X's repo or Terraform; since 22 Nov 2026 new LSV POCs go to the shared lsv-poc platform, not a project each
metadata:
  type: feedback
---

On 2026-11-21/22, deploying LIMSOC Permission Assist, Nick's brief said to reuse the LSV Operational Service Summary's setup and auth gate if it was already deployed. I read that as "serve the new app through that service" and opened a PR on `lsv-service-summary` adding a route, a per-app grant and Terraform. Nick asked "Why are you looking at service summary?" and then said: "It should stay separate, just follow those patterns. Read only."

**Why:** Each app is its own thing with its own repo, project and sign-in. The other project was mid-build by another session, and grafting a second app into it couples their deploys, state and access lists. (My interpretation: "reuse" in his briefs means reuse the approach, not the running system.)

**How to apply:** When a brief says to follow or reuse another project's patterns, treat that project as a read-only reference: export its committed source (`git archive origin/main`) and port what is needed into the new app's own repo. Do not create branches, worktrees, PRs or Terraform in the reference project. If a constraint seems to force sharing (for example two apps on one hostname), ask before touching the other project.

**Amended 2026-11-22/23:** the "own GCP project per app" half no longer holds for LSV POCs. After I built Permission Assist in its own project, Nick decided all LSV POCs share one project (`lsv-poc`) with a hub allocating access, and the standalone project was deleted. So: each POC still gets its own repo and stays out of other apps' repos, but it deploys onto the shared platform with the `PocDeploy` skill, never a new project. (My reading: what he objected to was grafting one app into another app's codebase, not sharing infrastructure as such.) See [[project-lsv-poc-platform]] and [[project-poc-permissions]].
