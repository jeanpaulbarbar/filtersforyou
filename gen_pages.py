#!/usr/bin/env python3
"""
FFY Page Generator — Session 7
Generates 6 region hub pages and 2 calculator pages.
Uses the new nav/footer from update_site.py.
"""

import os
from update_site import NEW_NAV, NEW_MOBILE_NAV, NEW_FOOTER_CSS, NEW_FOOTER_HTML

WEBSITE_DIR = os.path.dirname(os.path.abspath(__file__))

# ─── Shared CSS block (same as all existing pages) ───────────────────────────
HEAD_CSS = '''<style>
:root{--blue:#0B61F4;--blue-dark:#0C4BB9;--yellow:#FFD900;--white:#FAFAFA;--dark:#324158;--muted:#5a6a7e;--light:#eef2f9;--footer-bg:#1e2d40}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Sora',sans-serif;font-size:16px;line-height:1.65;color:var(--dark);background:var(--white);-webkit-font-smoothing:antialiased}
html,body{overflow-x:hidden}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit}
.sh{font-family:'Shantell Sans',cursive;font-style:italic;font-weight:700;font-size:1.08em;display:inline}
.sh-y{color:var(--yellow)}.sh-b{color:var(--blue)}
.btn{display:inline-flex;align-items:center;gap:9px;font-family:'Sora',sans-serif;font-weight:700;font-size:17px;padding:13px 26px;border-radius:8px;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s;text-decoration:none;line-height:1}
.btn:hover{transform:translateY(-2px)}
.btn-yellow{background:var(--yellow);color:var(--dark);box-shadow:0 4px 20px rgba(255,217,0,.35)}
.btn-yellow:hover{background:#ffe633}
.btn-blue{background:var(--blue);color:#fff;box-shadow:0 4px 20px rgba(11,97,244,.3)}
.btn-blue:hover{background:var(--blue-dark)}
.nav{background:var(--white);border-bottom:1px solid rgba(50,65,88,.1);position:sticky;top:0;z-index:1000;box-shadow:0 2px 14px rgba(11,97,244,.07)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:0 32px;max-width:1280px;margin:0 auto;height:68px;gap:24px}
.nav-logo img{height:40px;width:auto}
.nav-links{display:flex;align-items:center;gap:24px;list-style:none}
.nav-links a{font-size:16px;font-weight:600;color:var(--dark);transition:color .2s}
.nav-links a:hover{color:var(--blue)}
.nav-cta{display:inline-flex;align-items:center;gap:8px;background:var(--blue);color:#fff;font-weight:700;font-size:16px;padding:10px 20px;border-radius:8px;transition:background .2s,transform .2s;text-decoration:none;white-space:nowrap}
.nav-cta:hover{background:var(--blue-dark);transform:translateY(-1px)}
.nav-cta svg{flex-shrink:0}
.online-dot-wrap{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#22c55e;white-space:nowrap}
.dot{width:8px;height:8px;background:#22c55e;border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.breadcrumb{background:var(--light);padding:12px 32px;font-size:14px;color:var(--muted)}
.breadcrumb a{color:var(--blue);font-weight:500}
.breadcrumb a:hover{text-decoration:underline}
.ticker{background:var(--yellow);color:var(--dark);font-size:14px;font-weight:700;padding:10px 0;overflow:hidden;white-space:nowrap}
.ticker-track{display:inline-flex;animation:tick 30s linear infinite}
.ticker-item{padding:0 28px;display:inline-flex;align-items:center;gap:8px}
.ticker-item+.ticker-item::before{content:'';width:4px;height:4px;background:var(--dark);border-radius:50%;opacity:.4;margin-right:20px;flex-shrink:0}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.hero{background:linear-gradient(135deg,#041450 0%,#082D94 55%,#0b61f4 100%);padding:70px 32px 60px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-60px;right:-60px;width:420px;height:420px;background:rgba(255,217,0,.05);border-radius:50%;pointer-events:none}
.hero-inner{max-width:800px;margin:0 auto;position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);padding:7px 18px;border-radius:100px;font-size:14px;font-weight:600;color:#fff;margin-bottom:20px}
.hero-badge-dot{width:7px;height:7px;background:var(--yellow);border-radius:50%;display:inline-block;flex-shrink:0}
.hero h1{font-size:clamp(32px,5vw,56px);font-weight:800;color:#fff;line-height:1.1;margin-bottom:18px;letter-spacing:-.025em}
.hero-sub{font-size:18px;color:rgba(255,255,255,.82);margin-bottom:26px;max-width:600px;margin-left:auto;margin-right:auto;line-height:1.65}
.hero-stars{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:26px}
.stars{color:var(--yellow);font-size:18px;letter-spacing:2px}
.stars-label{font-size:15px;color:rgba(255,255,255,.75);font-weight:500}
.hero-trust{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:30px}
.trust-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);color:#fff;font-size:13px;font-weight:600;padding:7px 14px;border-radius:6px}
.trust-chip svg{flex-shrink:0;opacity:.85}
.hero-btns{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.sec{padding:72px 32px}
.sec-light{background:var(--light)}
.sec-white{background:#fff}
.container{max-width:1100px;margin:0 auto}
.sec-head{text-align:center;margin-bottom:48px}
.eyebrow{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);display:block;margin-bottom:8px}
.yline{width:36px;height:3px;background:var(--yellow);border-radius:2px;margin-bottom:14px}
.yline-c{margin:0 auto 14px}
.sec-title{font-size:clamp(26px,4vw,40px);font-weight:800;line-height:1.15;letter-spacing:-.02em;margin-bottom:14px}
.sec-title-dark{color:var(--dark)}
.sec-body{font-size:17px;color:var(--muted);max-width:580px}
.sec-body-c{margin:0 auto}
.intro-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
.intro-text h2{font-size:clamp(24px,3.5vw,36px);font-weight:800;color:var(--dark);margin-bottom:16px;line-height:1.2}
.intro-text p{font-size:16px;color:var(--muted);margin-bottom:16px;line-height:1.75}
.intro-text ul{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:24px}
.intro-text li{display:flex;align-items:flex-start;gap:10px;font-size:16px;font-weight:500;color:var(--dark)}
.chk{width:22px;height:22px;min-width:22px;background:var(--yellow);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.intro-photo{border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(11,97,244,.15)}
.intro-photo img{width:100%;height:380px;object-fit:cover}
.suburb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
.suburb-card{background:#fff;border:1px solid rgba(11,97,244,.12);border-radius:12px;padding:16px 20px;transition:border-color .2s,box-shadow .2s,transform .2s;display:block}
.suburb-card:hover{border-color:var(--blue);box-shadow:0 4px 20px rgba(11,97,244,.12);transform:translateY(-2px)}
.suburb-card-name{font-size:16px;font-weight:700;color:var(--dark);margin-bottom:4px}
.suburb-card-meta{font-size:13px;color:var(--blue);font-weight:500}
.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.service-card{background:#fff;border-radius:16px;padding:28px;box-shadow:0 2px 20px rgba(11,97,244,.08);border:1px solid rgba(11,97,244,.07);transition:transform .2s,box-shadow .2s}
.service-card:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(11,97,244,.14)}
.sc-icon{width:44px;height:44px;background:var(--light);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.sc-name{font-size:19px;font-weight:700;color:var(--dark);margin-bottom:8px}
.sc-desc{font-size:15px;color:var(--muted);line-height:1.65;margin-bottom:16px}
.sc-price{font-size:22px;font-weight:800;color:var(--blue);margin-bottom:4px}
.sc-price-note{font-size:13px;color:var(--muted);font-weight:500}
.faq-list{max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.faq-item{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.05)}
.faq-q{width:100%;text-align:left;background:none;border:none;padding:18px 24px;font-family:'Sora',sans-serif;font-size:16px;font-weight:600;color:var(--dark);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:12px}
.faq-icon{width:24px;height:24px;min-width:24px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform .25s}
.faq-item.open .faq-icon{transform:rotate(45deg)}
.faq-a{padding:0 24px;max-height:0;overflow:hidden;transition:max-height .3s ease,padding .3s;font-size:15px;color:var(--muted);line-height:1.75}
.faq-item.open .faq-a{max-height:320px;padding:0 24px 18px}
.why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}
.why-card{background:#fff;border-radius:14px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,.06);text-align:center}
.why-icon{width:48px;height:48px;background:var(--light);border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
.why-title{font-size:15px;font-weight:700;color:var(--dark);margin-bottom:6px}
.why-desc{font-size:14px;color:var(--muted);line-height:1.6}
.cta-section{background:var(--blue);padding:72px 32px;text-align:center}
.cta-section h2{font-size:clamp(26px,4vw,40px);font-weight:800;color:#fff;margin-bottom:16px;line-height:1.15}
.cta-section p{font-size:18px;color:rgba(255,255,255,.82);margin-bottom:28px;max-width:520px;margin-left:auto;margin-right:auto}
.cta-phone-big{font-size:clamp(28px,5vw,44px);font-weight:800;color:var(--yellow);margin-bottom:8px;line-height:1}
.cta-phone-big a{color:inherit;text-decoration:none}
.cta-phone-note{font-size:15px;color:rgba(255,255,255,.65);margin-bottom:32px}
.cta-form-card{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:16px;padding:28px;max-width:460px;margin:0 auto;text-align:left}
.cta-form-title{font-size:18px;font-weight:700;color:#fff;margin-bottom:16px}
.f-input{width:100%;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.22);border-radius:8px;padding:12px 15px;font-family:'Sora',sans-serif;font-size:15px;color:#fff;outline:none;margin-bottom:10px;transition:border-color .2s}
.f-input::placeholder{color:rgba(255,255,255,.45)}
.f-input:focus{border-color:var(--yellow)}
.f-select{width:100%;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.22);border-radius:8px;padding:12px 15px;font-family:'Sora',sans-serif;font-size:15px;color:rgba(255,255,255,.7);outline:none;margin-bottom:10px}
.f-select option{background:#0C4BB9;color:#fff}
.f-submit{width:100%;background:var(--yellow);color:var(--dark);font-family:'Sora',sans-serif;font-size:17px;font-weight:800;padding:14px;border:none;border-radius:8px;cursor:pointer;transition:background .2s,transform .2s}
.f-submit:hover{background:#ffe533;transform:translateY(-1px)}
.photo-banner{width:100%;max-height:420px;overflow:hidden;position:relative;background:#041450}
.photo-banner img{width:100%;height:380px;object-fit:cover;display:block;opacity:.82}
.photo-banner-overlay{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(4,20,80,.78));padding:40px 32px 28px}
.photo-banner-text{color:#fff;font-size:clamp(18px,3vw,24px);font-weight:800;max-width:600px}
.photo-banner-sub{color:rgba(255,255,255,.8);font-size:15px;margin-top:6px}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .5s,transform .5s}
.reveal.visible{opacity:1;transform:none}
@media(max-width:768px){
  .nav-links{display:none}
  .intro-grid{grid-template-columns:1fr}
  .intro-photo{display:block !important}
  .intro-photo img{height:240px}
  .hero{padding:50px 20px 44px}
  .sec{padding:50px 20px}
  .breadcrumb{padding:12px 20px}
  .services-grid{grid-template-columns:1fr}
  .why-grid{grid-template-columns:1fr 1fr}
  .hero-btns .btn{width:100%;justify-content:center;font-size:16px}
  .photo-banner img{height:220px}
  .photo-banner-overlay{padding:24px 20px 18px}
  .suburb-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:400px){.suburb-grid{grid-template-columns:1fr}}
</style>
<style id="dropdown-nav-css">
.nav-hamburger{display:none;background:none;border:none;cursor:pointer;padding:8px 6px;border-radius:7px;transition:background .2s;align-items:center;justify-content:center;flex-direction:column;gap:5px;-webkit-tap-highlight-color:transparent;flex-shrink:0}
.nav-hamburger:hover{background:rgba(50,65,88,.08)}
.ham-bar{display:block;width:22px;height:2px;background:#324158;border-radius:1px;transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .25s,width .25s}
.nav-hamburger[aria-expanded="true"] .ham-bar:nth-child(1){transform:translateY(7px) rotate(45deg)}
.nav-hamburger[aria-expanded="true"] .ham-bar:nth-child(2){opacity:0;transform:scaleX(0)}
.nav-hamburger[aria-expanded="true"] .ham-bar:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.nav-links{display:flex;align-items:center;gap:2px;list-style:none;margin:0;padding:0}
.nav-item{position:relative}
.nav-item::after{content:'';position:absolute;bottom:-10px;left:0;right:0;height:10px;background:transparent}
.nav-link-btn{display:flex;align-items:center;gap:5px;font-family:'Sora',sans-serif;font-size:15.5px;font-weight:600;color:#324158;background:none;border:none;cursor:pointer;padding:8px 11px;border-radius:7px;transition:color .2s,background .2s;white-space:nowrap;-webkit-tap-highlight-color:transparent;line-height:1}
.nav-link-btn:hover,.nav-link-btn:focus-visible{color:#0b61f4;background:rgba(11,97,244,.06);outline:none}
.nav-link-btn .chevron{transition:transform .22s cubic-bezier(.4,0,.2,1);flex-shrink:0}
.nav-item:hover .nav-link-btn .chevron{transform:rotate(180deg)}
.nav-link-plain{font-family:'Sora',sans-serif;font-size:15.5px;font-weight:600;color:#324158;padding:8px 11px;border-radius:7px;display:block;transition:color .2s,background .2s;white-space:nowrap;text-decoration:none}
.nav-link-plain:hover,.nav-link-plain:focus-visible{color:#0b61f4;background:rgba(11,97,244,.06);outline:none}
.nav-link-plain.active{color:#0b61f4}
.dropdown{position:absolute;top:calc(100% + 10px);left:0;background:#fff;border:1px solid rgba(50,65,88,.1);border-radius:12px;box-shadow:0 12px 40px rgba(11,97,244,.13),0 2px 8px rgba(0,0,0,.06);padding:6px;min-width:230px;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1),visibility .2s;z-index:500;pointer-events:none}
.nav-item:hover .dropdown{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}
.dropdown a{display:block;padding:9px 13px;font-family:'Sora',sans-serif;font-size:14.5px;font-weight:500;color:#324158;border-radius:7px;transition:background .15s,color .15s;white-space:nowrap;text-decoration:none}
.dropdown a:hover,.dropdown a.active{background:rgba(11,97,244,.07);color:#0b61f4}
.dropdown a.active{font-weight:600}
.dropdown-2col{display:flex;flex-direction:row;min-width:440px}
.dropdown-col{flex:1;padding:0 2px}
.mobile-nav{display:none;position:fixed;inset:0;z-index:9999;background:#fff;overflow-y:auto;transform:translateX(100%);transition:transform .32s cubic-bezier(.4,0,.2,1);-webkit-overflow-scrolling:touch}
.mobile-nav.open{transform:translateX(0)}
.mobile-nav-header{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1.5px solid rgba(50,65,88,.1);position:sticky;top:0;background:#fff;z-index:2}
.mobile-nav-close{background:none;border:none;cursor:pointer;padding:8px;border-radius:8px;transition:background .2s;-webkit-tap-highlight-color:transparent;display:flex;align-items:center;justify-content:center}
.mobile-nav-close:hover{background:rgba(50,65,88,.07)}
.mobile-nav-body{padding:4px 20px 60px}
.mobile-section{border-bottom:1px solid rgba(50,65,88,.1)}
.mobile-section-btn{display:flex;align-items:center;justify-content:space-between;width:100%;padding:16px 4px;font-family:'Sora',sans-serif;font-size:16.5px;font-weight:700;color:#324158;background:none;border:none;cursor:pointer;text-align:left;-webkit-tap-highlight-color:transparent}
.mobile-section-btn .chevron{transition:transform .25s cubic-bezier(.4,0,.2,1);flex-shrink:0}
.mobile-section.open .mobile-section-btn .chevron{transform:rotate(180deg)}
.mobile-section-links{display:none;padding:2px 0 10px}
.mobile-section.open .mobile-section-links{display:block}
.mobile-section-links a{display:block;padding:11px 12px;font-family:'Sora',sans-serif;font-size:15.5px;font-weight:500;color:#324158;border-radius:8px;transition:background .15s,color .15s;text-decoration:none}
.mobile-section-links a:hover,.mobile-section-links a.active{background:rgba(11,97,244,.07);color:#0b61f4}
.mobile-plain-links{padding:4px 0}
.mobile-plain-links a{display:block;padding:16px 4px;font-family:'Sora',sans-serif;font-size:16.5px;font-weight:700;color:#324158;border-bottom:1px solid rgba(50,65,88,.1);text-decoration:none;transition:color .15s}
.mobile-plain-links a:hover{color:#0b61f4}
.mobile-cta{display:flex;align-items:center;justify-content:center;gap:10px;background:#0b61f4;color:#fff;font-family:'Sora',sans-serif;font-size:18px;font-weight:700;padding:16px 20px;border-radius:10px;margin-top:20px;text-decoration:none;transition:background .2s,transform .2s}
.mobile-cta:hover{background:#0c4bb9;transform:translateY(-1px)}
@media(max-width:900px){
  .nav-links{display:none!important}
  .nav-hamburger{display:flex!important;order:99}
  .mobile-nav{display:block}
  .online-dot-wrap{display:none!important}
  .nav-cta{white-space:nowrap;font-size:13px;padding:8px 12px}
}
</style>'''

# ─── Shared ticker HTML ───────────────────────────────────────────────────────
TICKER_HTML = '''<div class="ticker" aria-hidden="true">
  <div class="ticker-track">
    <span class="ticker-item">Fixed Price — No Hidden Fees</span>
    <span class="ticker-item">Licensed Plumber Lic. 461511C</span>
    <span class="ticker-item">5.0 Star Google Rating</span>
    <span class="ticker-item">Fast Response Across Greater Sydney</span>
    <span class="ticker-item">WaterMark Certified Systems</span>
    <span class="ticker-item">Lifetime Workmanship Warranty</span>
    <span class="ticker-item">Fixed Price — No Hidden Fees</span>
    <span class="ticker-item">Licensed Plumber Lic. 461511C</span>
    <span class="ticker-item">5.0 Star Google Rating</span>
    <span class="ticker-item">Fast Response Across Greater Sydney</span>
    <span class="ticker-item">WaterMark Certified Systems</span>
    <span class="ticker-item">Lifetime Workmanship Warranty</span>
  </div>
</div>'''

# ─── Shared why-choose section ────────────────────────────────────────────────
WHY_HTML = '''<section class="sec sec-light reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">Why Filters For You</span>
      <h2 class="sec-title sec-title-dark">Sydney's Most Trusted Water Filter Installer</h2>
    </div>
    <div class="why-grid">
      <div class="why-card">
        <div class="why-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg></div>
        <div class="why-title">Licensed Plumber</div>
        <div class="why-desc">NSW Plumbing Licence 461511C. Fully insured and WaterMark certified systems only.</div>
      </div>
      <div class="why-card">
        <div class="why-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg></div>
        <div class="why-title">Fixed Upfront Price</div>
        <div class="why-desc">No surprises on the day. The price you're quoted is the price you pay — supply and installation included.</div>
      </div>
      <div class="why-card">
        <div class="why-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>
        <div class="why-title">Lifetime Warranty</div>
        <div class="why-desc">Every installation comes with a lifetime workmanship warranty. Jean-Paul stands behind every job.</div>
      </div>
      <div class="why-card">
        <div class="why-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></div>
        <div class="why-title">Fast Scheduling</div>
        <div class="why-desc">Most installations booked within 3 to 5 business days. Jean-Paul covers all of Greater Sydney.</div>
      </div>
      <div class="why-card">
        <div class="why-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div>
        <div class="why-title">Personal Service</div>
        <div class="why-desc">Jean-Paul personally attends every installation. No subcontractors, no strangers in your home.</div>
      </div>
      <div class="why-card">
        <div class="why-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg></div>
        <div class="why-title">5.0 Google Rating</div>
        <div class="why-desc">Six five-star Google reviews from real Sydney customers. Consistently rated the best in service and professionalism.</div>
      </div>
    </div>
  </div>
</section>'''

# ─── Nav JS (same on every page) ─────────────────────────────────────────────
NAV_JS = '''<script id="dropdown-nav-js">
(function(){
  var ham=document.getElementById('navHamburger');
  var mob=document.getElementById('mobileNav');
  var cls=document.getElementById('mobileNavClose');
  function openMob(){if(!mob)return;mob.classList.add('open');if(ham)ham.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';}
  function closeMob(){if(!mob)return;mob.classList.remove('open');if(ham)ham.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  if(ham)ham.addEventListener('click',openMob);
  if(cls)cls.addEventListener('click',closeMob);
  if(mob){
    mob.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMob);});
    mob.querySelectorAll('.mobile-section-btn').forEach(function(btn){
      btn.addEventListener('click',function(){btn.closest('.mobile-section').classList.toggle('open');});
    });
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMob();});
  var pg=(location.pathname.split('/').pop()||'index');
  if(pg==='')pg='index';
  document.querySelectorAll('.nav-links a[href],.dropdown a[href],.mobile-section-links a[href],.mobile-plain-links a[href]').forEach(function(a){
    var href=a.getAttribute('href')||'';
    if(href.includes('#'))return;
    var h=href.split('#')[0];
    if(h&&h===pg)a.classList.add('active');
  });
})();
</script>'''

PAGE_JS = '''<script>
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    const open=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!open)item.classList.add('open');
  });
});
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:0.07});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
</script>'''


def make_head(title, meta_desc, slug, region_name, suburb_list_str):
    canonical = f'https://filtersforyou.com.au/{slug}'
    og_url = canonical
    return f'''<!DOCTYPE html>
<html lang="en-AU">
<head>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-TK2P95MELV"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-TK2P95MELV');
  </script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>{title}</title>
<meta name="description" content="{meta_desc}">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="AU-NSW">
<meta name="geo.placename" content="{region_name}, NSW">
<script>!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2577696515958185');fbq('track','PageView');</script>
<meta property="og:type" content="website">
<meta property="og:url" content="{og_url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{meta_desc}">
<meta property="og:image" content="https://filtersforyou.com.au/assets/photos/preview.png">
<meta property="og:locale" content="en_AU">
<meta property="og:site_name" content="Filters For You">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Shantell+Sans:ital,wght@1,700&display=swap" rel="stylesheet">'''


def make_schema(slug, region_name, suburbs_desc, faq_items):
    canonical = f'https://filtersforyou.com.au/{slug}'
    faqs_json = ',\n        '.join([
        f'{{"@type":"Question","name":"{q}","acceptedAnswer":{{"@type":"Answer","text":"{a}"}}}}'
        for q, a in faq_items
    ])
    return f'''<script type="application/ld+json">
{{
  "@context":"https://schema.org",
  "@graph":[
    {{
      "@type":["Plumber","LocalBusiness"],
      "@id":"https://filtersforyou.com.au/#business",
      "name":"Filters For You",
      "description":"Professional water filter installation across {region_name} Sydney. Under sink, reverse osmosis and whole house systems supplied and installed by licensed plumber Jean-Paul Barber.",
      "url":"{canonical}",
      "telephone":"+61430546749",
      "email":"info@filtersforyou.com.au",
      "logo":"https://filtersforyou.com.au/assets/brand/logos/logo-transparent.svg",
      "image":"https://filtersforyou.com.au/assets/photos/jp-hero.jpg",
      "priceRange":"$$",
      "openingHours":["Mo-Sa 07:00-18:00"],
      "address":{{"@type":"PostalAddress","addressLocality":"Croydon Park","addressRegion":"NSW","postalCode":"2133","addressCountry":"AU"}},
      "geo":{{"@type":"GeoCoordinates","latitude":-33.9013,"longitude":151.1264}},
      "areaServed":[{{"@type":"City","name":"{region_name}"}},{{"@type":"City","name":"Sydney"}}],
      "aggregateRating":{{"@type":"AggregateRating","ratingValue":"5.0","reviewCount":"6","bestRating":"5"}},
      "founder":{{"@type":"Person","name":"Jean-Paul Barber","jobTitle":"Licensed Plumber & Founder","hasCredential":{{"@type":"EducationalOccupationalCredential","name":"NSW Plumbing Licence","identifier":"461511C"}}}},
      "hasOfferCatalog":{{
        "@type":"OfferCatalog","name":"Water Filter Installation {region_name}",
        "itemListElement":[
          {{"@type":"Offer","name":"Under Sink Water Filter Installation {region_name}","price":"550","priceCurrency":"AUD","availability":"https://schema.org/InStock"}},
          {{"@type":"Offer","name":"Reverse Osmosis System {region_name}","price":"840","priceCurrency":"AUD","availability":"https://schema.org/InStock"}},
          {{"@type":"Offer","name":"Whole House Water Filtration {region_name}","price":"3050","priceCurrency":"AUD","availability":"https://schema.org/InStock"}}
        ]
      }}
    }},
    {{
      "@type":"BreadcrumbList",
      "itemListElement":[
        {{"@type":"ListItem","position":1,"name":"Home","item":"https://filtersforyou.com.au/"}},
        {{"@type":"ListItem","position":2,"name":"Locations","item":"https://filtersforyou.com.au/locations-inner-west"}},
        {{"@type":"ListItem","position":3,"name":"Water Filter Installation {region_name}","item":"{canonical}"}}
      ]
    }},
    {{
      "@type":"FAQPage",
      "mainEntity":[
        {faqs_json}
      ]
    }}
  ]
}}
</script>'''


def make_hero(region_name, hero_subtitle, h1_span_text):
    return f'''<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge"><span class="hero-badge-dot"></span>{region_name} Water Filter Specialist</div>
    <h1>Water Filter Installation <br><span class="sh sh-y">{h1_span_text}</span></h1>
    <p class="hero-sub">{hero_subtitle}</p>
    <div class="hero-stars">
      <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
      <span class="stars-label">5.0 Google Rating &middot; 6 verified reviews</span>
    </div>
    <div class="hero-trust">
      <span class="trust-chip">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        Licensed Plumber 461511C
      </span>
      <span class="trust-chip">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
        Fixed Upfront Price
      </span>
      <span class="trust-chip">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
        Lifetime Warranty
      </span>
      <span class="trust-chip">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
        Greater Sydney Service
      </span>
    </div>
    <div class="hero-btns">
      <a href="tel:0430546749" class="btn btn-yellow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>
        Call 0430 546 749
      </a>
      <a href="index#contact" class="btn" style="background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.4)">Get a Free Quote</a>
    </div>
  </div>
</section>'''


def make_suburb_grid(suburbs):
    """suburbs: list of (display_name, slug)"""
    cards = ''
    for name, slug in suburbs:
        cards += f'''    <a href="{slug}" class="suburb-card">
      <div class="suburb-card-name">{name}</div>
      <div class="suburb-card-meta">View installations &rarr;</div>
    </a>\n'''
    return f'''<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">Suburbs We Serve</span>
      <h2 class="sec-title sec-title-dark">Select Your Suburb</h2>
      <p class="sec-body sec-body-c">Find your area below for suburb-specific water filter installation information, pricing and availability.</p>
    </div>
    <div class="suburb-grid">
{cards}    </div>
  </div>
</section>'''


def make_services_section(service_combos):
    """service_combos: list of (name, slug, desc, price, price_note, icon_svg)"""
    if not service_combos:
        return ''
    cards = ''
    for name, slug, desc, price, price_note, icon_svg in service_combos:
        cards += f'''      <a href="{slug}" class="service-card">
        <div class="sc-icon">{icon_svg}</div>
        <div class="sc-name">{name}</div>
        <div class="sc-desc">{desc}</div>
        <div class="sc-price">{price}</div>
        <div class="sc-price-note">{price_note}</div>
      </a>\n'''
    return f'''<section class="sec sec-light reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">Specialist Services</span>
      <h2 class="sec-title sec-title-dark">Water Filter Services in This Region</h2>
      <p class="sec-body sec-body-c">Dedicated service and product pages for popular locations in this region.</p>
    </div>
    <div class="services-grid">
{cards}    </div>
  </div>
</section>'''


def make_faq_section(faq_items):
    items_html = ''
    for q, a in faq_items:
        items_html += f'''    <div class="faq-item">
      <button class="faq-q">{q}
        <span class="faq-icon"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M5 1v8M1 5h8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span>
      </button>
      <div class="faq-a">{a}</div>
    </div>\n'''
    return f'''<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">Common Questions</span>
      <h2 class="sec-title sec-title-dark">Frequently Asked Questions</h2>
    </div>
    <div class="faq-list">
{items_html}    </div>
  </div>
</section>'''


def make_cta_section(region_name, slug):
    return f'''<section class="cta-section" id="contact">
  <div class="container">
    <h2>Get a Free Quote for {region_name}</h2>
    <p>Jean-Paul Barber covers all of {region_name} Sydney. Call now or fill in the form below for a fixed price quote within 24 hours.</p>
    <div class="cta-phone-big"><a href="tel:0430546749">0430 546 749</a></div>
    <div class="cta-phone-note">Mon–Sat 7am–6pm &middot; Fast response</div>
    <div class="cta-form-card">
      <div class="cta-form-title">Request a Free Quote</div>
      <form action="https://formspree.io/f/xpzgknjw" method="POST">
        <input type="hidden" name="page" value="{slug}">
        <input class="f-input" type="text" name="name" placeholder="Your name" required>
        <input class="f-input" type="tel" name="phone" placeholder="Your phone number" required>
        <input class="f-input" type="text" name="suburb" placeholder="Your suburb">
        <select class="f-select" name="system">
          <option value="" disabled selected>Which system are you interested in?</option>
          <option>Under Sink Water Filter — from $550</option>
          <option>Reverse Osmosis System — from $840</option>
          <option>Whole House Water Filter — from $3,050</option>
          <option>Not sure — I need advice</option>
        </select>
        <button type="submit" class="f-submit">Get My Free Quote</button>
      </form>
    </div>
  </div>
</section>'''


def make_geo_entity(region_name, slug):
    return f'''<div id="geo-entity" style="display:none" aria-hidden="true">
  <h2>Water Filter Installation {region_name} Sydney</h2>
  <p>Filters For You provides professional water filter installation across {region_name} Sydney. Jean-Paul Barber, NSW Licensed Plumber 461511C, personally installs every system. Based in Croydon Park. Fixed prices: under-sink from $550, reverse osmosis from $840, whole house HPF-3 from $3,050. WaterMark certified systems. 5.0 star Google rating. Phone: 0430 546 749. Website: filtersforyou.com.au.</p>
</div>'''


def build_region_page(data):
    """Build a full region hub page from data dict."""
    slug = data['slug']
    region_name = data['region_name']
    h1_span = data['h1_span']
    title = data['title']
    meta_desc = data['meta_desc']
    intro_p1 = data['intro_p1']
    intro_p2 = data['intro_p2']
    intro_bullets = data['intro_bullets']
    suburbs = data['suburbs']
    service_combos = data.get('service_combos', [])
    faq_items = data['faq_items']
    photo1 = data.get('photo1', 'install-01.jpg')
    photo2 = data.get('photo2', 'install-02.jpg')
    photo3 = data.get('photo3', 'install-03.jpg')

    bullets_html = '\n'.join([
        f'          <li><span class="chk"><svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true"><path d="M1 4.5L4 7.5L10 1" stroke="#324158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>{b}</li>'
        for b in intro_bullets
    ])

    schema = make_schema(slug, region_name, '', faq_items)

    page = f'''{make_head(title, meta_desc, slug, region_name, '')}
{schema}
{HEAD_CSS}
</head>
<body>

{NEW_NAV}

<!-- BREADCRUMB -->
<div class="breadcrumb">
  <a href="/">Home</a> &rsaquo; <a href="locations-inner-west">Locations</a> &rsaquo; {region_name}
</div>

{TICKER_HTML}

{make_hero(region_name, data['hero_subtitle'], h1_span)}

<!-- INTRO -->
<section class="sec sec-white reveal">
  <div class="container">
    <div class="intro-grid">
      <div class="intro-text">
        <div class="yline"></div>
        <span class="eyebrow">Serving {region_name} Sydney</span>
        <h2>Water Filter Installation for {region_name} Homes &amp; Apartments</h2>
        <p>{intro_p1}</p>
        <p>{intro_p2}</p>
        <ul>
{bullets_html}
        </ul>
        <a href="tel:0430546749" class="btn btn-blue">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>
          Call Jean-Paul — 0430 546 749
        </a>
      </div>
      <div class="intro-photo">
        <img src="assets/photos/{photo1}" alt="Water filter installation {region_name} Sydney — Jean-Paul Barber licensed plumber" width="500" height="380" loading="lazy">
      </div>
    </div>
  </div>
</section>

{make_suburb_grid(suburbs)}

<!-- PHOTO BANNER -->
<div class="photo-banner reveal">
  <img src="assets/photos/jp-hero.jpg" alt="Jean-Paul Barber — water filter installer {region_name} Sydney" loading="lazy">
  <div class="photo-banner-overlay">
    <div class="photo-banner-text">Jean-Paul Barber &mdash; Licensed Plumber 461511C</div>
    <div class="photo-banner-sub">Personally attends every installation across {region_name} and Greater Sydney</div>
  </div>
</div>

{make_services_section(service_combos)}

<!-- SERVICES OVERVIEW -->
<section class="sec sec-white reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">What We Install</span>
      <h2 class="sec-title sec-title-dark">Water Filter Systems Available in {region_name}</h2>
    </div>
    <div class="services-grid">
      <a href="under-sink-water-filter-sydney" class="service-card">
        <div class="sc-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M18.7 12.4C18.35 11.56 18 10.78 18 10c0-3.31-2.69-6-6-6S6 6.69 6 10c0 .78-.35 1.56-.7 2.4C4.5 13.6 4 14.8 4 16c0 2.21 1.79 4 4 4 .34 0 .67-.04 1-.12V20c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-.12c.33.08.66.12 1 .12 2.21 0 4-1.79 4-4 0-1.2-.5-2.4-1.3-3.6z"/></svg></div>
        <div class="sc-name">Under Sink Water Filter</div>
        <div class="sc-desc">Compact under-sink systems that connect to your existing kitchen tap. Ideal for apartments and houses alike.</div>
        <div class="sc-price">From $550</div>
        <div class="sc-price-note">Supply and installation included</div>
      </a>
      <a href="reverse-osmosis-water-filter-sydney" class="service-card">
        <div class="sc-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></div>
        <div class="sc-name">Reverse Osmosis System</div>
        <div class="sc-desc">Multi-stage RO filtration removes up to 99% of contaminants including fluoride, heavy metals and dissolved solids.</div>
        <div class="sc-price">From $840</div>
        <div class="sc-price-note">5, 7 and smart monitoring options</div>
      </a>
      <a href="whole-house-water-filter-sydney" class="service-card">
        <div class="sc-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></div>
        <div class="sc-name">Whole House Water Filter</div>
        <div class="sc-desc">The HPF-3 filters at the mains — every tap, shower, bath and appliance in the home gets clean filtered water.</div>
        <div class="sc-price">From $3,050</div>
        <div class="sc-price-note">Installed at the water mains entry</div>
      </a>
    </div>
  </div>
</section>

{WHY_HTML}

{make_cta_section(region_name, slug)}

{make_faq_section(faq_items)}

<!-- INTERNAL LINKS -->
<section class="sec sec-light reveal">
  <div class="container">
    <div class="sec-head">
      <div class="yline yline-c"></div>
      <span class="eyebrow">More Information</span>
      <h2 class="sec-title sec-title-dark">Related Pages</h2>
    </div>
    <div class="suburb-grid" style="max-width:780px;margin:0 auto">
      <a href="water-filter-systems" class="suburb-card"><div class="suburb-card-name">All Water Filter Systems</div><div class="suburb-card-meta">Compare our full range &rarr;</div></a>
      <a href="sydney-water-filter-cost-guide" class="suburb-card"><div class="suburb-card-name">Water Filter Cost Guide</div><div class="suburb-card-meta">Pricing explained &rarr;</div></a>
      <a href="how-water-filters-work" class="suburb-card"><div class="suburb-card-name">How Water Filters Work</div><div class="suburb-card-meta">Learn the basics &rarr;</div></a>
      <a href="water-filter-faq-sydney" class="suburb-card"><div class="suburb-card-name">Water Filter FAQ</div><div class="suburb-card-meta">Common questions answered &rarr;</div></a>
    </div>
  </div>
</section>

{NEW_FOOTER_CSS}
{NEW_FOOTER_HTML}

{make_geo_entity(region_name, slug)}

{PAGE_JS}
{NEW_MOBILE_NAV}
{NAV_JS}
</body>
</html>'''

    return page


# ─── REGION DATA ──────────────────────────────────────────────────────────────

ICON_FILTER = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M18.7 12.4C18.35 11.56 18 10.78 18 10c0-3.31-2.69-6-6-6S6 6.69 6 10c0 .78-.35 1.56-.7 2.4C4.5 13.6 4 14.8 4 16c0 2.21 1.79 4 4 4 .34 0 .67-.04 1-.12V20c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-.12c.33.08.66.12 1 .12 2.21 0 4-1.79 4-4 0-1.2-.5-2.4-1.3-3.6z"/></svg>'
ICON_RO = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>'
ICON_HOUSE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#0b61f4" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'

REGIONS = [
    {
        'slug': 'locations-inner-west',
        'region_name': 'Inner West',
        'h1_span': 'Inner West',
        'title': 'Water Filter Installation Inner West Sydney | Filters For You',
        'meta_desc': 'Water filter installation across Sydney\'s Inner West by Jean-Paul Barber. Licensed plumber covering Ashfield, Burwood, Newtown & 18 more suburbs. Call 0430 546 749.',
        'hero_subtitle': 'Jean-Paul Barber installs water filtration systems across all Inner West Sydney suburbs. Based in Croydon Park, he personally attends every installation — licensed plumber, fixed prices, WaterMark certified systems and a lifetime workmanship warranty.',
        'intro_p1': 'The Inner West is one of Sydney\'s most diverse and vibrant regions — a mix of heritage terrace houses in Newtown and Leichhardt, modern apartments near Homebush Olympic Park, family homes in Burwood and Strathfield, and everything in between. Jean-Paul from Filters For You has installed water filtration systems across virtually every Inner West suburb, and understands the unique requirements of each property type.',
        'intro_p2': 'Jean-Paul holds NSW Plumbing Licence 461511C and is based in Croydon Park — right at the heart of the Inner West. He personally attends every installation across Ashfield, Balmain, Burwood, Campsie, Concord, Drummoyne, Enmore, Erskineville, Five Dock, Glebe, Homebush, Leichhardt, Marrickville, Newtown, Petersham, Rozelle, Stanmore, Strathfield and Annandale. His 5.0 Google rating reflects the standard you can expect.',
        'intro_bullets': [
            'Jean-Paul personally attends every Inner West installation',
            'Terrace houses, apartments, townhouses and family homes — all covered',
            'Fixed price — supply and professional installation included',
            'Lifetime workmanship warranty on every install',
            'Based in Croydon Park — fast response across the Inner West',
            'NSW Licensed Plumber 461511C — fully insured',
        ],
        'suburbs': [
            ('Ashfield', 'water-filter-installation-ashfield'),
            ('Annandale', 'water-filter-installation-annandale'),
            ('Balmain', 'water-filter-installation-balmain'),
            ('Burwood', 'water-filter-installation-burwood'),
            ('Campsie', 'water-filter-installation-campsie'),
            ('Concord', 'water-filter-installation-concord'),
            ('Croydon Park', 'water-filter-installation-croydon-park'),
            ('Drummoyne', 'water-filter-installation-drummoyne'),
            ('Enmore', 'water-filter-installation-enmore'),
            ('Erskineville', 'water-filter-installation-erskineville'),
            ('Five Dock', 'water-filter-installation-five-dock'),
            ('Glebe', 'water-filter-installation-glebe'),
            ('Homebush', 'water-filter-installation-homebush'),
            ('Homebush West', 'water-filter-installation-homebush-west'),
            ('Leichhardt', 'water-filter-installation-leichhardt'),
            ('Marrickville', 'water-filter-installation-marrickville'),
            ('Newtown', 'water-filter-installation-newtown'),
            ('Petersham', 'water-filter-installation-petersham'),
            ('Rozelle', 'water-filter-installation-rozelle'),
            ('Stanmore', 'water-filter-installation-stanmore'),
            ('Strathfield', 'water-filter-installation-strathfield'),
        ],
        'service_combos': [],
        'faq_items': [
            ('Who installs water filters in the Inner West?', 'Jean-Paul Barber from Filters For You installs water filters throughout the Inner West. He is a NSW licensed plumber (Lic. 461511C) based in Croydon Park — right in the heart of the Inner West. Jean-Paul personally attends every installation. Call 0430 546 749 to book.'),
            ('How much does water filter installation cost in the Inner West?', 'Fixed pricing: under-sink filters from $550, reverse osmosis systems from $840, whole house HPF-3 from $3,050. All prices include supply and professional installation. No hidden fees, no upsells on the day.'),
            ('Can you install water filters in Inner West apartments?', 'Yes. Under-sink and reverse osmosis systems install under the kitchen sink and are ideal for Inner West apartments and terrace houses. Jean-Paul has installed systems in all property types across Newtown, Leichhardt, Glebe, Enmore and beyond.'),
            ('How quickly can you book in the Inner West?', 'Most Inner West bookings are scheduled within 3 to 5 business days. Jean-Paul is based in Croydon Park so response across the Inner West is fast. Call 0430 546 749 to confirm availability.'),
        ],
        'photo1': 'install-04.jpg',
    },
    {
        'slug': 'locations-eastern-suburbs',
        'region_name': 'Eastern Suburbs',
        'h1_span': 'Eastern Suburbs',
        'title': 'Water Filter Installation Eastern Suburbs | Filters For You',
        'meta_desc': 'Water filter installation across Sydney\'s Eastern Suburbs. Jean-Paul covers Bondi, Randwick, Coogee, Paddington & more. Licensed plumber. Call 0430 546 749.',
        'hero_subtitle': 'Jean-Paul Barber installs water filtration systems across Sydney\'s Eastern Suburbs. Licensed plumber, fixed prices, WaterMark certified systems and a lifetime workmanship warranty on every installation.',
        'intro_p1': 'Sydney\'s Eastern Suburbs range from the iconic beachside lifestyle of Bondi and Coogee to the leafy streets of Paddington, the urban density of Surry Hills and Waterloo, and the established family suburbs of Randwick and Maroubra. Jean-Paul from Filters For You has extensive experience installing water filtration systems in all Eastern Suburbs property types — from Bondi Beach apartments to Paddington terraces and Randwick family homes.',
        'intro_p2': 'Jean-Paul holds NSW Plumbing Licence 461511C and personally attends every Eastern Suburbs installation. He covers Bondi, Coogee, Kensington, Maroubra, Paddington, Randwick, Surry Hills, Waterloo and Zetland. His 5.0 Google rating (six reviews, all five stars) reflects the standard every Eastern Suburbs customer can expect.',
        'intro_bullets': [
            'Jean-Paul personally installs every Eastern Suburbs system',
            'Bondi apartments, Paddington terraces, Randwick family homes — all property types covered',
            'Fixed price — supply and professional installation included',
            'Dedicated pages for Bondi and Randwick installations',
            'Lifetime workmanship warranty on every install',
            'NSW Licensed Plumber 461511C — fully insured',
        ],
        'suburbs': [
            ('Bondi', 'water-filter-installation-bondi'),
            ('Coogee', 'water-filter-installation-coogee'),
            ('Kensington', 'water-filter-installation-kensington'),
            ('Maroubra', 'water-filter-installation-maroubra'),
            ('Paddington', 'water-filter-installation-paddington'),
            ('Randwick', 'water-filter-installation-randwick'),
            ('Surry Hills', 'water-filter-installation-surry-hills'),
            ('Waterloo', 'water-filter-installation-waterloo'),
            ('Zetland', 'water-filter-installation-zetland'),
        ],
        'service_combos': [
            ('Under Sink Water Filter Bondi', 'under-sink-water-filter-bondi', 'Under-sink filtration for Bondi apartments and houses. Compact systems that connect to your existing kitchen tap.', 'From $550', 'Supply and installation included', ICON_FILTER),
            ('Under Sink Water Filter Randwick', 'under-sink-water-filter-randwick', 'Under-sink water filter installation for Randwick homes and apartments by Jean-Paul Barber.', 'From $550', 'Supply and installation included', ICON_FILTER),
            ('Whole House Filter Bondi', 'whole-house-water-filter-bondi', 'The HPF-3 whole house filtration system installed at the mains entry — every tap in your Bondi home gets clean water.', 'From $3,050', 'Whole home coverage', ICON_HOUSE),
            ('Reverse Osmosis Bondi', 'reverse-osmosis-installation-bondi', 'Multi-stage reverse osmosis for Bondi homes and apartments. Removes fluoride, chlorine, heavy metals and dissolved solids.', 'From $840', '5 and 7-stage options available', ICON_RO),
        ],
        'faq_items': [
            ('Who installs water filters in the Eastern Suburbs?', 'Jean-Paul Barber from Filters For You installs water filters throughout the Eastern Suburbs. He is a NSW licensed plumber (Lic. 461511C) who personally attends every installation in Bondi, Randwick, Coogee, Paddington, Surry Hills and surrounding suburbs. Call 0430 546 749.'),
            ('How much does water filter installation cost in the Eastern Suburbs?', 'Fixed pricing in the Eastern Suburbs: under-sink filters from $550, reverse osmosis systems from $840, whole house HPF-3 from $3,050. All prices include supply and professional installation — no hidden fees.'),
            ('Can you install in a Bondi apartment?', 'Yes. Under-sink and reverse osmosis systems install under the kitchen sink without requiring mains access, making them ideal for Bondi and Eastern Suburbs apartments. No strata approval is typically required. Jean-Paul has extensive experience with Eastern Suburbs apartment installations.'),
            ('How quickly can you book in the Eastern Suburbs?', 'Most Eastern Suburbs bookings are scheduled within 3 to 5 business days. Call 0430 546 749 to confirm availability for your suburb.'),
        ],
        'photo1': 'install-05.jpg',
    },
    {
        'slug': 'locations-south-sydney',
        'region_name': 'South Sydney',
        'h1_span': 'South Sydney',
        'title': 'Water Filter Installation South Sydney | Filters For You',
        'meta_desc': 'Water filter installation across South Sydney by Jean-Paul Barber. Licensed plumber covering Hurstville, Rockdale, Mascot, Kogarah & more. Call 0430 546 749.',
        'hero_subtitle': 'Jean-Paul Barber installs water filtration systems across South Sydney. Licensed plumber, fixed prices, WaterMark certified systems and a lifetime workmanship warranty on every installation.',
        'intro_p1': 'South Sydney covers a wide range of suburbs from the inner southern fringe of Sydney CBD — Alexandria, Mascot and Tempe — through to the established St George district suburbs of Hurstville, Kogarah, Rockdale and Arncliffe. Jean-Paul from Filters For You regularly services this entire region, installing under-sink, reverse osmosis and whole house water filtration systems across all property types.',
        'intro_p2': 'Jean-Paul holds NSW Plumbing Licence 461511C and personally attends every South Sydney installation. He covers Alexandria, Arncliffe, Beaconsfield, Botany, Brighton-le-Sands, Hurstville, Kogarah, Mascot, Miranda, Ramsgate, Rockdale, St George and Tempe. His 5.0 Google rating reflects the consistently high standard of workmanship across every job.',
        'intro_bullets': [
            'Jean-Paul personally attends every South Sydney installation',
            'Houses, apartments and units across the St George and inner south area',
            'Fixed price — supply and professional installation included',
            'Fast scheduling — most bookings within 3 to 5 business days',
            'Lifetime workmanship warranty on every install',
            'NSW Licensed Plumber 461511C — fully insured',
        ],
        'suburbs': [
            ('Alexandria', 'water-filter-installation-alexandria'),
            ('Arncliffe', 'water-filter-installation-arncliffe'),
            ('Beaconsfield', 'water-filter-installation-beaconsfield'),
            ('Botany', 'water-filter-installation-botany'),
            ('Brighton-le-Sands', 'water-filter-installation-brighton-le-sands'),
            ('Hurstville', 'water-filter-installation-hurstville'),
            ('Kogarah', 'water-filter-installation-kogarah'),
            ('Mascot', 'water-filter-installation-mascot'),
            ('Miranda', 'water-filter-installation-miranda'),
            ('Ramsgate', 'water-filter-installation-ramsgate'),
            ('Rockdale', 'water-filter-installation-rockdale'),
            ('St George', 'water-filter-installation-st-george'),
            ('Tempe', 'water-filter-installation-tempe'),
        ],
        'service_combos': [],
        'faq_items': [
            ('Who installs water filters in South Sydney?', 'Jean-Paul Barber from Filters For You installs water filters throughout South Sydney — covering Hurstville, Kogarah, Rockdale, Arncliffe, Alexandria, Mascot, Tempe, Botany and surrounding suburbs. He is a NSW licensed plumber (Lic. 461511C) who personally attends every installation. Call 0430 546 749.'),
            ('How much does water filter installation cost in South Sydney?', 'Fixed pricing: under-sink filters from $550, reverse osmosis systems from $840, whole house HPF-3 from $3,050. All prices include supply and professional installation — no hidden fees, no upsells on the day.'),
            ('Do you service the St George area?', 'Yes. Jean-Paul covers all St George suburbs including Hurstville, Kogarah, Rockdale, Arncliffe, Brighton-le-Sands and Ramsgate. He personally attends every installation in this area.'),
            ('How quickly can you book in South Sydney?', 'Most South Sydney bookings are scheduled within 3 to 5 business days. Call 0430 546 749 to confirm availability for your suburb.'),
        ],
        'photo1': 'install-06.jpg',
    },
    {
        'slug': 'locations-inner-city',
        'region_name': 'Inner City',
        'h1_span': 'Inner City & CBD',
        'title': 'Water Filter Installation Inner City Sydney | Filters For You',
        'meta_desc': 'Water filter installation in Sydney\'s Inner City and CBD. Jean-Paul covers Redfern, Pyrmont, Chippendale, Ultimo & Sydney CBD. Licensed plumber. Call 0430 546 749.',
        'hero_subtitle': 'Jean-Paul Barber installs water filtration systems across Sydney\'s Inner City and CBD. Licensed plumber, fixed prices, WaterMark certified systems and a lifetime workmanship warranty on every installation.',
        'intro_p1': 'Sydney\'s inner city suburbs — Chippendale, Pyrmont, Redfern, Ultimo and the CBD itself — are dominated by apartments, heritage conversions and high-density residential developments. Jean-Paul from Filters For You has extensive experience installing water filtration systems in this environment. Under-sink and reverse osmosis systems are ideal for inner city apartments, installing neatly under the kitchen sink without any mains modifications.',
        'intro_p2': 'Jean-Paul holds NSW Plumbing Licence 461511C and personally attends every inner city installation. He covers Chippendale, Pyrmont, Redfern, Sydney CBD and Ultimo. Inner city property managers and strata committees have appreciated his neat, professional finish and his thorough client walkthrough at the end of every job.',
        'intro_bullets': [
            'Jean-Paul personally installs every inner city and CBD system',
            'Ideal for high-rise apartments, heritage terraces and strata properties',
            'No mains modifications needed for under-sink and RO systems',
            'Fixed price — supply and professional installation included',
            'Lifetime workmanship warranty on every install',
            'NSW Licensed Plumber 461511C — fully insured',
        ],
        'suburbs': [
            ('Chippendale', 'water-filter-installation-chippendale'),
            ('Pyrmont', 'water-filter-installation-pyrmont'),
            ('Redfern', 'water-filter-installation-redfern'),
            ('Sydney CBD', 'water-filter-installation-sydney-cbd'),
            ('Ultimo', 'water-filter-installation-ultimo'),
        ],
        'service_combos': [],
        'faq_items': [
            ('Who installs water filters in the Sydney CBD and inner city?', 'Jean-Paul Barber from Filters For You installs water filters throughout Sydney\'s inner city suburbs and CBD — Chippendale, Pyrmont, Redfern, Ultimo and the CBD. He is a NSW licensed plumber (Lic. 461511C) who personally attends every installation. Call 0430 546 749.'),
            ('Can you install in a Sydney CBD apartment?', 'Yes. Under-sink and reverse osmosis systems install under the kitchen sink and do not require mains access or structural modifications, making them ideal for CBD and inner city apartments. Most strata by-laws permit this installation. Jean-Paul will confirm suitability before booking.'),
            ('How much does water filter installation cost in inner city Sydney?', 'Fixed pricing: under-sink filters from $550, reverse osmosis systems from $840. Whole house HPF-3 filtration is available from $3,050 where mains access permits. All prices include supply and professional installation.'),
            ('How quickly can you book in the CBD or inner city?', 'Most inner city bookings are scheduled within 3 to 5 business days. Call 0430 546 749 to confirm availability.'),
        ],
        'photo1': 'install-07.jpg',
    },
    {
        'slug': 'locations-western-sydney',
        'region_name': 'Western Sydney',
        'h1_span': 'Western Sydney',
        'title': 'Water Filter Installation Western Sydney | Filters For You',
        'meta_desc': 'Water filter installation across Western Sydney by Jean-Paul Barber. Licensed plumber covering Parramatta, Bankstown, Auburn, Liverpool & more. Call 0430 546 749.',
        'hero_subtitle': 'Jean-Paul Barber installs water filtration systems across Western Sydney. Licensed plumber, fixed prices, WaterMark certified systems and a lifetime workmanship warranty on every installation.',
        'intro_p1': 'Western Sydney is one of the fastest-growing regions in Australia, with Parramatta at its core and a diverse mix of suburbs stretching across Auburn, Bankstown, Fairfield, Granville, Lidcombe and Liverpool. Jean-Paul from Filters For You regularly services all of Western Sydney, installing water filtration systems that transform the quality of drinking water for families and households across the region.',
        'intro_p2': 'Jean-Paul holds NSW Plumbing Licence 461511C and personally attends every Western Sydney installation. He covers Auburn, Bankstown, Fairfield, Granville, Lidcombe, Liverpool and Parramatta. His fixed-price, no-upsell approach is particularly valued in Western Sydney where families want transparency and reliability from their tradespeople.',
        'intro_bullets': [
            'Jean-Paul personally attends every Western Sydney installation',
            'Houses, apartments and new builds across Parramatta, Bankstown and surrounds',
            'Fixed price — supply and professional installation included',
            'Dedicated service pages for Parramatta',
            'Lifetime workmanship warranty on every install',
            'NSW Licensed Plumber 461511C — fully insured',
        ],
        'suburbs': [
            ('Auburn', 'water-filter-installation-auburn'),
            ('Bankstown', 'water-filter-installation-bankstown'),
            ('Fairfield', 'water-filter-installation-fairfield'),
            ('Granville', 'water-filter-installation-granville'),
            ('Lidcombe', 'water-filter-installation-lidcombe'),
            ('Liverpool', 'water-filter-installation-liverpool'),
            ('Parramatta', 'water-filter-installation-parramatta'),
        ],
        'service_combos': [
            ('Under Sink Water Filter Parramatta', 'under-sink-water-filter-parramatta', 'Under-sink water filter installation for Parramatta homes and apartments by Jean-Paul Barber.', 'From $550', 'Supply and installation included', ICON_FILTER),
            ('Whole House Filter Parramatta', 'whole-house-water-filter-parramatta', 'The HPF-3 whole house system installed at the water mains — every tap in your Parramatta home gets filtered water.', 'From $3,050', 'Whole home coverage', ICON_HOUSE),
            ('Reverse Osmosis Parramatta', 'reverse-osmosis-installation-parramatta', 'Multi-stage RO filtration for Parramatta homes and apartments. Removes fluoride, chlorine and dissolved contaminants.', 'From $840', '5 and 7-stage options available', ICON_RO),
        ],
        'faq_items': [
            ('Who installs water filters in Western Sydney?', 'Jean-Paul Barber from Filters For You installs water filters throughout Western Sydney — including Parramatta, Bankstown, Auburn, Fairfield, Granville, Lidcombe and Liverpool. He is a NSW licensed plumber (Lic. 461511C) who personally attends every installation. Call 0430 546 749.'),
            ('How much does water filter installation cost in Western Sydney?', 'Fixed pricing: under-sink filters from $550, reverse osmosis systems from $840, whole house HPF-3 from $3,050. All prices include supply and professional installation — no hidden fees.'),
            ('Do you service all Western Sydney suburbs?', 'Yes. Jean-Paul covers all major Western Sydney suburbs including Parramatta, Bankstown, Auburn, Fairfield, Granville, Lidcombe and Liverpool. He personally attends every installation in this region.'),
            ('How quickly can you book in Western Sydney?', 'Most Western Sydney bookings are scheduled within 3 to 5 business days. Call 0430 546 749 to confirm availability for your suburb.'),
        ],
        'photo1': 'install-08.jpg',
    },
    {
        'slug': 'locations-north-shore',
        'region_name': 'North Shore',
        'h1_span': 'North Shore & Beyond',
        'title': 'Water Filter Installation North Shore Sydney | Filters For You',
        'meta_desc': 'Water filter installation on Sydney\'s North Shore. Jean-Paul covers Chatswood, Manly, North Richmond & Richmond. Licensed plumber. Call 0430 546 749.',
        'hero_subtitle': 'Jean-Paul Barber installs water filtration systems across Sydney\'s North Shore and beyond. Licensed plumber, fixed prices, WaterMark certified systems and a lifetime workmanship warranty on every installation.',
        'intro_p1': 'Sydney\'s North Shore — from the commercial hub of Chatswood to the iconic beaches of Manly and the outer reaches of North Richmond and Richmond — is a region of significant diversity. Jean-Paul from Filters For You services all North Shore clients, installing water filtration systems in Chatswood apartments, Manly townhouses and North Shore family homes.',
        'intro_p2': 'Jean-Paul holds NSW Plumbing Licence 461511C and personally attends every North Shore installation. He covers Chatswood, Manly, North Richmond and Richmond. North Shore clients benefit from the same fixed pricing, lifetime warranty and personal service that has earned Filters For You its 5.0 Google rating across Greater Sydney.',
        'intro_bullets': [
            'Jean-Paul personally attends every North Shore installation',
            'Chatswood apartments, Manly townhouses, Richmond family homes — all covered',
            'Fixed price — supply and professional installation included',
            'Dedicated service pages for Chatswood',
            'Lifetime workmanship warranty on every install',
            'NSW Licensed Plumber 461511C — fully insured',
        ],
        'suburbs': [
            ('Chatswood', 'water-filter-installation-chatswood'),
            ('Manly', 'water-filter-installation-manly'),
            ('North Richmond', 'water-filter-installation-north-richmond'),
            ('Richmond', 'water-filter-installation-richmond'),
        ],
        'service_combos': [
            ('Whole House Filter Chatswood', 'whole-house-water-filter-chatswood', 'The HPF-3 whole house system installed at the mains — every tap in your Chatswood home gets filtered water.', 'From $3,050', 'Whole home coverage', ICON_HOUSE),
            ('Reverse Osmosis Chatswood', 'reverse-osmosis-installation-chatswood', 'Multi-stage reverse osmosis installation for Chatswood homes and apartments. Removes fluoride, chlorine and dissolved solids.', 'From $840', '5 and 7-stage options available', ICON_RO),
        ],
        'faq_items': [
            ('Who installs water filters on Sydney\'s North Shore?', 'Jean-Paul Barber from Filters For You installs water filters across the North Shore — Chatswood, Manly, North Richmond and Richmond. He is a NSW licensed plumber (Lic. 461511C) who personally attends every installation. Call 0430 546 749.'),
            ('How much does water filter installation cost on the North Shore?', 'Fixed pricing: under-sink filters from $550, reverse osmosis systems from $840, whole house HPF-3 from $3,050. All prices include supply and professional installation — no hidden fees.'),
            ('Do you travel to Chatswood for water filter installation?', 'Yes. Jean-Paul regularly installs water filtration systems in Chatswood apartments and houses. He has dedicated service pages for Chatswood whole house and reverse osmosis installations.'),
            ('How quickly can you book on the North Shore?', 'Most North Shore bookings are scheduled within 3 to 5 business days. Call 0430 546 749 to confirm availability.'),
        ],
        'photo1': 'install-10.jpg',
    },
]


def main():
    for data in REGIONS:
        slug = data['slug']
        html = build_region_page(data)
        filepath = os.path.join(WEBSITE_DIR, f'{slug}.html')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  CREATED: {slug}.html ({len(html):,} chars)')
    print(f'\nRegion pages done: {len(REGIONS)}')


if __name__ == '__main__':
    main()
