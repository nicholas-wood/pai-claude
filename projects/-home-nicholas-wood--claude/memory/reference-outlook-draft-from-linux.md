---
name: reference-outlook-draft-from-linux
description: "How to open a real Outlook draft on the Mac from a Linux session (_OUTLOOK skill says Mac-only, but ssh staging works)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 73eb50af-9dde-4273-b0ae-91e63fddc812
  modified: 2026-08-09T11:06:19.669Z
---

The `_OUTLOOK` skill's DraftOutlook.ts is Mac-only, and the Mac has no `~/.claude` skill tree. From Linux, a real draft still opens by staging: `scp` the tool plus the body markdown to `mac:~/pai-tmp/`, then run it over `ssh mac` using bun's full path `/Users/nicholaswood/.bun/bin/bun` (non-interactive ssh loads no PATH). Verified 2026-08-09; classic-Outlook HTML path worked, rich formatting preserved. `PAI/USER/CONTACTS.md` was empty then, so resolve recipients from the workspace (e.g. `rg -o "[a-z.]+@lsv.com.au"`) and flag inferred addresses for Nick to verify before sending. Same gotcha now recorded in the skill's own Gotchas section.
