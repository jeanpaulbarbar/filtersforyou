#!/usr/bin/env python3
"""Generate 5 product pages for Filters For You website."""
import os

BASEDIR = os.path.dirname(os.path.abspath(__file__))

def nav_html(active_page=""):
    systems_links = [
        ("pure-essential-water-filter-sydney.html", "Pure Essential — $550"),
        ("pure-plus-water-filter-sydney.html", "Pure Plus+ — $840"),
        ("pure-premium-water-filter-sydney.html", "Pure Premium — $1,180"),
        ("pure-compact-water-filter-sydney.html", "Pure Compact — $930"),
        ("pure-advanced-water-filter-sydney.html", "Pure Advanced — $1,280"),
        ("pure-luxe-water-filter-sydney.html", "Pure Luxe — $1,740"),
        ("pure-home-water-filter-sydney.html", "Pure Home — $3,150"),
    ]
    dd_items = '\n          '.join(
        f'<a href="{href}"{" class=\"active\"" if href == active_page else ""}>{label}</a>'
        for href, label in systems_links
    )
    dd_items = '<a href="water-filter-systems.html">All Water Filter Systems</a>\n          ' + dd_items

    mobile_items = '\n        '.join(
        f'<a href="{href}"{" class=\"active\"" if href == active_page else ""}>{label}</a>'
        for href, label in systems_links
    )
    mobile_items = '<a href="water-filter-systems.html">All Water Filter Systems</a>\n        ' + mobile_items

    return f'''<!-- NAV -->
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="assets/brand/logos/logo-transparent.svg" alt="Filters For You — Water Filter Installation Sydney" width="140" height="40"></a>
    <ul class="nav-links" id="navLinks">
      <li class="nav-item">
        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Systems <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="dropdown">
          {dd_items}
        </div>
      </li>
      <li class="nav-item">
        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Locations <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="dropdown dropdown-2col">
          <div class="dropdown-col">
            <a href="water-filter-installation-ashfield.html">Ashfield</a>
            <a href="water-filter-installation-balmain.html">Balmain</a>
            <a href="water-filter-installation-burwood.html">Burwood</a>
            <a href="water-filter-installation-campsie.html">Campsie</a>
            <a href="water-filter-installation-concord.html">Concord</a>
            <a href="water-filter-installation-croydon-park.html">Croydon Park</a>
            <a href="water-filter-installation-drummoyne.html">Drummoyne</a>
            <a href="water-filter-installation-enmore.html">Enmore</a>
          </div>
          <div class="dropdown-col">
            <a href="water-filter-installation-glebe.html">Glebe</a>
            <a href="water-filter-installation-homebush.html">Homebush</a>
            <a href="water-filter-installation-hurstville.html">Hurstville</a>
            <a href="water-filter-installation-leichhardt.html">Leichhardt</a>
            <a href="water-filter-installation-marrickville.html">Marrickville</a>
            <a href="water-filter-installation-newtown.html">Newtown</a>
            <a href="water-filter-installation-petersham.html">Petersham</a>
            <a href="water-filter-installation-strathfield.html">Strathfield</a>
          </div>
        </div>
      </li>
      <li><a href="index.html#reviews" class="nav-link-plain">Reviews</a></li>
      <li><a href="index.html#about" class="nav-link-plain">About</a></li>
    </ul>
    <button class="nav-hamburger" id="navHamburger" aria-label="Open menu" aria-expanded="false">
      <span class="ham-bar"></span><span class="ham-bar"></span><span class="ham-bar"></span>
    </button>
    <a href="tel:0430546749" class="nav-cta">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>
      0430 546 749
    </a>
  </div>
</nav>

<!-- MOBILE NAV -->
<div class="mobile-nav" id="mobileNav" role="dialog" aria-modal="true" aria-label="Navigation">
  <div class="mobile-nav-header">
    <a href="index.html"><img src="assets/brand/logos/logo-transparent.svg" alt="Filters For You" height="36"></a>
    <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M4 4l14 14M18 4L4 18" stroke="#324158" stroke-width="2.2" stroke-linecap="round"/></svg>
    </button>
  </div>
  <div class="mobile-nav-body">
    <div class="mobile-section">
      <button class="mobile-section-btn">Systems <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <div class="mobile-section-links">
        {mobile_items}
      </div>
    </div>
    <div class="mobile-plain-links">
      <a href="index.html#reviews">Reviews</a>
      <a href="index.html#about">About</a>
    </div>
    <a href="tel:0430546749" class="mobile-cta">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>
      Call 0430 546 749
    </a>
  </div>
</div>'''


CSS = '''<style>
:root{--blue:#0B61F4;--blue-dark:#0C4BB9;--yellow:#FFD900;--white:#FAFAFA;--dark:#324158;--muted:#5a6a7e;--light:#eef2f9;--footer-bg:#1e2d40}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:\'Sora\',sans-serif;font-size:16px;line-height:1.65;color:var(--dark);background:var(--white);-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}a{text-decoration:none;color:inherit}
.sh{font-family:\'Shantell Sans\',cursive;font-style:italic;font-weight:700;font-size:1.08em;display:inline}
.sh-y{color:var(--yellow)}.sh-b{color:var(--blue)}
.btn{display:inline-flex;align-items:center;gap:9px;font-family:\'Sora\',sans-serif;font-weight:700;font-size:17px;padding:13px 26px;border-radius:8px;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s;text-decoration:none;line-height:1}
.btn:hover{transform:translateY(-2px)}.btn-yellow{background:var(--yellow);color:var(--dark);box-shadow:0 4px 20px rgba(255,217,0,.35)}.btn-yellow:hover{background:#ffe633}
.btn-blue{background:var(--blue);color:#fff;box-shadow:0 4px 20px rgba(11,97,244,.3)}.btn-blue:hover{background:var(--blue-dark)}
.nav{background:var(--white);border-bottom:1px solid rgba(50,65,88,.1);position:sticky;top:0;z-index:1000;box-shadow:0 2px 14px rgba(11,97,244,.07)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:0 32px;max-width:1280px;margin:0 auto;height:68px;gap:24px}
.nav-logo img{height:40px;width:auto}
.nav-cta{display:inline-flex;align-items:center;gap:8px;background:var(--blue);color:#fff;font-weight:700;font-size:16px;padding:10px 20px;border-radius:8px;transition:background .2s,transform .2s;text-decoration:none;white-space:nowrap}
.nav-cta:hover{background:var(--blue-dark);transform:translateY(-1px)}.nav-cta svg{flex-shrink:0}
.breadcrumb{background:var(--light);padding:12px 32px;font-size:14px;color:var(--muted)}.breadcrumb a{color:var(--blue);font-weight:500}.breadcrumb a:hover{text-decoration:underline}
.ticker{background:var(--yellow);color:var(--dark);font-size:14px;font-weight:700;padding:10px 0;overflow:hidden;white-space:nowrap}
.ticker-track{display:inline-flex;animation:tick 30s linear infinite}
.ticker-item{padding:0 28px;display:inline-flex;align-items:center;gap:8px}
.ticker-item+.ticker-item::before{content:\'\';width:4px;height:4px;background:var(--dark);border-radius:50%;opacity:.4;margin-right:20px;flex-shrink:0}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.hero{background:linear-gradient(135deg,#041450 0%,#082D94 55%,#0b61f4 100%);padding:70px 32px 60px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:\'\';position:absolute;top:-60px;right:-60px;width:420px;height:420px;background:rgba(255,217,0,.05);border-radius:50%;pointer-events:none}
.hero-inner{max-width:800px;margin:0 auto;position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);padding:7px 18px;border-radius:100px;font-size:14px;font-weight:600;color:#fff;margin-bottom:20px}
.hero-badge-dot{width:7px;height:7px;background:var(--yellow);border-radius:50%;display:inline-block;flex-shrink:0}
.hero h1{font-size:clamp(30px,5vw,52px);font-weight:800;color:#fff;line-height:1.1;margin-bottom:18px;letter-spacing:-.025em}
.hero-sub{font-size:18px;color:rgba(255,255,255,.82);margin-bottom:26px;max-width:620px;margin-left:auto;margin-right:auto;line-height:1.65}
.hero-stars{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:26px}
.stars{color:var(--yellow);font-size:18px;letter-spacing:2px}.stars-label{font-size:15px;color:rgba(255,255,255,.75);font-weight:500}
.hero-trust{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:30px}
.trust-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);color:#fff;font-size:13px;font-weight:600;padding:7px 14px;border-radius:6px}
.trust-chip svg{flex-shrink:0;opacity:.85}
.hero-btns{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.sec{padding:72px 32px}.sec-light{background:var(--light)}.sec-white{background:#fff}
.container{max-width:1100px;margin:0 auto}
.sec-head{text-align:center;margin-bottom:48px}
.eyebrow{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);display:block;margin-bottom:8px}
.yline{width:36px;height:3px;background:var(--yellow);border-radius:2px;margin-bottom:14px}.yline-c{margin:0 auto 14px}
.sec-title{font-size:clamp(26px,4vw,40px);font-weight:800;line-height:1.15;letter-spacing:-.02em;margin-bottom:14px}.sec-title-dark{color:var(--dark)}
.sec-body{font-size:17px;color:var(--muted);max-width:580px}.sec-body-c{margin:0 auto}
.trust-bar{background:#fff;border-bottom:1px solid rgba(50,65,88,.08)}
.trust-bar-inner{max-width:1100px;margin:0 auto;padding:22px 32px;display:flex;flex-wrap:wrap;gap:20px;justify-content:center}
.tbi{display:flex;align-items:center;gap:9px;font-size:14px;font-weight:600;color:var(--dark)}.tbi svg{color:var(--blue);flex-shrink:0}
.product-layout{display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:start}
.gallery-hero{border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(11,97,244,.15);margin-bottom:14px}
.gallery-hero img{width:100%;aspect-ratio:4/3;object-fit:cover}
.product-model{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);margin-bottom:8px}
.product-name{font-size:clamp(28px,3.5vw,40px);font-weight:800;color:var(--dark);line-height:1.1;letter-spacing:-.02em;margin-bottom:12px}
.product-tagline{font-size:17px;color:var(--muted);line-height:1.65;margin-bottom:22px}
.product-price-block{background:var(--light);border-radius:14px;padding:22px;margin-bottom:22px}
.price-main{font-size:42px;font-weight:800;color:var(--blue);line-height:1;margin-bottom:4px}
.price-note{font-size:14px;color:var(--muted);font-weight:500;margin-bottom:12px}
.price-chips{display:flex;flex-wrap:wrap;gap:8px}
.price-chip{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid rgba(11,97,244,.15);color:var(--dark);font-size:13px;font-weight:600;padding:6px 12px;border-radius:6px}
.price-chip svg{color:var(--blue);flex-shrink:0}
.product-features{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:24px}
.product-features li{display:flex;align-items:flex-start;gap:10px;font-size:15px;color:var(--dark);font-weight:500;line-height:1.5}
.pf-chk{width:20px;height:20px;min-width:20px;background:var(--yellow);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.product-btns{display:flex;flex-wrap:wrap;gap:12px}
.tap-callout{background:linear-gradient(135deg,#f0f6ff 0%,#e8f0ff 100%);border:1.5px solid rgba(11,97,244,.15);border-radius:16px;padding:24px 28px;margin-top:24px;display:flex;gap:16px;align-items:flex-start}
.tap-icon{width:44px;height:44px;min-width:44px;background:var(--blue);border-radius:12px;display:flex;align-items:center;justify-content:center}
.tap-content h4{font-size:16px;font-weight:700;color:var(--dark);margin-bottom:6px}.tap-content p{font-size:14px;color:var(--muted);line-height:1.65}
.content-body{max-width:800px;margin:0 auto}
.content-body h2{font-size:26px;font-weight:800;color:var(--dark);margin:36px 0 14px;line-height:1.2}
.content-body p{font-size:16px;color:var(--muted);line-height:1.75;margin-bottom:16px}
.content-body ul{margin:0 0 16px 20px}.content-body ul li{font-size:16px;color:var(--muted);line-height:1.7;margin-bottom:6px}
.stages-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px}
.stage-card{background:#fff;border-radius:16px;padding:28px;box-shadow:0 4px 24px rgba(11,97,244,.08);border:1.5px solid rgba(11,97,244,.06);position:relative}
.stage-num{position:absolute;top:-14px;left:24px;width:32px;height:32px;background:var(--blue);color:#fff;font-size:16px;font-weight:800;border-radius:50%;display:flex;align-items:center;justify-content:center}
.stage-name{font-size:18px;font-weight:700;color:var(--dark);margin-bottom:4px;line-height:1.2}
.stage-rating{font-size:13px;font-weight:700;color:var(--muted);margin-bottom:12px}
.stage-desc{font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:14px}
.stage-tags{display:flex;flex-wrap:wrap;gap:6px}
.stage-tag{background:var(--light);border-radius:20px;font-size:12px;font-weight:600;color:var(--blue);padding:4px 10px}
.specs-table{width:100%;border-collapse:collapse;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07)}
.specs-table th{background:var(--blue);color:#fff;padding:14px 18px;font-size:14px;font-weight:700;text-align:left}
.specs-table th:last-child{text-align:right}
.specs-table td{padding:13px 18px;font-size:15px;border-bottom:1px solid rgba(0,0,0,.06);background:#fff;vertical-align:middle}
.specs-table td:last-child{text-align:right;font-weight:600;color:var(--dark)}
.specs-table tr:last-child td{border-bottom:none}.specs-table tr:hover td{background:var(--light)}
.specs-table-wrap{overflow-x:auto;border-radius:14px}
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}
.pricing-card{background:#fff;border-radius:16px;padding:28px;box-shadow:0 4px 24px rgba(11,97,244,.09);border:1.5px solid rgba(11,97,244,.08)}
.pricing-card.featured{border-color:var(--blue);background:linear-gradient(135deg,#f0f6ff 0%,#fff 100%);position:relative}
.pricing-badge{position:absolute;top:-12px;right:20px;background:var(--blue);color:#fff;font-size:12px;font-weight:700;padding:4px 14px;border-radius:20px;letter-spacing:.04em}
.pc-icon{width:44px;height:44px;background:var(--light);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px}
.pc-title{font-size:18px;font-weight:700;color:var(--dark);margin-bottom:6px}
.pc-price{font-size:36px;font-weight:800;color:var(--blue);line-height:1;margin-bottom:6px}
.pc-note{font-size:14px;color:var(--muted);margin-bottom:16px}
.pc-list{list-style:none;display:flex;flex-direction:column;gap:8px}
.pc-list li{display:flex;align-items:flex-start;gap:8px;font-size:14px;color:var(--dark);font-weight:500;line-height:1.5}
.pc-list .chk{width:18px;height:18px;min-width:18px;background:var(--yellow);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.faq-list{max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.faq-item{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.05)}
.faq-q{width:100%;text-align:left;background:none;border:none;padding:18px 24px;font-family:\'Sora\',sans-serif;font-size:16px;font-weight:600;color:var(--dark);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:12px}
.faq-icon{width:24px;height:24px;min-width:24px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform .25s}
.faq-item.open .faq-icon{transform:rotate(45deg)}
.faq-a{padding:0 24px;max-height:0;overflow:hidden;transition:max-height .3s ease,padding .3s;font-size:15px;color:var(--muted);line-height:1.75}
.faq-item.open .faq-a{max-height:400px;padding:0 24px 18px}
.cta-section{background:var(--blue);padding:72px 32px;text-align:center}
.cta-section h2{font-size:clamp(26px,4vw,40px);font-weight:800;color:#fff;margin-bottom:16px;line-height:1.15}
.cta-section p{font-size:18px;color:rgba(255,255,255,.82);margin-bottom:28px;max-width:520px;margin-left:auto;margin-right:auto}
.cta-phone-big{font-size:clamp(28px,5vw,44px);font-weight:800;color:var(--yellow);margin-bottom:8px;line-height:1}
.cta-phone-big a{color:inherit;text-decoration:none}
.cta-phone-note{font-size:15px;color:rgba(255,255,255,.65);margin-bottom:32px}
.cta-form-card{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:16px;padding:28px;max-width:460px;margin:0 auto;text-align:left}
.cta-form-title{font-size:18px;font-weight:700;color:#fff;margin-bottom:16px}
.f-input{width:100%;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.22);border-radius:8px;padding:12px 15px;font-family:\'Sora\',sans-serif;font-size:15px;color:#fff;outline:none;margin-bottom:10px;transition:border-color .2s}
.f-input::placeholder{color:rgba(255,255,255,.45)}.f-input:focus{border-color:var(--yellow)}
.f-select{width:100%;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.22);border-radius:8px;padding:12px 15px;font-family:\'Sora\',sans-serif;font-size:15px;color:rgba(255,255,255,.7);outline:none;margin-bottom:10px}
.f-select option{background:#0C4BB9;color:#fff}
.f-check-wrap{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:rgba(255,255,255,.65);margin-bottom:10px;line-height:1.5}
.f-check-wrap a{color:rgba(255,255,255,.85);text-decoration:underline}
.f-submit{width:100%;background:var(--yellow);color:var(--dark);font-family:\'Sora\',sans-serif;font-size:17px;font-weight:800;padding:14px;border:none;border-radius:8px;cursor:pointer;transition:background .2s,transform .2s}
.f-submit:hover{background:#ffe533;transform:translateY(-1px)}
.systems-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.system-card{background:#fff;border-radius:16px;padding:28px;box-shadow:0 4px 24px rgba(11,97,244,.09);border:1.5px solid rgba(11,97,244,.08);transition:transform .2s,box-shadow .2s}
.system-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(11,97,244,.16)}
.system-icon{width:48px;height:48px;background:var(--light);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px}
.system-name{font-size:19px;font-weight:800;color:var(--dark);margin-bottom:4px}
.system-price{font-size:24px;font-weight:800;color:var(--blue);margin-bottom:4px}
.system-note{font-size:13px;color:var(--muted);margin-bottom:14px}
.system-link{display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:700;color:var(--blue)}
.system-link:hover{text-decoration:underline}
.jp-collage{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:32px}
.jp-collage img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.12);display:block}
.jp-installer-trust{text-align:center;margin-top:20px;font-size:15px;color:#5a6478;max-width:600px;margin-left:auto;margin-right:auto}
.footer{background:var(--footer-bg);color:rgba(255,255,255,.6);padding:56px 32px 32px}
.footer-inner{max-width:1100px;margin:0 auto}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
.footer-brand p{font-size:14px;line-height:1.7;margin-top:14px;max-width:280px}
.footer-logo{height:36px;width:auto}
.footer-col h4{font-size:15px;font-weight:700;color:#fff;margin-bottom:14px}
.footer-col ul{list-style:none}.footer-col ul li{margin-bottom:8px}
.footer-col ul li a{font-size:14px;color:rgba(255,255,255,.6);transition:color .2s}.footer-col ul li a:hover{color:#fff}
.footer-contact-item{font-size:13px;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.footer-contact-item a{color:rgba(255,255,255,.6);transition:color .2s}.footer-contact-item a:hover{color:#fff}
.footer-social-row{display:flex;gap:14px;margin-top:14px}
.footer-social-link{font-size:13px;font-weight:600;color:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.15);padding:5px 12px;border-radius:4px;transition:color .2s,border-color .2s}
.footer-social-link:hover{color:#fff;border-color:rgba(255,255,255,.4)}
.footer-bottom{border-top:1px solid rgba(255,255,255,.1);padding-top:24px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-size:13px}
@media(max-width:900px){.product-layout{grid-template-columns:1fr}.stages-grid{grid-template-columns:1fr}}
@media(max-width:768px){.nav-links{display:none}.footer-top{grid-template-columns:1fr 1fr}.hero{padding:50px 20px}.sec{padding:50px 20px}.breadcrumb{padding:12px 20px}.trust-bar-inner{padding:16px 20px;gap:14px}}
@media(max-width:700px){.jp-collage{grid-template-columns:repeat(2,1fr);gap:10px}}
@media(max-width:600px){.specs-table-wrap{overflow-x:auto}.pricing-grid{grid-template-columns:1fr}}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .5s,transform .5s}.reveal.visible{opacity:1;transform:none}
</style>
<style id="dropdown-nav-css">
.nav-hamburger{display:none;background:none;border:none;cursor:pointer;padding:8px 6px;border-radius:7px;align-items:center;justify-content:center;flex-direction:column;gap:5px;-webkit-tap-highlight-color:transparent;flex-shrink:0}
.ham-bar{display:block;width:22px;height:2px;background:#324158;border-radius:1px;transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .25s,width .25s}
.nav-hamburger[aria-expanded="true"] .ham-bar:nth-child(1){transform:translateY(7px) rotate(45deg)}
.nav-hamburger[aria-expanded="true"] .ham-bar:nth-child(2){opacity:0;transform:scaleX(0)}
.nav-hamburger[aria-expanded="true"] .ham-bar:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.nav-links{display:flex;align-items:center;gap:2px;list-style:none;margin:0;padding:0}
.nav-item{position:relative}.nav-item::after{content:\'\';position:absolute;bottom:-10px;left:0;right:0;height:10px;background:transparent}
.nav-link-btn{display:flex;align-items:center;gap:5px;font-family:\'Sora\',sans-serif;font-size:15.5px;font-weight:600;color:#324158;background:none;border:none;cursor:pointer;padding:8px 11px;border-radius:7px;transition:color .2s,background .2s;white-space:nowrap;-webkit-tap-highlight-color:transparent;line-height:1}
.nav-link-btn:hover,.nav-link-btn:focus-visible{color:#0b61f4;background:rgba(11,97,244,.06);outline:none}
.nav-link-btn .chevron{transition:transform .22s cubic-bezier(.4,0,.2,1);flex-shrink:0}
.nav-item:hover .nav-link-btn .chevron{transform:rotate(180deg)}
.nav-link-plain{font-family:\'Sora\',sans-serif;font-size:15.5px;font-weight:600;color:#324158;padding:8px 11px;border-radius:7px;display:block;transition:color .2s,background .2s;white-space:nowrap;text-decoration:none}
.nav-link-plain:hover{color:#0b61f4;background:rgba(11,97,244,.06)}
.dropdown{position:absolute;top:calc(100% + 10px);left:0;background:#fff;border:1px solid rgba(50,65,88,.1);border-radius:12px;box-shadow:0 12px 40px rgba(11,97,244,.13),0 2px 8px rgba(0,0,0,.06);padding:6px;min-width:230px;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .2s,transform .2s,visibility .2s;z-index:500;pointer-events:none}
.nav-item:hover .dropdown{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}
.dropdown a{display:block;padding:9px 13px;font-family:\'Sora\',sans-serif;font-size:14.5px;font-weight:500;color:#324158;border-radius:7px;transition:background .15s,color .15s;white-space:nowrap;text-decoration:none}
.dropdown a:hover,.dropdown a.active{background:rgba(11,97,244,.07);color:#0b61f4}.dropdown a.active{font-weight:600}
.dropdown-2col{display:flex;flex-direction:row;min-width:380px}.dropdown-col{flex:1;padding:0 2px}
.mobile-nav{display:none;position:fixed;inset:0;z-index:9999;background:#fff;overflow-y:auto;transform:translateX(100%);transition:transform .32s cubic-bezier(.4,0,.2,1)}
.mobile-nav.open{transform:translateX(0)}
.mobile-nav-header{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1.5px solid rgba(50,65,88,.1);position:sticky;top:0;background:#fff;z-index:2}
.mobile-nav-close{background:none;border:none;cursor:pointer;padding:8px;border-radius:8px;-webkit-tap-highlight-color:transparent;display:flex;align-items:center;justify-content:center}
.mobile-nav-body{padding:4px 20px 60px}
.mobile-section{border-bottom:1px solid rgba(50,65,88,.1)}
.mobile-section-btn{display:flex;align-items:center;justify-content:space-between;width:100%;padding:16px 4px;font-family:\'Sora\',sans-serif;font-size:16.5px;font-weight:700;color:#324158;background:none;border:none;cursor:pointer;text-align:left;-webkit-tap-highlight-color:transparent}
.mobile-section-btn .chevron{transition:transform .25s;flex-shrink:0}
.mobile-section.open .mobile-section-btn .chevron{transform:rotate(180deg)}
.mobile-section-links{display:none;padding:2px 0 10px}
.mobile-section.open .mobile-section-links{display:block}
.mobile-section-links a{display:block;padding:11px 12px;font-family:\'Sora\',sans-serif;font-size:15.5px;font-weight:500;color:#324158;border-radius:8px;transition:background .15s,color .15s;text-decoration:none}
.mobile-section-links a:hover,.mobile-section-links a.active{background:rgba(11,97,244,.07);color:#0b61f4}
.mobile-plain-links{padding:4px 0}
.mobile-plain-links a{display:block;padding:16px 4px;font-family:\'Sora\',sans-serif;font-size:16.5px;font-weight:700;color:#324158;border-bottom:1px solid rgba(50,65,88,.1);text-decoration:none}
.mobile-cta{display:flex;align-items:center;justify-content:center;gap:10px;background:#0b61f4;color:#fff;font-family:\'Sora\',sans-serif;font-size:18px;font-weight:700;padding:16px 20px;border-radius:10px;margin-top:20px;text-decoration:none}
@media(max-width:900px){.nav-links{display:none!important}.nav-hamburger{display:flex!important;order:99}.mobile-nav{display:block}.nav-cta{white-space:nowrap;font-size:13px;padding:8px 12px}}
</style>'''

JS_FOOTER = '''<script>
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    const open=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!open)item.classList.add('open');
  });
});
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});},{threshold:0.07});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
</script>
<script id="dropdown-nav-js">
(function(){
  var ham=document.getElementById('navHamburger');
  var mob=document.getElementById('mobileNav');
  var cls=document.getElementById('mobileNavClose');
  function openMob(){if(!mob)return;mob.classList.add('open');if(ham)ham.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';}
  function closeMob(){if(!mob)return;mob.classList.remove('open');if(ham)ham.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  if(ham)ham.addEventListener('click',openMob);
  if(cls)cls.addEventListener('click',closeMob);
  if(mob){mob.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMob);});mob.querySelectorAll('.mobile-section-btn').forEach(function(btn){btn.addEventListener('click',function(){btn.closest('.mobile-section').classList.toggle('open');});});}
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMob();});
})();
</script>
</body>
</html>'''

CHKSVG = '<svg width="9" height="7" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="#324158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
PHONE_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>'

def head_html(title, desc, canonical, og_img, keywords=""):
    return f'''<!DOCTYPE html>
<html lang="en-AU">
<head>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-TK2P95MELV"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-TK2P95MELV');</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="AU-NSW">
<meta name="geo.placename" content="Sydney, NSW">
<script>!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2577696515958185');fbq('track','PageView');</script>
<meta property="og:type" content="website">
<meta property="og:url" content="{canonical}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{og_img}">
<meta property="og:locale" content="en_AU">
<meta property="og:site_name" content="Filters For You">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Shantell+Sans:ital,wght@1,700&display=swap" rel="stylesheet">'''

def trust_chips():
    return '''<div class="hero-trust">
      <span class="trust-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Installation Included</span>
      <span class="trust-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>Lifetime Workmanship Guarantee</span>
      <span class="trust-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>12-Month System Warranty</span>
      <span class="trust-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>Licensed Plumber 461511C</span>
      <span class="trust-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>WaterMark Certified</span>
    </div>'''

def trust_bar():
    return '''<div class="trust-bar">
  <div class="trust-bar-inner">
    <div class="tbi"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Supply + professional installation included</div>
    <div class="tbi"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>Lifetime workmanship guarantee</div>
    <div class="tbi"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>12-month system warranty</div>
    <div class="tbi"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>Licensed plumber Lic. 461511C</div>
    <div class="tbi"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>WaterMark Certified</div>
  </div>
</div>'''

def footer_html(page_name=""):
    return f'''<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="assets/brand/logos/logo-transparent.svg" alt="Filters For You" class="footer-logo" width="140" height="36">
        <p>Sydney\'s trusted water filter specialist. Jean-Paul Barber personally installs every system across greater Sydney. Fixed prices from $550, Lic. 461511C, lifetime warranty.</p>
        <div class="footer-social-row">
          <a href="https://instagram.com/filtersforyouau" class="footer-social-link" rel="noopener noreferrer" target="_blank">Instagram</a>
          <a href="https://facebook.com/filtersforyouau" class="footer-social-link" rel="noopener noreferrer" target="_blank">Facebook</a>
          <a href="https://tiktok.com/@filtersforyouau" class="footer-social-link" rel="noopener noreferrer" target="_blank">TikTok</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Systems</h4>
        <ul>
          <li><a href="water-filter-systems.html">All Systems</a></li>
          <li><a href="pure-essential-water-filter-sydney.html">Pure Essential</a></li>
          <li><a href="pure-plus-water-filter-sydney.html">Pure Plus+</a></li>
          <li><a href="pure-premium-water-filter-sydney.html">Pure Premium</a></li>
          <li><a href="pure-compact-water-filter-sydney.html">Pure Compact</a></li>
          <li><a href="pure-advanced-water-filter-sydney.html">Pure Advanced</a></li>
          <li><a href="pure-luxe-water-filter-sydney.html">Pure Luxe</a></li>
          <li><a href="pure-home-water-filter-sydney.html">Pure Home</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Suburbs</h4>
        <ul>
          <li><a href="/water-filter-installation-croydon-park.html">Croydon Park</a></li>
          <li><a href="/water-filter-installation-newtown.html">Newtown</a></li>
          <li><a href="/water-filter-installation-leichhardt.html">Leichhardt</a></li>
          <li><a href="/water-filter-installation-marrickville.html">Marrickville</a></li>
          <li><a href="/water-filter-installation-concord.html">Concord</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="/#about">About Jean-Paul</a></li>
          <li><a href="/#reviews">Reviews</a></li>
        </ul>
        <div style="margin-top:14px">
          <div class="footer-contact-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg><a href="tel:0430546749">0430 546 749</a></div>
          <div class="footer-contact-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><a href="mailto:info@filtersforyou.com.au">info@filtersforyou.com.au</a></div>
          <div class="footer-contact-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>Based Croydon Park, Greater Sydney</div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Tapped Out Pty Ltd (Filters For You) &middot; ABN 81 672 101 674 &middot; Lic. 461511C &middot; {page_name}</span>
      <span>filtersforyou.com.au</span>
    </div>
  </div>
</footer>'''

def quote_form(form_name, selected_option):
    options = [
        ("Pure Essential — Twin Stage ($550)", "Pure Essential — Twin Stage ($550)"),
        ("Pure Plus+ — 5 Stage RO ($840)", "Pure Plus+ — 5 Stage RO ($840)"),
        ("Pure Compact — RO Compact ($930)", "Pure Compact — RO Compact ($930)"),
        ("Pure Premium — 7 Stage RO ($1,180)", "Pure Premium — 7 Stage RO ($1,180)"),
        ("Pure Advanced — Quick-Change RO ($1,280)", "Pure Advanced — Quick-Change RO ($1,280)"),
        ("Pure Luxe — Smart Monitoring RO ($1,740)", "Pure Luxe — Smart Monitoring RO ($1,740)"),
        ("Pure Home — Whole House ($3,150)", "Pure Home — Whole House ($3,150)"),
        ("Not sure — need advice", "Not sure — need advice"),
    ]
    opts_html = "\n".join(
        f'        <option{"" if v != selected_option else " selected"}>{v}</option>'
        for k, v in options
    )
    return f'''<section class="cta-section" id="quote">
  <h2>Ready to Get <span class="sh sh-y">Cleaner Water</span>?</h2>
  <p>Book your installation or get a fixed price quote. Jean-Paul covers greater Sydney — same week appointments available.</p>
  <div class="cta-phone-big"><a href="tel:0430546749">0430 546 749</a></div>
  <div class="cta-phone-note">Mon–Sat 7am–6pm &middot; No call-out fee &middot; Fixed price</div>
  <div class="cta-form-card">
    <div class="cta-form-title">Request a Free Quote</div>
    <form name="{form_name}" method="POST" data-netlify="true" action="/thank-you.html">
      <input type="hidden" name="form-name" value="{form_name}">
      <input class="f-input" type="text" name="name" placeholder="Your name" required autocomplete="name">
      <input class="f-input" type="tel" name="phone" placeholder="Phone number" required autocomplete="tel">
      <input class="f-input" type="email" name="email" placeholder="Email address" autocomplete="email">
      <input class="f-input" type="text" name="suburb" placeholder="Your suburb" required autocomplete="address-level2">
      <select class="f-select" name="system">
        <option value="" disabled selected>System of interest</option>
{opts_html}
      </select>
      <div class="f-check-wrap">
        <input type="checkbox" id="tc" name="agree_terms" required>
        <label for="tc">I agree to the <a href="/terms-and-conditions.html" target="_blank">Terms and Conditions</a> and <a href="/privacy-policy.html" target="_blank">Privacy Policy</a></label>
      </div>
      <button type="submit" class="f-submit">Send My Free Quote Request</button>
    </form>
  </div>
</section>'''

def pricing_section(installed_price, pro_service, diy_service, system_name, features_install, features_pro, features_diy):
    def li(text):
        return f'<li><span class="chk">{CHKSVG}</span>{text}</li>'
    install_lis = "\n          ".join(li(f) for f in features_install)
    pro_lis = "\n          ".join(li(f) for f in features_pro)
    diy_lis = "\n          ".join(li(f) for f in features_diy)
    return f'''<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">Fixed Pricing</span>
      <h2 class="sec-title sec-title-dark">What You <span class="sh sh-b">Pay</span></h2>
      <p class="sec-body sec-body-c">No call-out fees. No hidden extras. One fixed price covers everything.</p>
    </div>
    <div class="pricing-grid">
      <div class="pricing-card featured">
        <div class="pricing-badge">SUPPLY + INSTALL</div>
        <div class="pc-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B61F4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg></div>
        <div class="pc-title">{system_name} — Installed</div>
        <div class="pc-price">${installed_price}</div>
        <div class="pc-note">One fixed price. Everything included.</div>
        <ul class="pc-list">
          {install_lis}
        </ul>
      </div>
      <div class="pricing-card">
        <div class="pc-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B61F4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg></div>
        <div class="pc-title">Annual Service — Professional</div>
        <div class="pc-price">${pro_service}<span style="font-size:18px;font-weight:600;color:var(--muted)">/yr</span></div>
        <div class="pc-note">Jean-Paul attends, replaces all filters and checks all fittings.</div>
        <ul class="pc-list">
          {pro_lis}
        </ul>
      </div>
      <div class="pricing-card">
        <div class="pc-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B61F4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div>
        <div class="pc-title">Annual Service — DIY</div>
        <div class="pc-price">~${diy_service}<span style="font-size:18px;font-weight:600;color:var(--muted)">/yr</span></div>
        <div class="pc-note">Self-replace cartridges — no specialist tools required for most stages.</div>
        <ul class="pc-list">
          {diy_lis}
        </ul>
      </div>
    </div>
  </div>
</section>'''

def collage_section(photos, caption):
    imgs = "\n      ".join(
        f'<img src="assets/jp%20working/{p[0]}" alt="{p[1]}" loading="lazy">'
        for p in photos
    )
    return f'''<section class="sec sec-light reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">Licensed Plumber</span>
      <h2 class="sec-title sec-title-dark">Installed by <span class="sh sh-y">Jean-Paul</span></h2>
      <p class="sec-body sec-body-c">Every system is installed by Jean-Paul Barber — a licensed plumber, not a contractor. Clean work across homes and apartments throughout Sydney.</p>
    </div>
    <div class="jp-collage">
      {imgs}
    </div>
    <p class="jp-installer-trust">{caption}</p>
  </div>
</section>'''

def faq_section(faqs):
    items = ""
    for q, a in faqs:
        items += f'''      <div class="faq-item"><button class="faq-q">{q}<span class="faq-icon"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span></button><div class="faq-a">{a}</div></div>\n'''
    return f'''<section class="sec sec-light reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">Common Questions</span>
      <h2 class="sec-title sec-title-dark">Frequently Asked <span class="sh sh-b">Questions</span></h2>
    </div>
    <div class="faq-list">
{items}    </div>
  </div>
</section>'''

def related_systems(cards):
    card_html = ""
    for name, price, note, href in cards:
        card_html += f'''      <div class="system-card">
        <div class="system-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B61F4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg></div>
        <div class="system-name">{name}</div>
        <div class="system-price">{price}</div>
        <div class="system-note">{note}</div>
        <a href="{href}" class="system-link">View {name} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
      </div>\n'''
    return f'''<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">Compare Systems</span>
      <h2 class="sec-title sec-title-dark">Other <span class="sh sh-y">Water Filter Systems</span></h2>
      <p class="sec-body sec-body-c">Browse the full range — every system includes professional installation by Jean-Paul.</p>
    </div>
    <div class="systems-grid">
{card_html}    </div>
    <div style="text-align:center;margin-top:36px"><a href="water-filter-systems.html" class="btn btn-blue">View All 7 Systems</a></div>
  </div>
</section>'''

def stage_card(num, name, rating, desc, tags):
    tag_html = "".join(f'<span class="stage-tag">{t}</span>' for t in tags)
    return f'''<div class="stage-card">
          <div class="stage-num">{num}</div>
          <div class="stage-name">{name}</div>
          <div class="stage-rating">{rating}</div>
          <div class="stage-desc">{desc}</div>
          <div class="stage-tags">{tag_html}</div>
        </div>'''

def pf_li(text):
    return f'<li><span class="pf-chk">{CHKSVG}</span>{text}</li>'

def ticker_html(items):
    doubled = items * 2
    spans = "".join(f'<span class="ticker-item">{i}</span>' for i in doubled)
    return f'<div class="ticker" aria-hidden="true"><div class="ticker-track">{spans}</div></div>'


# ============================================================
# PAGE 2: PURE PREMIUM (GT1-26-7)
# ============================================================
def build_pure_premium():
    filename = "pure-premium-water-filter-sydney.html"
    schema = '''{
  "@context":"https://schema.org",
  "@graph":[
    {"@type":["Plumber","LocalBusiness"],"@id":"https://filtersforyou.com.au/#business","name":"Filters For You","telephone":"+61430546749","email":"info@filtersforyou.com.au","address":{"@type":"PostalAddress","addressLocality":"Croydon Park","addressRegion":"NSW","postalCode":"2133","addressCountry":"AU"},"areaServed":{"@type":"City","name":"Sydney"}},
    {"@type":"Product","@id":"https://filtersforyou.com.au/pure-premium-water-filter-sydney.html#product","name":"Pure Premium 7-Stage Alkaline Hydrogen-Rich Reverse Osmosis Water Filter","description":"7-stage alkaline, magnesium and hydrogen-rich undersink reverse osmosis system. Removes 99%+ contaminants, then adds alkalinity, hydrogen and far infrared ceramic treatment for antioxidant-rich water. pH 8.5–10.","model":"GT1-26-7","brand":{"@type":"Brand","name":"Filters For You"},"image":"https://filtersforyou.com.au/assets/brochure/pure-premium.jpg","offers":{"@type":"Offer","priceCurrency":"AUD","price":"1180","availability":"https://schema.org/InStock","itemCondition":"https://schema.org/NewCondition"}},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://filtersforyou.com.au/"},{"@type":"ListItem","position":2,"name":"Water Filter Systems","item":"https://filtersforyou.com.au/water-filter-systems.html"},{"@type":"ListItem","position":3,"name":"Pure Premium","item":"https://filtersforyou.com.au/pure-premium-water-filter-sydney.html"}]},
    {"@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"What is hydrogen-rich water and what are its benefits?","acceptedAnswer":{"@type":"Answer","text":"Hydrogen-rich water contains dissolved molecular hydrogen (H2), a potent antioxidant that may help neutralise harmful free radicals in the body. Research suggests potential benefits including reduced oxidative stress, anti-inflammatory properties, improved athletic recovery and enhanced cellular energy. The Pure Premium generates hydrogen-rich water via its magnesium-media stage, which reacts with water to produce dissolved H2 — raising hydrogen concentration significantly above standard tap water."}},
      {"@type":"Question","name":"What does far infrared ceramic do in a water filter?","acceptedAnswer":{"@type":"Answer","text":"Far infrared ceramic (FIR) media is believed to emit far infrared rays that interact with water molecules to break them into smaller clusters. Proponents claim this improves water absorption at the cellular level and enhances taste and softness. The FIR stage in the Pure Premium follows the hydrogen and alkaline stages, adding a further treatment layer for those seeking the most comprehensive water enhancement available in a residential under-sink system."}},
      {"@type":"Question","name":"What pH does the Pure Premium produce?","acceptedAnswer":{"@type":"Answer","text":"The Pure Premium is rated to produce water at pH 8.5–10, depending on feed water mineral content and filter age. This alkaline output is achieved through a dedicated high-alkaline magnesium stage that raises pH significantly above the near-neutral output of standard RO systems. The elevated pH is maintained by the combination of the alkaline stage and the far infrared ceramic filter."}},
      {"@type":"Question","name":"Is a 7-stage water filter better than a 5-stage system?","acceptedAnswer":{"@type":"Answer","text":"Not necessarily in terms of contamination removal — both achieve comparable RO-grade purity. The additional stages in the 7-stage system (hydrogen-rich magnesium, far infrared ceramic, extra alkaline) enhance the output water beyond simple filtration. If your goal is maximum contaminant removal on a budget, the Pure Plus+ (5-stage, $840) is the pragmatic choice. If you want the cleanest water with added health-focused enhancements — higher pH, hydrogen enrichment, and cellular-uptake optimisation — the Pure Premium ($1,180) is the upgrade."}},
      {"@type":"Question","name":"How often do 7-stage RO filters need servicing?","acceptedAnswer":{"@type":"Answer","text":"The 7-stage Pure Premium follows a similar service schedule to 5-stage RO systems. Pre-filters (sediment + carbon) are replaced every 6–12 months. The RO membrane is replaced every 2–3 years. Post-filters including the hydrogen, alkaline, FIR and post-carbon stages are replaced annually. Jean-Paul offers a professional service for $475 per year including all filter media and labour."}},
      {"@type":"Question","name":"Does the 7-stage system remove fluoride?","acceptedAnswer":{"@type":"Answer","text":"Yes. The RO membrane in the Pure Premium operates at 0.0001 microns and rejects up to 95% of fluoride — the same as the Pure Plus+ 5-stage system. All RO systems share this core fluoride-rejection capability, regardless of the number of enhancement stages before and after the membrane."}},
      {"@type":"Question","name":"Can a 7-stage RO system be installed in a Sydney apartment?","acceptedAnswer":{"@type":"Answer","text":"Yes. The Pure Premium installs under your kitchen sink like any other under-sink RO system — connected to your cold water supply with a drain line to the waste pipe and a dedicated filter tap through the benchtop. There is no strata approval required in most cases, and Jean-Paul has installed in apartments of every size across inner Sydney. The installation takes approximately 2 hours."}},
      {"@type":"Question","name":"What is the difference between the Pure Premium and Pure Plus+?","acceptedAnswer":{"@type":"Answer","text":"Both systems use RO membrane filtration to remove 99%+ of dissolved contaminants. The Pure Plus+ (5-stage, $840) adds alkaline remineralisation post-RO for a pH of 7.5–8.5. The Pure Premium (7-stage, $1,180) goes further with a high-alkaline magnesium stage (pH 8.5–10), a hydrogen-rich filter for antioxidant benefits, a far infrared ceramic stage, and an additional post-carbon polish. Choose the Pure Plus+ for comprehensive filtration with alkalinity. Choose the Pure Premium for the full health-enhancement experience."}}
    ]}
  ]
}'''

    stages = [
        stage_card(1, "5-Micron Sediment Pre-Filter", "Sediment, particles, silt",
            "Removes physical particulates from the feed water — sand, silt, rust and suspended solids — protecting the RO membrane and all downstream stages from clogging. Replaced every 6 months.",
            ["Sediment", "Particles", "Rust", "Membrane protection"]),
        stage_card(2, "CTO Carbon Block Pre-Filter", "Chlorine, chloramine, VOCs",
            "Removes free chlorine, chloramine and organic chemical compounds that would otherwise degrade the RO membrane. Also reduces VOCs, herbicides, pesticides and chemical taste and odour.",
            ["Chloramine", "Chlorine", "VOCs", "Membrane protection"]),
        stage_card(3, "75 GPD RO Membrane", "0.0001 micron — 99%+ TDS rejection",
            "The core of the system. Rejects up to 99% of dissolved contaminants: fluoride (up to 95%), heavy metals, nitrates, PFAS, bacteria, cysts and microplastics. The membrane lasts 2–3 years.",
            ["Fluoride", "Heavy metals", "PFAS", "Nitrates", "Bacteria"]),
        stage_card(4, "High-Alkaline Magnesium & Hydrogen-Rich Stage", "pH 8.5–10, molecular hydrogen, antioxidant",
            "The defining stage of the Pure Premium. Passes RO-pure water through magnesium media that infuses dissolved molecular hydrogen (H2) — a potent antioxidant — and raises pH to 8.5–10 with magnesium and potassium mineral enrichment.",
            ["Hydrogen H2", "Alkaline pH", "Magnesium", "Antioxidant"]),
        stage_card(5, "Far Infrared Ceramic Stage", "Cellular absorption enhancement",
            "Far infrared ceramic media emits FIR energy to restructure water molecules into smaller clusters, believed to improve cellular hydration and absorption. Adds a further dimension to the water enhancement beyond chemistry alone.",
            ["Far infrared", "Micro-clustering", "Cellular uptake"]),
        stage_card(6, "Activated Coconut Carbon Post-Filter", "Final taste polish",
            "A high-grade coconut activated carbon inline filter that removes any residual taste or odour from the storage tank, ensuring every glass is crisp and clean. Replaced annually.",
            ["Taste", "Odour", "Post-tank polish"]),
        stage_card(7, "Inline Alkaline Post-Filter", "Secondary alkaline stage — final pH stabilisation",
            "A secondary alkaline filter that stabilises and maintains the elevated pH from stage 4, ensuring consistent alkaline output from the filter tap even as the primary stages age between service intervals.",
            ["Alkaline stability", "pH maintenance", "Post-carbon"]),
    ]

    stages_html = '<div class="stages-grid">\n        ' + "\n        ".join(stages) + '\n        </div>'

    photos = [
        ("ffy-water-filter-installation-sydney-016.jpg", "Jean-Paul Barber installing water filter at Sydney home"),
        ("pure-plus-ro-installation-sydney-001.jpg", "7-stage reverse osmosis system being installed under Sydney kitchen sink"),
        ("ffy-water-filter-installation-sydney-019.jpg", "Licensed plumber completing RO system installation Sydney"),
        ("pure-plus-ro-installation-sydney-004.jpg", "RO filter stages and tank mounted under kitchen sink"),
        ("ffy-water-filter-installation-sydney-022.jpg", "Filters For You plumber finalising water filter install Sydney"),
        ("pure-plus-ro-installation-sydney-007.jpg", "Jean-Paul connecting water filter lines under sink Sydney"),
        ("ffy-water-filter-installation-sydney-020.jpg", "Water filter system installation completed and tested Sydney"),
        ("ffy-water-filter-installation-sydney-018.jpg", "Licensed plumber Jean-Paul Barber at work installing water filter Sydney"),
    ]

    faqs = [
        ("What is hydrogen-rich water and what are its benefits?",
         "Hydrogen-rich water contains dissolved molecular hydrogen (H2), a potent antioxidant that may help neutralise harmful free radicals. Research suggests potential benefits including reduced oxidative stress, anti-inflammatory properties, improved athletic recovery and enhanced cellular energy. The Pure Premium generates hydrogen-rich water via its magnesium-media stage, which reacts with pure RO water to produce dissolved H2 — raising hydrogen concentration significantly above standard tap water."),
        ("What does far infrared ceramic do in a water filter?",
         "Far infrared ceramic (FIR) media emits far infrared rays that interact with water molecules. Proponents claim this improves water absorption at the cellular level and enhances taste and softness. The FIR stage in the Pure Premium follows the hydrogen and alkaline stages, adding a further enhancement layer for those seeking the most comprehensive residential water treatment available."),
        ("What pH does the Pure Premium produce?",
         "The Pure Premium is rated to produce water at pH 8.5–10, depending on feed water conditions and filter age. This is achieved through the high-alkaline magnesium stage combined with the inline alkaline post-filter — significantly higher than the 7.5–8.5 output of the Pure Plus+."),
        ("Is a 7-stage water filter better than a 5-stage system?",
         "Not necessarily in terms of contamination removal — both achieve comparable RO-grade purity at the membrane stage. The additional stages in the 7-stage system enhance the output water beyond filtration with hydrogen enrichment, higher alkalinity and cellular-uptake optimisation. If your goal is maximum contaminant removal, the Pure Plus+ ($840) is the pragmatic choice. If you want health-focused water enhancement, the Pure Premium ($1,180) is the upgrade."),
        ("How often do 7-stage RO filters need servicing?",
         "Pre-filters (sediment + carbon) every 6–12 months. RO membrane every 2–3 years. All post-filter stages annually. Jean-Paul offers a professional service including all filter media and labour for $475 per year."),
        ("Does the 7-stage system remove fluoride?",
         "Yes. The RO membrane operates at 0.0001 microns and rejects up to 95% of fluoride — the same as the Pure Plus+ and all RO systems in the range. The number of enhancement stages doesn't affect fluoride rejection, which is handled entirely by the membrane."),
        ("Can a 7-stage RO system be installed in a Sydney apartment?",
         "Yes. The Pure Premium installs under your kitchen sink like any standard under-sink RO system. No strata approval required in most cases. Jean-Paul has installed in apartments of every size across inner Sydney. Installation takes approximately 2 hours."),
        ("What is the difference between the Pure Premium and Pure Plus+?",
         "Both use RO membrane filtration to remove 99%+ of contaminants. The Pure Plus+ ($840) adds basic alkaline remineralisation (pH 7.5–8.5). The Pure Premium ($1,180) adds a high-alkaline magnesium stage (pH 8.5–10), molecular hydrogen enrichment, far infrared ceramic, and a secondary alkaline post-filter. Choose the Pure Plus+ for filtration + mild alkalinity. Choose the Pure Premium for the full health-enhancement experience."),
    ]

    html = f'''{head_html(
        "Pure Premium 7-Stage RO Water Filter Sydney | $1,180 Installed | Filters For You",
        "Pure Premium 7-stage alkaline, hydrogen-rich reverse osmosis water filter. pH 8.5–10, molecular hydrogen, far infrared ceramic. $1,180 supply + installation. WaterMark certified. Call 0430 546 749.",
        "https://www.filtersforyou.com.au/pure-premium-water-filter-sydney.html",
        "https://filtersforyou.com.au/assets/brochure/pure-premium.jpg"
    )}
<script type="application/ld+json">
{schema}
</script>
{CSS}
</head>
<body>
{nav_html("pure-premium-water-filter-sydney.html")}
<div class="breadcrumb"><a href="/">Home</a> &rsaquo; <a href="water-filter-systems.html">Water Filter Systems</a> &rsaquo; Pure Premium</div>
{ticker_html(["$1,180 Supply + Installation", "Licensed Plumber Lic. 461511C", "pH 8.5–10 Alkaline Output", "Hydrogen-Rich Water", "WaterMark Certified", "Lifetime Workmanship Warranty"])}
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge"><span class="hero-badge-dot"></span>7-Stage Alkaline &amp; Hydrogen-Rich RO Water Filter — Sydney</div>
    <h1>Pure Premium<br><span class="sh sh-y">7-Stage RO Filter</span></h1>
    <p class="hero-sub">The ultimate under-sink water experience. Seven stages of precision filtration remove 99%+ of dissolved contaminants, then transform your water with high-alkaline mineralisation, molecular hydrogen enrichment and far infrared ceramic treatment. Supplied and installed by Jean-Paul, Sydney's licensed water filter plumber.</p>
    <div class="hero-stars"><span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span class="stars-label">5.0 Google Rating &middot; 6 verified reviews</span></div>
    {trust_chips()}
    <div class="hero-btns">
      <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Call 0430 546 749</a>
      <a href="#quote" class="btn" style="background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.4)">Get a Fixed Quote</a>
    </div>
  </div>
</section>
{trust_bar()}
<section class="sec sec-white reveal">
  <div class="container">
    <div class="product-layout">
      <div class="product-gallery">
        <div class="gallery-hero"><img src="assets/brochure/pure-premium.jpg" alt="Pure Premium 7-stage alkaline hydrogen-rich reverse osmosis water filter — GT1-26-7" width="720" height="540" loading="eager"></div>
      </div>
      <div class="product-info">
        <div class="product-model">Model GT1-26-7 &middot; 7-Stage RO + Alkaline + Hydrogen + FIR</div>
        <h1 class="product-name">Pure Premium Water Filter</h1>
        <p class="product-tagline">Seven stages of treatment deliver not just pure water, but actively enhanced water. High-alkaline pH, antioxidant molecular hydrogen, far infrared ceramic treatment — the most comprehensive under-sink filtration experience available.</p>
        <div class="product-price-block">
          <div class="price-main">$1,180</div>
          <div class="price-note">Supply + professional installation. Fixed price — no call-out fees.</div>
          <div class="price-chips">
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Chrome filter tap included</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>12L tank included</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>~$220/yr DIY</div>
          </div>
        </div>
        <ul class="product-features">
          {pf_li("7 stages — RO purity + alkaline + magnesium + hydrogen-rich + FIR")}
          {pf_li("pH 8.5–10 high-alkaline output — significantly above standard RO")}
          {pf_li("Molecular hydrogen (H2) enrichment — antioxidant, anti-inflammatory")}
          {pf_li("Far infrared ceramic stage for enhanced water structure and taste")}
          {pf_li("Removes up to 99% of TDS including fluoride, heavy metals and PFAS")}
          {pf_li("WaterMark certified — AS/NZS 3497 compliant")}
          {pf_li("12L pressurised storage tank — water on demand")}
        </ul>
        <div class="product-btns">
          <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Book Installation</a>
          <a href="#quote" class="btn btn-blue">Get a Quote</a>
        </div>
        <div class="tap-callout">
          <div class="tap-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
          <div class="tap-content">
            <h4>Tap Options</h4>
            <p>Dedicated chrome filter tap installed as standard. A <strong>3-way mixer tap upgrade</strong> combines filtered and mains water in one premium fixture — available on request.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="sec sec-light reveal">
  <div class="container">
    <div class="content-body">
      <div class="yline"></div>
      <span class="eyebrow">About The System</span>
      <h2>The Most Advanced Under-Sink Water Filter Available in Sydney</h2>
      <p>The Pure Premium starts with the same RO membrane purity as the Pure Plus+ — removing up to 99% of dissolved contaminants including fluoride, chloramine, heavy metals, PFAS and microplastics. But it doesn't stop at filtration. Four additional post-treatment stages actively transform the water into something significantly more than just clean.</p>
      <p>The high-alkaline magnesium stage infuses dissolved molecular hydrogen (H2) — a potent antioxidant with researched anti-inflammatory and cellular energy benefits — while simultaneously raising the pH to 8.5–10 with magnesium and potassium enrichment. The far infrared ceramic stage adds a further dimension, restructuring water molecules for improved cellular absorption. A secondary alkaline post-filter stabilises pH consistency over time, and an activated coconut carbon final stage ensures every glass tastes crisp and clean from the tap.</p>
      <p>The result is water that performs at two levels simultaneously: hospital-grade filtration purity at the RO membrane stage, and health-optimised enhancement at the post-treatment stage. This is the system for households that treat water as part of a wellness routine — not just a utility.</p>
      <p>Jean-Paul installs every Pure Premium personally across Sydney. Fixed price of $1,180 covers system, 12L tank, chrome filter tap, all fittings, and licensed installation. No extras.</p>
      <h2>The Benefits of Hydrogen-Rich Water</h2>
      <p>Molecular hydrogen (H2) is the smallest and most bioavailable antioxidant known. Unlike larger antioxidant molecules, H2 can penetrate cell membranes and the blood-brain barrier to neutralise reactive oxygen species (free radicals) directly at the cellular level. Research published in peer-reviewed journals suggests potential benefits including:</p>
      <ul>
        <li>Reduction in oxidative stress markers</li>
        <li>Anti-inflammatory effects (particularly relevant for athletic recovery)</li>
        <li>Improved mitochondrial function and energy metabolism</li>
        <li>Neuroprotective properties</li>
        <li>Enhanced hydration at the cellular level</li>
      </ul>
      <p>The Pure Premium generates hydrogen-rich water through its magnesium-media stage — a passive, chemical-free process that reacts with pure RO water to produce dissolved H2 naturally. No electrolysis required, no moving parts, no electricity.</p>
      <h2>Filter Stage Breakdown</h2>
      <p>Seven stages work in sequence — four stages of protection and purification, followed by three stages of active water enhancement.</p>
      {stages_html}
    </div>
  </div>
</section>
<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">System Specifications</span>
      <h2 class="sec-title sec-title-dark">Technical <span class="sh sh-b">Specifications</span></h2>
    </div>
    <div class="specs-table-wrap">
      <table class="specs-table">
        <thead><tr><th>Specification</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>System Model</td><td>GT1-26-7 (Pure Premium)</td></tr>
          <tr><td>Filtration Stages</td><td>7 (Sediment + CTO Carbon + RO Membrane + H2 Alkaline + FIR Ceramic + Post Carbon + Alkaline)</td></tr>
          <tr><td>RO Membrane</td><td>75 GPD thin-film composite (NSF/ANSI 58 tested)</td></tr>
          <tr><td>TDS Rejection</td><td>Up to 99%</td></tr>
          <tr><td>Fluoride Reduction</td><td>Up to 95%</td></tr>
          <tr><td>Output pH</td><td>8.5–10 (high-alkaline)</td></tr>
          <tr><td>Hydrogen Enrichment</td><td>Yes — dissolved H2 via magnesium media</td></tr>
          <tr><td>Far Infrared Ceramic</td><td>Yes — post-RO stage</td></tr>
          <tr><td>Storage Tank</td><td>Approximately 12L pressurised</td></tr>
          <tr><td>Pre-filter Service Interval</td><td>6–12 months</td></tr>
          <tr><td>RO Membrane Service Interval</td><td>2–3 years</td></tr>
          <tr><td>Post-filter Service Interval</td><td>12 months</td></tr>
          <tr><td>WaterMark Certification</td><td>AS/NZS 3497</td></tr>
          <tr><td>Manufacturer</td><td>High Performance Filtration (HPF)</td></tr>
          <tr><td>Annual Service (professional)</td><td>$475/yr</td></tr>
          <tr><td>Annual Service (DIY)</td><td>~$220/yr</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
{collage_section(photos, "Every Pure Premium is installed by Jean-Paul — licensed plumber, not a contractor. Sydney-wide coverage from Croydon Park.")}
{pricing_section("1,180", "475", "220", "Pure Premium",
    ["Pure Premium GT1-26-7 system (7 stages)", "~12L pressurised storage tank", "Dedicated chrome filter tap", "All fittings and connections", "Licensed installation by Jean-Paul", "Lifetime workmanship guarantee"],
    ["All pre-filters replaced (sediment + carbon)", "All post-filters replaced (H2, FIR, alkaline, carbon)", "All connections checked and pressure-tested", "System flushed and performance confirmed"],
    ["Standard pre/post filter cartridges", "No specialist tools for most stages", "RO membrane swap every 2–3 yrs via service call", "Lowest ongoing cost for confident DIYers"]
)}
{faq_section(faqs)}
{related_systems([
    ("Pure Plus+", "$840", "5-stage RO + alkaline remineralisation. Removes 99%+ of contaminants including fluoride. pH 7.5–8.5. Sydney's most popular RO system.", "pure-plus-water-filter-sydney.html"),
    ("Pure Luxe", "$1,740", "5-stage quick-change RO with built-in digital TDS monitor. Shows real-time water quality from the tap. Premium quick-change cartridges — no tools, no mess.", "pure-luxe-water-filter-sydney.html"),
    ("Pure Home", "$3,150", "Whole-house HPF-3 triple-stage system. Filters every tap, shower and appliance in the home. External/outdoor mount in stainless steel enclosure.", "pure-home-water-filter-sydney.html"),
])}
{quote_form("pure-premium-quote", "Pure Premium — 7 Stage RO ($1,180)")}
{footer_html("Pure Premium 7-Stage RO Water Filter Sydney")}
{JS_FOOTER}'''

    out = os.path.join(BASEDIR, filename)
    with open(out, 'w') as f:
        f.write(html)
    print(f"Written: {filename}")


# ============================================================
# PAGE 3: PURE COMPACT (GT1-CRO)
# ============================================================
def build_pure_compact():
    filename = "pure-compact-water-filter-sydney.html"
    schema = '''{
  "@context":"https://schema.org",
  "@graph":[
    {"@type":["Plumber","LocalBusiness"],"@id":"https://filtersforyou.com.au/#business","name":"Filters For You","telephone":"+61430546749","address":{"@type":"PostalAddress","addressLocality":"Croydon Park","addressRegion":"NSW","postalCode":"2133","addressCountry":"AU"},"areaServed":{"@type":"City","name":"Sydney"}},
    {"@type":"Product","@id":"https://filtersforyou.com.au/pure-compact-water-filter-sydney.html#product","name":"Pure Compact 3-Stage Tankless Alkaline RO Water Filter","description":"Australian-assembled 3-stage compact undersink reverse osmosis system with inline filters, 380LPD output, tankless design and alkaline remineralisation. Ideal for apartments and small spaces.","model":"GT1-CRO","brand":{"@type":"Brand","name":"Filters For You"},"image":"https://filtersforyou.com.au/assets/brochure/pure-compact.jpg","offers":{"@type":"Offer","priceCurrency":"AUD","price":"930","availability":"https://schema.org/InStock","itemCondition":"https://schema.org/NewCondition"}},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://filtersforyou.com.au/"},{"@type":"ListItem","position":2,"name":"Water Filter Systems","item":"https://filtersforyou.com.au/water-filter-systems.html"},{"@type":"ListItem","position":3,"name":"Pure Compact","item":"https://filtersforyou.com.au/pure-compact-water-filter-sydney.html"}]},
    {"@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"What is a tankless reverse osmosis system and how does it work?","acceptedAnswer":{"@type":"Answer","text":"A tankless RO system filters water on demand rather than storing pre-filtered water in a pressurised tank. Instead of slowly filling a tank overnight, the system pushes feed water through a high-output membrane in real time as you draw from the tap. The Pure Compact achieves 380 litres per day output — significantly higher than older tank-based membranes — meaning wait times are minimal and you never run out of filtered water mid-use."}},
      {"@type":"Question","name":"Is a compact RO system good for apartments in Sydney?","acceptedAnswer":{"@type":"Answer","text":"The Pure Compact is purpose-built for apartments. It uses three compact inline filters rather than the large housing units of traditional RO systems, and eliminates the bulky pressurised tank. The result is a system that requires around half the under-sink space of a standard RO installation — ideal for Sydney apartments with limited cabinetry. Jean-Paul has installed the Pure Compact in apartments across inner Sydney with no space issues."}},
      {"@type":"Question","name":"Does a compact RO system produce the same water quality as a standard system?","acceptedAnswer":{"@type":"Answer","text":"Yes — water quality is equivalent. The RO membrane in the Pure Compact operates at 0.0001 microns and achieves the same 99%+ TDS rejection and up to 95% fluoride removal as larger systems. The compact design affects footprint and tank presence, not filtration performance. The alkaline remineralisation stage is also included, delivering the same alkaline mineral-balanced output as the Pure Plus+."}},
      {"@type":"Question","name":"What is the daily output of the Pure Compact?","acceptedAnswer":{"@type":"Answer","text":"The Pure Compact is rated at 380 litres per day (LPD). In practice for a household drawing 3–8 litres per day from the filter tap, this means the system is never supply-limited. The high output is achieved through the compact inline membrane design, which operates at higher efficiency than traditional 75 GPD tank systems."}},
      {"@type":"Question","name":"Does the Pure Compact need a storage tank?","acceptedAnswer":{"@type":"Answer","text":"No. The Pure Compact is a tankless system — water is filtered on demand rather than stored. This is the key space-saving advantage: no bulky pressurised tank under the sink. Flow rate at the tap is slightly lower than mains pressure (typical of all RO systems) but the 380LPD capacity means supply is never an issue for household use."}},
      {"@type":"Question","name":"How long does a compact RO filter installation take?","acceptedAnswer":{"@type":"Answer","text":"Installation of the Pure Compact takes approximately 1.5–2 hours. Jean-Paul connects the three inline filters to your cold water supply, runs the drain line to your waste pipe, and drills a dedicated hole for the filter tap. No tank means fewer fittings and a cleaner installation overall."}},
      {"@type":"Question","name":"How often do compact RO filters need replacing?","acceptedAnswer":{"@type":"Answer","text":"The pre-filter and post alkaline filter are replaced every 12 months. The RO membrane typically lasts 2–3 years. Jean-Paul offers a professional annual service for $380 including all filters and labour, or DIY replacement is available for approximately $130 per year."}},
      {"@type":"Question","name":"Does a compact RO system remove fluoride from Sydney tap water?","acceptedAnswer":{"@type":"Answer","text":"Yes. The RO membrane in the Pure Compact removes up to 95% of fluoride — the same level as all RO systems in the range. Fluoride rejection is a function of the membrane, not the size or configuration of the housing system around it."}}
    ]}
  ]
}'''

    stages = [
        stage_card(1, "Combined Sediment + Carbon Pre-Filter", "Sediment, chlorine, chloramine, taste & odour",
            "A compact inline combination filter that performs the work of two traditional housing-based stages. Removes physical particulates (sediment, silt, rust) while also reducing chlorine, chloramine, VOCs and chemical taste and odour. Protects and extends the life of the RO membrane. Replaced every 12 months.",
            ["Sediment", "Chloramine", "Chlorine", "VOCs", "Membrane protection"]),
        stage_card(2, "High-Output RO Membrane (380 LPD)", "0.0001 micron — 99%+ TDS rejection — tankless",
            "A high-efficiency inline RO membrane rated at 380 litres per day — significantly higher output than standard 75 GPD membranes. Removes up to 99% of dissolved solids including fluoride (up to 95%), heavy metals, nitrates, PFAS, bacteria and microplastics. The tankless design means water is filtered on demand rather than stored.",
            ["Fluoride 95%", "Heavy metals", "PFAS", "Nitrates", "380 LPD", "Tankless"]),
        stage_card(3, "Alkaline Remineralisation Post-Filter", "pH 7.5–8.5, minerals added",
            "A compact inline alkaline filter that replenishes beneficial minerals (calcium, magnesium, potassium) removed by the RO process, raising the pH to 7.5–8.5 for smooth, naturally balanced water. The final stage before the filter tap. Replaced every 12 months.",
            ["Alkaline pH", "Calcium", "Magnesium", "Potassium", "Taste"]),
    ]

    stages_html = '<div class="stages-grid">\n        ' + "\n        ".join(stages) + '\n        </div>'

    photos = [
        ("ffy-water-filter-installation-sydney-016.jpg", "Jean-Paul Barber installing compact water filter in Sydney apartment"),
        ("pure-plus-ro-installation-sydney-002.jpg", "Compact RO system installed under Sydney apartment kitchen sink"),
        ("ffy-water-filter-installation-sydney-021.jpg", "Licensed plumber completing compact water filter installation Sydney"),
        ("pure-plus-ro-installation-sydney-005.jpg", "Compact inline RO filter system connection under sink Sydney"),
        ("ffy-water-filter-installation-sydney-023.jpg", "Jean-Paul installing water filter in Sydney apartment kitchen"),
        ("pure-plus-ro-installation-sydney-009.jpg", "Compact water filter system tested and completed Sydney"),
        ("ffy-water-filter-installation-sydney-019.jpg", "Filters For You plumber at work in Sydney apartment"),
        ("ffy-water-filter-installation-sydney-017.jpg", "Water filter installation completed in inner-Sydney apartment"),
    ]

    faqs = [
        ("What is a tankless reverse osmosis system and how does it work?",
         "A tankless RO system filters water on demand rather than storing pre-filtered water in a pressurised tank. The Pure Compact pushes feed water through a high-output membrane in real time as you draw from the tap — 380 litres per day capacity. No tank means no waiting for it to fill, no under-sink bulk, and no stagnant water risk."),
        ("Is a compact RO system good for apartments in Sydney?",
         "The Pure Compact is purpose-built for apartments. Compact inline filters and no storage tank means it requires around half the under-sink space of a standard RO installation. Jean-Paul has installed the Pure Compact in apartments across inner Sydney with no space issues."),
        ("Does a compact RO system produce the same water quality as a standard system?",
         "Yes — water quality is equivalent. The RO membrane operates at 0.0001 microns and achieves 99%+ TDS rejection and up to 95% fluoride removal — identical to larger systems. The compact design affects footprint and tank presence, not filtration performance. The alkaline remineralisation stage delivers the same mineral-balanced output as the Pure Plus+."),
        ("What is the daily output of the Pure Compact?",
         "The Pure Compact is rated at 380 litres per day (LPD). For a household drawing 3–8 litres from the filter tap daily, the system is never supply-limited. The high output is achieved through the compact inline membrane design, which runs at higher efficiency than traditional 75 GPD tank systems."),
        ("Does the Pure Compact need a storage tank?",
         "No. The Pure Compact is a tankless system — water is filtered on demand. This is the key space-saving advantage: no bulky pressurised tank under the sink. Flow rate at the tap is slightly lower than mains pressure but the 380LPD capacity means supply is never an issue."),
        ("How long does a compact RO filter installation take?",
         "Installation takes approximately 1.5–2 hours. Jean-Paul connects the three inline filters to your cold water supply, runs the drain line, and installs the filter tap. No tank means fewer fittings and a cleaner installation overall."),
        ("How often do compact RO filters need replacing?",
         "The pre-filter and alkaline post-filter are replaced every 12 months. The RO membrane typically lasts 2–3 years. Professional annual service is $380 including all filters and labour. DIY replacement is approximately $130 per year."),
        ("Does a compact RO system remove fluoride?",
         "Yes. The RO membrane removes up to 95% of fluoride — identical to all RO systems in the range. Fluoride rejection is a function of the membrane technology, not the size of the housing system around it."),
    ]

    html = f'''{head_html(
        "Pure Compact Undersink Water Filter Sydney | $930 Installed | Filters For You",
        "Pure Compact 3-stage tankless alkaline RO water filter. 380LPD output, space-saving design perfect for Sydney apartments. $930 supply + professional installation. WaterMark certified. Call 0430 546 749.",
        "https://www.filtersforyou.com.au/pure-compact-water-filter-sydney.html",
        "https://filtersforyou.com.au/assets/brochure/pure-compact.jpg"
    )}
<script type="application/ld+json">
{schema}
</script>
{CSS}
</head>
<body>
{nav_html("pure-compact-water-filter-sydney.html")}
<div class="breadcrumb"><a href="/">Home</a> &rsaquo; <a href="water-filter-systems.html">Water Filter Systems</a> &rsaquo; Pure Compact</div>
{ticker_html(["$930 Supply + Installation", "Licensed Plumber Lic. 461511C", "Tankless Design — No Bulk", "380 LPD Output", "WaterMark Certified", "Lifetime Workmanship Warranty"])}
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge"><span class="hero-badge-dot"></span>Compact Tankless Reverse Osmosis — Perfect for Sydney Apartments</div>
    <h1>Pure Compact<br><span class="sh sh-y">Tankless RO Filter</span></h1>
    <p class="hero-sub">All the filtration power of reverse osmosis in half the space. The Pure Compact's three-stage inline design removes fluoride, chloramine and 99%+ of dissolved contaminants — with no bulky storage tank. Purpose-built for Sydney apartments and kitchens where space is at a premium.</p>
    <div class="hero-stars"><span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span class="stars-label">5.0 Google Rating &middot; 6 verified reviews</span></div>
    {trust_chips()}
    <div class="hero-btns">
      <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Call 0430 546 749</a>
      <a href="#quote" class="btn" style="background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.4)">Get a Fixed Quote</a>
    </div>
  </div>
</section>
{trust_bar()}
<section class="sec sec-white reveal">
  <div class="container">
    <div class="product-layout">
      <div class="product-gallery">
        <div class="gallery-hero"><img src="assets/brochure/pure-compact.jpg" alt="Pure Compact 3-stage tankless alkaline RO water filter — GT1-CRO" width="720" height="540" loading="eager"></div>
      </div>
      <div class="product-info">
        <div class="product-model">Model GT1-CRO &middot; 3-Stage Compact Tankless RO</div>
        <h1 class="product-name">Pure Compact Water Filter</h1>
        <p class="product-tagline">Reverse osmosis filtration designed for real-world Sydney apartment living. Three compact inline stages, 380 litres per day output, and no storage tank — everything fits under your sink without sacrificing cabinet space.</p>
        <div class="product-price-block">
          <div class="price-main">$930</div>
          <div class="price-note">Supply + professional installation. Fixed price — no call-out fees.</div>
          <div class="price-chips">
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Chrome filter tap included</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>No tank required</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>~$130/yr DIY</div>
          </div>
        </div>
        <ul class="product-features">
          {pf_li("Tankless design — no storage tank, half the under-sink footprint")}
          {pf_li("380 LPD high-output inline membrane — never supply-limited")}
          {pf_li("Removes 99%+ TDS including fluoride, heavy metals and PFAS")}
          {pf_li("Alkaline remineralisation — pH 7.5–8.5, minerals added back")}
          {pf_li("Australian-assembled HPF system")}
          {pf_li("Ideal for Sydney apartments and compact under-sink spaces")}
          {pf_li("WaterMark certified — AS/NZS 3497 compliant")}
        </ul>
        <div class="product-btns">
          <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Book Installation</a>
          <a href="#quote" class="btn btn-blue">Get a Quote</a>
        </div>
        <div class="tap-callout">
          <div class="tap-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
          <div class="tap-content">
            <h4>Tap Options</h4>
            <p>Dedicated chrome filter tap installed as standard. A <strong>3-way mixer tap upgrade</strong> combines filtered and mains water in one fixture — available on request.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="sec sec-light reveal">
  <div class="container">
    <div class="content-body">
      <div class="yline"></div>
      <span class="eyebrow">About The System</span>
      <h2>RO Performance Without the Tank</h2>
      <p>Sydney apartments have limited under-sink space. Traditional reverse osmosis systems take up significant cabinet room — three large filter housings plus a bulky 12-litre pressurised tank. The Pure Compact solves this with a fundamentally different design: three compact inline filters (no large housings) and a high-output 380LPD membrane that operates tankless, filtering water on demand rather than storing it.</p>
      <p>The filtration performance is equivalent to any other RO system in the range. The combined pre-filter removes sediment, chlorine and chloramine to protect the membrane. The 380LPD RO membrane rejects up to 99% of dissolved contaminants — fluoride (up to 95%), heavy metals, nitrates, PFAS, bacteria and microplastics. The alkaline remineralisation post-filter replenishes calcium, magnesium and potassium, raising the pH to 7.5–8.5 for balanced, naturally flavoursome water.</p>
      <p>What's different is the form factor. No tank under the sink means more storage space, and the inline filter design takes up a fraction of the footprint of housing-based RO systems. Jean-Paul has installed the Pure Compact in Sydney apartments where a standard RO simply wouldn't fit — from tight terrace house kitchens to compact flat cabinetry in inner-city suburbs.</p>
      <h2>Filter Stage Breakdown</h2>
      {stages_html}
    </div>
  </div>
</section>
<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">System Specifications</span>
      <h2 class="sec-title sec-title-dark">Technical <span class="sh sh-b">Specifications</span></h2>
    </div>
    <div class="specs-table-wrap">
      <table class="specs-table">
        <thead><tr><th>Specification</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>System Model</td><td>GT1-CRO (Pure Compact)</td></tr>
          <tr><td>Filtration Stages</td><td>3 (Combined Pre-Filter + RO Membrane + Alkaline Post-Filter)</td></tr>
          <tr><td>System Design</td><td>Compact inline — no housing units, no storage tank</td></tr>
          <tr><td>RO Membrane Output</td><td>380 LPD (approximately 100 GPD)</td></tr>
          <tr><td>TDS Rejection</td><td>Up to 99%</td></tr>
          <tr><td>Fluoride Reduction</td><td>Up to 95%</td></tr>
          <tr><td>Output pH</td><td>7.5–8.5 (alkaline remineralisation)</td></tr>
          <tr><td>Storage Tank</td><td>None — tankless on-demand filtration</td></tr>
          <tr><td>Filter Service Interval</td><td>12 months (pre + post filters)</td></tr>
          <tr><td>RO Membrane Service Interval</td><td>2–3 years</td></tr>
          <tr><td>Origin</td><td>Australian-assembled HPF system</td></tr>
          <tr><td>WaterMark Certification</td><td>AS/NZS 3497</td></tr>
          <tr><td>Ideal For</td><td>Apartments, compact kitchens, limited under-sink space</td></tr>
          <tr><td>Annual Service (professional)</td><td>$380/yr</td></tr>
          <tr><td>Annual Service (DIY)</td><td>~$130/yr</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
{collage_section(photos, "Every Pure Compact is installed by Jean-Paul — licensed plumber, not a contractor. Apartment installations a specialty.")}
{pricing_section("930", "380", "130", "Pure Compact",
    ["Pure Compact GT1-CRO system (3 stages)", "No storage tank — compact under-sink install", "Dedicated chrome filter tap", "All fittings and connections", "Licensed installation by Jean-Paul", "Lifetime workmanship guarantee"],
    ["Pre-filter replaced (combined sediment + carbon)", "Alkaline post-filter replaced", "All connections checked and pressure-tested", "System flushed and performance confirmed"],
    ["Inline pre-filter and alkaline post-filter swap", "Simple cartridge replacement, no tools needed", "RO membrane swap every 2–3 yrs via service call", "Best option for budget-conscious apartment owners"]
)}
{faq_section(faqs)}
{related_systems([
    ("Pure Plus+", "$840", "5-stage RO with 12L tank + alkaline remineralisation. The full-size RO option for houses with more under-sink space.", "pure-plus-water-filter-sydney.html"),
    ("Pure Advanced", "$1,280", "5-stage quick-change RO. Twist-off cartridges — no tools, no mess for servicing. Great for those who prefer hassle-free maintenance.", "pure-advanced-water-filter-sydney.html"),
    ("Pure Essential", "$550", "Twin-stage carbon filter. No RO — just chloramine, chlorine and VOC removal at full mains pressure. Entry-level option.", "pure-essential-water-filter-sydney.html"),
])}
{quote_form("pure-compact-quote", "Pure Compact — RO Compact ($930)")}
{footer_html("Pure Compact Tankless RO Water Filter Sydney")}
{JS_FOOTER}'''

    out = os.path.join(BASEDIR, filename)
    with open(out, 'w') as f:
        f.write(html)
    print(f"Written: {filename}")


# ============================================================
# PAGE 4: PURE ADVANCED (H1-EQ5AN)
# ============================================================
def build_pure_advanced():
    filename = "pure-advanced-water-filter-sydney.html"
    schema = '''{
  "@context":"https://schema.org",
  "@graph":[
    {"@type":["Plumber","LocalBusiness"],"@id":"https://filtersforyou.com.au/#business","name":"Filters For You","telephone":"+61430546749","address":{"@type":"PostalAddress","addressLocality":"Croydon Park","addressRegion":"NSW","postalCode":"2133","addressCountry":"AU"},"areaServed":{"@type":"City","name":"Sydney"}},
    {"@type":"Product","@id":"https://filtersforyou.com.au/pure-advanced-water-filter-sydney.html#product","name":"Pure Advanced 5-Stage Quick-Change Alkaline RO Water Filter","description":"5-stage quick-change undersink reverse osmosis system with twist-fit cartridges. No tools required for servicing. WaterMark certified.","model":"H1-EQ5AN","brand":{"@type":"Brand","name":"Filters For You"},"image":"https://filtersforyou.com.au/assets/brochure/pure-advanced.jpg","offers":{"@type":"Offer","priceCurrency":"AUD","price":"1280","availability":"https://schema.org/InStock","itemCondition":"https://schema.org/NewCondition"}},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://filtersforyou.com.au/"},{"@type":"ListItem","position":2,"name":"Water Filter Systems","item":"https://filtersforyou.com.au/water-filter-systems.html"},{"@type":"ListItem","position":3,"name":"Pure Advanced","item":"https://filtersforyou.com.au/pure-advanced-water-filter-sydney.html"}]},
    {"@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"What is a quick-change water filter cartridge?","acceptedAnswer":{"@type":"Answer","text":"A quick-change cartridge uses a twist-fit or push-fit bayonet mechanism rather than traditional threaded housings. To replace the filter, you simply twist the old cartridge a quarter-turn and pull it out, then insert the new one and twist to lock. The entire process takes under 5 minutes per cartridge with no tools, no water spillage and no need to shut off the water supply at a separate valve. The Pure Advanced uses this system for all five filter stages."}},
      {"@type":"Question","name":"Is a quick-change water filter system more expensive to service?","acceptedAnswer":{"@type":"Answer","text":"Quick-change cartridges typically cost slightly more per unit than equivalent standard cartridges, but the savings in servicing labour and convenience generally offset this. The Pure Advanced DIY service runs approximately $220 per year — comparable to other 5-stage RO systems. The primary advantage is the servicing experience: no tools, no mess, and no need to call a plumber for routine filter changes."}},
      {"@type":"Question","name":"Does a quick-change RO system filter fluoride?","acceptedAnswer":{"@type":"Answer","text":"Yes. The RO membrane in the Pure Advanced operates at 0.0001 microns and rejects up to 95% of fluoride — identical to all other RO systems in the Filters For You range. Quick-change refers to the cartridge replacement mechanism, not the filtration technology. The membrane itself is the same thin-film composite RO technology."}},
      {"@type":"Question","name":"How long does a quick-change filter cartridge last?","acceptedAnswer":{"@type":"Answer","text":"Pre-filter and post-filter quick-change cartridges are typically rated for 6–12 months. The RO membrane lasts 2–3 years. Because replacement is so simple with the twist-fit system, many households are more consistent with their service schedule — which means better long-term filtration performance than systems where servicing gets deferred because it feels like a hassle."}},
      {"@type":"Question","name":"Can I replace quick-change water filter cartridges myself?","acceptedAnswer":{"@type":"Answer","text":"Yes — this is the defining advantage of the Pure Advanced. The twist-fit cartridge mechanism requires no tools, no plumbing knowledge, and no water spillage. Turn off the tap, twist out the old cartridge, twist in the new one. Done. The entire service takes 10–15 minutes for all five stages. No plumber required for routine annual servicing."}},
      {"@type":"Question","name":"What is the price difference between quick-change and standard RO systems?","acceptedAnswer":{"@type":"Answer","text":"The Pure Advanced (H1-EQ5AN, quick-change) is $1,280 installed. The Pure Plus+ (GT1-26-5, standard cartridges) is $840 installed. The $440 premium buys you the quick-change mechanism and its servicing convenience. If routine filter changes are something you'd gladly handle yourself but want to make as easy as possible, the Pure Advanced is the practical choice."}},
      {"@type":"Question","name":"Does the Pure Advanced include alkaline remineralisation?","acceptedAnswer":{"@type":"Answer","text":"Yes. Like the Pure Plus+, the Pure Advanced includes a 5th-stage alkaline remineralisation cartridge that adds calcium, magnesium and potassium back after the RO membrane, raising the pH to 7.5–8.5 for balanced, naturally flavoursome water. The quick-change alkaline cartridge is replaced annually as part of the standard service schedule."}},
      {"@type":"Question","name":"Is the Pure Advanced WaterMark certified?","acceptedAnswer":{"@type":"Answer","text":"Yes. The H1-EQ5AN is WaterMark certified to AS/NZS 3497 — Certificate No. 022780. WaterMark certification is mandatory for all plumbing products installed in Australian homes and ensures the system meets Australian standards for safety and performance in contact with drinking water."}}
    ]}
  ]
}'''

    stages = [
        stage_card(1, "Sediment Quick-Change Cartridge", "Particles, silt, rust",
            "Quick-change twist-fit 1-micron sediment cartridge. Removes physical particles from feed water to protect the RO membrane. Replaced by a simple quarter-turn — no tools, no housings to unscrew.",
            ["Sediment", "Silt", "Rust", "Quick-change"]),
        stage_card(2, "Carbon Block Quick-Change Cartridge", "Chlorine, chloramine, taste & odour",
            "Quick-change carbon block pre-filter that removes chlorine, chloramine, VOCs and chemical taste and odour before the feed water reaches the membrane. Protects membrane life. Quarter-turn replacement.",
            ["Chloramine", "Chlorine", "VOCs", "Quick-change"]),
        stage_card(3, "RO Membrane", "0.0001 micron — 99%+ TDS rejection",
            "Thin-film composite RO membrane that rejects up to 99% of dissolved solids including fluoride (up to 95%), heavy metals, nitrates, PFAS and microplastics. Lasts 2–3 years. The membrane itself is a standard exchange, typically handled at an annual service visit.",
            ["Fluoride 95%", "Heavy metals", "PFAS", "Nitrates", "Bacteria"]),
        stage_card(4, "Post Carbon Quick-Change Cartridge", "Final taste polish",
            "Inline coconut carbon post-filter in a quick-change cartridge. Removes any residual taste or odour from the storage tank before water reaches the tap. Replaced annually with a simple twist.",
            ["Taste", "Odour", "Post-tank", "Quick-change"]),
        stage_card(5, "Alkaline Remineralisation Quick-Change Cartridge", "pH 7.5–8.5, minerals added",
            "Quick-change alkaline remineralisation cartridge that replenishes calcium, magnesium and potassium after the RO process, raising pH to 7.5–8.5 for smooth, balanced water. Annual replacement — twist out, twist in.",
            ["Alkaline pH", "Calcium", "Magnesium", "Quick-change"]),
    ]

    stages_html = '<div class="stages-grid">\n        ' + "\n        ".join(stages) + '\n        </div>'

    photos = [
        ("ffy-water-filter-installation-sydney-016.jpg", "Jean-Paul installing quick-change RO system at Sydney home"),
        ("pure-plus-ro-installation-sydney-001.jpg", "5-stage quick-change RO filter installed under Sydney kitchen sink"),
        ("ffy-water-filter-installation-sydney-020.jpg", "Licensed plumber completing water filter installation in Sydney"),
        ("pure-plus-ro-installation-sydney-004.jpg", "Quick-change filter cartridges and system under kitchen sink"),
        ("ffy-water-filter-installation-sydney-022.jpg", "Filters For You plumber completing RO install at Sydney property"),
        ("pure-plus-ro-installation-sydney-007.jpg", "RO system water lines and connections under sink Sydney"),
        ("ffy-water-filter-installation-sydney-018.jpg", "Jean-Paul Barber at work installing water filter system Sydney"),
        ("ffy-water-filter-installation-sydney-024.jpg", "Completed water filter installation at Sydney home — tested and running"),
    ]

    faqs = [
        ("What is a quick-change water filter cartridge?",
         "A quick-change cartridge uses a twist-fit bayonet mechanism. To replace the filter, twist the old cartridge a quarter-turn and pull it out, then insert the new one and twist to lock. The entire process takes under 5 minutes per cartridge with no tools, no water spillage, and no need to shut off the water supply separately."),
        ("Is a quick-change system more expensive to service?",
         "Quick-change cartridges cost slightly more per unit than standard cartridges, but the savings in servicing convenience generally offset this. DIY service runs approximately $220 per year — comparable to other 5-stage RO systems. The primary benefit is the experience: no tools, no mess, no plumber for routine changes."),
        ("Does a quick-change RO system filter fluoride?",
         "Yes. The RO membrane operates at 0.0001 microns and rejects up to 95% of fluoride — identical to all other RO systems in the range. Quick-change refers to the cartridge mechanism, not the filtration technology. The membrane is the same thin-film composite RO technology."),
        ("How long does a quick-change filter cartridge last?",
         "Pre-filter and post-filter cartridges are typically rated for 6–12 months. The RO membrane lasts 2–3 years. Because replacement is so simple, many households are more consistent with their service schedule — better long-term performance than systems where servicing gets deferred because it feels like a hassle."),
        ("Can I replace quick-change cartridges myself?",
         "Yes — this is the defining advantage of the Pure Advanced. Twist out the old cartridge, twist in the new one. No tools, no water spillage, no plumbing knowledge required. The entire service takes 10–15 minutes for all five stages."),
        ("What is the price difference between quick-change and standard RO systems?",
         "The Pure Advanced (quick-change) is $1,280 installed. The Pure Plus+ (standard cartridges) is $840 installed. The $440 premium buys the quick-change mechanism and its servicing convenience. If you want to handle routine filter changes yourself as easily as possible, the Pure Advanced is the practical choice."),
        ("Does the Pure Advanced include alkaline remineralisation?",
         "Yes. Stage 5 is a quick-change alkaline remineralisation cartridge that adds calcium, magnesium and potassium back after the RO process, raising pH to 7.5–8.5 for smooth, balanced water. Annual replacement — twist out, twist in."),
        ("Is the Pure Advanced WaterMark certified?",
         "Yes. The H1-EQ5AN is WaterMark certified to AS/NZS 3497 — Certificate No. 022780. All Filters For You systems are WaterMark certified for legal installation by a licensed plumber in Australian homes."),
    ]

    html = f'''{head_html(
        "Pure Advanced Quick-Change RO Water Filter Sydney | $1,280 Installed | Filters For You",
        "Pure Advanced 5-stage quick-change alkaline RO water filter. Twist-fit cartridges — no tools, no mess. $1,280 supply + installation. WaterMark certified. Licensed plumber. Call 0430 546 749.",
        "https://www.filtersforyou.com.au/pure-advanced-water-filter-sydney.html",
        "https://filtersforyou.com.au/assets/brochure/pure-advanced.jpg"
    )}
<script type="application/ld+json">
{schema}
</script>
{CSS}
</head>
<body>
{nav_html("pure-advanced-water-filter-sydney.html")}
<div class="breadcrumb"><a href="/">Home</a> &rsaquo; <a href="water-filter-systems.html">Water Filter Systems</a> &rsaquo; Pure Advanced</div>
{ticker_html(["$1,280 Supply + Installation", "Licensed Plumber Lic. 461511C", "Twist-Fit Cartridges — No Tools", "5-Stage RO + Alkaline", "WaterMark Certified", "Lifetime Workmanship Warranty"])}
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge"><span class="hero-badge-dot"></span>5-Stage Quick-Change Reverse Osmosis — Sydney</div>
    <h1>Pure Advanced<br><span class="sh sh-y">Quick-Change RO Filter</span></h1>
    <p class="hero-sub">The smart upgrade for households who want RO purity with effortless servicing. All five cartridges use a twist-fit quick-change system — no tools, no mess, no plumber for routine filter swaps. Just twist out the old, twist in the new.</p>
    <div class="hero-stars"><span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span class="stars-label">5.0 Google Rating &middot; 6 verified reviews</span></div>
    {trust_chips()}
    <div class="hero-btns">
      <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Call 0430 546 749</a>
      <a href="#quote" class="btn" style="background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.4)">Get a Fixed Quote</a>
    </div>
  </div>
</section>
{trust_bar()}
<section class="sec sec-white reveal">
  <div class="container">
    <div class="product-layout">
      <div class="product-gallery">
        <div class="gallery-hero"><img src="assets/brochure/pure-advanced.jpg" alt="Pure Advanced 5-stage quick-change alkaline RO water filter — H1-EQ5AN" width="720" height="540" loading="eager"></div>
      </div>
      <div class="product-info">
        <div class="product-model">Model H1-EQ5AN &middot; 5-Stage Quick-Change RO + Alkaline</div>
        <h1 class="product-name">Pure Advanced Water Filter</h1>
        <p class="product-tagline">Five-stage reverse osmosis filtration with alkaline remineralisation — and a twist-fit cartridge system that makes annual servicing a 10-minute DIY job. No tools, no mess, no tradesperson for routine filter changes.</p>
        <div class="product-price-block">
          <div class="price-main">$1,280</div>
          <div class="price-note">Supply + professional installation. Fixed price — no call-out fees.</div>
          <div class="price-chips">
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Chrome filter tap included</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>12L tank included</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>~$220/yr DIY</div>
          </div>
        </div>
        <ul class="product-features">
          {pf_li("Quick-change twist-fit cartridges — no tools for routine servicing")}
          {pf_li("5-stage RO filtration — 99%+ TDS rejection, fluoride up to 95%")}
          {pf_li("Removes chloramine, heavy metals, PFAS and microplastics")}
          {pf_li("Alkaline remineralisation — pH 7.5–8.5, minerals added back")}
          {pf_li("WaterMark certified — Certificate No. 022780, AS/NZS 3497")}
          {pf_li("12L storage tank — water on demand")}
          {pf_li("Entire annual service completed in under 15 minutes by homeowner")}
        </ul>
        <div class="product-btns">
          <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Book Installation</a>
          <a href="#quote" class="btn btn-blue">Get a Quote</a>
        </div>
        <div class="tap-callout">
          <div class="tap-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
          <div class="tap-content">
            <h4>Tap Options</h4>
            <p>Dedicated chrome filter tap installed as standard. A <strong>3-way mixer tap upgrade</strong> combines filtered and mains water in one fixture — available on request.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="sec sec-light reveal">
  <div class="container">
    <div class="content-body">
      <div class="yline"></div>
      <span class="eyebrow">About The System</span>
      <h2>RO Purity. Servicing Made Simple.</h2>
      <p>The Pure Advanced delivers the same RO filtration performance as the Pure Plus+ — 99%+ TDS rejection, fluoride reduction up to 95%, and alkaline remineralisation to pH 7.5–8.5. The difference is in the servicing experience.</p>
      <p>Traditional RO systems use large threaded housing units for each filter stage. Replacing cartridges means shutting off the supply valve, unscrewing each housing (often under a sink with limited access), catching the water that spills, swapping the cartridge, cleaning the housing, screwing it back on, and pressure-testing all connections. It's a job most homeowners defer — or call a plumber to handle.</p>
      <p>The Pure Advanced eliminates all of that. Every cartridge uses a quarter-turn twist-fit mechanism. Turn off the tap, twist out the old cartridge, twist in the new one. No housing to open, no water to catch, no seals to worry about. The entire service — all five cartridges — takes under 15 minutes. It's the RO system for households who value self-sufficiency without complexity.</p>
      <h2>Filter Stage Breakdown</h2>
      {stages_html}
    </div>
  </div>
</section>
<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">System Specifications</span>
      <h2 class="sec-title sec-title-dark">Technical <span class="sh sh-b">Specifications</span></h2>
    </div>
    <div class="specs-table-wrap">
      <table class="specs-table">
        <thead><tr><th>Specification</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>System Model</td><td>H1-EQ5AN (Pure Advanced)</td></tr>
          <tr><td>Filtration Stages</td><td>5 (Quick-Change Sediment + Carbon + RO Membrane + Post Carbon + Alkaline)</td></tr>
          <tr><td>Cartridge System</td><td>Quick-change twist-fit — no tools required</td></tr>
          <tr><td>RO Membrane</td><td>Thin-film composite, 0.0001 micron</td></tr>
          <tr><td>TDS Rejection</td><td>Up to 99%</td></tr>
          <tr><td>Fluoride Reduction</td><td>Up to 95%</td></tr>
          <tr><td>Output pH</td><td>7.5–8.5 (alkaline remineralisation)</td></tr>
          <tr><td>Storage Tank</td><td>Approximately 12L pressurised</td></tr>
          <tr><td>WaterMark Certification</td><td>AS/NZS 3497 — Certificate No. 022780</td></tr>
          <tr><td>Filter Service Interval</td><td>6–12 months (pre-filters); 12 months (post-filters)</td></tr>
          <tr><td>RO Membrane Service Interval</td><td>2–3 years</td></tr>
          <tr><td>Manufacturer</td><td>High Performance Filtration (HPF)</td></tr>
          <tr><td>Annual Service (professional)</td><td>$475/yr</td></tr>
          <tr><td>Annual Service (DIY)</td><td>~$220/yr</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
{collage_section(photos, "Every Pure Advanced is installed by Jean-Paul — licensed plumber, not a contractor. Sydney-wide coverage.")}
{pricing_section("1,280", "475", "220", "Pure Advanced",
    ["Pure Advanced H1-EQ5AN system (5 stages)", "~12L pressurised storage tank", "Dedicated chrome filter tap", "All fittings and connections", "Licensed installation by Jean-Paul", "Lifetime workmanship guarantee"],
    ["All 5 quick-change cartridges replaced", "All connections checked and pressure-tested", "System flushed and performance confirmed", "RO membrane inspected or replaced if due"],
    ["Twist-fit cartridge swap — no tools, no mess", "Complete 5-stage service in under 15 minutes", "RO membrane swap every 2–3 yrs via service call", "Lowest hassle DIY option in the RO range"]
)}
{faq_section(faqs)}
{related_systems([
    ("Pure Plus+", "$840", "5-stage RO + alkaline with standard cartridges. Same filtration performance at a lower price point if you are comfortable with traditional housing-based servicing.", "pure-plus-water-filter-sydney.html"),
    ("Pure Luxe", "$1,740", "5-stage quick-change RO + built-in digital TDS monitor. Shows real-time water quality from the tap. The premium quick-change upgrade.", "pure-luxe-water-filter-sydney.html"),
    ("Pure Compact", "$930", "3-stage tankless RO for apartments. Compact inline design, no storage tank, half the under-sink footprint.", "pure-compact-water-filter-sydney.html"),
])}
{quote_form("pure-advanced-quote", "Pure Advanced — Quick-Change RO ($1,280)")}
{footer_html("Pure Advanced Quick-Change RO Water Filter Sydney")}
{JS_FOOTER}'''

    out = os.path.join(BASEDIR, filename)
    with open(out, 'w') as f:
        f.write(html)
    print(f"Written: {filename}")


# ============================================================
# PAGE 5: PURE LUXE (H1-302B)
# ============================================================
def build_pure_luxe():
    filename = "pure-luxe-water-filter-sydney.html"
    schema = '''{
  "@context":"https://schema.org",
  "@graph":[
    {"@type":["Plumber","LocalBusiness"],"@id":"https://filtersforyou.com.au/#business","name":"Filters For You","telephone":"+61430546749","address":{"@type":"PostalAddress","addressLocality":"Croydon Park","addressRegion":"NSW","postalCode":"2133","addressCountry":"AU"},"areaServed":{"@type":"City","name":"Sydney"}},
    {"@type":"Product","@id":"https://filtersforyou.com.au/pure-luxe-water-filter-sydney.html#product","name":"Pure Luxe 5-Stage Quick-Change RO with Smart TDS Monitor","description":"5-stage quick-change undersink RO system with built-in digital TDS display showing real-time water quality. WaterMark certified.","model":"H1-302B","brand":{"@type":"Brand","name":"Filters For You"},"image":"https://filtersforyou.com.au/assets/brochure/pure-luxe.jpg","offers":{"@type":"Offer","priceCurrency":"AUD","price":"1740","availability":"https://schema.org/InStock","itemCondition":"https://schema.org/NewCondition"}},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://filtersforyou.com.au/"},{"@type":"ListItem","position":2,"name":"Water Filter Systems","item":"https://filtersforyou.com.au/water-filter-systems.html"},{"@type":"ListItem","position":3,"name":"Pure Luxe","item":"https://filtersforyou.com.au/pure-luxe-water-filter-sydney.html"}]},
    {"@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"What is a TDS monitor on a water filter and what does it tell you?","acceptedAnswer":{"@type":"Answer","text":"TDS stands for Total Dissolved Solids — the concentration of all dissolved minerals, salts and compounds in your water, measured in parts per million (ppm). A digital TDS monitor on a water filter tap displays the current TDS reading in real time, so you can see exactly how pure your filtered water is at any given moment. Sydney mains water typically reads 80–180 ppm TDS. Post-RO water from the Pure Luxe typically reads under 20 ppm. If the reading rises significantly, it indicates the RO membrane needs servicing."}},
      {"@type":"Question","name":"How does the digital TDS display on the Pure Luxe work?","acceptedAnswer":{"@type":"Answer","text":"The Pure Luxe includes a digital TDS display built into the filter tap. Two TDS probes measure the water quality continuously — one reading the filtered output, one monitoring the feed water — and display the results on a small LED screen on the tap body. There are no apps or Wi-Fi required. The display is always visible at the tap, giving instant confirmation that your filter is performing correctly every time you use it."}},
      {"@type":"Question","name":"What TDS reading should I expect from a reverse osmosis system?","acceptedAnswer":{"@type":"Answer","text":"Sydney mains water (the feed water) typically measures 80–180 ppm TDS. After reverse osmosis filtration, the output should read under 30 ppm — often under 15 ppm on a well-maintained system. The Pure Luxe's digital display lets you see this reading in real time. If the reading creeps above 30–40 ppm consistently, it is a clear signal that the RO membrane is due for replacement."}},
      {"@type":"Question","name":"Is the Pure Luxe the same as the Pure Advanced but with a monitor?","acceptedAnswer":{"@type":"Answer","text":"Essentially, yes. Both use a 5-stage quick-change RO system with alkaline remineralisation and WaterMark certification. The Pure Luxe adds the built-in digital TDS monitoring display on the tap, which provides real-time water quality data. The Pure Advanced is $1,280 installed; the Pure Luxe is $1,740 installed. The $460 difference buys the TDS monitoring capability and the premium tap design that houses it."}},
      {"@type":"Question","name":"Does the TDS monitor require batteries or maintenance?","acceptedAnswer":{"@type":"Answer","text":"The TDS display in the Pure Luxe is powered by a small battery typically lasting 1–2 years. Replacement is straightforward — a standard CR2032 or similar coin cell battery depending on the model revision. The probes themselves do not require cleaning under normal conditions."}},
      {"@type":"Question","name":"Does the Pure Luxe remove fluoride from Sydney tap water?","acceptedAnswer":{"@type":"Answer","text":"Yes. The RO membrane operates at 0.0001 microns and removes up to 95% of fluoride — identical to all other RO systems in the range. The digital TDS display does not measure fluoride specifically (fluoride is part of overall TDS), but a low TDS reading is a strong indicator of effective fluoride reduction."}},
      {"@type":"Question","name":"Can I service the Pure Luxe myself?","acceptedAnswer":{"@type":"Answer","text":"Yes. Like the Pure Advanced, the Pure Luxe uses the quick-change twist-fit cartridge system for all five filter stages. Cartridge replacement requires no tools — twist out the old, twist in the new. Annual DIY service runs approximately $220. The RO membrane typically needs replacing every 2–3 years and is best handled by Jean-Paul at a service visit."}},
      {"@type":"Question","name":"What makes the Pure Luxe worth the premium over the Pure Advanced?","acceptedAnswer":{"@type":"Answer","text":"The Pure Luxe adds built-in real-time TDS monitoring — the ability to see your water quality on demand, at the tap, every time you use it. For households who want certainty that their RO system is performing correctly between service visits, this is invaluable. It removes guesswork and provides the most transparent water quality feedback of any system in the range. If you do not need this visibility, the Pure Advanced at $1,280 delivers the same quick-change RO filtration at a lower price."}},
    ]}
  ]
}'''

    stages = [
        stage_card(1, "Sediment Quick-Change Cartridge", "Particles, silt, rust — membrane protection",
            "Twist-fit 1-micron sediment cartridge. Removes physical particles before the RO membrane. Quarter-turn replacement — no tools, no housing to open.",
            ["Sediment", "Silt", "Quick-change"]),
        stage_card(2, "Carbon Block Quick-Change Cartridge", "Chlorine, chloramine, taste & odour",
            "Quick-change carbon block pre-filter that removes chlorine, chloramine and VOCs to protect the RO membrane. Quarter-turn replacement.",
            ["Chloramine", "Chlorine", "VOCs", "Quick-change"]),
        stage_card(3, "RO Membrane", "0.0001 micron — 99%+ TDS rejection",
            "Thin-film composite RO membrane rejecting up to 99% of dissolved solids. The TDS monitor reads the output of this stage continuously. Membrane lasts 2–3 years.",
            ["Fluoride 95%", "Heavy metals", "PFAS", "TDS monitored"]),
        stage_card(4, "Post Carbon Quick-Change Cartridge", "Final taste polish",
            "Quick-change coconut carbon post-filter. Removes residual taste and odour from the storage tank before water reaches the smart tap. Annual quick-change replacement.",
            ["Taste", "Odour", "Post-tank", "Quick-change"]),
        stage_card(5, "Alkaline Remineralisation Quick-Change", "pH 7.5–8.5, minerals added",
            "Quick-change alkaline cartridge replenishing calcium, magnesium and potassium after RO, raising pH to 7.5–8.5. Annual twist-fit replacement.",
            ["Alkaline pH", "Calcium", "Magnesium", "Quick-change"]),
    ]

    stages_html = '<div class="stages-grid">\n        ' + "\n        ".join(stages) + '\n        </div>'

    photos = [
        ("ffy-water-filter-installation-sydney-016.jpg", "Jean-Paul installing Pure Luxe smart RO system at Sydney home"),
        ("pure-plus-ro-installation-sydney-001.jpg", "5-stage quick-change RO system with TDS monitor installed under Sydney sink"),
        ("ffy-water-filter-installation-sydney-021.jpg", "Licensed plumber completing smart water filter installation Sydney"),
        ("pure-plus-ro-installation-sydney-005.jpg", "RO system filter and monitor connection under Sydney kitchen sink"),
        ("ffy-water-filter-installation-sydney-023.jpg", "Filters For You licensed plumber at work installing water filter"),
        ("pure-plus-ro-installation-sydney-010.jpg", "Smart RO water filter installation completed Sydney home"),
        ("ffy-water-filter-installation-sydney-017.jpg", "Jean-Paul Barber installing premium water filter system Sydney"),
        ("ffy-water-filter-installation-sydney-022.jpg", "Smart water filter system installed and tested Sydney home"),
    ]

    faqs = [
        ("What is a TDS monitor on a water filter and what does it tell you?",
         "TDS stands for Total Dissolved Solids — the concentration of all dissolved minerals, salts and compounds in your water, measured in ppm. The digital TDS display shows your filtered water quality in real time. Sydney mains water typically reads 80–180 ppm. Post-RO water from the Pure Luxe typically reads under 20 ppm. A rising reading indicates the membrane is due for service."),
        ("How does the digital TDS display work?",
         "The Pure Luxe includes a digital TDS display built into the filter tap. Two TDS probes measure water quality continuously — one reading filtered output, one monitoring feed water — displaying results on an LED screen on the tap body. No apps, no Wi-Fi. Instant confirmation that your filter is performing correctly every time you use it."),
        ("What TDS reading should I expect from a reverse osmosis system?",
         "Sydney mains water typically measures 80–180 ppm TDS. After RO filtration, the output should read under 30 ppm — often under 15 ppm on a well-maintained system. If the reading creeps above 30–40 ppm consistently, it's a clear signal the RO membrane needs replacing."),
        ("Is the Pure Luxe the same as the Pure Advanced but with a monitor?",
         "Essentially yes. Both use a 5-stage quick-change RO system with alkaline remineralisation and WaterMark certification. The Pure Luxe adds the built-in digital TDS monitoring display on the tap. The Pure Advanced is $1,280 installed; the Pure Luxe is $1,740 installed. The $460 difference buys the real-time water quality monitoring capability."),
        ("Does the TDS monitor require maintenance?",
         "The TDS display is powered by a small battery lasting 1–2 years. Replacement is straightforward. The probes do not require cleaning under normal use conditions."),
        ("Does the Pure Luxe remove fluoride?",
         "Yes. The RO membrane operates at 0.0001 microns and removes up to 95% of fluoride — identical to all RO systems in the range. A low TDS reading from the digital display is a strong indicator of effective fluoride reduction."),
        ("Can I service the Pure Luxe myself?",
         "Yes. All five cartridges use the quick-change twist-fit system. Annual DIY service runs approximately $220. The RO membrane needs replacing every 2–3 years and is best handled by Jean-Paul at a service visit."),
        ("What makes the Pure Luxe worth the premium over the Pure Advanced?",
         "Built-in real-time TDS monitoring — the ability to see your water quality on demand, at the tap, every time you use it. For households who want certainty that their system is performing correctly between service visits, this is invaluable. If you do not need this visibility, the Pure Advanced at $1,280 delivers the same quick-change RO filtration at a lower price."),
    ]

    html = f'''{head_html(
        "Pure Luxe Smart RO Water Filter Sydney | $1,740 Installed | Filters For You",
        "Pure Luxe 5-stage quick-change RO with built-in digital TDS water quality monitor. See real-time water purity at the tap. $1,740 supply + installation. WaterMark certified. Call 0430 546 749.",
        "https://www.filtersforyou.com.au/pure-luxe-water-filter-sydney.html",
        "https://filtersforyou.com.au/assets/brochure/pure-luxe.jpg"
    )}
<script type="application/ld+json">
{schema}
</script>
{CSS}
</head>
<body>
{nav_html("pure-luxe-water-filter-sydney.html")}
<div class="breadcrumb"><a href="/">Home</a> &rsaquo; <a href="water-filter-systems.html">Water Filter Systems</a> &rsaquo; Pure Luxe</div>
{ticker_html(["$1,740 Supply + Installation", "Licensed Plumber Lic. 461511C", "Real-Time TDS Water Quality Display", "Quick-Change Cartridges", "WaterMark Certified", "Lifetime Workmanship Warranty"])}
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge"><span class="hero-badge-dot"></span>Smart Monitoring RO Water Filter — Sydney</div>
    <h1>Pure Luxe<br><span class="sh sh-y">Smart RO Filter</span></h1>
    <p class="hero-sub">The premium under-sink RO experience. Five-stage quick-change filtration with built-in digital TDS monitoring — see your water purity in real time, directly on the tap. No guessing. No apps. Just instant water quality data on demand.</p>
    <div class="hero-stars"><span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span class="stars-label">5.0 Google Rating &middot; 6 verified reviews</span></div>
    {trust_chips()}
    <div class="hero-btns">
      <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Call 0430 546 749</a>
      <a href="#quote" class="btn" style="background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.4)">Get a Fixed Quote</a>
    </div>
  </div>
</section>
{trust_bar()}
<section class="sec sec-white reveal">
  <div class="container">
    <div class="product-layout">
      <div class="product-gallery">
        <div class="gallery-hero"><img src="assets/brochure/pure-luxe.jpg" alt="Pure Luxe 5-stage quick-change RO with digital TDS monitor — H1-302B" width="720" height="540" loading="eager"></div>
      </div>
      <div class="product-info">
        <div class="product-model">Model H1-302B &middot; 5-Stage Quick-Change RO + Digital TDS Monitor</div>
        <h1 class="product-name">Pure Luxe Water Filter</h1>
        <p class="product-tagline">Everything in the Pure Advanced — plus a built-in digital TDS display on the tap that shows your water quality in real time. Know your water is performing. Always.</p>
        <div class="product-price-block">
          <div class="price-main">$1,740</div>
          <div class="price-note">Supply + professional installation. Fixed price — no call-out fees.</div>
          <div class="price-chips">
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Digital TDS monitor tap included</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>12L tank included</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>~$220/yr DIY</div>
          </div>
        </div>
        <ul class="product-features">
          {pf_li("Built-in digital TDS display — real-time water quality on the tap")}
          {pf_li("5-stage quick-change RO — twist-fit cartridges, no tools needed")}
          {pf_li("99%+ TDS rejection, fluoride up to 95%, heavy metals and PFAS removed")}
          {pf_li("Alkaline remineralisation — pH 7.5–8.5, minerals added back")}
          {pf_li("WaterMark certified — AS/NZS 3497 compliant")}
          {pf_li("See when your membrane needs replacing — no guessing")}
          {pf_li("12L storage tank — water available on demand")}
        </ul>
        <div class="product-btns">
          <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Book Installation</a>
          <a href="#quote" class="btn btn-blue">Get a Quote</a>
        </div>
        <div class="tap-callout">
          <div class="tap-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
          <div class="tap-content">
            <h4>Smart Monitor Tap</h4>
            <p>The Pure Luxe comes with a premium <strong>digital TDS monitor tap</strong> — showing your water's TDS reading in ppm on an LED display built into the tap body. No separate monitor unit. No apps. Always visible at the point of use.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="sec sec-light reveal">
  <div class="container">
    <div class="content-body">
      <div class="yline"></div>
      <span class="eyebrow">About The System</span>
      <h2>Know Your Water Quality. At the Tap.</h2>
      <p>Reverse osmosis is the most comprehensive residential water filtration method available — but it works invisibly. You turn the tap, draw filtered water, and trust that the system is performing. With the Pure Luxe, you don't have to trust blindly. The built-in digital TDS display shows you exactly how your filtered water is performing — in real time, at the tap, every single time you use it.</p>
      <p>Sydney mains water typically reads 80–180 ppm TDS. A well-maintained RO system should deliver under 20 ppm. The Pure Luxe monitors both feed water and filtered output continuously, displaying the results on an LED screen built into the premium tap body. When the TDS reading starts creeping up, you know the membrane is due for service — before your water quality actually degrades.</p>
      <p>On top of the monitoring capability, the Pure Luxe uses the same quick-change twist-fit cartridge system as the Pure Advanced — no tools required for annual servicing. All five cartridges are accessible under the sink and replaced with a simple quarter-turn. The RO membrane is the only stage that typically requires a service visit (every 2–3 years).</p>
      <p>Jean-Paul installs every Pure Luxe personally. Fixed price of $1,740 includes the system, 12L tank, digital TDS monitor tap, all fittings, and licensed installation.</p>
      <h2>Filter Stage Breakdown</h2>
      {stages_html}
    </div>
  </div>
</section>
<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">System Specifications</span>
      <h2 class="sec-title sec-title-dark">Technical <span class="sh sh-b">Specifications</span></h2>
    </div>
    <div class="specs-table-wrap">
      <table class="specs-table">
        <thead><tr><th>Specification</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>System Model</td><td>H1-302B (Pure Luxe)</td></tr>
          <tr><td>Filtration Stages</td><td>5 (Quick-Change Sediment + Carbon + RO Membrane + Post Carbon + Alkaline)</td></tr>
          <tr><td>Cartridge System</td><td>Quick-change twist-fit — no tools required</td></tr>
          <tr><td>Water Quality Monitor</td><td>Built-in digital TDS display on tap — real-time ppm readout</td></tr>
          <tr><td>RO Membrane</td><td>Thin-film composite, 0.0001 micron</td></tr>
          <tr><td>TDS Rejection</td><td>Up to 99%</td></tr>
          <tr><td>Fluoride Reduction</td><td>Up to 95%</td></tr>
          <tr><td>Output pH</td><td>7.5–8.5 (alkaline remineralisation)</td></tr>
          <tr><td>Storage Tank</td><td>Approximately 12L pressurised</td></tr>
          <tr><td>WaterMark Certification</td><td>AS/NZS 3497</td></tr>
          <tr><td>Manufacturer</td><td>High Performance Filtration (HPF)</td></tr>
          <tr><td>Annual Service (professional)</td><td>$475/yr</td></tr>
          <tr><td>Annual Service (DIY)</td><td>~$220/yr</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
{collage_section(photos, "Every Pure Luxe is installed by Jean-Paul — licensed plumber, not a contractor. Sydney-wide coverage from Croydon Park.")}
{pricing_section("1,740", "475", "220", "Pure Luxe",
    ["Pure Luxe H1-302B system (5 stages)", "Digital TDS monitor tap (LED display)", "~12L pressurised storage tank", "All fittings and connections", "Licensed installation by Jean-Paul", "Lifetime workmanship guarantee"],
    ["All 5 quick-change cartridges replaced", "TDS monitor calibration checked", "All connections pressure-tested", "System flushed and performance confirmed"],
    ["Twist-fit cartridge swap — no tools, no mess", "Annual service in under 15 minutes", "TDS display shows when membrane is due", "RO membrane swap every 2–3 yrs via service call"]
)}
{faq_section(faqs)}
{related_systems([
    ("Pure Advanced", "$1,280", "5-stage quick-change RO + alkaline — same filtration without the TDS monitor. The practical quick-change choice at a lower price.", "pure-advanced-water-filter-sydney.html"),
    ("Pure Premium", "$1,180", "7-stage RO + alkaline + hydrogen-rich + far infrared ceramic. The health-focused upgrade with high-alkaline pH 8.5–10.", "pure-premium-water-filter-sydney.html"),
    ("Pure Home", "$3,150", "Whole-house HPF-3 triple-stage system. Filters every tap, shower and appliance in the home.", "pure-home-water-filter-sydney.html"),
])}
{quote_form("pure-luxe-quote", "Pure Luxe — Smart Monitoring RO ($1,740)")}
{footer_html("Pure Luxe Smart RO Water Filter Sydney")}
{JS_FOOTER}'''

    out = os.path.join(BASEDIR, filename)
    with open(out, 'w') as f:
        f.write(html)
    print(f"Written: {filename}")


# ============================================================
# PAGE 6: PURE HOME (HPF-3)
# ============================================================
def build_pure_home():
    filename = "pure-home-water-filter-sydney.html"
    schema = '''{
  "@context":"https://schema.org",
  "@graph":[
    {"@type":["Plumber","LocalBusiness"],"@id":"https://filtersforyou.com.au/#business","name":"Filters For You","telephone":"+61430546749","address":{"@type":"PostalAddress","addressLocality":"Croydon Park","addressRegion":"NSW","postalCode":"2133","addressCountry":"AU"},"areaServed":{"@type":"City","name":"Sydney"}},
    {"@type":"Product","@id":"https://filtersforyou.com.au/pure-home-water-filter-sydney.html#product","name":"Pure Home HPF-3 Whole House Water Filter System","description":"Triple whole-house 3-stage water filtration system in stainless steel enclosure. Outdoor/external mount. Filters every tap, shower and appliance in the home. Sydney supply and installation by licensed plumber.","model":"HPF-3","brand":{"@type":"Brand","name":"Filters For You"},"image":"https://filtersforyou.com.au/assets/brochure/pure-home.jpg","offers":{"@type":"Offer","priceCurrency":"AUD","price":"3150","availability":"https://schema.org/InStock","itemCondition":"https://schema.org/NewCondition"}},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://filtersforyou.com.au/"},{"@type":"ListItem","position":2,"name":"Water Filter Systems","item":"https://filtersforyou.com.au/water-filter-systems.html"},{"@type":"ListItem","position":3,"name":"Pure Home","item":"https://filtersforyou.com.au/pure-home-water-filter-sydney.html"}]},
    {"@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"What is a whole house water filter system and how is it different to an under-sink filter?","acceptedAnswer":{"@type":"Answer","text":"A whole house water filter is installed on the main water supply line where it enters the property — before the water reaches any tap, appliance, shower or garden outlet. This means every outlet in the home delivers filtered water: kitchen tap, bathroom, shower, laundry, dishwasher, and hot water system. An under-sink filter only treats water at a single tap. Whole house filtration is the solution for households who want protection at every point of use — particularly relevant for chloramine exposure in showers and for protecting hot water systems and appliances from sediment and scale."}},
      {"@type":"Question","name":"Where is the Pure Home whole house filter installed?","acceptedAnswer":{"@type":"Answer","text":"The HPF-3 is an outdoor-rated whole house system designed for external wall mount in a stainless steel enclosure. It is installed on the main cold water supply line as it enters the property — typically on an external wall near the water meter or just before the plumbing enters the building. Jean-Paul assesses the best installation point during the quote visit. The stainless steel housing protects all filter components from weather and UV exposure."}},
      {"@type":"Question","name":"Does a whole house filter remove chloramine from shower water?","acceptedAnswer":{"@type":"Answer","text":"Yes. Chloramine exposure through shower steam inhalation and skin absorption is a concern for some households — and standard shower filters struggle to address it effectively. The Pure Home's carbon block stage is specifically selected to target chloramine (using catalytic or high-grade activated carbon) at the point of entry, so water reaching every shower in the home has already had chloramine reduced. This is one of the key advantages of whole house filtration over point-of-use systems."}},
      {"@type":"Question","name":"How long does a whole house water filter installation take?","acceptedAnswer":{"@type":"Answer","text":"A whole house filter installation typically takes 2–3 hours. Jean-Paul connects the HPF-3 to your main supply line (usually requires a short section of pipe and isolation valves), mounts the stainless steel enclosure on an external wall, and tests the system under pressure before leaving. The process may vary depending on the location of your main supply line and existing plumbing configuration."}},
      {"@type":"Question","name":"Does a whole house filter require council or strata approval?","acceptedAnswer":{"@type":"Answer","text":"In most cases, installing a whole house filter on a standalone residential property in NSW does not require council approval — it is treated as a standard plumbing connection to the mains supply line. For strata properties, body corporate approval may be required if the installation affects common property plumbing. Jean-Paul can advise on your specific situation during the quote visit."}},
      {"@type":"Question","name":"How often does the whole house filter need servicing?","acceptedAnswer":{"@type":"Answer","text":"The three filter cartridges in the HPF-3 are typically replaced every 6–12 months depending on water quality and usage volume. Jean-Paul offers a professional annual service for $550 including all three cartridges and labour. DIY replacement is available for approximately $380 per year — the large-format housings are standard 20 x 4.5 inch units with a filter housing wrench."}},
      {"@type":"Question","name":"Does a whole house filter remove fluoride?","acceptedAnswer":{"@type":"Answer","text":"Whole house carbon filtration does not remove fluoride — fluoride is a dissolved ion that passes through carbon media. The HPF-3 is designed to remove sediment, chlorine, chloramine, VOCs, and chemical taste and odour at the whole-house level. If fluoride removal is also required (e.g., for drinking water), an additional under-sink RO system in the kitchen is the combined solution — whole house carbon for all-outlet protection plus kitchen RO for drinking water purity."}},
      {"@type":"Question","name":"What is included in the Pure Home $3,150 installation price?","acceptedAnswer":{"@type":"Answer","text":"The $3,150 fixed price covers the HPF-3 stainless steel whole house filter system (including all three filter cartridges), all pipe fittings, isolation valves, licensed installation by Jean-Paul on your main supply line, and connection testing. Concrete drilling or specialist wall mounting for some property types may incur a small additional charge — Jean-Paul will advise at the quote stage if applicable."}}
    ]}
  ]
}'''

    stages = [
        stage_card(1, "5-Micron Sediment Filter", "Particles, silt, rust, suspended solids",
            "The first stage captures physical particulates from your mains supply — sand, silt, rust, scale and suspended solids. Protects the downstream carbon stages and your home's appliances, hot water system and tapware from sediment damage. Standard 20x4.5\" housing, replaced every 6–12 months.",
            ["Sediment", "Silt", "Rust", "Scale", "Appliance protection"]),
        stage_card(2, "Carbon Block Filter", "Chlorine, chloramine, VOCs, chemical taste & odour",
            "The core treatment stage. A high-grade activated carbon block (or catalytic carbon for chloramine) removes chlorine, chloramine, VOCs, herbicides, pesticides, and chemical taste and odour from all water entering the home. This is the stage that makes every shower, tap and appliance outlet run on chloramine-reduced water. Replaced every 6–12 months.",
            ["Chloramine", "Chlorine", "VOCs", "Whole-home treatment"]),
        stage_card(3, "Fine Carbon Block or Ceramic Filter", "Final polish — fine particles and residual chemicals",
            "The third stage provides a finer post-treatment pass — typically a 1-micron carbon block or ceramic filter that catches any fine particles and residual chemical compounds that passed through the first two stages. Final water quality check before distribution through the home. Replaced every 12 months.",
            ["Fine particles", "Residual chemicals", "Post-polish", "Final quality check"]),
    ]

    stages_html = '<div class="stages-grid">\n        ' + "\n        ".join(stages) + '\n        </div>'

    photos = [
        ("jp-hero.jpg", "Jean-Paul Barber licensed plumber with Pure Home whole house water filter system"),
        ("IMG_7470.jpg", "HPF-3 whole house water filter installed on external brick wall Sydney"),
        ("IMG_7472.jpg", "Pure Home stainless steel whole house filter system mounted externally"),
        ("IMG_7486.jpg", "Whole house water filtration system pipe connections and installation Sydney"),
        ("IMG_7509.jpg", "HPF-3 triple whole house water filter system external installation Sydney"),
        ("install-04.jpg", "Jean-Paul completing whole house filter system installation at Sydney property"),
        ("install-08.jpg", "Stainless steel whole house water filter installed and tested Sydney"),
        ("pure-plus-ro-installation-sydney-012.jpg", "Licensed plumber Jean-Paul Barber at work on whole house water filtration"),
    ]

    faqs = [
        ("What is a whole house water filter and how is it different to an under-sink filter?",
         "A whole house filter is installed on the main supply line where water enters the property — filtering every tap, shower, laundry, dishwasher and hot water system. An under-sink filter only treats water at one tap. Whole house filtration protects every outlet including showers (important for chloramine inhalation), appliances, and the hot water system."),
        ("Where is the Pure Home installed?",
         "The HPF-3 is designed for external wall mount in its stainless steel weatherproof enclosure. It is installed on the main cold water supply line as it enters the property — typically on an external wall near the water meter. Jean-Paul assesses the best installation point at quote."),
        ("Does a whole house filter remove chloramine from shower water?",
         "Yes. The carbon block stage in the HPF-3 targets chloramine at the point of entry — so water reaching every shower in the home has already had chloramine reduced. This is one of the key advantages of whole house filtration: protection at every outlet, not just the kitchen tap."),
        ("How long does a whole house water filter installation take?",
         "Installation typically takes 2–3 hours. Jean-Paul connects the HPF-3 to your main supply line, mounts the stainless steel enclosure on an external wall, and pressure-tests before leaving. Duration varies by property plumbing configuration."),
        ("Does a whole house filter require council or strata approval?",
         "For standalone residential properties in NSW, no council approval is typically required. For strata properties, body corporate approval may be needed if the installation affects common property plumbing. Jean-Paul advises at quote stage."),
        ("How often does the whole house filter need servicing?",
         "Filter cartridges are replaced every 6–12 months depending on water quality and usage. Professional annual service is $550 including all three cartridges and labour. DIY replacement is approximately $380 per year using standard 20x4.5\" housings and a filter wrench."),
        ("Does a whole house filter remove fluoride?",
         "Carbon filtration does not remove fluoride — fluoride passes through carbon media. The HPF-3 targets sediment, chlorine, chloramine and VOCs. If fluoride removal is required for drinking water, an additional under-sink RO system in the kitchen provides the combined solution: whole house carbon protection + kitchen RO purity."),
        ("What is included in the $3,150 installation price?",
         "The $3,150 fixed price covers the HPF-3 stainless steel whole house filter system (including all three cartridges), all pipe fittings, isolation valves, and licensed installation by Jean-Paul on your main supply line. Specialist wall mounting for unusual property types may incur a small additional charge — Jean-Paul advises at quote stage."),
    ]

    html = f'''{head_html(
        "Pure Home Whole House Water Filter Sydney | $3,150 Installed | Filters For You",
        "Pure Home HPF-3 triple whole house water filter. Stainless steel enclosure, external mount. Filters every tap, shower and appliance. $3,150 supply + installation. Licensed plumber. Call 0430 546 749.",
        "https://www.filtersforyou.com.au/pure-home-water-filter-sydney.html",
        "https://filtersforyou.com.au/assets/brochure/pure-home.jpg"
    )}
<script type="application/ld+json">
{schema}
</script>
{CSS}
</head>
<body>
{nav_html("pure-home-water-filter-sydney.html")}
<div class="breadcrumb"><a href="/">Home</a> &rsaquo; <a href="water-filter-systems.html">Water Filter Systems</a> &rsaquo; Pure Home</div>
{ticker_html(["$3,150 Supply + Installation", "Licensed Plumber Lic. 461511C", "Every Tap, Shower & Appliance Filtered", "Stainless Steel Enclosure", "WaterMark Certified", "Lifetime Workmanship Warranty"])}
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge"><span class="hero-badge-dot"></span>Whole House Water Filtration — Sydney</div>
    <h1>Pure Home<br><span class="sh sh-y">Whole House Filter</span></h1>
    <p class="hero-sub">The complete home water solution. The HPF-3 installs on your main water supply line and filters every tap, shower, laundry, dishwasher and hot water system in the home. Three stages of filtration in a weatherproof stainless steel enclosure — supplied and installed by Jean-Paul, Sydney's licensed water filter plumber.</p>
    <div class="hero-stars"><span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span class="stars-label">5.0 Google Rating &middot; 6 verified reviews</span></div>
    {trust_chips()}
    <div class="hero-btns">
      <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Call 0430 546 749</a>
      <a href="#quote" class="btn" style="background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.4)">Get a Fixed Quote</a>
    </div>
  </div>
</section>
{trust_bar()}
<section class="sec sec-white reveal">
  <div class="container">
    <div class="product-layout">
      <div class="product-gallery">
        <div class="gallery-hero" id="mainGallery">
          <img src="assets/jp%20working/IMG_7470.jpg" alt="Pure Home HPF-3 whole house water filter installed on external brick wall Sydney" width="720" height="540" loading="eager" id="mainGalleryImg">
        </div>
        <div class="gallery-thumbs" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
          <div class="gallery-thumb" style="border-radius:10px;overflow:hidden;cursor:pointer;transition:transform .2s"><img src="assets/brochure/pure-home.jpg" alt="Pure Home HPF-3 whole house water filter system brochure" loading="lazy" style="width:100%;aspect-ratio:1;object-fit:cover"></div>
          <div class="gallery-thumb" style="border-radius:10px;overflow:hidden;cursor:pointer;transition:transform .2s"><img src="assets/jp%20working/IMG_7472.jpg" alt="HPF-3 whole house filter stainless steel enclosure installed externally Sydney" loading="lazy" style="width:100%;aspect-ratio:1;object-fit:cover"></div>
          <div class="gallery-thumb" style="border-radius:10px;overflow:hidden;cursor:pointer;transition:transform .2s"><img src="assets/jp%20working/IMG_7486.jpg" alt="Whole house water filter pipe connections and installation" loading="lazy" style="width:100%;aspect-ratio:1;object-fit:cover"></div>
          <div class="gallery-thumb" style="border-radius:10px;overflow:hidden;cursor:pointer;transition:transform .2s"><img src="assets/jp%20working/install-04.jpg" alt="Jean-Paul completing whole house water filter installation Sydney" loading="lazy" style="width:100%;aspect-ratio:1;object-fit:cover"></div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-model">Model HPF-3 &middot; Triple Whole House 3-Stage Filtration</div>
        <h1 class="product-name">Pure Home Water Filter</h1>
        <p class="product-tagline">The only system in the range that filters your entire home — not just one tap. From every shower to the washing machine, dishwasher and hot water system. Total whole-house protection from sediment, chlorine and chloramine.</p>
        <div class="product-price-block">
          <div class="price-main">$3,150</div>
          <div class="price-note">Supply + professional installation. Fixed price — no call-out fees.</div>
          <div class="price-chips">
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Stainless steel enclosure</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Outdoor-rated installation</div>
            <div class="price-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>~$380/yr DIY service</div>
          </div>
        </div>
        <ul class="product-features">
          {pf_li("Filters every tap, shower, laundry, dishwasher and hot water system")}
          {pf_li("3-stage: sediment + carbon block + fine carbon/ceramic final stage")}
          {pf_li("Removes chloramine, chlorine, VOCs and sediment at the whole-house level")}
          {pf_li("Stainless steel weatherproof enclosure — outdoor wall mount")}
          {pf_li("Installed on main supply line — upstream of all outlets")}
          {pf_li("Chloramine removed at entry — cleaner shower steam and laundry water")}
          {pf_li("Protects hot water system and appliances from sediment and scale")}
        </ul>
        <div class="product-btns">
          <a href="tel:0430546749" class="btn btn-yellow">{PHONE_SVG}Book Installation</a>
          <a href="#quote" class="btn btn-blue">Get a Quote</a>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="sec sec-light reveal">
  <div class="container">
    <div class="content-body">
      <div class="yline"></div>
      <span class="eyebrow">About The System</span>
      <h2>Filter Every Outlet in Your Home</h2>
      <p>Under-sink and bench-top filters treat water at a single point. The Pure Home takes a different approach entirely — installing on your main water supply line so that every outlet in the property receives filtered water. Every kitchen tap. Every bathroom tap. Every shower. The washing machine. The dishwasher. The hot water system. All filtered before the water enters any pipe in the home.</p>
      <p>This matters for several reasons. Chloramine — Sydney's primary water disinfectant — enters the body not just through drinking but through inhalation of shower steam and skin absorption. A kitchen under-sink filter addresses the drinking water, but the shower remains untreated. The Pure Home removes this asymmetry: the same chloramine-reduced water that comes out of your filter tap also comes out of your showerhead.</p>
      <p>The HPF-3 uses a triple filter housing in a weatherproof stainless steel enclosure rated for outdoor installation. It connects to the main supply line — typically on an external wall near the water meter — and requires no power. Jean-Paul assesses the most appropriate installation point at the quote stage and handles all pipe connections, isolation valves and pressure testing. The fixed installation price of $3,150 covers everything.</p>
      <p>For drinking water requiring fluoride removal, the Pure Home is often paired with a kitchen under-sink RO system (Pure Plus+, $840) — giving both whole-house chloramine/sediment protection and point-of-use RO purity for drinking water.</p>
      <h2>Filter Stage Breakdown</h2>
      {stages_html}
    </div>
  </div>
</section>
<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">System Specifications</span>
      <h2 class="sec-title sec-title-dark">Technical <span class="sh sh-b">Specifications</span></h2>
    </div>
    <div class="specs-table-wrap">
      <table class="specs-table">
        <thead><tr><th>Specification</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>System Model</td><td>HPF-3 (Pure Home)</td></tr>
          <tr><td>Filtration Stages</td><td>3 (Sediment + Carbon Block + Fine Carbon/Ceramic)</td></tr>
          <tr><td>Installation Point</td><td>Main supply line — upstream of all outlets</td></tr>
          <tr><td>Enclosure</td><td>Stainless steel — weatherproof, outdoor-rated</td></tr>
          <tr><td>Housing Size</td><td>20 x 4.5 inch (standard industry size)</td></tr>
          <tr><td>Filters Included</td><td>3 (Sediment + Carbon Block + Fine Carbon/Ceramic)</td></tr>
          <tr><td>Chloramine Removal</td><td>Yes — catalytic/activated carbon stage</td></tr>
          <tr><td>Fluoride Removal</td><td>No — combine with under-sink RO for fluoride reduction</td></tr>
          <tr><td>Suitable For</td><td>Houses, townhouses, strata (where approved)</td></tr>
          <tr><td>Filter Service Interval</td><td>6–12 months (sediment); 12 months (carbon stages)</td></tr>
          <tr><td>Manufacturer</td><td>High Performance Filtration (HPF)</td></tr>
          <tr><td>Annual Service (professional)</td><td>$550/yr</td></tr>
          <tr><td>Annual Service (DIY)</td><td>~$380/yr</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
<section class="sec sec-light reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">Installation Photos</span>
      <h2 class="sec-title sec-title-dark">Installed by <span class="sh sh-y">Jean-Paul</span></h2>
      <p class="sec-body sec-body-c">Every Pure Home is installed by Jean-Paul Barber — licensed plumber, not a contractor. Whole-house installs across greater Sydney.</p>
    </div>
    <div class="jp-collage">
      <img src="assets/jp%20working/jp-hero.jpg" alt="Jean-Paul Barber licensed plumber and Filters For You founder Sydney" loading="lazy">
      <img src="assets/jp%20working/IMG_7470.jpg" alt="HPF-3 whole house water filter system installed on external wall Sydney" loading="lazy">
      <img src="assets/jp%20working/IMG_7472.jpg" alt="Pure Home stainless steel whole house filter mounted on Sydney property wall" loading="lazy">
      <img src="assets/jp%20working/IMG_7486.jpg" alt="Whole house water filter pipe work and connections at Sydney home" loading="lazy">
      <img src="assets/jp%20working/IMG_7509.jpg" alt="HPF-3 triple whole house water filter system external installation" loading="lazy">
      <img src="assets/jp%20working/install-04.jpg" alt="Jean-Paul completing whole house water filter installation at Sydney property" loading="lazy">
      <img src="assets/jp%20working/install-08.jpg" alt="Stainless steel whole house water filter tested and running at Sydney home" loading="lazy">
      <img src="assets/jp%20working/ffy-water-filter-installation-sydney-016.jpg" alt="Jean-Paul Barber at work on residential water filtration system Sydney" loading="lazy">
    </div>
    <p class="jp-installer-trust">Every Pure Home system is installed personally by Jean-Paul Barber — licensed plumber Lic. 461511C. Clean pipe work, proper isolation valves, and a full system walkthrough before he leaves.</p>
  </div>
</section>
{pricing_section("3,150", "550", "380", "Pure Home",
    ["HPF-3 stainless steel whole house system", "All three filter cartridges", "All pipe fittings and isolation valves", "External wall mounting and connections", "Licensed installation by Jean-Paul", "Lifetime workmanship guarantee"],
    ["All 3 cartridges replaced (sediment + 2x carbon)", "All fittings checked and pressure-tested", "System flushed and flow rate confirmed", "Recommended for maximum performance"],
    ["Standard 20x4.5\" filter housings — industry standard", "Filter wrench required (included with system)", "Straightforward DIY for confident homeowners", "Professional service recommended every 12 months"]
)}
{faq_section(faqs)}
{related_systems([
    ("Pure Plus+", "$840", "5-stage under-sink RO. Perfect complement to the Pure Home — adds fluoride removal and complete purification for drinking water in the kitchen.", "pure-plus-water-filter-sydney.html"),
    ("Pure Essential", "$550", "Twin-stage under-sink carbon filter for chloramine and chlorine removal at the kitchen tap. Entry-level point-of-use option.", "pure-essential-water-filter-sydney.html"),
    ("Pure Premium", "$1,180", "7-stage RO + alkaline + hydrogen-rich. The ultimate under-sink filtration upgrade to pair with whole house protection.", "pure-premium-water-filter-sydney.html"),
])}
{quote_form("pure-home-quote", "Pure Home — Whole House ($3,150)")}
{footer_html("Pure Home Whole House Water Filter Sydney")}
<script>
document.querySelectorAll('.faq-q').forEach(btn=>{{
  btn.addEventListener('click',()=>{{
    const item=btn.closest('.faq-item');
    const open=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!open)item.classList.add('open');
  }});
}});
const obs=new IntersectionObserver(entries=>{{entries.forEach(e=>{{if(e.isIntersecting)e.target.classList.add('visible')}});}},{{threshold:0.07}});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
// Gallery click-to-swap
document.querySelectorAll('.gallery-thumb').forEach(thumb=>{{
  thumb.addEventListener('click',()=>{{
    const mainImg=document.getElementById('mainGalleryImg');
    const thumbImg=thumb.querySelector('img');
    if(mainImg&&thumbImg){{const tmp=mainImg.src;mainImg.src=thumbImg.src;mainImg.alt=thumbImg.alt;thumbImg.src=tmp;}}
  }});
}});
</script>
<script id="dropdown-nav-js">
(function(){{
  var ham=document.getElementById('navHamburger');
  var mob=document.getElementById('mobileNav');
  var cls=document.getElementById('mobileNavClose');
  function openMob(){{if(!mob)return;mob.classList.add('open');if(ham)ham.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';}}
  function closeMob(){{if(!mob)return;mob.classList.remove('open');if(ham)ham.setAttribute('aria-expanded','false');document.body.style.overflow='';}}
  if(ham)ham.addEventListener('click',openMob);
  if(cls)cls.addEventListener('click',closeMob);
  if(mob){{mob.querySelectorAll('a').forEach(function(a){{a.addEventListener('click',closeMob);}});mob.querySelectorAll('.mobile-section-btn').forEach(function(btn){{btn.addEventListener('click',function(){{btn.closest('.mobile-section').classList.toggle('open');}});}});}}
  document.addEventListener('keydown',function(e){{if(e.key==='Escape')closeMob();}});
}})();
</script>
</body>
</html>'''

    out = os.path.join(BASEDIR, filename)
    with open(out, 'w') as f:
        f.write(html)
    print(f"Written: {filename}")


if __name__ == "__main__":
    build_pure_premium()
    build_pure_compact()
    build_pure_advanced()
    build_pure_luxe()
    build_pure_home()
    print("All 5 pages generated successfully!")
