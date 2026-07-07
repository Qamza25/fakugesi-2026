(function () {
  const path = window.location.pathname;
  const page = path.replace(/^\//, '').replace(/\.html$/, '') || 'index';
  function isActive(href) {
    return page === href.replace(/^\//, '').replace(/\.html$/, '');
  }
  document.head.insertAdjacentHTML('beforeend', `
<link rel="icon" type="image/x-icon" href="/images/favicon_io/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon_io/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon_io/favicon-16x16.png">
<link rel="apple-touch-icon" href="/images/favicon_io/apple-touch-icon.png">
<link rel="manifest" href="/images/favicon_io/site.webmanifest">
`);
  document.head.insertAdjacentHTML('beforeend', `<style>
    
    #main-nav {
      position:fixed; top:0; left:0; right:0; z-index:1000;
      display:flex; align-items:center; height:58px;
      background:transparent; border-bottom:1px solid transparent;
      font-family:'InterDisplay',sans-serif;
      transition:border-color .35s;
      overflow:visible;
    }

    #main-nav::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(10,18,50,0.98) 0%,
        rgba(15,24,60,0.92) 35%,
        rgba(20,32,72,0.72) 70%,
        rgba(26,40,80,0.35) 100%
      );
      opacity: 0;
      transition: opacity 0.45s ease;
      pointer-events: none;
      z-index: 0;
    }
    #main-nav.scrolled::before { opacity: 1; }
    #main-nav.scrolled { box-shadow: 0 4px 32px rgba(0,0,0,0.18); }

    /* ── HOME LOGO ── */
    #nav-home-logo {
      position: absolute; left: 32px; top: 50%; transform: translateY(-50%);
      z-index: 2; display: flex; align-items: center;
      text-decoration: none; pointer-events: none; user-select: none;
    }
    #nav-home-logo img {
      height: 26px; width: auto; display: block;
      filter: brightness(0) invert(1); opacity: 0.88;
    }

    /* ── Desktop nav links ── */
    #main-nav .nav-links-wrap {
      flex: 1; display: flex; align-items: center;
      padding-left: 248px; position: relative; z-index: 1;
      overflow: visible; transition: opacity 0.3s ease;
    }
    #main-nav .nav-links {
      display: flex; align-items: center; list-style: none; margin: 0; padding: 0; overflow: visible;
    }
    #main-nav .nav-links>li { position:relative; overflow:visible; }
    #main-nav .nav-links>li>a,
    #main-nav .nav-links>li>span {
      color:rgba(255,255,255,0.82); font-size:13px; font-weight:500;
      letter-spacing:.01em; text-decoration:none; line-height:58px;
      white-space:nowrap; display:block; padding:0 20px; cursor:pointer;
    }
    #main-nav .nav-links>li:first-child>a,
    #main-nav .nav-links>li:first-child>span { padding-left: 0; }
    #main-nav .nav-links>li>a.active,
    #main-nav .nav-links>li>span.active { color:#fff; font-weight:400; }

    /* Standard dropdown */
    #main-nav .nav-dd {
      position:absolute; top:57px; left:0; min-width:200px;
      background:rgba(8,15,44,0.97); border:1px solid rgba(255,255,255,0.1);
      backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
      padding:8px 0; opacity:0; pointer-events:none; transform:translateY(-8px);
      transition:opacity .22s,transform .22s; z-index:200;
    }
    #main-nav .nav-links>li:hover .nav-dd { opacity:1; pointer-events:auto; transform:translateY(0); }
    #main-nav .nav-dd a {
      display:block; padding:9px 20px;
      color:rgba(255,255,255,0.75); font-size:12.5px; font-weight:500;
      text-decoration:none; transition:background .18s, padding-left .2s ease; line-height:1.4;
    }
    #main-nav .nav-dd a:hover { background:rgba(255,255,255,0.07); padding-left:28px; }

    /* Right-side controls */
    #main-nav .nav-right {
      display:flex; align-items:center; gap:0; padding-right:32px;
      flex-shrink:0; position:relative; z-index:2;
    }

    /* ── SEARCH ICON BUTTON ── */
    #main-nav .nav-search {
      background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.78);
      display:flex; align-items:center; padding:6px 12px 6px 6px;
      position: relative; z-index: 2; transition: color 0.18s; flex-shrink: 0;
    }
    #main-nav .nav-search svg{width:18px;height:18px;}
    #main-nav .nav-search:hover { color: #fff; }

    /* ── COMPACT INLINE SEARCH ── */
    #nav-search-bar {
      display: flex; align-items: center; gap: 8px;
      overflow: hidden; max-width: 0; opacity: 0; pointer-events: none;
      transition: max-width 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease;
      position: relative; z-index: 2;
      background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0);
      border-radius: 2px; height: 34px; padding: 0;
    }
    #nav-search-bar.open {
      max-width: 260px; opacity: 1; pointer-events: auto;
      border-color: rgba(255,255,255,0.22); padding: 0 10px 0 12px;
    }
    #nav-search-inline-input {
      flex: 1; background: none; border: none; outline: none; color: #fff;
      font-family: 'InterDisplay', sans-serif; font-size: 13px; font-weight: 400;
      letter-spacing: 0.01em; caret-color: rgba(255,255,255,0.8); min-width: 0; width: 180px;
    }
    #nav-search-inline-input::placeholder { color: rgba(255,255,255,0.4); }
    #nav-search-close-btn {
      background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.45);
      font-size: 18px; line-height: 1; padding: 2px 0 2px 4px; font-family: sans-serif;
      flex-shrink: 0; transition: color 0.18s;
    }
    #nav-search-close-btn:hover { color: #fff; }

    /* ── SEARCH RESULTS DROPDOWN ── */
    #nav-search-results-drop {
      position: fixed; top: 58px; right: 32px; width: 340px;
      background: rgba(8,15,44,0.98); border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      max-height: 420px; overflow-y: auto; scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.15) transparent;
      z-index: 9999; display: none; border-top: none;
    }
    #nav-search-results-drop.open { display: block; }
    #nav-search-results-drop::-webkit-scrollbar { width: 4px; }
    #nav-search-results-drop::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

    .nsr-item {
      display: flex; align-items: flex-start; gap: 14px; padding: 13px 20px;
      text-decoration: none; cursor: pointer;
      border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.15s;
    }
    .nsr-item:last-child { border-bottom: none; }
    .nsr-item:hover { background: rgba(255,255,255,0.07); }
    .nsr-section {
      font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      min-width: 80px; flex-shrink: 0; padding-top: 2px; font-family: 'InterDisplay', sans-serif;
    }
    .nsr-title {
      font-size: 13.5px; font-weight: 600; color: #fff;
      font-family: 'InterDisplay', sans-serif; line-height: 1.3;
    }
    .nsr-title mark { background: none; color: rgba(255,220,60,0.95); font-weight: 700; }
    .nsr-no-results {
      padding: 20px; text-align: center; font-size: 13px;
      color: rgba(255,255,255,0.4); font-family: 'InterDisplay', sans-serif;
    }
    .nsr-hint {
      padding: 8px 20px; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
      color: rgba(255,255,255,0.28); font-family: 'InterDisplay', sans-serif;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    /* GET TICKETS */
    #main-nav .nav-tickets {
      position:relative; overflow:hidden;
      background:#1a2744; color:#fff;
      border:1.5px solid rgba(255,255,255,0.38); border-radius:0;
      cursor:pointer; padding:9px 22px;
      font-size:11.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
      font-family:'InterDisplay',sans-serif; text-decoration:none;
      display:inline-flex; align-items:center; white-space:nowrap;
      transition:background .22s,border-color .22s,transform .15s;
    }
    #main-nav .nav-tickets:hover{background:#00f4f5;color:#0d1b3e;border-color:#00f4f5;box-shadow:0 0 20px #00f4f5,0 0 44px #00f4f5;transform:translateY(-1px);}
    #main-nav .nav-tickets span{position:relative;z-index:1;}

    /* ── HAMBURGER BUTTON ── */
    #nav-hamburger {
      display: none; flex-direction: column; justify-content: center;
      align-items: center; gap: 5px; width: 40px; height: 40px;
      background: none; border: none; cursor: pointer;
      position: relative; z-index: 1001; padding: 8px; margin-right: 12px;
    }
    #nav-hamburger span {
      display: block; width: 22px; height: 1.5px; background: #fff;
      transition: transform 0.3s ease, opacity 0.3s ease; transform-origin: center;
    }
    #nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    #nav-hamburger.open span:nth-child(2) { opacity: 0; }
    #nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    /* ── MOBILE LOGO ── */
    #nav-mobile-logo {
      display: none; position: relative; z-index: 1; padding-left: 20px; flex: 1;
    }
    #nav-mobile-logo img { height: 24px; width: auto; display: block; filter: brightness(0) invert(1); }

    /* ── MOBILE MENU OVERLAY ── */
    #nav-mobile-menu {
      display: none; position: fixed; inset: 0;
      background: rgba(10,18,48,0.98); backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px); z-index: 999;
      flex-direction: column; justify-content: center;
      padding: 80px 28px 48px; overflow-y: auto;
      opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
    }
    #nav-mobile-menu.open { display: flex; opacity: 1; pointer-events: auto; }
    #nav-mobile-menu .mob-nav-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(255,255,255,0.1); }
    #nav-mobile-menu .mob-nav-list li { border-bottom: 1px solid rgba(255,255,255,0.1); }
    #nav-mobile-menu .mob-nav-list > li > a,
    #nav-mobile-menu .mob-nav-list > li > span {
      display: flex; align-items: center; justify-content: space-between; padding: 18px 0;
      color: #fff; text-decoration: none; font-size: 22px; font-weight: 700;
      letter-spacing: -0.01em; font-family: 'InterDisplay', sans-serif;
      cursor: pointer; transition: opacity 0.2s;
    }
    #nav-mobile-menu .mob-nav-list > li > a:hover,
    #nav-mobile-menu .mob-nav-list > li > span:hover { opacity: 0.65; }
    #nav-mobile-menu .mob-nav-list > li > a.active { opacity: 0.5; }
    #nav-mobile-menu .mob-sub { list-style: none; margin: 0; padding: 0 0 12px 12px; display: none; }
    #nav-mobile-menu .mob-sub.open { display: block; }
    #nav-mobile-menu .mob-sub li a {
      display: block; padding: 9px 0; color: rgba(255,255,255,0.65);
      font-size: 14px; font-weight: 500; font-family: 'InterDisplay', sans-serif;
      text-decoration: none; transition: color 0.2s;
    }
    #nav-mobile-menu .mob-sub li a:hover { color: #fff; }
    .mob-chevron {
      display: inline-block; width: 20px; height: 20px;
      border-right: 2px solid rgba(255,255,255,0.5); border-bottom: 2px solid rgba(255,255,255,0.5);
      transform: rotate(45deg); transition: transform 0.25s; flex-shrink: 0;
      margin-left: 12px; position: relative; top: -3px;
    }
    .mob-chevron.open { transform: rotate(-135deg); top: 3px; }
    #nav-mobile-menu .mob-tickets {
      display: block; margin-top: 32px; padding: 16px 28px;
      background: transparent; border: 1.5px solid rgba(255,255,255,0.4); color: #fff;
      font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
      text-decoration: none; font-family: 'InterDisplay', sans-serif;
      text-align: center; transition: background 0.2s, border-color 0.2s;
    }
    #nav-mobile-menu .mob-tickets:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,220,60,0.6); }
    #nav-mobile-menu .mob-socials { display: flex; gap: 20px; align-items: center; margin-top: 28px; }
    #nav-mobile-menu .mob-socials a {
      color: rgba(255,255,255,0.55); text-decoration: none;
      display: flex; align-items: center; transition: color 0.2s;
    }
    #nav-mobile-menu .mob-socials a:hover { color: #fff; }

    /* Button hover transitions */
    .btn-primary, .btn-outline-dark, .btn-outline-white,
    .btn-apply, .btn-cta-white, .btn-cta-filled, .btn-learn,
    .hero-cta, .intro-cta, .network-cta, .section-cta,
    .challenge-cta, a.btn-tickets, button.btn-tickets, .btn-get-pass,
    .showcase-cta-btn,
    [class*="btn-"]:not(.req-btn):not(.faq-q-btn):not(.nav-tickets):not(.nav-search):not(.showcase-detail-back):not(.speaker-detail-back) {
      transition: background 0.28s ease, color 0.22s ease,
                  border-color 0.28s ease, transform 0.18s ease !important;
    }
    .btn-primary:hover { background: #0d1b3e; color: #fff; border-color: rgba(100,160,255,0.65); transform: translateY(-1px); }
    .btn-outline-dark:hover { background: #0d1b3e; color: #fff; border-color: rgba(100,160,255,0.65); transform: translateY(-1px); }
    .btn-outline-white:hover { background: #0d1b3e; color: #fff; border-color: rgba(100,160,255,0.65); transform: translateY(-1px); }

    /* ══ RESPONSIVE ══ */
    @media (max-width: 1024px) {
      #nav-home-logo { left: 24px; }
      #main-nav .nav-links-wrap { padding-left: 200px; }
      #main-nav .nav-right { padding-right: 24px; }
      #main-nav .nav-links>li>a, #main-nav .nav-links>li>span { font-size: 12px; padding: 0 14px; }
      #main-nav .nav-tickets { padding: 8px 16px; font-size: 10.5px; }
      #nav-search-bar.open { max-width: 200px; }
      #nav-search-results-drop { right: 24px; width: 300px; }
    }
    @media (max-width: 768px) {
      #main-nav .nav-links-wrap { display: none; }
      #main-nav .nav-right { display: none; }
      #nav-hamburger { display: flex; }
      #nav-mobile-logo { display: flex; align-items: center; }
      #nav-home-logo { display: none; }
      #main-nav::before { opacity: 1 !important; }
      #nav-search-bar { display: none; }
      #nav-search-results-drop { display: none !important; }
    }
  </style>`);

  /* ── Signature Programmes pages ── */
  const SIG_PAGES = [
    { label: 'Awards',           href: '/sig-awards.html'      },
    { label: 'Dala Khona',       href: '/sig-dalakhona.html'   },
    { label: 'PRO',              href: '/sig-fakugesipro.html'  },
    { label: 'Immersive Africa', href: '/sig-immersive.html'   },
    { label: 'JAMZ',             href: '/sig-jamz.html'        },
    { label: 'Pitchathon',       href: '/sig-pitchathon.html'  },
  ];

  const sigHrefs = SIG_PAGES.map(p => p.href.replace(/^\//, '').replace(/\.html$/, ''));
  const isAnySigPage = sigHrefs.includes(page);

  /*  Desktop dropdown*/
  const sigDropHTML = SIG_PAGES.map(p => `<a href="${p.href}">${p.label}</a>`).join('');

  const links = [
    { label: 'Home',                 href: '/index.html' },
    { label: 'Festival Programme',   href: '/festival-programmes.html' },
    { label: 'Signature Programmes', href: '/sig-awards.html', sigDd: true },
    { label: 'Discover',             href: '#', dd: [
      { label: 'About Us',   href: '/about.html' },
      { label: 'Venues',     href: '/discover/venues.html' },
      { label: 'Resources',  href: '/discover/resources.html' },
    ]},
  ];

  /* ── Desktop nav items ── */
  const items = links.map((l, i) => {
    const active = l.sigDd ? isAnySigPage : isActive(l.href);
    if (l.sigDd) {
      return `<li data-i="${i}"><span class="${active ? 'active' : ''}">${l.label} ▾</span><div class="nav-dd">${sigDropHTML}</div></li>`;
    }
    if (l.dd) {
      const ddHTML = `<div class="nav-dd">${l.dd.map(d => `<a href="${d.href}">${d.label}</a>`).join('')}</div>`;
      return `<li data-i="${i}"><span class="${active ? 'active' : ''}">${l.label} ▾</span>${ddHTML}</li>`;
    }
    return `<li data-i="${i}"><a href="${l.href}"${active ? ' class="active"' : ''}>${l.label}</a></li>`;
  }).join('');

  /* ── Mobile menu items ── */
  const mobileLinks = [{ label: 'Home', href: '/index.html' }, ...links.slice(1)];
  const mobItems = mobileLinks.map((l, i) => {
    const active = l.sigDd ? isAnySigPage : isActive(l.href);
    if (l.sigDd) {
      /* Build each mobile sub-item explicitly from SIG_PAGES to avoid any copy-paste drift */
      const subItems = SIG_PAGES.map(p => `<li><a href="${p.href}" data-nav-link>${p.label}</a></li>`).join('');
      return `
        <li>
          <span class="${active ? 'active' : ''}" data-mob-toggle="${i}">
            ${l.label}
            <span class="mob-chevron" id="mob-chev-${i}"></span>
          </span>
          <ul class="mob-sub" id="mob-sub-${i}">${subItems}</ul>
        </li>`;
    }
    if (l.dd) {
      const subItems = l.dd.map(d => `<li><a href="${d.href}" data-nav-link>${d.label}</a></li>`).join('');
      return `
        <li>
          <span class="${active ? 'active' : ''}" data-mob-toggle="${i}">
            ${l.label}
            <span class="mob-chevron" id="mob-chev-${i}"></span>
          </span>
          <ul class="mob-sub" id="mob-sub-${i}">${subItems}</ul>
        </li>`;
    }
    return `<li><a href="${l.href}"${active ? ' class="active"' : ''} data-nav-link>${l.label}</a></li>`;
  }).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <nav id="main-nav">
      <div id="nav-home-logo" aria-label="Fak'ugesi Festival">
        <img src="/images/logos/fakugesi/logo_fakugesi_light.svg" alt="Fak'ugesi Festival" />
      </div>
      <div id="nav-mobile-logo">
        <a href="/index.html" data-nav-link>
          <img src="/images/logos/fakugesi/logo_fakugesi_light.svg" alt="Fak'ugesi Festival" />
        </a>
      </div>
      <div class="nav-links-wrap" id="nav-links-wrap">
        <ul class="nav-links" id="nav-list">${items}</ul>
      </div>
      <div id="nav-search-results-drop"></div>
      <div class="nav-right" id="nav-right">
        <div id="nav-search-bar" role="search" aria-label="Site search">
          <input type="text" id="nav-search-inline-input" placeholder="Search…" autocomplete="off" spellcheck="false" aria-label="Search" />
          <button id="nav-search-close-btn" aria-label="Close search">×</button>
        </div>
        <button class="nav-search" id="nav-search-btn" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <a class="nav-tickets" id="nav-tickets" href="/tickets.html" data-nav-link>
          <span>GET TICKETS</span>
        </a>
      </div>
      <button id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <div id="nav-mobile-menu" role="dialog" aria-label="Navigation menu">
      <ul class="mob-nav-list">${mobItems}</ul>
      <a class="mob-tickets" href="/tickets.html" data-nav-link>Get Tickets →</a>
      <div class="mob-socials">
        <a href="https://www.instagram.com/fakugesi/" target="_blank" rel="noopener" aria-label="Instagram" data-nav-link>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
        </a>
        <a href="https://x.com/fakugesi" target="_blank" rel="noopener" aria-label="X" data-nav-link>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622z"/></svg>
        </a>
        <a href="https://www.facebook.com/fakugesi" target="_blank" rel="noopener" aria-label="Facebook" data-nav-link>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      </div>
    </div>
  `);

  /* ── Scroll behaviour ── */
  window.addEventListener('scroll', () => {
    document.getElementById('main-nav').classList.toggle('scrolled', scrollY > 40);
  }, { passive: true });
  document.getElementById('main-nav').classList.toggle('scrolled', scrollY > 40);

  /* ── Hamburger toggle ── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── Mobile sub-menu toggles ── */
  mobileMenu.querySelectorAll('[data-mob-toggle]').forEach(el => {
    el.addEventListener('click', () => {
      const i = el.dataset.mobToggle;
      const sub = document.getElementById(`mob-sub-${i}`);
      const chev = document.getElementById(`mob-chev-${i}`);
      if (sub) sub.classList.toggle('open');
      if (chev) chev.classList.toggle('open');
    });
  });

  /* Close mobile menu on link click */
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ══════════════════════════════════════════════
     INLINE SEARCH SYSTEM
  ══════════════════════════════════════════════ */
  const SEARCH_INDEX = [
    // Home
    { title: 'Home', section: 'Home', url: '/index.html', tags: ['home','festival','fakugesi','2026','african','digital','innovation','johannesburg'] },
    { title: '2026 Theme: African Imaginaries', section: 'Home', url: '/index.html', tags: ['african imaginaries','2026 theme','imagination precedes innovation','memory engines','imagination engines','future engines'] },
    { title: 'Spotlight — Awards Applications Open', section: 'Home', url: '/index.html', tags: ['spotlight','awards','applications','open'] },
    { title: "What's Happening", section: 'Home', url: '/index.html', tags: ['instagram','twitter','x','facebook','social','feed'] },

    // About
    { title: 'Who We Are', section: 'About', url: '/about.html', tags: ['about','who we are','history','fakugesi','switch on the electricity'] },
    { title: 'Previous Editions', section: 'About', url: '/about.html', tags: ['editions','2017','2018','2019','2020','2021','2022','2023','2024','2025','posters','past festivals'] },
    { title: 'The Team', section: 'About', url: '/about.html', tags: ['team','staff','alby michaels','festival director','contact'] },
    { title: 'Get in Touch', section: 'About', url: '/about.html', tags: ['contact','email','phone','address','braamfontein','juta street'] },

    // Tickets
    { title: 'Festival Passes', section: 'Tickets', url: '/tickets.html', tags: ['tickets','buy tickets','full pass','day pass','industry pass','pricing','student'] },
    { title: 'Tickets FAQ', section: 'Tickets', url: '/tickets.html', tags: ['faq','accessibility','fakugesipro registration','directions','tshimologong'] },

    // Festival Venues
    { title: 'Festival Venues', section: 'Venues', url: '/discover/venues.html', tags: ['venues','locations','map','directions'] },
    { title: 'Tshimologong Digital Innovation Precinct', section: 'Venues', url: '/discover/venues.html', tags: ['tshimologong','precinct','incubator','innovation','juta street'] },
    { title: 'Wits Anglo American Digital Dome', section: 'Venues', url: '/discover/venues.html', tags: ['digital dome','planetarium','immersive','360'] },
    { title: 'Origins Centre', section: 'Venues', url: '/discover/venues.html', tags: ['origins centre','museum','rock art','archaeology','human origins'] },
    { title: 'Chris Seabrooke Music Hall', section: 'Venues', url: '/discover/venues.html', tags: ['music hall','live music','acoustic','jorissen street'] },

    // Signature Programmes
    { title: "Fak'ugesi Awards", section: 'Awards', url: '/sig-awards.html', tags: ['awards','categories','winners','jury','application','festival director award'] },
    { title: 'Dala Khona — African Gaming Arcade', section: 'Dala Khona', url: '/sig-dalakhona.html', tags: ['dala khona','gaming','arcade','indie games','african games','developers'] },
    { title: "Fak'ugesiPRO", section: 'PRO', url: '/sig-fakugesipro.html', tags: ['pro','industry','professional','networking'] },
    { title: 'Immersive Africa', section: 'Immersive Africa', url: '/sig-immersive.html', tags: ['immersive','xr','vr','dome','now showing'] },
    { title: 'JAMZ — Animation & Video Game Hackathon', section: 'JAMZ', url: '/sig-jamz.html', tags: ['jamz','animation','hackathon','video game','music'] },
    { title: 'Pitchathon', section: 'Pitchathon', url: '/sig-pitchathon.html', tags: ['pitchathon','pitch','startup','entrepreneur','apply'] },

   
    { title: "Fak'ugesi Market", section: 'Market', url: '/festival-programmes.html', tags: ['market','exhibitors','vendors','showcase','want a spot'] },
    { title: 'Research & Resources', section: 'Resources', url: '/discover/resources.html', tags: ['research','resources','report','intermediaries report','download','pdf'] },
    { title: 'Get Involved', section: 'Get Involved', url: '/get-involved.html', tags: ['get involved','investors','funders','volunteers','exhibitors','sponsors','apply'] },
    { title: "Director's Highlights", section: 'Highlights', url: '/director-highlights.html', tags: ["director's highlights","director highlights","festival highlights","highlights"] },
  ];

  const categoryColors = {
    'Home': '#4a90d9', 'About': '#5a6a7a', 'Tickets': '#a03a3a', 'Venues': '#4a7a4a',
    'Awards': '#b8860b', 'Dala Khona': '#1a7a4a', 'PRO': '#3a5a9a', 'Immersive Africa': '#7a3a8a',
    'JAMZ': '#c43a3a', 'Pitchathon': '#2a6a8a', 'Market': '#3a8a6a', 'Resources': '#3a6a7a',
    'Get Involved': '#7b68ee', 'Highlights': '#c46200'
  };

  const searchBar    = document.getElementById('nav-search-bar');
  const searchInput  = document.getElementById('nav-search-inline-input');
  const searchClose  = document.getElementById('nav-search-close-btn');
  const searchDrop   = document.getElementById('nav-search-results-drop');
  const navSearchBtn = document.getElementById('nav-search-btn');

  function openSearch() {
    searchBar.classList.add('open');
    searchDrop.classList.add('open');
    setTimeout(() => searchInput.focus(), 60);
    renderResults('');
  }
  function closeSearch() {
    searchBar.classList.remove('open');
    searchDrop.classList.remove('open');
    searchInput.value = '';
    searchDrop.innerHTML = '';
  }
  function highlight(text, query) {
    if (!query) return text;
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${esc})`, 'gi'), '<mark>$1</mark>');
  }
  function renderResults(query) {
    const q = query.trim().toLowerCase();
    let results = SEARCH_INDEX;
    if (q) {
      results = results.filter(r => {
        const combined = (r.title + ' ' + r.section + ' ' + r.tags.join(' ')).toLowerCase();
        return combined.includes(q);
      }).sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
        const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
        return aTitle - bTitle;
      });
    } else {
      results = results.slice(0, 6);
    }
    searchDrop.innerHTML = '';
    if (!q) searchDrop.innerHTML = `<div class="nsr-hint">Suggested pages</div>`;
    if (results.length === 0) {
      searchDrop.innerHTML = `<div class="nsr-no-results">No results found — try a different search.</div>`;
      return;
    }
    results.slice(0, 10).forEach(r => {
      const el = document.createElement('a');
      el.href = r.url;
      el.className = 'nsr-item';
      el.dataset.navLink = '';
      el.innerHTML = `
        <div class="nsr-section" style="color:${categoryColors[r.section] || 'rgba(255,255,255,0.35)'}">${r.section}</div>
        <div class="nsr-title">${highlight(r.title, q)}</div>
      `;
      el.addEventListener('click', () => closeSearch());
      searchDrop.appendChild(el);
    });
  }

  navSearchBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (searchBar.classList.contains('open')) { closeSearch(); } else { openSearch(); }
  });
  searchClose.addEventListener('click', (e) => { e.stopPropagation(); closeSearch(); });
  searchInput.addEventListener('input', () => renderResults(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    if (e.key === 'Enter') { const first = searchDrop.querySelector('.nsr-item'); if (first) first.click(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchBar.classList.contains('open')) closeSearch();
    if (
      (e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) &&
      !searchBar.classList.contains('open') &&
      document.activeElement.tagName !== 'INPUT' &&
      document.activeElement.tagName !== 'TEXTAREA'
    ) { e.preventDefault(); openSearch(); }
  });
  document.addEventListener('click', (e) => {
    if (
      searchBar.classList.contains('open') &&
      !searchBar.contains(e.target) &&
      !searchDrop.contains(e.target) &&
      e.target !== navSearchBtn &&
      !navSearchBtn.contains(e.target)
    ) closeSearch();
  });

})();

/* ── Redirect non-exempt links to get-involved form ── */
(function () {
  const EXEMPT_PAGES = ['get-involved.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (EXEMPT_PAGES.includes(currentPage)) return;

  function getFormPath() {
    const depth = window.location.pathname.split('/').length - 2;
    return depth > 0 ? '../'.repeat(depth) + 'public/get-involved.html' : 'get-involved.html';
  }

  const EXEMPT_SELECTORS = [
    '.nav-tickets', '#nav-tickets', '[data-no-redirect]', '.gi-submit',
    '.fug-sig-item', '.hero-link', '[data-nav-link]',
  ];

  function isExempt(el) {
    if (!el) return true;
    if (el.type === 'submit' || el.tagName === 'BUTTON') return true;
    if (el.hasAttribute('download')) return true;
    const href = el.getAttribute('href') || '';
    if (href === '#' || href.startsWith('#') || href === '') return true;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return true;
    if (href.includes('get-involved')) return true;
    if (href.startsWith('http://') || href.startsWith('https://')) return true;
    if (href.toLowerCase().includes('.pdf')) return true;
    /* Exempt anything inside the nav or mobile menu */
    if (el.closest('#main-nav') || el.closest('#nav-mobile-menu')) return true;
    if (el.closest('.mob-nav-list') || el.closest('.mob-sub')) return true;
    if (el.closest('.fug-sig-strip')) return true;
    if (el.closest('#main-footer')) return true;
    for (const sel of EXEMPT_SELECTORS) {
      try { if (el.matches(sel) || el.closest(sel)) return true; } catch(e) {}
    }
    return false;
  }

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;
    if (isExempt(link)) return;
    e.preventDefault();
    window.location.href = getFormPath();
  }, true);
})();