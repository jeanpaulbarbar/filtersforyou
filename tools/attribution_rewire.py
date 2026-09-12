#!/usr/bin/env python3
"""Point the seven hand-written form handlers at the shared attribution module.

attribution_sweep.py puts assets/js/ffy-attribution.js on every page. Seven pages also
carry their own copy of the same logic inside their form code — four variants of a
sessionStorage landing/referrer seed, one FormData builder, and on the RO-vs-whole-house
page a second definition of window.ffyStampClick that would overwrite the module's.

This replaces each with a call into the module:

    window.ffyStampForm(form)          writes every attribution field onto the form
    window.ffyLeadSuccess(form, meta)  the one conversion event, after an accepted send

Every replacement asserts its expected hit count, so a page that drifts fails loudly
instead of quietly losing its measurement.

    python3 tools/attribution_rewire.py --check
    python3 tools/attribution_rewire.py --write
"""
from __future__ import annotations
import argparse
import pathlib
import re
import sys

WEB = pathlib.Path(__file__).resolve().parent.parent

LABEL = re.compile(r"content_name: ?'([a-z_]+)_' \+ where")

FFYSESS_ONE = re.compile(
    r"\n[ \t]*function ffySess\(k, fallback\)\{ try \{ return sessionStorage"
    r"\.getItem\(k\) \|\| fallback; \} catch \(e\) \{ return fallback; \} \}")
FFYSESS_MULTI = re.compile(
    r"\n[ \t]*function ffySess\(k, fallback\)\{\n"
    r"[ \t]*try \{ return sessionStorage\.getItem\(k\) \|\| fallback; \}"
    r" catch \(e\) \{ return fallback; \}\n[ \t]*\}")
SEED = re.compile(
    r"\n[ \t]*try \{\n"
    r"[ \t]*if \(!sessionStorage\.getItem\('ffy_landing'\)\)\{\n"
    r"[ \t]*sessionStorage\.setItem\('ffy_landing', location\.pathname\);\n"
    r"[ \t]*sessionStorage\.setItem\('ffy_referrer', document\.referrer \|\| ''\);\n"
    r"[ \t]*\}\n[ \t]*\} catch \(e\) \{\}")
QSTAMP = re.compile(
    r"([ \t]*)hidden\(form, 'landing_page', ffySess\('ffy_landing', location\.pathname\)\);\n"
    r"[ \t]*hidden\(form, 'submitted_page', location\.pathname\);\n"
    r"[ \t]*hidden\(form, 'referrer', ffySess\('ffy_referrer', document\.referrer \|\| ''\)\);"
    r"(?:\n[ \t]*if \(window\.ffyStampClick\) window\.ffyStampClick\(form\);)?")
QSUBMIT = re.compile(
    r"([ \t]*)window\.ffyTrack && window\.ffyTrack\('form_submit', "
    r"\{form: where, system: system \|\| 'not chosen'\}\);")
FBQ = re.compile(
    r"\n[ \t]*if \(typeof fbq === 'function'\)\s*\{.*?catch \(err\) \{\}\n[ \t]*\}",
    re.S)


def sub(text: str, pattern, repl, want: int, what: str, out: list) -> str:
    new, n = pattern.subn(repl, text) if hasattr(pattern, "subn") else (
        text.replace(pattern, repl), text.count(pattern))
    if not hasattr(pattern, "subn"):
        new = text.replace(pattern, repl)
    if n != want:
        out.append(f"ERROR {what}: expected {want} hit(s), found {n}")
        return text
    out.append(f"{what} ({n}x)")
    return new


def lit(text: str, old: str, new: str, want: int, what: str, out: list) -> str:
    n = text.count(old)
    if n != want:
        out.append(f"ERROR {what}: expected {want} hit(s), found {n}")
        return text
    out.append(f"{what} ({n}x)")
    return text.replace(old, new)


def qform_page(text: str, out: list) -> str:
    m = LABEL.search(text)
    if not m:
        out.append("ERROR qform page: no Meta content_name to take the label from")
        return text
    label = m.group(1)
    one, multi = len(FFYSESS_ONE.findall(text)), len(FFYSESS_MULTI.findall(text))
    if one + multi != 1:
        out.append(f"ERROR ffySess helper: expected 1, found {one + multi}")
        return text
    text = FFYSESS_ONE.sub("", text) if one else FFYSESS_MULTI.sub("", text)
    out.append("removed the page's own ffySess helper (1x)")

    text = sub(text, SEED, "", 1, "removed the page's own landing/referrer seed", out)
    text = sub(text, QSTAMP,
               lambda m: f"{m.group(1)}if (window.ffyStampForm) window.ffyStampForm(form);",
               1, "form stamping -> window.ffyStampForm", out)
    text = sub(text, QSUBMIT,
               lambda m: (f"{m.group(1)}window.ffyLeadSuccess && window.ffyLeadSuccess(form, "
                          f"{{form: where, label: '{label}_' + where, "
                          f"system: system || 'not chosen'}});"),
               1, "conversion event -> window.ffyLeadSuccess", out)
    text = sub(text, FBQ, "", 1, "removed the page's own Meta Lead call", out)
    return text


def humm_page(text: str, out: list) -> str:
    text = lit(text,
               "  function sess(k, fallback){ try { return sessionStorage.getItem(k)"
               " || fallback; } catch (e) { return fallback; } }\n", "",
               1, "removed the page's own sess helper", out)
    text = lit(text,
               "    hid('landing_page', sess('ffy_landing', location.pathname));\n"
               "    hid('submitted_page', location.pathname);\n"
               "    hid('referrer', sess('ffy_referrer', document.referrer || ''));\n"
               "    if (window.ffyStampClick) window.ffyStampClick(form);",
               "    if (window.ffyStampForm) window.ffyStampForm(form);",
               1, "form stamping -> window.ffyStampForm", out)
    text = lit(text,
               "      window.ffyTrack && window.ffyTrack('form_submit', "
               "{form:'repayments', system: names().join(' + ')});",
               "      window.ffyLeadSuccess && window.ffyLeadSuccess(form, "
               "{form:'repayments', label:'humm_repayments', system: names().join(' + ')});",
               1, "conversion event -> window.ffyLeadSuccess", out)
    text = sub(text, FBQ, "", 1, "removed the page's own Meta Lead call", out)
    return text


def taps_page(text: str, out: list) -> str:
    text = lit(text,
               " try{body.set('landing_page',sessionStorage.getItem('ffy_landing')"
               "||location.pathname);body.set('referrer',sessionStorage.getItem('ffy_referrer')"
               "||document.referrer||'')}catch{body.set('landing_page',location.pathname)}\n"
               " try{if(window.ffyClickFields)Object.entries(window.ffyClickFields())"
               ".forEach(([k,v])=>body.set(k,v))}catch(e){}",
               " try{if(window.ffyAttrFields)Object.entries(window.ffyAttrFields())"
               ".forEach(([k,v])=>{if(v)body.set(k,v)})}catch(e){}",
               1, "FormData attribution -> window.ffyAttrFields", out)
    text = lit(text,
               "  trackQuote('form_submit',{form:'tap_studio',system:data.system||'not chosen'});",
               "  if(window.ffyLeadSuccess)window.ffyLeadSuccess(quoteForm,"
               "{form:'tap_studio',label:'taps_quote',system:data.system||'not chosen'});",
               1, "conversion event -> window.ffyLeadSuccess", out)
    return text


def compare_page(text: str, out: list) -> str:
    dup = re.search(
        r"<script>\s*\n?\s*\(function \(\) \{\s*\n\s*var STORE = 'ffy_click'.*?</script>\n",
        text, re.S)
    if dup:
        text = text.replace(dup.group(0), "", 1)
        out.append("removed the page's second copy of the click-id module (1x)")

    text = lit(text,
               "let attr={};try{attr=JSON.parse(sessionStorage.getItem('ffy_attr')||'{}');"
               "if(!attr.landing_page){attr={landing_page:location.pathname+location.search,"
               "referrer:document.referrer||''};sessionStorage.setItem('ffy_attr',"
               "JSON.stringify(attr));}}catch(e){}\n"
               "function stamp(form){for(const [name,value] of Object.entries("
               "{landing_page:attr.landing_page||location.pathname,"
               "submitted_page:location.pathname,referrer:attr.referrer||''})){"
               "let field=form.querySelector('[name=\"'+name+'\"]');if(!field){"
               "field=document.createElement('input');field.type='hidden';field.name=name;"
               "form.append(field);}field.value=value;}"
               "if(window.ffyStampClick)window.ffyStampClick(form);}\n",
               "function stamp(form){if(window.ffyStampForm)window.ffyStampForm(form);}\n",
               1, "page's own attribution store -> window.ffyStampForm", out)

    text = lit(text,
               "if(typeof fbq==='function')fbq('track','Lead',{content_name:select.value,"
               "content_category:'website_form',source_page:location.pathname},"
               "{eventID:'web-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)});",
               "if(window.ffyLeadSuccess)window.ffyLeadSuccess(form,{form:'comparison',"
               "label:'comparison_'+(root.closest('#drawer')?'drawer':'inline'),"
               "system:select.value});",
               1, "conversion event -> window.ffyLeadSuccess", out)
    return text


def contact_page(text: str, out: list) -> str:
    return lit(text,
               "      if(res.ok){\n"
               "        form.reset();\n"
               "        successMsg.style.display='flex';",
               "      if(res.ok){\n"
               "        if(window.ffyLeadSuccess)window.ffyLeadSuccess(form,"
               "{form:'contact',label:'contact_page',system:form.subject?form.subject.value:''});\n"
               "        form.reset();\n"
               "        successMsg.style.display='flex';",
               1, "success handler now fires the conversion event", out)


# (trigger, job). A file is rewired by every job whose trigger it still carries, so
# this runs over the live pages AND the workbench sources they are generated from.
JOBS = [
    ("function ffySess(k, fallback)", qform_page),
    ("hid('landing_page', sess('ffy_landing'", humm_page),
    ("body.set('landing_page',sessionStorage.getItem('ffy_landing')", taps_page),
    ("sessionStorage.getItem('ffy_attr')", compare_page),
    ("      if(res.ok){\n        form.reset();", contact_page),
]

TARGETS = [
    "index.html", "contact.html", "humm.html",
    "faucets-and-mixers-sydney.html",
    "reverse-osmosis-water-filter-sydney.html",
    "reverse-osmosis-vs-whole-house-water-filter-sydney.html",
    "watermark-certified-water-filter-sydney.html",
    "whole-house-water-filter-sydney.html",
]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("paths", nargs="*")
    a = ap.parse_args()
    if not (a.write or a.check):
        ap.error("pass --check or --write")

    errors = changed = 0
    targets = ([pathlib.Path(x) for x in a.paths] if a.paths
               else [WEB / n for n in TARGETS])
    for p in targets:
        src = p.read_text(encoding="utf-8")
        new = src
        out: list[str] = []
        for trigger, job in JOBS:
            if trigger in new:
                new = job(new, out)
        bad = [o for o in out if o.startswith("ERROR")]
        errors += len(bad)
        if out:
            print(p.name)
            for o in out:
                print(f"    {o}")
        if new != src:
            changed += 1
            if a.write:
                p.write_text(new, encoding="utf-8")

    print(f"\n{'wrote' if a.write else 'would change'} {changed} page(s); {errors} error(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
