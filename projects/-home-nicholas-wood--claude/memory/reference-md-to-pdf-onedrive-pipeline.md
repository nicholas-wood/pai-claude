---
name: reference-md-to-pdf-onedrive-pipeline
description: Working markdown->PDF export path (Chrome headless + marked) for pushing readable docs to OneDrive
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0279ceea-92aa-4778-b828-5cf87983c905
---

A working markdown->PDF pipeline exists on the Linux box, so general docs (prep packs, notes, briefs) can be rendered to readable PDF and pushed to OneDrive without pandoc or python-docx (both absent; no apt/pip). This complements [[reference-docx-export-tool]] (which is template-faithful md->docx for resumes/cover letters only, with a strict resume/coverletter markdown contract that mangles general docs like tables/code blocks).

**The path:**
- `marked` (npm, install via `bun add marked` in a tmp dir; network works) parses markdown -> HTML. Wrap in a small styled HTML template (own CSS for tables, code, headings).
- Render HTML -> PDF with the puppeteer Chrome already on disk: `~/.cache/puppeteer/chrome-headless-shell/linux-131.0.6778.204/chrome-headless-shell-linux64/chrome-headless-shell --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf=out.pdf in.html`. No pandoc, no LaTeX, no PDF engine needed.
- Push to OneDrive with `rclone copy localdir/ "onedrive:<path>"` then verify with `rclone lsl`. Do NOT rely on the rclone FUSE mount for writes (uploads stall silently, and the mount listing can show files that are not on the remote): see [[gotcha-onedrive-rclone-push]].

**Rule reminder:** OneDrive holds exports only, never `.md`. Keep markdown source in the workspace, push the rendered PDF.

This partially closes the "programmatic resume export pipeline (PDF unbuilt)" open item: PDF generation now works for general docs; the remaining gap is template-faithful resume `.docx`/`.pdf` fidelity. The reusable converter script lived at `$CLAUDE_JOB_DIR/tmp/md2html.ts` (job-scoped, not permanent) during the Virgin interview-prep build (2026-06-24).
