(function () {
  'use strict';

  /* System data: name, base filter interval (months), annual cost */
  var SYSTEMS = [
    { id: 'essential',  label: 'Pure Essential',               filterMonths: 12, annualCost: 80  },
    { id: 'plus',       label: 'Pure Plus+ (5-stage RO)',       filterMonths: 12, annualCost: 120 },
    { id: 'compact',    label: 'Pure Compact (3-stage RO)',     filterMonths: 12, annualCost: 100 },
    { id: 'premium',    label: 'Pure Premium (7-stage RO)',     filterMonths: 12, annualCost: 150 },
    { id: 'advanced',   label: 'Pure Advanced',                 filterMonths: 12, annualCost: 130 },
    { id: 'luxe',       label: 'Pure Luxe (smart monitoring)',  filterMonths: 12, annualCost: 150 },
    { id: 'hpf3',       label: 'HPF-3 Whole House',            filterMonths: 12, annualCost: 200 }
  ];

  /* Household size multipliers */
  var HOUSEHOLD = [
    { id: 'small',  label: '1\u20132 people', multiplier: 1.0  },
    { id: 'medium', label: '3\u20134 people', multiplier: 0.8  },
    { id: 'large',  label: '5+ people',       multiplier: 0.65 }
  ];

  /* Reference date: 2026-05-01 */
  var TODAY = new Date(2026, 4, 1); // month is 0-indexed

  var MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  function addMonths(date, n) {
    var d = new Date(date);
    d.setMonth(d.getMonth() + n);
    return d;
  }

  function formatDate(date) {
    return MONTH_NAMES[date.getMonth()] + ' ' + date.getFullYear();
  }

  function init() {
    var el = document.getElementById('filter-calculator');
    if (!el) return;

    /* Build select options */
    var optionsHtml = SYSTEMS.map(function (s) {
      return '<option value="' + s.id + '">' + s.label + '</option>';
    }).join('');

    /* Build household toggle buttons */
    var hhButtons = HOUSEHOLD.map(function (h, i) {
      var active = i === 0;
      return '<button id="fc-hh-' + h.id + '" data-hh="' + h.id + '" style="padding:9px 18px;border-radius:6px;border:2px solid #0B61F4;' +
        (active ? 'background:#0B61F4;color:#fff;' : 'background:#fff;color:#0B61F4;') +
        'font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">' + h.label + '</button>';
    }).join('');

    el.innerHTML = [
      '<div style="max-width:560px;border-radius:12px;box-shadow:0 2px 20px rgba(11,97,244,.08);overflow:hidden;font-family:Sora,sans-serif;background:#fff">',

        /* Header */
        '<div style="background:#0B61F4;padding:20px 24px">',
          '<h3 style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.015em">Filter Service Calculator</h3>',
          '<p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.75);font-weight:400">Know when your next filter change is due</p>',
        '</div>',

        /* Body */
        '<div style="padding:24px">',

          /* System select */
          '<div style="margin-bottom:20px">',
            '<label for="fc-system" style="display:block;font-size:13px;font-weight:600;color:#324158;margin-bottom:8px">Your system</label>',
            '<select id="fc-system" style="width:100%;padding:10px 12px;border:2px solid #e0e7f0;border-radius:8px;font-size:14px;color:#324158;font-family:inherit;background:#fff;cursor:pointer;outline:none">',
              optionsHtml,
            '</select>',
          '</div>',

          /* Household size */
          '<div style="margin-bottom:24px">',
            '<label style="display:block;font-size:13px;font-weight:600;color:#324158;margin-bottom:8px">Household size</label>',
            '<div style="display:flex;gap:8px;flex-wrap:wrap">',
              hhButtons,
            '</div>',
          '</div>',

          /* Output box */
          '<div id="fc-output" style="background:#eef2f9;border-radius:10px;padding:20px 22px">',
            '<div id="fc-next" style="font-size:16px;font-weight:700;color:#0B61F4;margin-bottom:10px"></div>',
            '<div id="fc-cost" style="font-size:15px;font-weight:600;color:#324158"></div>',
          '</div>',

          /* CTA */
          '<div style="margin-top:20px">',
            '<a href="tel:0430546749" style="display:inline-flex;align-items:center;gap:8px;background:#FFD900;color:#324158;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;font-family:inherit">',
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>',
              'Book a Service Reminder',
            '</a>',
          '</div>',

        '</div>',
      '</div>'
    ].join('');

    var systemSelect = document.getElementById('fc-system');
    var hhBtns       = document.querySelectorAll('[data-hh]');
    var nextEl       = document.getElementById('fc-next');
    var costEl       = document.getElementById('fc-cost');

    var selectedHH = 'small';

    hhBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedHH = btn.getAttribute('data-hh');
        hhBtns.forEach(function (b) {
          b.style.background = '#fff';
          b.style.color = '#0B61F4';
        });
        btn.style.background = '#0B61F4';
        btn.style.color = '#fff';
        calculate();
      });
    });

    systemSelect.addEventListener('change', calculate);

    function calculate() {
      var sysId  = systemSelect.value;
      var system = SYSTEMS.filter(function (s) { return s.id === sysId; })[0];
      if (!system) return;

      var hh         = HOUSEHOLD.filter(function (h) { return h.id === selectedHH; })[0];
      var multiplier = hh ? hh.multiplier : 1;

      var adjustedMonths = Math.round(system.filterMonths * multiplier);
      if (adjustedMonths < 1) adjustedMonths = 1;

      var nextDate = addMonths(TODAY, adjustedMonths);
      nextEl.textContent = 'Next filter change: ' + formatDate(nextDate);
      costEl.textContent = 'Annual maintenance cost: ~$' + system.annualCost;
    }

    calculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
