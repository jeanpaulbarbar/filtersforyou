(function () {
  'use strict';

  function init() {
    var el = document.getElementById('savings-calculator');
    if (!el) return;

    el.innerHTML = [
      '<div style="max-width:560px;border-radius:12px;box-shadow:0 2px 20px rgba(11,97,244,.08);overflow:hidden;font-family:Sora,sans-serif;background:#fff">',

        /* Header */
        '<div style="background:#0B61F4;padding:20px 24px">',
          '<h3 style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.015em">Water Savings Calculator</h3>',
          '<p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.75);font-weight:400">See how fast a water filter pays for itself</p>',
        '</div>',

        /* Body */
        '<div style="padding:24px">',

          /* Input: bottles per week */
          '<div style="margin-bottom:20px">',
            '<label style="display:block;font-size:13px;font-weight:600;color:#324158;margin-bottom:8px">',
              'Bottles of water per week — <span id="sc-bottles-val" style="color:#0B61F4">10</span>',
            '</label>',
            '<input id="sc-bottles" type="range" min="0" max="30" value="10" style="width:100%;accent-color:#0B61F4;cursor:pointer;height:4px">',
            '<div style="display:flex;justify-content:space-between;font-size:11px;color:#9aaabe;margin-top:4px">',
              '<span>0</span><span>15</span><span>30</span>',
            '</div>',
          '</div>',

          /* Input: bottle size */
          '<div style="margin-bottom:20px">',
            '<label style="display:block;font-size:13px;font-weight:600;color:#324158;margin-bottom:8px">Bottle size</label>',
            '<div style="display:flex;gap:8px;flex-wrap:wrap">',
              '<button id="sc-size-500" data-size="0.5" style="padding:8px 18px;border-radius:6px;border:2px solid #0B61F4;background:#fff;color:#0B61F4;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">500 ml</button>',
              '<button id="sc-size-1000" data-size="1" style="padding:8px 18px;border-radius:6px;border:2px solid #0B61F4;background:#0B61F4;color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">1 L</button>',
              '<button id="sc-size-1500" data-size="1.5" style="padding:8px 18px;border-radius:6px;border:2px solid #0B61F4;background:#fff;color:#0B61F4;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">1.5 L</button>',
            '</div>',
          '</div>',

          /* Input: cost per bottle */
          '<div style="margin-bottom:24px">',
            '<label style="display:block;font-size:13px;font-weight:600;color:#324158;margin-bottom:8px">Cost per bottle</label>',
            '<div style="display:flex;align-items:center;border:2px solid #e0e7f0;border-radius:8px;overflow:hidden;width:140px">',
              '<span style="padding:9px 12px;background:#f4f7fb;color:#324158;font-size:14px;font-weight:600;border-right:2px solid #e0e7f0">$</span>',
              '<input id="sc-cost" type="number" min="0.10" max="20" step="0.10" value="2.50" style="border:none;outline:none;padding:9px 10px;font-size:14px;font-family:inherit;color:#324158;width:80px;background:#fff">',
            '</div>',
          '</div>',

          /* Output box */
          '<div id="sc-output" style="background:#eef2f9;border-radius:10px;padding:20px 22px">',
            '<div id="sc-annual" style="font-size:16px;font-weight:700;color:#0B61F4;margin-bottom:10px"></div>',
            '<div id="sc-payoff" style="font-size:15px;font-weight:600;color:#324158"></div>',
            '<div id="sc-savings" style="font-size:14px;font-weight:600;color:#0C4BB9;margin-top:8px;display:none"></div>',
          '</div>',

          /* CTA */
          '<div style="margin-top:20px">',
            '<a href="tel:0430546749" style="display:inline-flex;align-items:center;gap:8px;background:#FFD900;color:#324158;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;font-family:inherit">',
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>',
              'Book Your Installation — 0430 546 749',
            '</a>',
          '</div>',

        '</div>',
      '</div>'
    ].join('');

    var bottlesInput = document.getElementById('sc-bottles');
    var bottlesVal   = document.getElementById('sc-bottles-val');
    var costInput    = document.getElementById('sc-cost');
    var sizeButtons  = [
      document.getElementById('sc-size-500'),
      document.getElementById('sc-size-1000'),
      document.getElementById('sc-size-1500')
    ];
    var annualEl  = document.getElementById('sc-annual');
    var payoffEl  = document.getElementById('sc-payoff');
    var savingsEl = document.getElementById('sc-savings');

    var selectedSize = 1; // litres

    function setSize(val, activeBtn) {
      selectedSize = val;
      sizeButtons.forEach(function (btn) {
        btn.style.background = '#fff';
        btn.style.color = '#0B61F4';
      });
      activeBtn.style.background = '#0B61F4';
      activeBtn.style.color = '#fff';
      calculate();
    }

    sizeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSize(parseFloat(btn.getAttribute('data-size')), btn);
      });
    });

    bottlesInput.addEventListener('input', function () {
      bottlesVal.textContent = bottlesInput.value;
      calculate();
    });

    costInput.addEventListener('input', calculate);

    function calculate() {
      var bottles = parseInt(bottlesInput.value, 10) || 0;
      var cost    = parseFloat(costInput.value) || 0;

      var weeklySpend = bottles * cost;
      var annual      = weeklySpend * 52;

      annualEl.textContent = 'You spend $' + annual.toFixed(0) + ' per year on bottled water';

      if (annual <= 0) {
        payoffEl.textContent = 'Enter your usage above to see your savings.';
        savingsEl.style.display = 'none';
        return;
      }

      var systemCost, systemName;
      if (annual < 840) {
        systemCost = 550;
        systemName = 'Pure Essential system ($550)';
      } else {
        systemCost = 840;
        systemName = 'Pure Plus+ system ($840)';
      }

      var monthlySpend = annual / 12;
      var months = Math.ceil(systemCost / monthlySpend);
      payoffEl.textContent = 'A ' + systemName + ' pays for itself in ' + months + ' month' + (months !== 1 ? 's' : '');

      if (annual > 1200) {
        var maintenance = 120;
        var yearlySaving = annual - maintenance;
        savingsEl.textContent = 'You would save $' + yearlySaving.toFixed(0) + ' per year vs bottled water';
        savingsEl.style.display = 'block';
      } else {
        savingsEl.style.display = 'none';
      }
    }

    calculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
