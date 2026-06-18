// inline.ts — dependency-free inline markdown -> run segments.
// Supports **bold**, *italic*, _italic_. Uses simplified CommonMark flanking
// rules so emphasis only triggers on real markers: an opener must be followed
// by non-whitespace and have a valid closer; a closer must be preceded by
// non-whitespace; underscores never emphasise intra-word (snake_case safe);
// unbalanced markers are emitted literally. Toggles are inserted into rPr at
// the schema-correct position (right after rStyle/rFonts), per OOXML CT_RPr.

export interface Seg {
  text: string;
  bold: boolean;
  italic: boolean;
}

function findCloser(src: string, start: number, marker: string): number {
  let j = start;
  while (j < src.length) {
    j = src.indexOf(marker, j);
    if (j < 0) return -1;
    if (marker === "*" && (src[j + 1] === "*" || src[j - 1] === "*")) {
      j += 1; // part of a ** run; not a single-* closer
      continue;
    }
    const before = src[j - 1];
    if (before && !/\s/.test(before)) return j;
    j += marker.length;
  }
  return -1;
}

export function parseInline(src: string): Seg[] {
  const segs: Seg[] = [];
  let i = 0;
  let bold = false;
  let italic = false;
  let buf = "";
  const flush = () => {
    if (buf) segs.push({ text: buf, bold, italic });
    buf = "";
  };
  while (i < src.length) {
    if (src.startsWith("**", i)) {
      if (bold) {
        if (!/\s/.test(src[i - 1] ?? "")) {
          flush();
          bold = false;
          i += 2;
          continue;
        }
      } else {
        const next = src[i + 2];
        if (next && !/\s/.test(next) && findCloser(src, i + 2, "**") >= 0) {
          flush();
          bold = true;
          i += 2;
          continue;
        }
      }
      buf += "**";
      i += 2;
      continue;
    }
    const c = src[i];
    if (c === "*" || c === "_") {
      if (italic) {
        if (!/\s/.test(src[i - 1] ?? "")) {
          flush();
          italic = false;
          i += 1;
          continue;
        }
      } else {
        const next = src[i + 1];
        const leftOk = c === "*" ? true : !/[A-Za-z0-9]/.test(src[i - 1] ?? "");
        if (next && !/\s/.test(next) && leftOk && findCloser(src, i + 1, c) >= 0) {
          flush();
          italic = true;
          i += 1;
          continue;
        }
      }
      buf += c;
      i += 1;
      continue;
    }
    buf += c;
    i += 1;
  }
  flush();
  return segs.length ? segs : [{ text: src, bold: false, italic: false }];
}

// Insert an rPr fragment (e.g. "<w:b/><w:bCs/>") at the schema-correct position:
// immediately after <w:rFonts.../> if present, else after <w:rStyle.../>, else
// at the start of the rPr inner XML.
export function insertRpr(rprInner: string, frag: string): string {
  if (!frag) return rprInner;
  const f = rprInner.match(/<w:rFonts\b[^>]*\/>/);
  if (f) {
    const idx = (f.index ?? 0) + f[0].length;
    return rprInner.slice(0, idx) + frag + rprInner.slice(idx);
  }
  const s = rprInner.match(/<w:rStyle\b[^>]*\/>/);
  if (s) {
    const idx = (s.index ?? 0) + s[0].length;
    return rprInner.slice(0, idx) + frag + rprInner.slice(idx);
  }
  return frag + rprInner;
}

// Merge a segment's bold/italic into a base rPr at the schema-correct position,
// without duplicating toggles already present on the base.
export function applyToggles(baseRpr: string, seg: Seg): string {
  let frag = "";
  if (seg.bold && !/<w:b\b/.test(baseRpr)) frag += "<w:b/><w:bCs/>";
  if (seg.italic && !/<w:i\b/.test(baseRpr)) frag += "<w:i/><w:iCs/>";
  return insertRpr(baseRpr, frag);
}
