#!/usr/bin/env python3
"""Prove a stripped page is the same page.

Four checks per file, all of which must pass:
  1. structure   the tag tree, every attribute and all visible text are identical
  2. scripts     every executable script block still parses (node --check)
  3. styles      brace balance and declaration count are unchanged
  4. clean       no author comment survives, and a second strip changes nothing

Usage: verify_no_notes.py <before_dir> <after_dir>
"""
import sys, re, json, subprocess, pathlib, tempfile
from html.parser import HTMLParser

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from strip_page_notes import strip_page, RAW, DATA_SCRIPT


class Skeleton(HTMLParser):
    """Tag tree + attributes + text, with comments and whitespace ignored."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.events = []
        self._raw = None

    def handle_starttag(self, tag, attrs):
        self.events.append(("s", tag, tuple(sorted((k, v or "") for k, v in attrs))))
        if tag in ("script", "style", "textarea", "pre"):
            self._raw = tag

    def handle_startendtag(self, tag, attrs):
        self.events.append(("s", tag, tuple(sorted((k, v or "") for k, v in attrs))))

    def handle_endtag(self, tag):
        self.events.append(("e", tag))
        if tag == self._raw:
            self._raw = None

    def handle_data(self, data):
        if self._raw:                      # script/style bodies checked separately
            return
        t = " ".join(data.split())
        if t:
            self.events.append(("t", t))

    def handle_comment(self, data):
        pass


def skeleton(src):
    p = Skeleton()
    p.feed(src)
    p.close()
    return p.events


def blocks(src, kind):
    out = []
    for m in RAW.finditer(src):
        if m.group(1).lower() != kind:
            continue
        if kind == "script" and DATA_SCRIPT.search(m.group(2)):
            continue
        out.append(m.group(3))
    return out


def css_shape(body):
    body = re.sub(r'/\*.*?\*/', '', body, flags=re.S)
    return (body.count("{"), body.count("}"), body.count(";"), body.count(":"))


MAX_MARKER = 60          # a marker is short; prose is not


def _surviving(src):
    """Every comment left in the page, found by reading, not by stripping."""
    out = []
    for m in RAW.finditer(src):
        tag = m.group(1).lower()
        if tag == "style" or (tag == "script" and not DATA_SCRIPT.search(m.group(2))):
            for c in re.findall(r"/\*.*?\*/", m.group(3), re.S):
                out.append(("block", " ".join(c[2:-2].split())))
    outside = RAW.sub("", src)
    for c in re.findall(r"<!--(.*?)-->", outside, re.S):
        out.append(("html", " ".join(c.split())))
    return out


def _allowlisted(kind, body):
    from strip_page_notes import KEEP_HTML, KEEP_BLOCK, _licence
    if kind == "block" and _licence(body):
        return True                                  # a third-party banner
    names = KEEP_HTML if kind == "html" else KEEP_BLOCK
    return body in names and len(body) <= MAX_MARKER


def check(before_p, after_p, node_ok):
    b = before_p.read_text(encoding="utf-8")
    a = after_p.read_text(encoding="utf-8")
    fails = []

    # 1 · structure
    sb, sa = skeleton(b), skeleton(a)
    if sb != sa:
        for i, (x, y) in enumerate(zip(sb, sa)):
            if x != y:
                fails.append(f"structure diverges at node {i}: {x!r} -> {y!r}")
                break
        else:
            fails.append(f"structure length {len(sb)} -> {len(sa)}")

    # 2 · scripts parse, and count is unchanged
    jb, ja = blocks(b, "script"), blocks(a, "script")
    if len(jb) != len(ja):
        fails.append(f"script blocks {len(jb)} -> {len(ja)}")
    elif node_ok:
        for i, body in enumerate(ja):
            if not body.strip():
                continue
            with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as fh:
                fh.write(body); tmp = fh.name
            r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True)
            pathlib.Path(tmp).unlink()
            if r.returncode:
                fails.append(f"script #{i} no longer parses: {r.stderr.strip().splitlines()[-1][:120]}")

    # 3 · styles
    cb, ca = blocks(b, "style"), blocks(a, "style")
    if len(cb) != len(ca):
        fails.append(f"style blocks {len(cb)} -> {len(ca)}")
    else:
        for i, (x, y) in enumerate(zip(cb, ca)):
            if css_shape(x) != css_shape(y):
                fails.append(f"style #{i} shape {css_shape(x)} -> {css_shape(y)}")

    # 4 · clean and stable
    again, removed, _ = strip_page(a)
    if removed:
        fails.append(f"{removed} author comments still present")
    if again != a:
        fails.append("not stable: a second strip changes the file")

    # 5 · every surviving comment is an allowlisted marker — checked WITHOUT the
    #     stripper. ⛔ Checks 1-4 all run the stripper, so anything it wrongly
    #     KEEPS is invisible to them: on 9 Sep 2026 six notes survived because
    #     they contained the word "licence", and every check above said clean.
    #     A verifier that shares the subject's blind spot is not a verifier.
    for kind, body in _surviving(a):
        if not _allowlisted(kind, body):
            fails.append(f"a comment survived that is not a marker: {body[:110]!r}")
    return fails


def main():
    before, after = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    node_ok = subprocess.run(["node", "--version"], capture_output=True).returncode == 0
    if not node_ok:
        print("node missing — script parse check skipped", file=sys.stderr)

    files = sorted(after.glob("*.html"))
    bad = 0
    for f in files:
        src = before / f.name
        if not src.exists():
            print(f"FAIL {f.name}: no 'before' copy"); bad += 1; continue
        fails = check(src, f, node_ok)
        if fails:
            bad += 1
            print(f"FAIL {f.name}")
            for x in fails:
                print(f"      {x}")
    print(f"\n{len(files) - bad} of {len(files)} pages verified identical" +
          (f" — {bad} FAILED" if bad else " — all clean"))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
