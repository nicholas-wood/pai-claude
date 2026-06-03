#!/usr/bin/env python3
"""Generate six LifesaverOnCall logo concepts via Nano Banana (gemini-2.5-flash-image)."""
import base64
import json
import os
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# Load API key from ~/.claude/.env
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

TUBE_DESC = (
    "The rescue tube in the attached reference photo is the EXACT object to depict. "
    "It is a LONG SLIM YELLOW hexagonal-cross-section foam baton with TAPERED POINTED ENDS "
    "(the hex cross-section squashes flat to an angled point at each tip). "
    "Length-to-width ratio is roughly 8:1 — it is LONG and SLIM, NOT short and fat. "
    "There are SHORT RED FABRIC STRAP LOOPS at each end (one with a small metal clip). "
    "The body is SLSA YELLOW (#fbbf24 area) — NOT ORANGE. "
    "It is NOT a ring buoy, NOT a torpedo, NOT a foam sausage, NOT a life ring. "
    "It is a slim flat baton. Match the reference photo shape exactly."
)

BRAND = (
    "Brand context: LifesaverOnCall, a serious life-safety dispatch service for SLSA volunteer "
    "lifesavers. Tone sits next to NSW SES, Ambulance Victoria, Coast Guard branding — "
    "professional, hi-vis, emergency-services serious. Palette: SLSA red (#dc2626) and SLSA yellow "
    "(#fbbf24) on cream/warm-white. Avoid: SLSA crest, surfboards, beach umbrellas, sun motifs, "
    "swimmers, tourist beach imagery."
)

OUTPUT_REQS = (
    "Output: square 1:1 aspect ratio, suitable for app icon. Solid cream/warm-white background "
    "(NOT transparent). NO text, NO wordmark, NO letters anywhere in the image — pure mark only. "
    "Vector-style flat illustration with clean geometry."
)

CONCEPTS = [
    {
        "id": "01-silhouette",
        "prompt": (
            f"{TUBE_DESC}\n\n{BRAND}\n\n{OUTPUT_REQS}\n\n"
            "Concept: Bold flat silhouette of a lifesaver mid-stride in profile/side view, "
            "carrying the long slim yellow rescue tube horizontally tucked under one arm. "
            "Because the tube is long, it extends well past the figure on BOTH sides — the tube "
            "sticks out clearly in front and clearly behind. The lifesaver figure is a solid red "
            "silhouette in the style of an Olympic pictogram, conveying motion and urgency. "
            "Tube is yellow with red strap loops visible at each end. Cream background. "
            "Single clean composition, no extras."
        ),
    },
    {
        "id": "02-bell",
        "prompt": (
            f"{TUBE_DESC}\n\n{BRAND}\n\n{OUTPUT_REQS}\n\n"
            "Concept: The long slim yellow rescue tube has been bent into the silhouette of a "
            "notification bell or alert ring — a smooth U-curve or curl shape. The yellow tube "
            "forms the bell body, and one of the red fabric strap-end loops dangles down like a "
            "bell clapper. Plays on the dual meaning of 'on call' — alert/notification and rescue. "
            "Geometric illustrative style. Cream background."
        ),
    },
    {
        "id": "03-radar",
        "prompt": (
            f"{TUBE_DESC}\n\n{BRAND}\n\n{OUTPUT_REQS}\n\n"
            "Concept: Top-down overhead view. The long slim yellow rescue tube lies horizontally "
            "across the centre of the square. Its hexagonal prism shape, tapered pointed ends, and "
            "small red strap loops at each end are clearly visible from above. Three concentric "
            "arcs in charcoal/dark grey radiate outward from the tube like a radar broadcast or "
            "pager signal pulse. Cream background. Clean editorial flat illustration."
        ),
    },
    {
        "id": "04-handset",
        "prompt": (
            f"{TUBE_DESC}\n\n{BRAND}\n\n{OUTPUT_REQS}\n\n"
            "Concept: The long slim yellow rescue tube has been bent into the silhouette of a "
            "classic curved telephone handset receiver — the natural arc shape of an old phone "
            "receiver. The tube IS the handset. A single small red accent (one of the strap loops "
            "or the metal clip) provides a red colour pop. Clever visual pun: simultaneously reads "
            "as a rescue tube AND a phone handset. Geometric flat illustration on cream background."
        ),
    },
    {
        "id": "05-badge",
        "prompt": (
            f"{TUBE_DESC}\n\n{BRAND}\n\n{OUTPUT_REQS}\n\n"
            "Concept: A heraldic-but-modern circular badge emblem. Outer frame is a clean charcoal "
            "circle. Inside the frame, the long slim yellow rescue tube has been curved into a "
            "near-complete ring around the inner space, tapered ends meeting or slightly "
            "overlapping. At the centre of the ring sits a single solid red dot representing the "
            "incident or responder. Cream background inside the badge. Symmetrical, balanced."
        ),
    },
    {
        "id": "06-monoline",
        "prompt": (
            f"{TUBE_DESC}\n\n{BRAND}\n\n{OUTPUT_REQS}\n\n"
            "Concept: An ultra-minimal monoline mark — a single continuous red stroke on cream "
            "background. The stroke simultaneously reads as (a) the outline of the long slim "
            "rescue tube with tapered pointed ends, AND (b) a heartbeat / ECG pulse line spike. "
            "The proportions of the tube outline are clearly long and slim — NOT chunky. "
            "Stripe-level minimalism, vector clean, no fills, just a single stroke."
        ),
    },
]

OUT_PATHS = {
    "01-silhouette": OUT_DIR / "lifesaveroncall-01-silhouette.png",
    "02-bell": OUT_DIR / "lifesaveroncall-02-bell.png",
    "03-radar": OUT_DIR / "lifesaveroncall-03-radar.png",
    "04-handset": OUT_DIR / "lifesaveroncall-04-handset.png",
    "05-badge": OUT_DIR / "lifesaveroncall-05-badge.png",
    "06-monoline": OUT_DIR / "lifesaveroncall-06-monoline.png",
}


def generate(concept: dict) -> dict:
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
                    {"text": concept["prompt"]},
                ],
            }
        ],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": "1:1"},
        },
    }
    # Write body to temp file to avoid command line size limits
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
        os.unlink(body_path)
        return {"id": concept["id"], "ok": False, "error": f"{type(e).__name__}: {e}"}
    finally:
        try:
            os.unlink(body_path)
        except Exception:
            pass

    if proc.returncode != 0:
        return {"id": concept["id"], "ok": False, "error": f"curl exit {proc.returncode}: {proc.stderr[:500]}"}
    try:
        data = json.loads(proc.stdout)
    except Exception as e:
        return {"id": concept["id"], "ok": False, "error": f"JSON decode: {e}; stdout[:500]={proc.stdout[:500]}"}
    if "error" in data:
        return {"id": concept["id"], "ok": False, "error": f"API error: {json.dumps(data['error'])[:600]}"}

    candidates = data.get("candidates", [])
    if not candidates:
        return {"id": concept["id"], "ok": False, "error": f"no candidates: {json.dumps(data)[:600]}"}
    parts = candidates[0].get("content", {}).get("parts", [])
    for p in parts:
        inline = p.get("inline_data") or p.get("inlineData")
        if inline and inline.get("data"):
            img_bytes = base64.b64decode(inline["data"])
            out = OUT_PATHS[concept["id"]]
            out.write_bytes(img_bytes)
            return {"id": concept["id"], "ok": True, "path": str(out), "bytes": len(img_bytes)}
    return {"id": concept["id"], "ok": False, "error": f"no image in response: {json.dumps(data)[:600]}"}


def main():
    with ThreadPoolExecutor(max_workers=6) as ex:
        futures = {ex.submit(generate, c): c["id"] for c in CONCEPTS}
        for fut in as_completed(futures):
            print(json.dumps(fut.result()), flush=True)


if __name__ == "__main__":
    main()
