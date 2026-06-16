---
name: feedback-markdown-to-workspace-docx-to-onedrive
description: "When producing paired markdown + Office artefacts (SOPs, briefs, reports), the .md lives in workspace and only the .docx/.pdf/.xlsx goes to OneDrive"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a96492a4-4df9-4c7a-ba9f-5aa9dfe86b06
---

When work produces a paired markdown source + Office output (SOPs, briefs, reports), the markdown is the durable, editable source and belongs in `~/Documents/workspace/<project>/artifacts/`. Only the rendered .docx (or .pdf / .xlsx) goes to OneDrive, because OneDrive is for distributable Office artefacts that other people open, not for the working source.

**Why:** Two reasons, both surfaced 2026-06-11:
1. Markdown in OneDrive lives outside the workspace Obsidian vault and outside the workspace git history — it's invisible to PAI's knowledge layer and to the daily auto-commit cadence, so it drifts. Yesterday's SOP 1.4.1 (Patrolling Areas) landed entirely in OneDrive and was unreachable from any workspace search.
2. OneDrive Linux rclone reads can be up to 12h stale (see [[reference-onedrive-rclone-linux-cache]]), so workspace material kept there is also slow to read back on Linux.

**How to apply:** Whenever a session produces a markdown that drives a generated Office artefact:
- Save the .md to `workspace/<project>/artifacts/<name>.md`
- Save (or render) the .docx/.pdf to the appropriate OneDrive folder
- Never the other way around — if you catch yourself writing a .md into OneDrive, stop and route it to workspace first
- Convention applies to SOPs, briefs, board papers, reports, proposals — anything where the markdown is the source and the Office file is a render target

Related: [[feedback-onedrive-inbox-processing-practice]] (OneDrive `00_Inbox` is also a transit zone, not a home).
