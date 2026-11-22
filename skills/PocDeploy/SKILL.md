---
name: PocDeploy
description: "Deploy a claude.ai prototype to Nick's shared LSV POC platform (GCP project lsv-poc) so it is live behind sign-in at <id>.poc.nicholaswood.com.au, registered in the access hub at poc.nicholaswood.com.au, with alerts, uptime check, CI secret scan and dependency audit. Takes a poc-pack archive (zip with poc.json) or a repo, validates it, scaffolds a private app repo from the host template, provisions with the poc-app Terraform module, registers it in the hub and verifies live. Gated: stops for Nick's yes before creating a GitHub repo, before any terraform apply, and before any DNS write. USE WHEN deploy a POC, deploy a prototype, deploy this claude artifact, put this on the POC platform, poc-deploy, new LSV POC, host this on nicholaswood.com.au, add a POC to the hub, poc-pack zip, redeploy a POC. NOT FOR creating a new GCP project per app (never: the platform exists to avoid that), changing the parent DNS zone nicholaswood.com.au, AccessBuddy or LifesaverOnCall deployments, or granting a person access to a POC (Nick does that in the hub grid)."
version: 1.0.0
effort: high
---

# PocDeploy

The canonical instructions, tools and gotchas live in the platform repository, next to the code they drive, so they are versioned with it. This skill is the entry point.

## Do this

1. Go to the platform repository: `${HOME}/Documents/workspace/projects/lsv-poc-platform/code` (GitHub `nicholas-wood/lsv-poc-platform`). Pull `main` first.
2. Read `skills/poc-deploy/SKILL.md` there in full and follow it step by step. Its tools are in `skills/poc-deploy/tools/`. Run everything from the repository root.
3. Read `DEPLOY.md` in the same repository for how the shared project was brought up and what was confirmed live.
4. The system of record for the platform is `${HOME}/Documents/workspace/projects/lsv-poc-platform/ISA.md`. Record decisions and verification there.

## The three gates

Never, without Nick saying yes in the current conversation, each time: create a GitHub repository, run any `terraform apply`, write any DNS record. Show the plan's adds, changes and destroys before asking. A yes to one is not a yes to the next.

## Where things run

- `gcloud`, `gh` and `terraform` run on the Mac: `ssh mac 'export PATH=/opt/homebrew/bin:/opt/homebrew/share/google-cloud-sdk/bin:$PATH; ...'`. `gh` needs `GH_TOKEN=$(cat ~/.gh-token)` there.
- Terraform working copies with their variable files are on the Mac under `~/pai-tmp/` (`lsv-poc-platform/terraform/platform` for the platform, `poc-<id>/infra` for each app). State is in `gs://lsv-poc-tfstate` (`platform`, `apps/<id>`).
- Move files with tar over ssh; rsync between the machines is broken.
- Do git from the main session. Engineer subagents are worktree-isolated and cannot run git in other repositories.

## Gotchas

- The Service Summary's repository and the parent DNS zone belong to its own thread. Do not edit either; send that thread a message.
- The packager half (`poc-pack`) is a claude.ai skill. A claude.ai chat cannot be relied on to push to GitHub, so expect a zip. Build the upload zip with `bun run skill:zip` in the platform repository.
- The repository's own skill file carries the full, current gotcha list (Hosting caching, API key referrers, unverified accounts, probe signer, deploy pipeline). Read it; do not rely on memory of a previous run.
- Verify with the live end-to-end script and the Interceptor skill before saying a POC is live. If Interceptor cannot connect, say the browser pass is owed.
