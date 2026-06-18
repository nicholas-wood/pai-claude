# DocxExport — markdown → .docx, formatting-faithful

Exports Nick's resumes and cover letters from markdown to `.docx` that match the
originals exactly: same font, sizes, ligatures, spacing, headings, bullets,
margins, header/footer. No more "the formatting came out too simple."

## How it works (template surgery)

A `.docx` is a zip of XML parts. Prior export attempts *regenerated* styling from
scratch (and got it wrong). This tool instead **keeps the original document as a
template and replaces only the body**:

- `word/styles.xml`, `theme1.xml`, `fontTable.xml`, `settings.xml` (ligatures),
  `numbering.xml`, headers/footers, `docProps`, theme — all preserved **byte for
  byte**.
- Only `word/document.xml` (the body text) and its `.rels` are regenerated.
- Every paragraph/run in the new body is built by **cloning the exact property
  blocks** captured from the template at runtime.

So fidelity is a *consequence* of reusing the originals, not something re-derived.
The cover-letter output is byte-identical to the original on every formatting
dimension; see `bun src/selftest.ts`.

## Usage

```bash
cd ~/.claude/PAI/TOOLS/DocxExport

# Cover letter
bun src/export.ts coverletter letter.md "out.docx"

# Resume
bun src/export.ts resume resume.md "out.docx"

# Use a different original as the style template (e.g. a specific historical CV)
bun src/export.ts resume resume.md out.docx --template "/path/to/Original.docx"
```

Write straight to OneDrive (exports only — never put `.md` in OneDrive):

```bash
bun src/export.ts coverletter letter.md \
  "$HOME/OneDrive/02_Career/Job_Applications/2026/<Company>/Cover Letter - Nicholas Wood.docx"
```

### Other tools

```bash
bun src/inspect.ts <file.docx>                 # dump a docx's style skeleton
bun src/extract.ts resume <file.docx> > out.md # docx -> editable markdown (this contract)
bun src/verify.ts <expected.docx> <actual.docx># diff two docx on formatting dimensions
bun src/render.ts <file.docx> out.html         # standalone HTML preview (open in Chrome)
bun src/selftest.ts                            # regression harness (24 checks)
```

## Markdown contract

### Cover letter
Just the letter text; blank lines separate paragraphs. The three leading vertical
spacers come from the template (don't add them). A single newline inside a
paragraph becomes a line break (used for the sign-off). `**bold**` / `*italic*`
supported.

```
Dear <Company> Recruiting Team,

First paragraph…

Second paragraph…

Yours sincerely,
Nicholas Wood
```

### Resume
See `templates/resume.md` for a full annotated example.

| Markdown | Renders as |
|---|---|
| `# Nicholas Wood` | Centered name (18pt, IntenseEmphasis) |
| contact lines under the name, ` \| ` splits items | Centered contact paragraphs; emails/URLs become hyperlinks, phone stays plain |
| `**One bold line.**` (before first `##`) | Bold headline summary |
| plain paragraph (before first `##`) | Plain summary paragraph |
| `## Section` | Underlined section header |
| `### Org \| Role \| Dates \| Location` | Bold entry header |
| plain line under a `###` | Plain intro sentence for that entry |
| `- bullet` under `## Key Skills` | Italic skill bullet; text before the first `:` is the bold-italic label |
| `- bullet` elsewhere | Standard job bullet |
| `**Degree** - Institution` under `## Education` | Bold degree + plain remainder |
| plain line under `## Certifications` | Plain line |

## Documented normalizations (resume only)

The historical resumes are internally inconsistent from years of hand-editing.
The exporter normalises these to the dominant, cleanest variant (consistent and
professional, occasionally differing from a given original's quirk):

1. **Bullet indent** — all body bullets use one indent (originals mixed
   0.25"/0.5"/0.75" per job). Key-Skills bullets keep their own indent.
2. **Section headers** — one uniform underlined style (originals mixed two).
3. **Section model** — two sections (title block + body). The original's extra
   mid-document section breaks, which only nudged margins, are dropped. The
   first-page header/footer and `titlePg` behaviour are preserved.

Everything else (font, sizes, ligatures, page size, spacing scale, bullet glyph,
header/footer content) is preserved exactly.

## Verification

- `src/selftest.ts` — proves cover-letter byte-fidelity, resume part-preservation,
  page invariants, the inline parser, and input guards. **24/24 pass.**
- `src/render.ts` + headless Chrome screenshots give a visual A/B. (docx-preview
  renders Symbol bullets as □ and page-breaks on continuous sections — both are
  renderer artifacts, not output defects; Word shows • and flows correctly.)

## Adding a new template

Drop a clean original at `profiles/<type>.template.docx` (or pass `--template`).
The exporter captures archetypes from whatever template you give it, so the
output always tracks that document's styling.
