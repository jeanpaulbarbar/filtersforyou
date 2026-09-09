# PAGE LAW — the non-negotiables of every page on filtersforyou.com.au

<!-- PAGE-LAW/9F3C-SHELL-SEAL -->

> **JP, 6 September 2026.** *"The header area, the whole border around it, and the way that the
> homepage hero looks need to be a spitting image on every single page we make from here on.
> It needs to be a hard rule. It's a direct copy and paste, not a recreation, a direct copy and
> paste. Same thing when we go to the footer. There shouldn't be any movement or any
> inconsistency at all. The header, the sticky header, those buttons, the footer, everything
> needs to be the exact same."*

**This is the forever home for Filters For You. Read this file before you create or change a
page — every time, whatever you were invoked by.** `/web-designer`, `/scroll-craft`, an agent, a
generator script, or nothing at all. The law does not care which door you came in.

---

## THE ONE RULE

**The homepage is the shell. Every other page wears it, byte for byte, pixel for pixel.**

`Website/index.html` is the single source. The header, the utility strip, the mobile sheet, the
footer, their CSS and their JS are **extracted from it and stamped**, never typed, never copied by
hand, never "matched".

---

## THE FIVE NON-NEGOTIABLES

### 1 · A new page is created by the script. Never by hand.
```
Console/venv/bin/python3 .claude/skills/web-designer/scripts/site_shell.py \
    new <slug> --title "…" --description "…"
```
It starts from `Website/_shell-template.html` and stamps the shell in. **Writing a `Website/*.html`
that has no `SHELL:` markers is refused by the gate.** There is no such thing as a page outside the
shell.

### 2 · Never edit inside a `SHELL:` marker pair.
```
<!-- SHELL:CSS -->    …  <!-- /SHELL:CSS -->      in <head>
<!-- SHELL:HEADER --> …  <!-- /SHELL:HEADER -->   first in <body>
<!-- SHELL:FOOTER --> …  <!-- /SHELL:FOOTER -->   after </main>
<!-- SHELL:JS -->     …  <!-- /SHELL:JS -->       before </body>
```
Those four blocks are generated. Anything you type in them is destroyed on the next stamp, and
until then the page is lying about being consistent.

### 3 · A page never declares a rule that targets a shell class.
Banned as the **leading** compound of any selector in a page's own `<style>`:

> `.hdr` · `.util` · `.rowu` · `.ustars` · `.ulinks` · `.soc` · `.msheet` · `.mrow` · `.mlinks` ·
> `.mmore` · `.mcontact` · `.msoc` · `.mcard` · `.foot` · `.ftop` · `.fbrand` · `.ftel` ·
> `.flinks` · `.fareas` · `.aws*` · `.burger` · `.bars` · `.mark` · `.mark-link` · `.ddpanel` ·
> `.legal` · `.btn` · `.btn-sm` · `.btn-line` · `.btn-ghost` · `.pgtop` · `.pgcard`

`.hdr.solid{background:var(--paper)}` on one page is how the whole house header ended up fading
over 0.3s while the homepage faded over 0.35s, against a different colour. **Styling your own
content that happens to contain a button is fine** — `.ocfoot .btn`, `.humm .btn` — because the
shell's buttons are never inside your blocks. It is the leading compound that is banned.

⚠️ The gate catches a selector that *leads* with a shell class. It cannot catch an element-led
rule that happens to reach the shell — `nav a{border-radius:8px}` would slip past it. That is
what the render probe is for, and it is why the probe is not optional.

**If a shell rule genuinely needs to change, change it in `index.html` and restamp.** That is the
only correct move. A fix that lives on one page is not a fix, it is a fork.

### 4 · A page never runs a second driver for the header.
The shell's own scroll listener decides `.solid`, `.mini` and `.hide`. Adding another listener
"after the shell's, so the shell's bytes stay untouched" passes `site_shell.py check` and still
moves the header. It is banned. `getElementById('hdr')` in a page script is a red flag.

### 5 · The same element, not just the same class.
A `<button class="btn">` and an `<a class="btn">` are **not** interchangeable: the UA gives a
button `line-height:normal` and `text-align:center`, an anchor inherits the body's. **MEASURED
6 Sep: that put the "Book now" glyphs 0.28px apart between the homepage and the whole house page**,
which lands on a different device pixel and reads as a shimmer when you flick between them. That
is the exact thing JP could see. `.btn` now declares both properties itself, and `site_shell.py`
no longer swaps the element — the only transform it is allowed to make to shell markup is the
`href="#x"` → `href="/#x"` prefix.

---

## THE OPENER — every page opens like the homepage

The first thing in `<main>` is:
```html
<div class="pgtop"><section class="pgcard …"> … </section></div>
```
The shell's CSS and JS key off `.pgtop`. Without it the page gets the old solid header and a 72px
shim — no framed card, no transparent header, no growing-open entrance, and it will not match.

---

## VERIFY — both gates, every time, before you say a page is done

```bash
# ── ONE COMMAND, all three gates ──
cd ~/Nucleus/Website && ./verify-shell.sh          # or ./verify-shell.sh <page>.html
```

It runs, in order:

```bash
# 0 · the gate proves itself (and proves no denial text can unlock it)
python3 .claude/hooks/page-law.py --selftest

# 1 · the SOURCE matches — the stamped bytes are index.html's
Console/venv/bin/python3 .claude/skills/web-designer/scripts/site_shell.py check

# 2 · the RENDER matches — a real Chrome, every node in the chrome, 4 widths, 3 states
cd Website && node serve.mjs &          # if it is not already up
node shell-probe.mjs                    # all shelled pages
node shell-probe.mjs <page>.html        # one page
```

**Check 1 passing is not enough and never was.** It compares bytes inside the markers. The whole
house page passed it on 6 Sep while its header sat 16px taller on a phone, kept a utility strip the
homepage hides, faded on different timings, and moved the Book now lettering — all from rules and
scripts *outside* the markers. `shell-probe.mjs` measures what a person actually sees: position
relative to the shell root, width, height, font, spacing, colour and transform of **every node** in
the utility strip, header, mobile sheet and footer, on the homepage and on your page, at 1440 /
1280 / 900 / 390, at rest, scrolled, and with the menu open. Anything over **0.5px** or any changed
computed value is named and the run fails.

**All three must print ✓. A page that has not passed them has not shipped** — and the Stop hook
in `page-law.py` will say so if a page was changed and never re-probed.

---

## WHEN THE SHELL ITSELF CHANGES

1. Edit `Website/index.html` — the source, and the only place a shell rule may be written.
2. `site_shell.py apply <every shelled page>` — or `apply` with no page list is not a thing, name them.
3. `site_shell.py check` → ✓
4. `node shell-probe.mjs` → ✓
5. Commit. The diff is how JP verifies it.

## THE WHOLE HOUSE PAGE IS GENERATED
⛔ Never hand-edit `Website/whole-house-water-filter-sydney.html`. Edit
`Workspace/Projects/website-redesign-2026-08/mockup/pure-home-v7.html`, then re-run
`cutover-v7.py`, which restamps the shell and asserts `check` passes.

## THE WATERMARK PAGE IS GENERATED TOO
⛔ Never hand-edit `Website/watermark-certified-water-filter-sydney.html`. Edit the parts in
`Workspace/Projects/website-redesign-2026-08/wm/`, then `build-wm.py` → `cutover-wm.py` (8 Sep 2026).
The RO page is the same: `ro/` → `build-ro.py` → `cutover-ro.py`.

## SHARED NAVIGATION — 9 September 2026
The navigation source is still `index.html`. Systems shows the three RO studio photographs
together, followed by whole house and taps, without category tabs. Taps & mixers links directly
to `faucets-and-mixers-sydney` in the desktop bar and mobile menu. The opened header, review
strip and dropdown share one paper surface. Mobile uses the same destinations and photographs;
short screens scroll inside the menu so no destination is clipped. Preserve keyboard focus,
Escape, delayed pointer exit, reduced motion and scroll restoration when revising it.

The six themed pages are `index.html`, `humm.html`, `whole-house-water-filter-sydney.html`,
`reverse-osmosis-water-filter-sydney.html`, `watermark-certified-water-filter-sydney.html` and
`faucets-and-mixers-sydney.html`. Restamp all five inner pages whenever the source navigation
changes. `site_shell.py new` stamps the current source into future pages automatically.

## LEGACY PAGES ARE A SEPARATE MIGRATION
Pages still using the legacy `.nav-links` header have not been migrated by this navigation
redesign. Bringing those pages onto the theme remains a separate job.
