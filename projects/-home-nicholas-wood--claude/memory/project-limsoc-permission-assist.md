---
name: project-limsoc-permission-assist
description: SUPERSEDED 22 Nov 2026 - the standalone limsoc-pa-prod deployment is retired; Permission Assist now lives in the shared lsv-poc project at permissions.poc.nicholaswood.com.au
metadata:
  type: project
---

Retired. Permission Assist moved to the shared LSV POC platform: live at https://permissions.poc.nicholaswood.com.au in project `lsv-poc`, from repo `nicholas-wood/poc-permissions` (page under `site/`); access is allocated per user in the hub at https://poc.nicholaswood.com.au (claim `poc_permissions`). Current state lives in [[project-lsv-poc-platform]].

What the standalone attempt left behind, reported by the lsv-poc-consolidation session on Nick's decisions (not verified by me):
- GCP project `limsoc-pa-prod` deleted on 22 Nov 2026 (Google keeps it recoverable for 30 days). Do not relink, redeploy or release there.
- Repo `nicholas-wood/limsoc-permission-assist` archived, read-only. Local checkout at `~/Documents/workspace/projects/limsoc-permission-assist/code` and its ISA are history only.
- A flat `permissions.nicholaswood.com.au` CNAME I added by gcloud to zone `nicholaswood-com-au` in `lsv-oss-prod` (on Nick's instruction) was handed to that session to remove.
- `limsoc-brief-poc` was unlinked from billing to free a slot and was still unlinked when I last looked.
- Dead Terraform working copy with a `prod.tfvars` at `mac:~/pai-tmp/limsoc-pa`.

Why it was replaced: see [[feedback-separate-apps-stay-separate]] for the first correction, then Nick's later decision to consolidate all LSV POCs in one project.
