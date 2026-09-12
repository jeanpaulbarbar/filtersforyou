#!/usr/bin/env python3
"""Put the ONE shared attribution module on every page that carries a lead form.

Until 12 September 2026 the same measurement logic existed three times per page as
three inline blocks (FFY ATTRIBUTION, FFY CLICK ID, FFY META LEAD EVENT), and in two
further bespoke variants on the themed pages. Five copies drift: the RO-vs-whole-house
page never got the landing/referrer capture at all, and the contact page could show a
success message without ever firing the conversion event.

This replaces all of that with a single <script src> loader. The logic now lives in
Website/assets/js/ffy-attribution.js and nowhere else.

    python3 tools/attribution_sweep.py --check
    python3 tools/attribution_sweep.py --write

Idempotent: running it twice changes nothing the second time.
"""
from __future__ import annotations
import argparse
import pathlib
import re
import sys

WEB = pathlib.Path(__file__).resolve().parent.parent
ASSET = "assets/js/ffy-attribution.js"
VERSION = "1"
MARKER = "<!-- FFY ATTRIBUTION -->"
LOADER = f'{MARKER}\n<script src="{ASSET}?v={VERSION}"></script>'

# Each inline block is the marker comment followed immediately by its own <script>.
# The script AFTER the marker only — on the themed pages the cutover scripts insert an
# unrelated <script> immediately BEFORE the FFY ATTRIBUTION marker.
BLOCK = r'<!--\s*{name}\s*-->\s*<script\b(?![^>]*\bsrc=)[^>]*>.*?</script>'

DROP = ("FFY CLICK ID", "FFY META LEAD EVENT")


def pages() -> list[pathlib.Path]:
    return sorted(p for p in WEB.glob("*.html"))


def rewrite(text: str) -> tuple[str, list[str]]:
    did: list[str] = []

    for name in DROP:
        text, n = re.subn(BLOCK.format(name=re.escape(name)), "", text, flags=re.S)
        if n:
            did.append(f"removed {n} inline {name} block(s)")

    text, n = re.subn(BLOCK.format(name=re.escape("FFY ATTRIBUTION")), LOADER, text,
                      flags=re.S)
    if n:
        did.append(f"inline FFY ATTRIBUTION block -> shared module ({n}x)")

    if ASSET not in text:
        i = text.rfind("</body>")
        if i == -1:
            did.append("NO </body> — loader NOT inserted")
        else:
            text = text[:i] + LOADER + "\n" + text[i:]
            did.append("shared module inserted before </body>")

    # A page must load it exactly once.
    have = text.count(ASSET)
    if have != 1:
        did.append(f"ERROR loader appears {have}x")

    return text, did


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("paths", nargs="*")
    a = ap.parse_args()
    if not (a.write or a.check):
        ap.error("pass --check or --write")

    targets = [pathlib.Path(p) for p in a.paths] if a.paths else pages()
    changed = errors = 0
    for p in targets:
        src = p.read_text(encoding="utf-8")
        if "formspree" not in src and p.name != "_shell-template.html":
            continue
        out, did = rewrite(src)
        bad = [d for d in did if d.startswith(("ERROR", "NO "))]
        errors += len(bad)
        if out != src:
            changed += 1
            if a.write:
                p.write_text(out, encoding="utf-8")
        if did and (bad or out != src):
            print(f"{p.name}")
            for d in did:
                print(f"    {d}")

    print(f"\n{'wrote' if a.write else 'would change'} {changed} page(s); {errors} error(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
