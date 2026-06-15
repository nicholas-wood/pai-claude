---
name: gotcha-gitignored-subrepo-migration
description: "Gitignored nested git repos didn't survive the Mac→Linux migration; pull them over SSH separately"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 11131224-e0d9-4ec7-a929-509d24b3e145
---

Nested git repos that are gitignored from their parent (e.g. `life-os-console/code/`, its own repo with no remote, ignored by the parent `life-os.git`) were NOT carried across in the Mac→Linux workspace migration — a parent clone never includes a gitignored sub-repo, and with no remote of its own there was nothing to fetch. Symptom: project docs/ISA present, but `find` for `*.ts`/`package.json` returns nothing.

**How to apply:** the Mac is reachable via SSH (`ssh mac`, user `nicholaswood`, key `~/.ssh/id_ed25519`). Recover with `rsync -az -e ssh --exclude node_modules mac:Documents/workspace/<proj>/<subrepo>/ <dest>/` then `bun install` + typecheck. Other workspace projects may still be missing their own gitignored sub-repos — check before assuming code is local. Related: [[project-claude-tree-migrated-from-mac]].
