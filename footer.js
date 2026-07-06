/**
 * Fak'ugesi Shared Footer
 * Injects consistent footer + social band on every page.
 */
(function () {

  const style = document.createElement('style');
  style.textContent = `
    @font-face { font-family:'InterDisplay'; src:url('/fonts/InterDisplay-Regular.otf') format('opentype'); font-weight:400; }
    @font-face { font-family:'InterDisplay'; src:url('/fonts/InterDisplay-Medium.otf') format('opentype'); font-weight:500; }
    @font-face { font-family:'InterDisplay'; src:url('/fonts/InterDisplay-SemiBold.otf') format('opentype'); font-weight:600; }
    @font-face { font-family:'InterDisplay'; src:url('/fonts/InterDisplay-Bold.otf') format('opentype'); font-weight:700; }

    /* ── SOCIAL BAND ── */
    #fug-social-band {
      background: #1a2744;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 24px;
      padding: 18px 248px;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-social-band p {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      letter-spacing: 0.02em;
      margin: 0;
    }
    #fug-social-band .fsb-icons {
      display: flex;
      gap: 16px;
    }
    #fug-social-band .fsb-icons a {
      color: #fff;
      text-decoration: none;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
    }
    #fug-social-band .fsb-icons a:hover { opacity: 0.5; }

    /* ── FOOTER ── */
    #fug-footer {
      background: #fff;
      border-top: 1px solid rgba(26,39,68,0.1);
      color: #0d1b3e;
      position: relative;
      font-family: 'InterDisplay', sans-serif;
      padding: 0;
    }

    /* Cross overlay — spans the same 248px-padded content box as
       .fug-footer-inner. Left/right crosses sit at the box edges (0%
       / 100%); the middle cross is positioned at true 50%, so it is
       always exactly equidistant from the outer two regardless of
       how the content columns below are sized. */
    .fug-footer-crosses {
      position: absolute;
      left: 200px;
      right: 200px;
      height: 18px;
      pointer-events: none;
      z-index: 2;
    }
    .fug-footer-crosses-top { top: 52px; }
    .fug-footer-crosses-bottom { bottom: 52px; }

    .fug-footer-cross {
      position: absolute;
      top: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      opacity: 0.55;
    }
    .fug-footer-cross svg { width: 18px; height: 18px; }

    .fug-footer-crosses .fc-left { left: 0; }
    .fug-footer-crosses .fc-mid { left: 50%; transform: translateX(-50%); }
    .fug-footer-crosses .fc-right { left: 100%; transform: translateX(-100%); }
    .fug-footer-crosses-bottom .fc-mid { display: none; }

    /* Outer grid: left half = Brand block, right half = Contact +
       Logo/Copyright. The right half starts at exactly 50% of the
       248px-padded box — the same coordinate system the crosses use
       above — so the Contact heading lines up under the middle cross. */
    #fug-footer .fug-footer-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 128px 248px;
      gap: 0 32px;
      position: relative;
    }

    #fug-footer .fug-footer-right-half {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 0 32px;
    }

    #fug-footer .fug-footer-col {
      display: flex;
      flex-direction: column;
    }

    /* Col 1 — brand + address */
    #fug-footer .fug-footer-brand {
      font-weight: 700;
      font-size: 14px;
      color: #0d1b3e;
      margin: 0 0 8px 0;
      font-family: 'InterDisplay', sans-serif;
      letter-spacing: -0.01em;
      line-height: 1.3;
    }
    #fug-footer .fug-footer-addr {
      font-size: 12px;
      line-height: 1.7;
      color: #5a6070;
      margin: 0;
      font-family: 'InterDisplay', sans-serif;
    }

    /* Col 2 — contact stacked, aligned under the middle cross */
    #fug-footer .fug-footer-col-title {
      font-size: 12px;
      font-weight: 700;
      color: #0d1b3e;
      margin: 0 0 2px 0;
      font-family: 'InterDisplay', sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    #fug-footer a {
      color: #1a2744;
      font-size: 12px;
      display: block;
      line-height: 1.7;
      text-decoration: none;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-footer a:hover { text-decoration: underline; }

    /* Col 2 — align contact block with logo height */
    #fug-footer .fug-footer-contact-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 72px;
    }

    /* Col 3 — logo left, copyright + link right */
    #fug-footer .fug-footer-right {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 16px;
    }
    #fug-footer .fug-footer-logo {
      height: 72px;
      width: auto;
      display: block;
      flex-shrink: 0;
    }
    #fug-footer .fug-footer-copy {
      font-size: 11px;
      font-weight: 400;
      color: #5a6070;
      line-height: 1.65;
      margin: 0;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-footer .fug-footer-copy strong {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #0d1b3e;
      margin-bottom: 2px;
    }

    /* ── TABLET (≤1024px) ── */
    @media (max-width: 1024px) {
      #fug-social-band { padding: 16px 48px; }
      #fug-social-band p { font-size: 13px; }
      #fug-footer .fug-footer-inner { padding: 40px 48px; gap: 0 32px; }
      .fug-footer-crosses { display: none; }
    }

    /* ── MOBILE (≤768px) ── */
    @media (max-width: 768px) {
      #fug-social-band {
        flex-direction: column;
        gap: 12px;
        padding: 20px;
        text-align: center;
      }
      #fug-social-band p { font-size: 12px; }
      #fug-social-band .fsb-icons { justify-content: center; gap: 20px; }
      #fug-social-band .fsb-icons a svg { width: 22px; height: 22px; }
      #fug-footer .fug-footer-inner {
        grid-template-columns: 1fr;
        padding: 32px 20px 28px;
        gap: 24px 0;
      }
      #fug-footer .fug-footer-right-half {
        grid-template-columns: 1fr;
        gap: 24px 0;
      }
      #fug-footer .fug-footer-col { width: 100%; }
      #fug-footer .fug-footer-brand { font-size: 13px; }
      #fug-footer .fug-footer-addr { font-size: 12px; }
      #fug-footer .fug-footer-col-title { font-size: 10px; }
      #fug-footer a { font-size: 12px; line-height: 1.7; }
      #fug-footer .fug-footer-contact-block { height: auto; }
      #fug-footer .fug-footer-right {
        padding-top: 8px;
        border-top: 1px solid rgba(26,39,68,0.08);
        flex-direction: row;
        align-items: center;
        gap: 14px;
      }
      #fug-footer .fug-footer-logo { height: 56px; }
      #fug-footer .fug-footer-copy { font-size: 11px; }
      .fug-footer-crosses { display: none; }
    }

    @media (max-width: 480px) {
      #fug-social-band p { font-size: 11px; }
      #fug-footer .fug-footer-logo { height: 48px; }
      #fug-footer .fug-footer-copy { font-size: 11px; }
    }
  `;
  document.head.appendChild(style);

  const crossSVG = `<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="9" y1="0" x2="9" y2="18" stroke="#1a2744" stroke-width="0.75"/>
    <line x1="0"  y1="9" x2="18" y2="9" stroke="#1a2744" stroke-width="0.75"/>
  </svg>`;

  const html = `
    <div id="fug-social-band">
      <p>Follow us on socials @fakugesi</p>
      <div class="fsb-icons">
        <a href="https://www.instagram.com/fakugesi?igsh=MTh2YTI3cTN6M2YyZg==" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://x.com/fakugesi" target="_blank" rel="noopener" aria-label="X">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/fakugesi" target="_blank" rel="noopener" aria-label="Facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
      </div>
    </div>

    <footer id="fug-footer">

      <div class="fug-footer-crosses fug-footer-crosses-top">
        <span class="fug-footer-cross fc-left">${crossSVG}</span>
        <span class="fug-footer-cross fc-mid">${crossSVG}</span>
        <span class="fug-footer-cross fc-right">${crossSVG}</span>
      </div>

      <div class="fug-footer-inner">

        <!-- Left half: Brand + Address -->
        <div class="fug-footer-col">
          <p class="fug-footer-brand">Fak'ugesi African Digital & Innovation Festival</p>
          <p class="fug-footer-addr">
            Tshimologong Digital Innovation Precinct<br>
            41 Juta Street, Braamfontein<br>
            Johannesburg, South Africa
          </p>
        </div>

        <!-- Right half: Contact (starts at exact 50% — under middle cross) + Logo/Copyright -->
        <div class="fug-footer-right-half">

          <div class="fug-footer-col">
            <p class="fug-footer-col-title">Contact</p>
            <div class="fug-footer-contact-block">
              <a href="mailto:hello@fakugesi.co.za">hello@fakugesi.co.za</a>
              <a href="tel:+27117178156">+27 11 717 8156</a>
              <a href="https://fakugesi.co.za/" target="_blank" rel="noopener">fakugesi.co.za</a>
            </div>
          </div>

          <div class="fug-footer-col">
            <div class="fug-footer-right">
              <img class="fug-footer-logo" src="/images/logos/fakugesi/logo_fakugesi_dark.svg" alt="Fak'ugesi Festival" />
              <p class="fug-footer-copy">
                <strong>© 2026 Fak'ugesi<br>Festival</strong>
                All Rights Reserved<br>
                13–17 October 2026<br>
                Tshimologong, Johannesburg
              </p>
            </div>
          </div>

        </div>

      </div>

      <div class="fug-footer-crosses fug-footer-crosses-bottom">
        <span class="fug-footer-cross fc-left">${crossSVG}</span>
        <span class="fug-footer-cross fc-right">${crossSVG}</span>
      </div>

    </footer>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

})();