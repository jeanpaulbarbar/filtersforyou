#!/bin/bash
# Every attribution scenario, each in its own browser process.
# One shared Chrome runs out of protocol time part-way through ten heavy pages, and a
# shared browser profile would also let one scenario's stored visit become the next
# one's first visit — which would make every later result a lie.
cd "$(dirname "$0")/.." || exit 1
fail=0
for n in 1 2 3 4 5 6 7 8 9 10; do
  out=$(ONLY=$n node tools/attribution_test.mjs 2>&1)
  echo "$out" | grep -E '^[0-9]+ ·|^  (PASS|FAIL)'
  echo "$out" | grep -q 'ALL CHECKS PASSED' || { fail=1; echo "  scenario $n did not pass"; }
  echo
done
[ $fail -eq 0 ] && echo "ALL SCENARIOS PASSED" || echo "SOME SCENARIOS FAILED"
exit $fail
