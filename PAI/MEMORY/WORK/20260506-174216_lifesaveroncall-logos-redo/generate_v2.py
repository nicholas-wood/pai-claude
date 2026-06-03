#!/usr/bin/env python3
"""Generate 5 LifesaverOnCall concepts x 3 variants each via Nano Banana.

Stricter prompts, explicit anti-patterns, reference image attached as inline_data
on every request. Concepts: 01, 02, 03, 05, 07 (4 and 6 dropped).
"""
import base64
import json
import os
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ENV_PATH = Path.home() / ".claude" / ".env"
api_key = None
for line in ENV_PATH.read_text().splitlines():
    if line.startswith("GOOGLE_API_KEY="):
        api_key = line.split("=", 1)[1].split()[0].strip()
        break
if not api_key:
    sys.exit("GOOGLE_API_KEY not found in ~/.claude/.env")

REF_PATH = Path("/Users/nicholaswood/Documents/workspace/lifesaveroncall/brand/logos/rescue-tube-reference.png")
OUT_DIR = REF_PATH.parent
ref_b64 = base64.b64encode(REF_PATH.read_bytes()).decode("ascii")

MODEL = "gemini-2.5-flash-image"
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={api_key}"

# Verbatim tube spec from the user's brief
TUBE_SPEC = (
    "TUBE SPEC (the attached reference image shows this exact object):\n"
    "The rescue tube is a long slim flat foam baton. Imagine a Toblerone bar "
    "stretched to be 8 times longer than it is wide. Hexagonal cross-section "
    "(NOT round, NOT cylindrical, NOT a torpedo). Both ends taper to a flat "
    "angled point - the hex faces converge to an edge. The body is bright "
    "yellow. At each end is a SHORT red fabric strap loop integrated into "
    "the foam (thumb-sized, NOT a long rope, NOT a tail). One end has a small "
    "silver carabiner clip on the strap loop.\n\n"
    "CRITICAL anti-patterns (do NOT draw):\n"
    "- A round inflated buoy or torpedo\n"
    "- A ring buoy / life ring (the 'O' doughnut shape with rope)\n"
    "- A surfboard, body board, or paddle board\n"
    "- A rescue stretcher, sled, or backboard with handles\n"
    "- A foam sausage or pool noodle\n"
    "- A long trailing rope or tail\n"
    "- Internal cutouts, holes, or handles in the body\n"
    "- Orange colour (it is YELLOW, not orange)\n"
    "- Soft rounded ends (the ends are flat angled hex points)"
)

BRAND = (
    "BRAND: LifesaverOnCall - serious life-safety dispatch service for SLSA volunteer "
    "lifesavers. Tone like NSW SES, Ambulance Victoria, Coast Guard - professional, "
    "hi-vis, emergency-services serious. Palette: SLSA red (#dc2626), SLSA yellow "
    "(#fbbf24), charcoal, on cream/warm-white. AVOID: SLSA crest, surfboards, beach "
    "umbrellas, sun motifs, swimmers, tourist beach imagery."
)

OUTPUT_REQS = (
    "OUTPUT: square 1:1 aspect ratio, app-icon scale. Solid cream/warm-white background "
    "(NOT transparent). NO text, NO wordmark, NO letters anywhere. Pure mark only. "
    "Vector-style flat illustration with clean geometry."
)


def make_prompt(concept_body: str) -> str:
    return f"{TUBE_SPEC}\n\n{BRAND}\n\n{OUTPUT_REQS}\n\nCONCEPT:\n{concept_body}"


CONCEPTS = [
    {
        "id": "01-silhouette",
        "prompt": make_prompt(
            "Bold flat silhouette of a lifesaver mid-stride, profile/side view, carrying "
            "the long slim yellow rescue tube horizontally tucked under one arm. The tube "
            "extends WELL PAST the figure on BOTH sides - clearly sticking out in front "
            "AND behind - because it is long and slim (8:1 ratio). Olympic-pictogram style: "
            "the lifesaver is a solid red silhouette, no facial features, conveying urgency "
            "and motion. The tube must show its hex cross-section faceting and tapered flat "
            "angled points at both ends, with short red fabric strap loops visible at each "
            "tip. Cream background. One single clean composition, no extras, no ground line, "
            "no shadows."
        ),
    },
    {
        "id": "02-bell",
        "prompt": make_prompt(
            "The long slim yellow rescue tube has been bent into a U-shape (or partial coil). "
            "At each cut/bent end, the HEXAGONAL CROSS-SECTION is clearly visible - you can "
            "see the flat hex faces where the tube was cut. The bent ends are NOT smooth "
            "rounded caps - they are flat hex prism faces. Short red fabric strap loops are "
            "still visible at each end of the tube, attached at the cut faces. The U-bend "
            "shape evokes a notification/alert ring. Geometric flat illustration. Cream "
            "background. The body of the U retains visible hex faceting along its length - "
            "this is a faceted prism bent into a U, NOT a smooth round noodle bent into a U."
        ),
    },
    {
        "id": "03-radar",
        "prompt": make_prompt(
            "Top-down overhead view. The long slim yellow rescue tube lies horizontally "
            "across the centre of the square. From this top-down angle the tube clearly "
            "shows: hexagonal-prism faceting along its length (visible top hex faces), "
            "tapered flat angled points at both ends (the hex faces converge to an edge), "
            "and small red fabric strap loops at each tapered end. Three concentric arcs in "
            "charcoal/dark grey radiate outward from the tube like a radar broadcast or "
            "pager pulse. Clean editorial flat illustration. Cream background. The tube is "
            "SLIM (8:1 length-to-width), not a fat torpedo."
        ),
    },
    {
        "id": "05-badge",
        "prompt": make_prompt(
            "A modern circular badge emblem. Outer frame is a clean charcoal circle. Inside "
            "the frame, the long slim yellow rescue tube has been curved into a NEAR-CIRCLE "
            "around a central red dot (the responder/incident point). The tube's tapered "
            "flat hex-point ends meet (or nearly meet) at the BOTTOM of the circle, with "
            "their short red fabric strap loops visible at the meeting point. Critically, "
            "the tube must RETAIN visible hex faceting along its curved length and retain "
            "the tapered flat angled points at its ends - it is NOT a smooth horseshoe arc "
            "or a smooth round ring. Think of a faceted prism wrapped into a near-circle. "
            "Symmetrical, balanced. Cream background inside the badge."
        ),
    },
    {
        "id": "07-pin",
        "prompt": make_prompt(
            "The long slim yellow rescue tube is positioned diagonally across the square. "
            "At one end of the tube sits a charcoal map-pin / location-marker shape "
            "(classic teardrop with a circular hole/dot inside, the kind used on maps to "
            "mark a location). The pin appears anchored to the tube end as if marking 'this "
            "is where the responder is going' or 'incident pin'. The tube clearly shows hex "
            "faceting along its length, tapered flat angled points at both ends, and short "
            "red fabric strap loops at each end. Clean flat editorial illustration. Cream "
            "background. The tube remains LONG and SLIM (8:1 ratio)."
        ),
    },
]

VARIANT_HINTS = {
    "v1": "Composition variant A: centered, balanced, neutral angle.",
    "v2": "Composition variant B: slightly off-centre, dynamic angle, tighter crop.",
    "v3": "Composition variant C: alternative styling - try a different framing/angle while keeping all required tube features intact.",
}


def generate(concept_id: str, variant: str, prompt: str) -> dict:
    out_path = OUT_DIR / f"lifesaveroncall-{concept_id}_{variant}.png"
    full_prompt = f"{prompt}\n\n{VARIANT_HINTS[variant]}"
    body = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "image/png",
                            "data": ref_b64,
                        }
                    },
                    {"text": full_prompt},
                ],
            }
        ],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": "1:1"},
        },
    }
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as tf:
        json.dump(body, tf)
        body_path = tf.name
    try:
        proc = subprocess.run(
            [
                "curl", "-sS", "-X", "POST", ENDPOINT,
                "-H", "Content-Type: application/json",
                "--data-binary", f"@{body_path}",
                "--max-time", "240",
            ],
            capture_output=True, text=True, timeout=260,
        )
    except Exception as e:
        return {"id": concept_id, "variant": variant, "ok": False, "error": f"{type(e).__name__}: {e}"}
    finally:
        try:
            os.unlink(body_path)
        except Exception:
            pass

    if proc.returncode != 0:
        return {"id": concept_id, "variant": variant, "ok": False,
                "error": f"curl exit {proc.returncode}: {proc.stderr[:400]}"}
    try:
        data = json.loads(proc.stdout)
    except Exception as e:
        return {"id": concept_id, "variant": variant, "ok": False,
                "error": f"JSON decode: {e}; stdout[:300]={proc.stdout[:300]}"}
    if "error" in data:
        return {"id": concept_id, "variant": variant, "ok": False,
                "error": f"API error: {json.dumps(data['error'])[:500]}"}

    candidates = data.get("candidates", [])
    if not candidates:
        return {"id": concept_id, "variant": variant, "ok": False,
                "error": f"no candidates: {json.dumps(data)[:400]}"}
    parts = candidates[0].get("content", {}).get("parts", [])
    for p in parts:
        inline = p.get("inline_data") or p.get("inlineData")
        if inline and inline.get("data"):
            img_bytes = base64.b64decode(inline["data"])
            out_path.write_bytes(img_bytes)
            return {"id": concept_id, "variant": variant, "ok": True,
                    "path": str(out_path), "bytes": len(img_bytes)}
    return {"id": concept_id, "variant": variant, "ok": False,
            "error": f"no image in response: {json.dumps(data)[:400]}"}


def main():
    jobs = []
    for concept in CONCEPTS:
        for variant in ("v1", "v2", "v3"):
            jobs.append((concept["id"], variant, concept["prompt"]))
    with ThreadPoolExecutor(max_workers=8) as ex:
        futures = {ex.submit(generate, cid, v, p): (cid, v) for cid, v, p in jobs}
        for fut in as_completed(futures):
            print(json.dumps(fut.result()), flush=True)


if __name__ == "__main__":
    main()
