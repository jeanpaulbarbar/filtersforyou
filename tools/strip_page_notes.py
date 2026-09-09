#!/usr/bin/env python3
"""Strip every author comment from a shipped page.

A page we serve carries markup, styles and scripts. It does not carry notes.
Anything a human wrote to a human — reasoning, quotes, dates, references,
competitor names, file paths — is removed before the file goes live.

Only the short machine anchors in KEEP survive, because build tooling slices
on them. Nothing in KEEP reads as a note to a stranger.

Usage:
    strip_page_notes.py --check  [paths...]   report only, exit 1 if notes found
    strip_page_notes.py --write  [paths...]   rewrite the files in place
"""
import re, sys, argparse, pathlib

# ── the only comments allowed to survive ────────────────────────────────────
# Each entry is a prefix. A surviving comment is normalised to its bare marker,
# so no prose can hide behind one.
# ⛔ EVERY ENTRY HERE IS LOAD-BEARING. A build or cutover script slices the page
# on it. Removing one silently breaks a tool — `tools/marker_audit.py` is the test
# that proves each is still present on the pages that need it.
KEEP_HTML = [
    # the shell and the generated blocks
    "AWS:START", "AWS:END",
    "SHELL:CSS", "/SHELL:CSS", "SHELL:HEADER", "/SHELL:HEADER",
    "SHELL:FOOTER", "/SHELL:FOOTER", "SHELL:JS", "/SHELL:JS",
    "ESTATE:START", "ESTATE:END",
    "SC:CSS", "/SC:CSS",
    "HUMM:DATA", "/HUMM:DATA", "HUMM:CALC", "/HUMM:CALC",
    # measurement, carried page to page at cutover
    "FFY ATTRIBUTION", "FFY CLICK ID", "FFY META LEAD EVENT", "FFY TRACKING",
    "═══ GA4 + META PIXEL",
    "Google tag (gtag.js)", "Meta Pixel Code", "End Meta Pixel Code",
    # section anchors the page fixers slice on
    "TICKER", "HERO", "SERVICES", "WHY",
    "PHOTO BANNER", "PHOTO GALLERY", "DEEP CONTENT",
    "Company",
]
KEEP_BLOCK = ["ESTATE:CSS", "/ESTATE:CSS", "ESTATE:JS", "/ESTATE:JS", "FFY TRACKING"]

# script types whose body is data, never code — never touched
DATA_SCRIPT = re.compile(
    r'type\s*=\s*["\']?\s*(application/ld\+json|application/json|speculationrules|'
    r'importmap|text/template|text/x-template|text/html)', re.I)


def _keep_html(body: str):
    """Return the normalised marker if this comment is allowlisted, else None."""
    s = body.strip()
    for k in KEEP_HTML:
        # exact, or the marker followed by prose after a dash. ⛔ NOT `k + " "`:
        # that turned <!-- WHY CHOOSE --> into <!-- WHY -->, a different marker.
        if s == k or s.startswith(k + " —") or s.startswith(k + "—") or s.startswith(k + " -"):
            return f"<!-- {k} -->"
    return None


# A third-party licence banner is not our note and must never be removed.
# ⛔ THE WORD "LICENCE" IS NOT THE TEST. This is a plumbing business: "installed by
# a licensed plumber", "licence 461511C" and "the WaterMark licence" all appear in
# our OWN build notes. Matching the bare word kept six of them on the live site,
# JP quoted verbatim among them, and both checks still said clean (9 Sep 2026).
# A banner declares itself: `/*!`, or an explicit licence/copyright token.
_BANNER = ("@license", "@licence", "spdx-license-identifier", "©", "(c)",
           "copyright", "all rights reserved")

def _licence(body: str) -> bool:
    if body.startswith("!"):
        return True
    head = body[:400].lower()
    return any(w in head for w in _BANNER)


def _keep_block(body: str):
    if _licence(body):
        return "/*" + body + "*/"
    s = body.strip().lstrip("═=—- ").strip()
    for k in KEEP_BLOCK:
        if s.startswith(k):
            return f"/* {k} */"
    return None


# ── CSS ─────────────────────────────────────────────────────────────────────
def strip_css(src: str, joins: list):
    out, i, n = [], 0, len(src)
    while i < n:
        c = src[i]
        if src.startswith("url(", i) and '"' not in src[i:i + 5] and "'" not in src[i:i + 5]:
            j = src.find(")", i)                          # unquoted url() is raw
            j = n if j < 0 else j + 1
            out.append(src[i:j]); i = j
        elif c in "\"'":                                  # string literal
            j = i + 1
            while j < n:
                if src[j] == "\\": j += 2; continue
                if src[j] == c: j += 1; break
                if src[j] == "\n": break                  # unterminated; bail out
                j += 1
            out.append(src[i:j]); i = j
        elif c == "/" and src.startswith("/*", i):
            j = src.find("*/", i + 2)
            if j < 0:
                # ⛔ Never swallow the tail of a stylesheet on an unterminated comment.
                # Emit it and stop: a human must look at it.
                joins.append("UNTERMINATED /* — left in place: " + src[i:i + 80])
                out.append(src[i:]); break
            j += 2
            body = src[i + 2:j - 2]
            kept = _keep_block(body)
            if kept:
                out.append(kept)
            else:
                before = out[-1][-1:] if out and out[-1] else ""
                after = src[j:j + 1]
                if before.strip() and after.strip():
                    joins.append(src[max(0, i - 40):j + 40])
                    out.append(" ")
            i = j
        else:
            out.append(c); i += 1
    return "".join(out)


# ── JavaScript ──────────────────────────────────────────────────────────────
_RE_PREV = re.compile(r'[\w$\)\]]$')   # if the last real token looks like a value,
                                       # a following '/' is division, not a regex

def strip_js(src: str, joins: list):
    out, i, n = [], 0, len(src)
    prev = ""                                             # last significant char emitted
    tmpl_stack = []                                       # depth tracking for `${ }`
    while i < n:
        c = src[i]
        if c in "\"'":
            j = i + 1
            while j < n:
                if src[j] == "\\": j += 2; continue
                if src[j] == c: j += 1; break
                if src[j] == "\n": break
                j += 1
            out.append(src[i:j]); prev = c; i = j
        elif c == "`":
            j = i + 1; depth = 0
            while j < n:
                if src[j] == "\\": j += 2; continue
                if src[j] == "$" and src[j + 1:j + 2] == "{": depth += 1; j += 2; continue
                if src[j] == "}" and depth: depth -= 1; j += 1; continue
                if src[j] == "`" and not depth: j += 1; break
                j += 1
            out.append(src[i:j]); prev = "`"; i = j
        elif c == "/" and src.startswith("//", i):
            j = src.find("\n", i)
            j = n if j < 0 else j
            i = j                                          # drop it, keep the newline
        elif c == "/" and src.startswith("/*", i):
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            kept = _keep_block(src[i + 2:j - 2])
            if kept:
                out.append(kept); prev = "/"
            else:
                after = src[j:j + 1]
                if prev and after.strip():
                    joins.append(src[max(0, i - 40):j + 40])
                out.append(" ")
            i = j
        elif c == "/" and not _RE_PREV.search(prev):
            j = i + 1; klass = False                       # regex literal
            while j < n:
                if src[j] == "\\": j += 2; continue
                if src[j] == "[": klass = True
                elif src[j] == "]": klass = False
                elif src[j] == "/" and not klass: j += 1; break
                elif src[j] == "\n": break
                j += 1
            while j < n and src[j].isalpha(): j += 1        # flags
            out.append(src[i:j]); prev = "/"; i = j
        else:
            out.append(c)
            if not c.isspace(): prev = c
            i += 1
    return "".join(out)


# ── the page ────────────────────────────────────────────────────────────────
RAW = re.compile(r'<(script|style|textarea|pre)\b([^>]*)>(.*?)</\1\s*>', re.S | re.I)

def strip_asset(src: str, kind: str):
    """A standalone .css or .js file we serve. Same rule as a page."""
    joins = []
    before = len(re.findall(r'/\*.*?\*/', src, re.S)) + len(re.findall(r'(?m)^\s*//', src))
    out = strip_css(src, joins) if kind == "css" else strip_js(src, joins)
    after = len(re.findall(r'/\*.*?\*/', out, re.S)) + len(re.findall(r'(?m)^\s*//', out))
    return out, max(0, before - after), joins


def strip_page(src: str):
    """Return (new_source, removed_count, join_warnings)."""
    joins, removed = [], 0
    pieces, last = [], 0

    for m in RAW.finditer(src):
        tag, attrs, body = m.group(1).lower(), m.group(2), m.group(3)
        head = src[last:m.start()]
        html_out, n = _strip_html_comments(head)
        removed += n
        pieces.append(html_out)

        if tag == "style":
            before = body
            body = strip_css(body, joins)
            removed += before.count("/*") - body.count("/*")
        elif tag == "script" and not DATA_SCRIPT.search(attrs):
            before = body
            body = strip_js(body, joins)
            removed += (before.count("/*") - body.count("/*")) + \
                       max(0, len(re.findall(r'(?m)^\s*//', before)) - len(re.findall(r'(?m)^\s*//', body)))
        pieces.append(f"<{m.group(1)}{attrs}>{body}</{m.group(1)}>")
        last = m.end()

    tail_out, n = _strip_html_comments(src[last:])
    removed += n
    pieces.append(tail_out)
    return "".join(pieces), removed, joins


def _strip_html_comments(chunk: str):
    out, i, n, removed = [], 0, len(chunk), 0
    while i < n:
        k = chunk.find("<!--", i)
        if k < 0:
            out.append(chunk[i:]); break
        out.append(chunk[i:k])
        j = chunk.find("-->", k + 4)
        if j < 0:
            out.append(chunk[k:]); break
        j += 3
        kept = _keep_html(chunk[k + 4:j - 3])
        if kept:
            out.append(kept)
        else:
            removed += 1
            # swallow a lone newline the comment leaves behind
            if out and out[-1].endswith("\n") and chunk[j:j + 1] == "\n":
                j += 1
        i = j
    return "".join(out), removed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()

    root = pathlib.Path(__file__).resolve().parent.parent
    files = [pathlib.Path(p) for p in a.paths] or sorted(root.glob("*.html"))
    files = [f for f in files if f.is_file()]

    dirty, total, warn = [], 0, []
    for f in files:
        src = f.read_text(encoding="utf-8")
        if f.suffix.lower() in (".css", ".js", ".mjs"):
            new, removed, joins = strip_asset(src, "css" if f.suffix.lower() == ".css" else "js")
        else:
            new, removed, joins = strip_page(src)
        if removed:
            dirty.append((f, removed)); total += removed
        warn += [(f, w) for w in joins]
        if a.write and new != src:
            f.write_text(new, encoding="utf-8")

    for f, w in warn:
        print(f"JOIN WARNING {f.name}: {w[:120]!r}", file=sys.stderr)
    if a.check:
        for f, c in dirty:
            try:
                name = f.relative_to(root)
            except ValueError:
                name = f
            print(f"{name}: {c} comments")
        print(f"\n{len(dirty)} of {len(files)} pages carry notes ({total} comments)")
        return 1 if dirty else 0
    print(f"stripped {total} comments from {len(dirty)} of {len(files)} pages")
    return 0


if __name__ == "__main__":
    sys.exit(main())
