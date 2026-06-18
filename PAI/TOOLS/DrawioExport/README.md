# DrawioExport

Headless `.drawio` -> PNG renderer (user-space; no xvfb / no root).
Renders via the drawio GraphViewer library inside Puppeteer's headless Chromium.

## Usage
```
bun ~/.claude/PAI/TOOLS/DrawioExport/render.ts <input.drawio> <output.png> [scale=2]
```

## Setup (one-time, already done)
- `bun install` (puppeteer)
- `bunx puppeteer browsers install chrome`
- `viewer-static.min.js` vendored from jgraph/drawio.
