#!/usr/bin/env python3
"""
FFY Site Update Script — Session 7
- Replaces nav (desktop + mobile) on all HTML pages
- Replaces footer on all HTML pages
- Strips .html from all internal relative links
"""

import os
import re
import glob

WEBSITE_DIR = os.path.dirname(os.path.abspath(__file__))

# ──────────────────────────────────────────────
# NEW DESKTOP NAV
# ──────────────────────────────────────────────
NEW_NAV = '''<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="assets/brand/logos/logo-transparent.svg" alt="Filters For You" height="42"></a>
    <ul class="nav-links" id="navLinks">
      <li class="nav-item has-dropdown">
        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Systems <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="dropdown dropdown-2col">
          <div class="dropdown-col">
            <a href="under-sink-water-filter-sydney">Under Sink Water Filter</a>
            <a href="whole-house-water-filter-sydney">Whole House Water Filter</a>
            <a href="reverse-osmosis-water-filter-sydney">Reverse Osmosis</a>
            <a href="water-filter-systems">View All Systems</a>
            <div style="border-top:1px solid rgba(50,65,88,.1);margin:5px 2px 3px"></div>
            <a href="pure-essential-water-filter-sydney">Pure Essential</a>
            <a href="pure-plus-water-filter-sydney">Pure Plus+</a>
            <a href="pure-premium-water-filter-sydney">Pure Premium</a>
          </div>
          <div class="dropdown-col">
            <a href="pure-advanced-water-filter-sydney">Pure Advanced</a>
            <a href="pure-luxe-water-filter-sydney">Pure Luxe</a>
            <a href="pure-home-water-filter-sydney">Pure Home</a>
            <a href="pure-compact-water-filter-sydney">Pure Compact</a>
          </div>
        </div>
      </li>
      <li class="nav-item has-dropdown">
        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Locations <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="dropdown">
          <a href="locations-inner-west">Inner West</a>
          <a href="locations-eastern-suburbs">Eastern Suburbs</a>
          <a href="locations-south-sydney">South Sydney</a>
          <a href="locations-inner-city">Inner City &amp; CBD</a>
          <a href="locations-western-sydney">Western Sydney</a>
          <a href="locations-north-shore">North Shore &amp; Beyond</a>
        </div>
      </li>
      <li class="nav-item has-dropdown">
        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Resources <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="dropdown">
          <a href="how-water-filters-work">How Water Filters Work</a>
          <a href="is-sydney-water-safe">Is Sydney Water Safe?</a>
          <a href="sydney-water-quality-guide">Sydney Water Quality Guide</a>
          <a href="sydney-water-filter-cost-guide">Water Filter Cost Guide</a>
          <a href="water-filter-faq-sydney">Water Filter FAQ</a>
          <a href="water-filter-maintenance-guide">Maintenance Guide</a>
          <a href="water-savings-calculator">Water Savings Calculator</a>
          <a href="filter-lifespan-calculator">Filter Lifespan Calculator</a>
          <a href="water-filter-pfas-removal-sydney">PFAS Water Filter Guide</a>
          <a href="best-water-filter-sydney">Best Water Filter Sydney</a>
        </div>
      </li>
      <li><a href="index#reviews" class="nav-link-plain">Reviews</a></li>
      <li><a href="index#contact" class="nav-link-plain" style="background:#0b61f4;color:#fff!important;padding:8px 16px;border-radius:8px;margin-left:4px;font-weight:700">Get a Free Quote</a></li>
    </ul>
    <button class="nav-hamburger" id="navHamburger" aria-label="Open menu" aria-expanded="false">
      <span class="ham-bar"></span>
      <span class="ham-bar"></span>
      <span class="ham-bar"></span>
    </button>
    <div class="online-dot-wrap"><div class="dot"></div>Online</div>
    <a href="tel:0430546749" class="nav-cta">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>
      0430 546 749
    </a>
  </div>
</nav>'''

# ──────────────────────────────────────────────
# NEW MOBILE NAV
# ──────────────────────────────────────────────
NEW_MOBILE_NAV = '''<div class="mobile-nav" id="mobileNav" role="dialog" aria-modal="true" aria-label="Navigation">
  <div class="mobile-nav-header">
    <a href="/"><img src="assets/brand/logos/logo-transparent.svg" alt="Filters For You" height="36"></a>
    <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M4 4l14 14M18 4L4 18" stroke="#324158" stroke-width="2.2" stroke-linecap="round"/></svg>
    </button>
  </div>
  <div class="mobile-nav-body">
    <div class="mobile-section">
      <button class="mobile-section-btn">Systems <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <div class="mobile-section-links">
        <a href="under-sink-water-filter-sydney">Under Sink Water Filter</a>
        <a href="whole-house-water-filter-sydney">Whole House Water Filter</a>
        <a href="reverse-osmosis-water-filter-sydney">Reverse Osmosis</a>
        <a href="water-filter-systems">View All Systems</a>
        <a href="pure-essential-water-filter-sydney">Pure Essential</a>
        <a href="pure-plus-water-filter-sydney">Pure Plus+</a>
        <a href="pure-premium-water-filter-sydney">Pure Premium</a>
        <a href="pure-advanced-water-filter-sydney">Pure Advanced</a>
        <a href="pure-luxe-water-filter-sydney">Pure Luxe</a>
        <a href="pure-home-water-filter-sydney">Pure Home</a>
        <a href="pure-compact-water-filter-sydney">Pure Compact</a>
      </div>
    </div>
    <div class="mobile-section">
      <button class="mobile-section-btn">Locations <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <div class="mobile-section-links">
        <a href="locations-inner-west">Inner West</a>
        <a href="locations-eastern-suburbs">Eastern Suburbs</a>
        <a href="locations-south-sydney">South Sydney</a>
        <a href="locations-inner-city">Inner City &amp; CBD</a>
        <a href="locations-western-sydney">Western Sydney</a>
        <a href="locations-north-shore">North Shore &amp; Beyond</a>
      </div>
    </div>
    <div class="mobile-section">
      <button class="mobile-section-btn">Resources <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <div class="mobile-section-links">
        <a href="how-water-filters-work">How Water Filters Work</a>
        <a href="is-sydney-water-safe">Is Sydney Water Safe?</a>
        <a href="sydney-water-quality-guide">Sydney Water Quality Guide</a>
        <a href="sydney-water-filter-cost-guide">Water Filter Cost Guide</a>
        <a href="water-filter-faq-sydney">Water Filter FAQ</a>
        <a href="water-filter-maintenance-guide">Maintenance Guide</a>
        <a href="water-savings-calculator">Water Savings Calculator</a>
        <a href="filter-lifespan-calculator">Filter Lifespan Calculator</a>
        <a href="water-filter-pfas-removal-sydney">PFAS Water Filter Guide</a>
        <a href="best-water-filter-sydney">Best Water Filter Sydney</a>
      </div>
    </div>
    <div class="mobile-plain-links">
      <a href="index#reviews">Reviews</a>
      <a href="index#contact">Get a Free Quote</a>
    </div>
    <a href="tel:0430546749" class="mobile-cta">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>
      Call 0430 546 749
    </a>
  </div>
</div>'''

# ──────────────────────────────────────────────
# NEW FOOTER CSS (injected as style block before footer)
# ──────────────────────────────────────────────
NEW_FOOTER_CSS = '''<style id="footer-v2-css">
.footer-v2{background:#1e2d40;color:rgba(255,255,255,.6);padding:56px 32px 32px}
.footer-v2 .fv2-inner{max-width:1380px;margin:0 auto}
.fv2-brand-row{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:20px;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:32px}
.fv2-brand-info p{font-size:13.5px;line-height:1.7;margin-top:10px;max-width:300px;color:rgba(255,255,255,.55)}
.fv2-social-row{display:flex;gap:10px;margin-top:14px}
.fv2-social-link{font-family:'Sora',sans-serif;font-size:12.5px;font-weight:600;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.15);padding:5px 12px;border-radius:4px;transition:color .2s,border-color .2s;text-decoration:none}
.fv2-social-link:hover{color:#fff;border-color:rgba(255,255,255,.4)}
.fv2-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:28px;margin-bottom:40px}
.fv2-col h4{font-family:'Sora',sans-serif;font-size:12px;font-weight:700;color:#fff;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.07em}
.fv2-col ul{list-style:none;margin:0;padding:0}
.fv2-col ul li{margin-bottom:4px}
.fv2-col ul li a,.fv2-col a{font-family:'Sora',sans-serif;font-size:12.5px;color:rgba(255,255,255,.55);transition:color .2s;text-decoration:none;display:block;line-height:1.5}
.fv2-col ul li a:hover,.fv2-col a:hover{color:#fff}
.fv2-region-head{font-family:'Sora',sans-serif;font-size:10.5px;font-weight:700;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:0.09em;margin:12px 0 4px}
.fv2-region-head:first-child{margin-top:0}
.fv2-contact-line{font-family:'Sora',sans-serif;font-size:12.5px;margin-bottom:6px;display:flex;align-items:center;gap:7px;color:rgba(255,255,255,.55)}
.fv2-contact-line a{color:rgba(255,255,255,.55);transition:color .2s;text-decoration:none}
.fv2-contact-line a:hover{color:#fff}
.fv2-bottom{border-top:1px solid rgba(255,255,255,.08);padding-top:24px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-family:'Sora',sans-serif;font-size:12px;color:rgba(255,255,255,.35)}
@media(max-width:1100px){.fv2-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:640px){.fv2-grid{grid-template-columns:1fr 1fr}.fv2-brand-row{flex-direction:column}}
@media(max-width:400px){.fv2-grid{grid-template-columns:1fr}}
</style>'''

# ──────────────────────────────────────────────
# NEW FOOTER HTML
# ──────────────────────────────────────────────
NEW_FOOTER_HTML = '''<footer class="footer-v2">
  <div class="fv2-inner">
    <div class="fv2-brand-row">
      <div class="fv2-brand-info">
        <img src="assets/brand/logos/logo-transparent.svg" alt="Filters For You" width="140" height="36" style="height:36px;width:auto">
        <p>Sydney's trusted water filter installation specialist. Jean-Paul Barber personally installs every system across Greater Sydney. Fixed prices, Lic. 461511C, lifetime warranty.</p>
        <div class="fv2-social-row">
          <a href="https://instagram.com/filtersforyouau" class="fv2-social-link" rel="noopener noreferrer" target="_blank">Instagram</a>
          <a href="https://facebook.com/filtersforyouau" class="fv2-social-link" rel="noopener noreferrer" target="_blank">Facebook</a>
          <a href="https://tiktok.com/@filtersforyouau" class="fv2-social-link" rel="noopener noreferrer" target="_blank">TikTok</a>
        </div>
      </div>
    </div>
    <div class="fv2-grid">
      <!-- Col 1: Services -->
      <div class="fv2-col">
        <h4>Services</h4>
        <ul>
          <li><a href="under-sink-water-filter-sydney">Under Sink Water Filter Sydney</a></li>
          <li><a href="whole-house-water-filter-sydney">Whole House Water Filter Sydney</a></li>
          <li><a href="reverse-osmosis-water-filter-sydney">Reverse Osmosis Sydney</a></li>
          <li><a href="water-filter-systems">View All Systems</a></li>
          <li><a href="water-filter-systems">Water Filter Systems Comparison</a></li>
          <li><a href="whole-house-vs-under-sink-water-filter">Whole House vs Under Sink</a></li>
        </ul>
      </div>
      <!-- Col 2: Service + Location -->
      <div class="fv2-col">
        <h4>Service + Location</h4>
        <ul>
          <li><a href="under-sink-water-filter-bondi">Under Sink Bondi</a></li>
          <li><a href="under-sink-water-filter-parramatta">Under Sink Parramatta</a></li>
          <li><a href="under-sink-water-filter-randwick">Under Sink Randwick</a></li>
          <li><a href="whole-house-water-filter-bondi">Whole House Bondi</a></li>
          <li><a href="whole-house-water-filter-parramatta">Whole House Parramatta</a></li>
          <li><a href="whole-house-water-filter-chatswood">Whole House Chatswood</a></li>
          <li><a href="reverse-osmosis-installation-bondi">Reverse Osmosis Bondi</a></li>
          <li><a href="reverse-osmosis-installation-parramatta">Reverse Osmosis Parramatta</a></li>
          <li><a href="reverse-osmosis-installation-chatswood">Reverse Osmosis Chatswood</a></li>
        </ul>
      </div>
      <!-- Col 3: Locations Inner West + Eastern Suburbs -->
      <div class="fv2-col">
        <h4>Locations</h4>
        <p class="fv2-region-head">Inner West</p>
        <a href="water-filter-installation-ashfield">Ashfield</a>
        <a href="water-filter-installation-balmain">Balmain</a>
        <a href="water-filter-installation-burwood">Burwood</a>
        <a href="water-filter-installation-campsie">Campsie</a>
        <a href="water-filter-installation-concord">Concord</a>
        <a href="water-filter-installation-croydon-park">Croydon Park</a>
        <a href="water-filter-installation-drummoyne">Drummoyne</a>
        <a href="water-filter-installation-enmore">Enmore</a>
        <a href="water-filter-installation-erskineville">Erskineville</a>
        <a href="water-filter-installation-five-dock">Five Dock</a>
        <a href="water-filter-installation-glebe">Glebe</a>
        <a href="water-filter-installation-homebush">Homebush</a>
        <a href="water-filter-installation-leichhardt">Leichhardt</a>
        <a href="water-filter-installation-marrickville">Marrickville</a>
        <a href="water-filter-installation-newtown">Newtown</a>
        <a href="water-filter-installation-petersham">Petersham</a>
        <a href="water-filter-installation-rozelle">Rozelle</a>
        <a href="water-filter-installation-stanmore">Stanmore</a>
        <a href="water-filter-installation-strathfield">Strathfield</a>
        <a href="water-filter-installation-annandale">Annandale</a>
        <p class="fv2-region-head">Eastern Suburbs</p>
        <a href="water-filter-installation-bondi">Bondi</a>
        <a href="water-filter-installation-coogee">Coogee</a>
        <a href="water-filter-installation-kensington">Kensington</a>
        <a href="water-filter-installation-maroubra">Maroubra</a>
        <a href="water-filter-installation-paddington">Paddington</a>
        <a href="water-filter-installation-randwick">Randwick</a>
        <a href="water-filter-installation-surry-hills">Surry Hills</a>
        <a href="water-filter-installation-waterloo">Waterloo</a>
        <a href="water-filter-installation-zetland">Zetland</a>
      </div>
      <!-- Col 4: More Locations -->
      <div class="fv2-col">
        <h4>More Locations</h4>
        <p class="fv2-region-head">South Sydney</p>
        <a href="water-filter-installation-alexandria">Alexandria</a>
        <a href="water-filter-installation-arncliffe">Arncliffe</a>
        <a href="water-filter-installation-beaconsfield">Beaconsfield</a>
        <a href="water-filter-installation-botany">Botany</a>
        <a href="water-filter-installation-brighton-le-sands">Brighton-le-Sands</a>
        <a href="water-filter-installation-hurstville">Hurstville</a>
        <a href="water-filter-installation-kogarah">Kogarah</a>
        <a href="water-filter-installation-mascot">Mascot</a>
        <a href="water-filter-installation-miranda">Miranda</a>
        <a href="water-filter-installation-ramsgate">Ramsgate</a>
        <a href="water-filter-installation-rockdale">Rockdale</a>
        <a href="water-filter-installation-tempe">Tempe</a>
        <p class="fv2-region-head">Inner City</p>
        <a href="water-filter-installation-chippendale">Chippendale</a>
        <a href="water-filter-installation-pyrmont">Pyrmont</a>
        <a href="water-filter-installation-redfern">Redfern</a>
        <a href="water-filter-installation-sydney-cbd">Sydney CBD</a>
        <a href="water-filter-installation-ultimo">Ultimo</a>
        <p class="fv2-region-head">Western Sydney</p>
        <a href="water-filter-installation-auburn">Auburn</a>
        <a href="water-filter-installation-bankstown">Bankstown</a>
        <a href="water-filter-installation-fairfield">Fairfield</a>
        <a href="water-filter-installation-granville">Granville</a>
        <a href="water-filter-installation-lidcombe">Lidcombe</a>
        <a href="water-filter-installation-liverpool">Liverpool</a>
        <a href="water-filter-installation-parramatta">Parramatta</a>
        <p class="fv2-region-head">North Shore</p>
        <a href="water-filter-installation-chatswood">Chatswood</a>
        <a href="water-filter-installation-manly">Manly</a>
        <a href="water-filter-installation-north-richmond">North Richmond</a>
        <a href="water-filter-installation-richmond">Richmond</a>
      </div>
      <!-- Col 5: Resources -->
      <div class="fv2-col">
        <h4>Resources</h4>
        <ul>
          <li><a href="how-water-filters-work">How Water Filters Work</a></li>
          <li><a href="is-sydney-water-safe">Is Sydney Water Safe?</a></li>
          <li><a href="sydney-water-quality-guide">Sydney Water Quality Guide</a></li>
          <li><a href="water-filter-faq-sydney">Water Filter FAQ</a></li>
          <li><a href="sydney-water-filter-cost-guide">Cost Guide</a></li>
          <li><a href="water-filter-maintenance-guide">Maintenance Guide</a></li>
          <li><a href="water-savings-calculator">Water Savings Calculator</a></li>
          <li><a href="filter-lifespan-calculator">Filter Lifespan Calculator</a></li>
          <li><a href="water-filter-pfas-removal-sydney">PFAS Removal Guide</a></li>
          <li><a href="water-filter-baby-safe-sydney">Baby Safe Water</a></li>
          <li><a href="best-water-filter-sydney">Best Water Filter Sydney</a></li>
          <li><a href="watermark-certified-water-filter-sydney">WaterMark Certified</a></li>
        </ul>
      </div>
      <!-- Col 6: Company -->
      <div class="fv2-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="index#reviews">Reviews</a></li>
          <li><a href="privacy-policy">Privacy Policy</a></li>
          <li><a href="terms-and-conditions">Terms &amp; Conditions</a></li>
          <li><a href="refund-policy">Refund Policy</a></li>
        </ul>
        <div style="margin-top:14px">
          <div class="fv2-contact-line">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>
            <a href="tel:0430546749">0430 546 749</a>
          </div>
          <div class="fv2-contact-line">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            <a href="mailto:info@filtersforyou.com.au">info@filtersforyou.com.au</a>
          </div>
          <div class="fv2-contact-line">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            Croydon Park NSW
          </div>
          <div class="fv2-contact-line">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5h-2V13H9v2.5H7V8h2v3h4V8h2v7.5z"/></svg>
            Lic. 461511C
          </div>
        </div>
      </div>
    </div>
    <div class="fv2-bottom">
      <span>&copy; 2025 Filters For You &middot; ABN 81 672 101 674 &middot; Lic. 461511C &middot; filtersforyou.com.au</span>
      <span>
        <a href="privacy-policy" style="color:rgba(255,255,255,.35);text-decoration:none;margin-right:14px">Privacy</a>
        <a href="terms-and-conditions" style="color:rgba(255,255,255,.35);text-decoration:none">Terms</a>
      </span>
    </div>
  </div>
</footer>'''


def strip_html_from_links(content):
    """Strip .html extension from all relative internal href links."""
    # Matches href values that are not external (https/http), mailto, tel, or anchor-only (#)
    # Handles: href="page.html", href="/page.html", href="page.html#section"
    return re.sub(
        r'(href="(?!https?://|mailto:|tel:|#)[^"]*?)\.html',
        r'\1',
        content
    )


def update_page(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Replace desktop nav
    content = re.sub(
        r'<nav class="nav">.*?</nav>',
        NEW_NAV,
        content,
        flags=re.DOTALL
    )

    # 2. Replace mobile nav (everything from <div class="mobile-nav" up to the closing </div> before the nav JS script)
    content = re.sub(
        r'<div class="mobile-nav".*?</div>\s*(?=<script id="dropdown-nav-js">)',
        NEW_MOBILE_NAV + '\n',
        content,
        flags=re.DOTALL
    )

    # 3. Replace old footer (class="footer") with new footer CSS + HTML
    # First insert the CSS before the footer (if not already present)
    if 'footer-v2-css' not in content:
        content = re.sub(
            r'<footer class="footer">',
            NEW_FOOTER_CSS + '\n' + '<footer class="footer-placeholder-replaced">',
            content,
            flags=re.DOTALL
        )
        content = re.sub(r'<footer class="footer-placeholder-replaced">.*?</footer>',
                         NEW_FOOTER_HTML, content, flags=re.DOTALL)
    else:
        # CSS already there, just replace footer HTML
        content = re.sub(r'<footer class="footer">.*?</footer>',
                         NEW_FOOTER_HTML, content, flags=re.DOTALL)

    # Also replace footer-v2 if it was already applied (idempotent)
    # (handled by the footer-v2-css check above)

    # 4. Strip .html from internal links
    content = strip_html_from_links(content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    html_files = sorted(glob.glob(os.path.join(WEBSITE_DIR, '*.html')))
    # Exclude this script's output and any temp files
    skip = {'update_site.py'}

    updated = 0
    skipped = 0
    errors = []

    for filepath in html_files:
        basename = os.path.basename(filepath)
        if basename in skip:
            continue
        try:
            changed = update_page(filepath)
            if changed:
                print(f'  UPDATED: {basename}')
                updated += 1
            else:
                print(f'  SKIPPED (no change): {basename}')
                skipped += 1
        except Exception as e:
            print(f'  ERROR: {basename} — {e}')
            errors.append(basename)

    print(f'\n=== DONE ===')
    print(f'Updated:  {updated}')
    print(f'Skipped:  {skipped}')
    print(f'Errors:   {len(errors)}')
    if errors:
        print('Error files:', errors)


if __name__ == '__main__':
    main()
