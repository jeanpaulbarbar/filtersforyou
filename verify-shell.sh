#!/usr/bin/env bash
# THE VERIFICATION LOOP — run this before you say a page is done.
# JP, 6 Sep 2026: "Reverify it. Make sure you have a little verification loop that
# actually checks your work."
#
#   ./verify-shell.sh              every page carrying the shell
#   ./verify-shell.sh <page>.html  one page
set -uo pipefail
cd "$(dirname "$0")"
NUC=/Users/xtc/Nucleus
PY="$NUC/Console/venv/bin/python3"
SHELL_PY="$NUC/.claude/skills/web-designer/scripts/site_shell.py"
fail=0

echo "── 1/3 · THE GATE PROVES ITSELF ──────────────────────────────"
python3 "$NUC/.claude/hooks/page-law.py" --selftest || fail=1

echo
echo "── 2/3 · THE SOURCE — stamped bytes match index.html ─────────"
"$PY" "$SHELL_PY" check "$@" || fail=1

echo
echo "── 3/3 · THE RENDER — a real Chrome, 4 widths, 3 states ──────"
if ! curl -sf -o /dev/null http://localhost:3000/; then
  echo "   starting the dev server…"; nohup node serve.mjs >/tmp/ffy-serve.log 2>&1 &
  for _ in $(seq 1 20); do curl -sf -o /dev/null http://localhost:3000/ && break; sleep 0.5; done
fi
node shell-probe.mjs "$@" || fail=1

echo
if [ $fail -eq 0 ]; then
  echo "✓ ALL THREE PASS — the shell is a direct copy and paste on every page checked."
else
  echo "✗ SOMETHING DRIFTED. Nothing ships until all three print ✓. See Website/PAGE-LAW.md."
fi
exit $fail
