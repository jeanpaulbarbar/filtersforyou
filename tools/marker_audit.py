#!/usr/bin/env python3
"""Prove the strip did not remove a landmark a tool steers by.

Some comments are not notes: a build or cutover script finds its place in a page
by searching for them. Removing one does not break the page — it breaks the tool,
silently, the next time someone runs it. That is how `site_shell.py`, the humm
calculator stamper and the cutover scripts were all broken at once on 9 Sep 2026
and only found by looking.

This reads every script in the toolchain, pulls out the comment strings they
search for, and checks each one is still present on the pages that carried it.

    marker_audit.py [before_dir]      exits 1 if a tool lost its landmark
"""
import re, sys, pathlib, collections

NUC     = pathlib.Path("/Users/xtc/Nucleus")
WEBSITE = NUC / "Website"
# ⛔ EVERY TREE THAT HOLDS A TOOL. `.agents` and `.codex` were missing on
# 9 Sep 2026 and hid a stale second copy of site_shell.py still steering by a
# comment this strip had removed — the audit reported green while it was broken.
TOOLS   = [NUC / ".claude", NUC / ".agents", NUC / ".codex",
           NUC / "Engine", NUC / "Workspace" / "Projects", WEBSITE]

# A literal comment string a script searches for, inside quotes.
# ⛔ NOT just `["']<!--[A-Z]`. Anchors also open with an indent, a box-drawing
# rule, a ⛔, or a digit, and they are not always upper case — five shapes the
# first version of this regex missed while printing "every landmark in place".
LITERAL = re.compile(r"""["'](?:\s*)((?:<!--|/\*)[^"'\n]{2,90})["']""")


def landmarks():
    """Every comment string the toolchain looks for, and who looks for it."""
    found = collections.defaultdict(set)
    for root in TOOLS:
        for p in root.rglob("*"):
            if p.suffix not in (".py", ".mjs", ".js", ".sh"):
                continue
            if "node_modules" in str(p) or "_Archive" in str(p) or "/tools/" in str(p):
                continue
            try:
                src = p.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            # ⛔ Does this script actually READ A LIVE PAGE? Most build scripts
            # slice their own workbench sources, which carry their comments and
            # always will. Only a script that opens Website/ can be broken by
            # this strip, and only those may fail the audit.
            live = bool(re.search(r'Website[/"\']|WEB\s*/|SITE\s*/|INDEX\b|DST\b', src))
            for m in LITERAL.findall(src):
                s = m.strip()
                # only a real marker: uppercase, short, no prose
                body = s[4:] if s.startswith("<!--") else s[2:]
                body = body.strip().rstrip("->*/").strip()
                if 2 <= len(body) <= 90 and not body.endswith("."):
                    found[("html" if s.startswith("<!--") else "block", body)].add((p.name, live))
    return found


def main():
    before = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None
    pages = sorted(WEBSITE.glob("*.html"))
    now = {p: p.read_text(encoding="utf-8", errors="replace") for p in pages}

    bad, review = 0, []
    for (kind, mark), users in sorted(landmarks().items()):
        live_users = sorted(n for n, l in users if l)
        users = sorted(n for n, _ in users)
        needle = f"<!-- {mark}" if kind == "html" else f"/* {mark}"
        have = sum(1 for t in now.values() if needle in t)
        want = None
        if before:
            want = sum(1 for p in pages
                       if (before / p.name).exists()
                       and needle in (before / p.name).read_text(encoding="utf-8", errors="replace"))
        if want is not None and want and have < want:
            label = "LOST" if not have else "THIN"
            if live_users:
                bad += 1
                print(f"{label}  {needle!r}  was on {want} pages, now on {have} — READ BY {', '.join(live_users)}")
            else:
                review.append(f"      {needle!r}  ({want}->{have}) in {', '.join(users)} — reads its own source, not a live page")
        elif want == 0 and have == 0:
            print(f"n/a   {needle!r}  never on any page (before or after)")
        else:
            print(f"ok    {needle!r}  on {have} pages" + (f" (was {want})" if want is not None else ""))
    if review:
        print(f"\n{len(review)} anchors changed in scripts that do not read a live page (no action):")
        for r in review[:6]:
            print(r)
        if len(review) > 6:
            print(f"      … and {len(review) - 6} more")
    print(f"\n{'FAILED — ' + str(bad) + ' landmarks lost from a tool that reads a live page' if bad else 'every landmark a tool steers by is still in place'}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
