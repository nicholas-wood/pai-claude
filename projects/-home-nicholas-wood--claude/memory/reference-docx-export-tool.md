---
name: reference-docx-export-tool
description: "Formatting-faithful md→docx exporter for Nick's resumes/cover letters; use instead of ad-hoc docx generation"
metadata: 
  node_type: memory
  type: reference
  originSessionId: e9555133-0a69-4296-9c45-24eb67f89680
---

Tool at `~/.claude/PAI/TOOLS/DocxExport/` exports resumes and cover letters from markdown to `.docx` that match Nick's originals exactly (font, sizes, ligatures, spacing, headings, bullets, margins, header/footer). Built 2026-06-18 to fix the recurring "export came out with simple/wrong formatting" failure.

**Always use this instead of generating docx from scratch** (the old failure mode). bun/TypeScript, no python-docx needed.

```bash
cd ~/.claude/PAI/TOOLS/DocxExport
bun src/export.ts coverletter letter.md "out.docx"
bun src/export.ts resume resume.md "out.docx"   # --template <docx> to use a specific original
bun src/selftest.ts   # 24-check regression, all pass
```

**Approach = template surgery:** keep the original `.docx` as a style template, preserve every part (styles/theme/fontTable/settings-with-ligatures/numbering/headers) byte-for-byte, regenerate only `word/document.xml` by cloning the template's exact property blocks. Cover-letter output is byte-identical formatting to the original; resume conforms to template archetypes with 3 documented normalizations (uniform bullet indent, uniform section headers, 2-section model). Markdown contract in `README.md` + `templates/`.

Write exports straight to OneDrive paths; never put `.md` in OneDrive (see [[gotcha-onedrive-rclone-push]]). Verify visually with `src/render.ts` → headless Chrome screenshot on the Mac (no LibreOffice/Word on the Linux box). This supersedes the deferred "programmatic resume export pipeline" in PROJECTS.md.
