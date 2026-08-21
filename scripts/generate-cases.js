'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── Shared chunks ──────────────────────────────────────────────────────────────
const WA_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;
const WA_SVG_22 = WA_SVG.replace('width="16" height="16"','width="22" height="22"').replace('fill="currentColor"','fill="white"');

const CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{background:#0c0e1a;color:#e8eaf6;font-family:'DM Sans',system-ui,sans-serif;font-weight:400;line-height:1.7;-webkit-font-smoothing:antialiased}h1,h2,h3,h4{font-family:'Syne',system-ui,sans-serif;line-height:1.2}a{color:#ffbd59;text-decoration:underline;text-underline-offset:3px}a:hover{color:#ffc96d}ul{list-style:none}address{font-style:normal}.container{width:100%;max-width:1200px;margin-inline:auto;padding-inline:1.5rem}@media(min-width:768px){.container{padding-inline:2rem}}.section--sm{padding:2.5rem 0 0}.skip-link{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden}.skip-link:focus{position:fixed;top:0;left:0;width:auto;height:auto;padding:.75rem 1.5rem;background:#ffbd59;color:#0c0e1a;font-weight:700;z-index:10000;text-decoration:none}.site-header{position:sticky;top:0;z-index:100;background:rgba(12,14,26,.85);backdrop-filter:blur(12px);border-bottom:1px solid #1e2240}.nav{display:flex;align-items:center;gap:2rem;height:4rem}.nav-logo{display:flex;align-items:center;gap:.55rem;font-family:Arial,sans-serif;font-weight:700;font-size:1.2rem;color:#e8eaf6;flex-shrink:0;text-decoration:none}.nav-logo img{height:2.4rem;width:auto;display:block}.nav-links{display:none}@media(min-width:900px){.nav-links{display:flex;align-items:center;gap:1.75rem;list-style:none;margin-left:auto}.nav-links a{color:#6b7099;text-decoration:none;font-size:.95rem;transition:color .2s}.nav-links a:hover,.nav-links a[aria-current]{color:#e8eaf6}}.nav-has-dropdown{position:relative}.nav-has-dropdown>a::after{content:'▾';margin-left:.35rem;font-size:.7em;opacity:.6}.nav-dropdown{display:none;position:absolute;top:calc(100% + .5rem);left:0;background:#111328;border:1px solid #1e2240;border-radius:12px;padding:.5rem;min-width:220px;box-shadow:0 8px 24px rgba(0,0,0,.4)}.nav-has-dropdown:hover .nav-dropdown,.nav-has-dropdown:focus-within .nav-dropdown{display:block}.nav-dropdown a{display:block;padding:.6rem 1rem;color:#6b7099;text-decoration:none;font-size:.9rem;border-radius:8px;white-space:nowrap}.nav-dropdown a:hover{background:#181b35;color:#e8eaf6}.dropdown-badge{display:inline-block;background:#ffbd59;color:#0c0e1a;font-size:.65rem;font-weight:700;padding:.15em .5em;border-radius:4px;margin-left:.5rem;vertical-align:middle}.nav-toggle{display:flex;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px;margin-left:auto}.nav-toggle span{display:block;width:22px;height:2px;background:#e8eaf6;border-radius:2px;transition:all .25s}@media(min-width:900px){.nav-toggle{display:none}}.nav-cta{display:none}@media(min-width:900px){.nav-cta{display:inline-flex}}.nav-drawer{display:none;flex-direction:column;gap:.25rem;padding:1rem;background:#111328;border-top:1px solid #1e2240}.nav-drawer.is-open{display:flex}.nav-drawer a{color:#e8eaf6;text-decoration:none;padding:.6rem .75rem;border-radius:8px;font-size:1rem}.nav-drawer a:hover{background:#181b35}.drawer-sub-label{font-size:.75rem;color:#6b7099;text-transform:uppercase;letter-spacing:.08em;padding:.5rem .75rem 0}.drawer-sub-link{padding-left:1.5rem!important;color:#6b7099!important}.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.8em 1.6em;font-family:'Syne',system-ui,sans-serif;font-weight:700;font-size:.95rem;line-height:1;border-radius:12px;border:2px solid transparent;cursor:pointer;white-space:nowrap;transition:all .25s ease;text-decoration:none}.btn-primary{background:#ffbd59;color:#0c0e1a}.btn-primary:hover{background:#ffc96d;transform:translateY(-1px);color:#0c0e1a}.btn-outline{background:transparent;border-color:#1e2240;color:#e8eaf6}.btn-outline:hover{border-color:#ffbd59;color:#ffbd59}.breadcrumb{display:flex;align-items:center;gap:.5rem;font-size:.85rem;margin-bottom:2rem;flex-wrap:wrap}.breadcrumb a{color:#6b7099;text-decoration:none}.breadcrumb a:hover{color:#e8eaf6}.breadcrumb-sep{color:#1e2240;user-select:none}.cs-hero{padding:3.5rem 0 4rem;position:relative;overflow:hidden}.cs-hero::before{content:'';position:absolute;top:-30%;right:-5%;width:55%;height:150%;background:radial-gradient(ellipse at center,rgba(255,189,89,.08) 0%,transparent 65%);pointer-events:none}.cs-label{display:inline-flex;align-items:center;gap:.5rem;background:#111328;border:1px solid #1e2240;border-radius:8px;padding:.4em .9em;font-size:.78rem;color:#ffbd59;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-bottom:1.25rem}.cs-h1{font-size:clamp(1.85rem,5vw,3rem);font-weight:800;color:#e8eaf6;margin-bottom:1rem;max-width:820px}.cs-subline{font-size:1.05rem;color:#6b7099;max-width:680px;line-height:1.75;margin-bottom:2.5rem}.cs-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}@media(max-width:600px){.cs-tiles{grid-template-columns:1fr;gap:1rem}}.cs-tile{background:#111328;border:1px solid #1e2240;border-radius:16px;padding:1.5rem 1.25rem;text-align:center}.cs-tile-num{font-family:'Syne',system-ui,sans-serif;font-size:clamp(1.9rem,4vw,2.75rem);font-weight:800;color:#ffbd59;line-height:1}.cs-tile-label{color:#6b7099;font-size:.85rem;margin-top:.5rem;line-height:1.4}.cs-body{padding:4rem 0 5rem}.cs-content{max-width:780px}.cs-divider{border:none;border-top:1px solid #1e2240;margin:3.5rem 0}.cs-tag{display:inline-block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#ffbd59;margin-bottom:.75rem}.cs-content h2{font-size:clamp(1.35rem,3vw,1.85rem);font-weight:700;color:#e8eaf6;margin-bottom:1.5rem}.cs-prose p{color:#6b7099;font-size:.975rem;line-height:1.85;margin-bottom:1rem}.cs-prose p:last-child{margin-bottom:0}.cs-measures{display:flex;flex-direction:column;gap:2rem;margin-top:.5rem}.cs-measure{padding-left:1.25rem;border-left:3px solid #ffbd59}.cs-measure h3{font-size:1rem;font-weight:700;color:#e8eaf6;margin-bottom:.45rem;font-family:'Syne',system-ui,sans-serif}.cs-measure p{color:#6b7099;font-size:.95rem;line-height:1.8;margin:0}.cs-result-card{background:#111328;border:1px solid #1e2240;border-radius:20px;padding:2.5rem 2rem;margin:1.75rem 0 2rem;text-align:center}.cs-result-big{font-family:'Syne',system-ui,sans-serif;font-size:clamp(3rem,8vw,5rem);font-weight:800;color:#ffbd59;line-height:1;display:block}.cs-result-sub{color:#e8eaf6;font-size:1rem;font-weight:500;margin-top:.6rem}.cs-quote{display:none}.cs-cta{background:linear-gradient(135deg,#111328 0%,#181b35 100%);border:1px solid #1e2240;border-radius:20px;padding:3.5rem 2rem;text-align:center;margin-top:3.5rem}.cs-cta h2{font-size:clamp(1.5rem,3vw,2rem);font-weight:800;color:#e8eaf6;margin-bottom:.75rem}.cs-cta p{color:#6b7099;font-size:.975rem;max-width:520px;margin:0 auto 2rem;line-height:1.7}.cs-cta-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}.cs-related{margin-top:4rem}.cs-related h2{font-size:1.25rem;font-weight:700;color:#e8eaf6;margin-bottom:1.5rem}.cs-related-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:1.25rem}.cs-related-card{display:block;background:#111328;border:1px solid #1e2240;border-radius:16px;padding:1.75rem;text-decoration:none;transition:border-color .25s ease,transform .25s ease}.cs-related-card:hover{border-color:#ffbd59;transform:translateY(-3px)}.cs-related-num{font-family:'Syne',system-ui,sans-serif;font-size:1.85rem;font-weight:800;color:#ffbd59;line-height:1}.cs-related-metric{font-size:.8rem;color:#6b7099;margin-top:.2rem}.cs-related-name{font-size:1rem;font-weight:700;color:#e8eaf6;margin-top:.9rem;font-family:'Syne',system-ui,sans-serif}.cs-related-cat{font-size:.8rem;color:#6b7099;margin-top:.25rem}.cs-related-link{display:inline-flex;align-items:center;gap:.35rem;font-size:.85rem;font-weight:700;color:#ffbd59;text-decoration:none;margin-top:1.1rem;font-family:'Syne',system-ui,sans-serif}.whatsapp-float{position:fixed;bottom:1.5rem;right:1.5rem;z-index:500;background:#25d366;border-radius:50%;width:3.25rem;height:3.25rem;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,.4);transition:transform .25s;text-decoration:none}.whatsapp-float:hover{transform:scale(1.1)}.site-footer{background:#111328;border-top:1px solid #1e2240;padding:3rem 0 1.5rem}.footer-grid{display:grid;grid-template-columns:1fr;gap:2.5rem}@media(min-width:640px){.footer-grid{grid-template-columns:repeat(2,1fr)}}@media(min-width:1024px){.footer-grid{grid-template-columns:2fr 1fr 1fr 1.5fr;gap:3rem}}.footer-brand{display:flex;align-items:center;gap:.55rem;font-family:Arial,sans-serif;font-weight:700;font-size:1.1rem;color:#e8eaf6;margin-bottom:.75rem}.footer-brand img{height:2.2rem;width:auto}.footer-tagline{font-size:.875rem;color:#6b7099;margin-bottom:1rem}.footer-nap{font-size:.875rem;color:#6b7099;line-height:1.8}.footer-nap strong{color:#e8eaf6}.footer-nap a{color:#6b7099;text-decoration:none}.footer-nap a:hover{color:#e8eaf6}.footer-col-title{font-family:'Syne',system-ui,sans-serif;font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:#6b7099;margin-bottom:1rem}.footer-links{display:flex;flex-direction:column;gap:.6rem}.footer-links a{font-size:.875rem;color:#6b7099;text-decoration:none}.footer-links a:hover{color:#e8eaf6}.footer-bottom{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid #1e2240;font-size:.8rem;color:#6b7099}.footer-legal-links{display:flex;gap:1.5rem;flex-wrap:wrap}.footer-legal-links a{color:#6b7099;text-decoration:none}.footer-legal-links a:hover{color:#e8eaf6}[data-reveal]{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}[data-reveal].is-visible{opacity:1;transform:none}`;

const HEADER = `<header class="site-header" role="banner"><div class="container"><nav class="nav" aria-label="Hauptnavigation"><a href="/" class="nav-logo" aria-label="Lokalbesucher – Startseite"><img src="/assets/images/lokalbesucher-logo-invers.webp" alt="" width="35" height="38" loading="eager">Lokalbesucher</a><ul class="nav-links" role="list"><li class="nav-has-dropdown"><a href="/google-business-agentur/" aria-haspopup="true">Leistungen</a><ul class="nav-dropdown" role="menu"><li><a href="/google-business-agentur/" role="menuitem">Google Business Optimierung</a></li><li><a href="/bewertungsmanagement/" role="menuitem">Bewertungsmanagement</a></li></ul></li><li><a href="/case-studies/" aria-current="page" style="color:#e8eaf6">Erfolge</a></li><li><a href="/faq/">FAQ</a></li><li class="nav-has-dropdown"><a href="#" aria-haspopup="true">Tools</a><ul class="nav-dropdown" role="menu"><li><a href="/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/" role="menuitem">ROI-Kalkulator <span class="dropdown-badge">Kostenlos</span></a></li><li><a href="/schema-org-generator/" role="menuitem">Schema Generator</a></li><li><a href="/ki-sichtbarkeits-check/" role="menuitem">KI-Sichtbarkeits-Check <span class="dropdown-badge">Neu</span></a></li></ul></li></ul><a href="https://wa.me/4915122358883" class="btn btn-primary nav-cta" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp Beratung">${WA_SVG}Kostenlos beraten</a><button class="nav-toggle" aria-controls="nav-drawer" aria-expanded="false" aria-label="Navigation öffnen"><span></span><span></span><span></span></button></nav></div><div id="nav-drawer" class="nav-drawer" role="navigation" aria-label="Mobile Navigation"><span class="drawer-sub-label">Leistungen</span><a href="/google-business-agentur/" class="drawer-sub-link">Google Business Optimierung</a><a href="/bewertungsmanagement/" class="drawer-sub-link">Bewertungsmanagement</a><a href="/case-studies/">Erfolge</a><a href="/faq/">FAQ</a><span class="drawer-sub-label">Tools</span><a href="/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/" class="drawer-sub-link">ROI-Kalkulator</a><a href="/schema-org-generator/" class="drawer-sub-link">Schema Generator</a>
    <a href="/ki-sichtbarkeits-check/" class="drawer-sub-link">KI-Sichtbarkeits-Check</a><a href="https://wa.me/4915122358883" rel="noopener noreferrer" target="_blank" class="btn btn-primary" style="width:fit-content;margin-top:.5rem">WhatsApp Beratung</a></div></header>`;

const FOOTER = `<footer class="site-footer" role="contentinfo"><div class="container"><div class="footer-grid"><div><div class="footer-brand"><img src="/assets/images/lokalbesucher-logo-invers.webp" alt="" width="34" height="37" loading="lazy">Lokalbesucher</div><p class="footer-tagline">einfach. lokal. erfolgreich.</p><address class="footer-nap"><strong>Lokalbesucher GmbH</strong><br>Im Westerkamp 7<br>45711 Datteln<br><a href="tel:+4915122358883">+49&nbsp;151&nbsp;22358883</a><br><a href="mailto:info@lokalbesucher.de">info@lokalbesucher.de</a></address></div><nav aria-label="Leistungen"><div class="footer-col-title">Leistungen</div><ul class="footer-links" role="list"><li><a href="/google-business-agentur/">Google Business Optimierung</a></li><li><a href="/bewertungsmanagement/">Bewertungsmanagement</a></li><li><a href="/google-business-agentur/#verzeichnisse">Branchenverzeichnisse</a></li><li><a href="/google-business-agentur/#reporting">Monatliches Reporting</a></li></ul></nav><nav aria-label="Unternehmen"><div class="footer-col-title">Unternehmen</div><ul class="footer-links" role="list"><li><a href="/case-studies/">Erfolgsgeschichten</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/ratgeber/">Ratgeber</a></li><li><a href="/schema-org-generator/">Schema Generator</a></li><li><a href="/ki-sichtbarkeits-check/">KI-Sichtbarkeits-Check</a></li><li><a href="/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/">ROI Kalkulator</a></li></ul></nav><div><div class="footer-col-title">Jetzt starten</div><p style="font-size:.875rem;color:#6b7099;margin-bottom:1rem;line-height:1.7">Kostenlose Erstberatung — direkt via WhatsApp, ohne Wartezeit.</p><a href="https://wa.me/4915122358883" class="btn btn-primary" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp Beratung starten">${WA_SVG}WhatsApp Beratung</a></div></div><div class="footer-bottom"><p>&copy; 2026 Lokalbesucher GmbH &middot; Alle Rechte vorbehalten</p><nav class="footer-legal-links" aria-label="Rechtliches"><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a><a href="#cookie-settings" id="cookie-settings-link">Cookie-Einstellungen</a></nav></div></div></footer>`;

const SCRIPTS = `<script>(function(){var t=document.querySelector('.nav-toggle'),d=document.getElementById('nav-drawer');if(t&&d){t.addEventListener('click',function(){var o=t.getAttribute('aria-expanded')==='true';t.setAttribute('aria-expanded',String(!o));d.classList.toggle('is-open',!o);});document.addEventListener('click',function(e){if(!t.contains(e.target)&&!d.contains(e.target)){t.setAttribute('aria-expanded','false');d.classList.remove('is-open');}});document.addEventListener('keydown',function(e){if(e.key==='Escape'){t.setAttribute('aria-expanded','false');d.classList.remove('is-open');t.focus();}});}if('IntersectionObserver' in window){var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});document.querySelectorAll('[data-reveal]').forEach(function(el){obs.observe(el);});}}());</script>
<script src="/assets/js/cookie-consent.js" defer></script>`;

const GA4 = `<link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://cdn.leadinfo.eu">
  <link rel="dns-prefetch" href="https://cdn.leadinfo.net">
  <link rel="dns-prefetch" href="https://collector4.leadinfo.net">
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','wait_for_update':500});</script>
  <script src="/assets/js/third-party.js" defer></script>
  <script>gtag('js',new Date());gtag('config','G-KRKS5RL7MP',{anonymize_ip:true});</script>`;

// ── Case data ──────────────────────────────────────────────────────────────────
const cases = [
  {
    slug: 'muhis-restaurant',
    title: 'MUHIS Restaurant: +151% mehr Google-Aufrufe seit Profilstart | Lokalbesucher',
    desc: 'Wie das MUHIS Restaurant in Recklinghausen mit Lokalbesucher seine Google-Profil-Aufrufe um 151% gesteigert hat – vom Start weg Teil eines systematischen Profilaufbaus.',
    category: 'Gastronomie',
    name: 'MUHIS Restaurant',
    h1: '+151% mehr Profilaufrufe seit Profilstart',
    subline: 'Wie das MUHIS Restaurant im Jerke-Museum von Anfang an mit systematischer Google-Präsenz startete – statt Jahre zu brauchen, bis man „irgendwann mal gefunden wird".',
    tiles: [
      ['+151%', 'Mehr Profilaufrufe'],
      ['Vom Start', 'Keine jahrelange Anlaufphase'],
      ['Recklinghausen', 'Lokale Dominanz in der Innenstadt'],
    ],
    ausgangslage_h2: 'Neue Location, keine Zeit für eine jahrelange Anlaufphase',
    ausgangslage: [
      'Das MUHIS ist ein Restaurant mit einem besonderen Standort: im Jerke-Museum mitten in Recklinghausen. Mediterrane und internationale Küche, ambitionierte Ausrichtung, eine Location mit Wiedererkennungswert.',
      'Das Problem vieler neuer Gastro-Konzepte: Der Laden ist gut, die Speisekarte passt, das Ambiente stimmt – aber bis Google das Profil versteht und relevant platziert, vergehen oft 12 bis 18 Monate. In der Zwischenzeit kommen die Gäste überwiegend über Zufall, Empfehlung oder teure Lieferdienst-Plattformen mit ihren Provisionen.',
      'MUHIS wollte nicht Jahre auf die organische Sichtbarkeit warten. Sondern von Anfang an strukturiert arbeiten.',
    ],
    massnahmen_h2: 'Fünf Bausteine für sofortige Sichtbarkeit ab Eröffnung',
    massnahmen: [
      ['Profil-Architektur vom ersten Tag an richtig', 'Kategorien, Beschreibungen, Angebote, Öffnungszeiten – alles nicht "irgendwie eingerichtet", sondern nach einer klaren Local-SEO-Logik aufgebaut, die Google sofort versteht. Ein richtig aufgebautes Profil verkürzt die Google-Lernphase von Monaten auf Wochen.'],
      ['Starker Fotostart mit professionellen Aufnahmen', 'Keine unscharfen Handy-Fotos, sondern professionelle Bilder der Räume, der Gerichte, der Atmosphäre. Google bewertet die Bildqualität mit – und ein Profil, das optisch überzeugt, bekommt deutlich mehr Klicks als eines mit schlechten Fotos.'],
      ['Bewertungs-Aufbau von Beginn an über TapTag', 'Statt zu hoffen, dass sich Bewertungen von selbst ansammeln, haben wir mit TapTag – Schlüsselanhänger mit individuellem QR-Code – direkt ab Eröffnung Bewertungen systematisch eingesammelt. Das beschleunigt die Ranking-Entwicklung um Monate.'],
      ['Google-Posts zur Positionierung', 'Jede besondere Speisekarte, jedes Event, jede saisonale Ausrichtung als Google-Post direkt im Profil. Das macht MUHIS nicht nur auffindbar – es macht es interessant für jemanden, der sucht und zwischen mehreren Optionen wählt.'],
      ['Sofortige Verzeichnis-Einträge in 50+ Plattformen', 'Für Neueröffnungen entscheidend: Branchenverzeichnis-Einträge sofort, nicht irgendwann. Das Netz braucht sonst Monate, bis sich Einträge organisch verteilen. Wir haben von Tag 1 an für konsistente NAP-Daten gesorgt.'],
    ],
    ergebnis_h2: 'In Monaten dort, wo andere Jahre brauchen',
    ergebnis_big: '+151%',
    ergebnis_sub: 'mehr Profilaufrufe – systematisch aufgebaut seit Profilstart',
    ergebnis: [
      '+151% mehr Profilaufrufe – und zwar nicht gegenüber einem etablierten Niveau, sondern als Ergebnis eines systematischen Aufbaus seit Profilstart. MUHIS ist heute nach wenigen Monaten dort, wo Restaurants ohne Profiloptimierung oft erst nach zwei Jahren ankommen – wenn überhaupt.',
      'In einer Stadt wie Recklinghausen mit begrenzter Laufkundschaft in der Innenstadt ist die Google-Sichtbarkeit ein harter Wettbewerbsfaktor. MUHIS hat sich diesen Platz schnell erarbeitet. Das Modell ist übertragbar: Jede Gastro-Neueröffnung kann auf dieselbe Weise arbeiten und spart sich die teure, oft frustrierende Anlaufphase.',
    ],
    quote_hint: 'Zitat vom MUHIS-Team einholen – Themen: Wie fühlt es sich an, von Anfang an gut sichtbar zu sein? Welche Rolle spielt Google bei einer Neueröffnung?',
    cta_h2: 'Neue Gastro-Eröffnung oder Relaunch?',
    cta_sub: 'Lass uns von Anfang an richtig aufstellen – statt zwei Jahre zu warten, bis Google dein Profil versteht.',
    related: [
      { slug: 'ristorante-peperoncino', num: '+158%', metric: 'mehr Profilaufrufe', name: 'Ristorante Peperoncino', cat: 'Gastronomie' },
      { slug: 'battlekart', num: '800+', metric: '5-Sterne-Bewertungen in 9 Monaten', name: 'BattleKart', cat: 'Freizeit &amp; Entertainment' },
    ],
  },
  {
    slug: 'solar-richter',
    title: 'Solar Richter: 0 → 16.000 Google-Aufrufe pro Monat | Lokalbesucher',
    desc: 'Wie Solar Richter von null auf 16.000 Google-Profilaufrufe pro Monat gekommen ist – systematischer Neuaufbau einer lokalen Handwerker-Präsenz im Photovoltaik-Markt.',
    category: 'Handwerk &amp; Energie',
    name: 'Solar Richter',
    h1: 'Von 0 auf 16.000 Profilaufrufe pro Monat',
    subline: 'Wie ein Photovoltaik-Anbieter von komplett unsichtbar zu einem der meistgefundenen Solarbetriebe in seiner Region wurde – in einem Markt, in dem gerade jeder nach Photovoltaik sucht.',
    tiles: [
      ['16.000', 'Profilaufrufe pro Monat'],
      ['0', 'Aufrufe am Startpunkt'],
      ['Organisch', 'Kein Ads-Budget'],
    ],
    ausgangslage_h2: 'Boomender Markt – aber niemand findet dich',
    ausgangslage: [
      'Solar Richter hatte ein Problem, das vielen Handwerksbetrieben bekannt ist: Der Kern des Geschäfts wird gut gemacht, aber die digitale Sichtbarkeit existiert praktisch nicht. Kein Google-Profil im klassischen Sinne, keine Bewertungen, keine auffindbare Online-Präsenz.',
      'Das ist in der Photovoltaik-Branche besonders bitter. Der Markt explodiert. Haushalte, Gewerbe, Landwirtschaft – alle suchen aktuell nach Anbietern für Solaranlagen. Wer bei diesen Suchen nicht auftaucht, verliert Aufträge, die jeden Monat wehtun.',
      'Gleichzeitig ist das Feld voll: Ein großer Teil der Wettbewerber wirbt bezahlt, teils mit Budgets, die ein mittelständischer Handwerksbetrieb nicht stemmen kann. Die Lösung musste organisch kommen.',
    ],
    massnahmen_h2: 'Neuaufbau von Grund auf – Profil, Fotos, Bewertungen, Posts, Verzeichnisse',
    massnahmen: [
      ['Neuaufbau des Google-Profils von Grund auf', 'Kein "wir pflegen das bestehende Profil", sondern systematischer Neuaufbau: Kategorien, Leistungsbeschreibungen, Einzugsgebiet, USPs, Fotos – alles so ausgerichtet, dass Google bei Suchen wie "Photovoltaik [Region]", "Solaranlage installieren", "PV-Anbieter in der Nähe" die richtige Antwort findet.'],
      ['Referenz-Fotos statt Stockbilder', 'In der Solarbranche suchen potenzielle Kunden nach Vertrauen. Fotos von tatsächlich installierten Anlagen – auf echten Dächern, bei echten Kunden – schlagen jede Produktbroschüre. Das haben wir systematisch ins Profil gebracht.'],
      ['Bewertungsaufbau über TapTag nach jeder Installation', 'Jeder Monteur trägt einen TapTag – einen Schlüsselanhänger mit individuellem QR-Code. Nach Abnahme der Anlage zeigt er seinen TapTag, der Kunde scannt den QR-Code und landet direkt auf der Google-Bewertungsseite. Eine Minute, fertig.'],
      ['Google-Posts zu Branchenthemen', 'Förderungen, Einspeisevergütung, neue Technik, lokale Einsätze – regelmäßige Posts machen das Profil nicht nur sichtbar, sondern positionieren Solar Richter als Experte im Feld.'],
      ['Verzeichnis-Listings in Handwerks- und Energie-Verzeichnissen', 'Gerade im Handwerk gibt es starke Branchenverzeichnisse. Sauber gepflegte, konsistente Einträge stärken die Profil-Autorität und liefern zusätzliche Eingangstore für Kundenanfragen.'],
    ],
    ergebnis_h2: '16.000 Aufrufe – organisch, ohne Lead-Plattformen',
    ergebnis_big: '16.000',
    ergebnis_sub: 'Profilaufrufe pro Monat – Start war null',
    ergebnis: [
      '16.000 Profilaufrufe pro Monat – aufgebaut von einem Startpunkt nahe null. Das ist eine massive Sichtbarkeit in einem der heißesten Märkte Deutschlands. Jeder dieser Aufrufe ist ein potenzieller Auftragswert von vierstelligen bis hohen fünfstelligen Beträgen.',
      'Was diesen Case besonders macht: Das Wachstum ist vollständig organisch. Kein Google-Ads-Budget, keine Lead-Kauf-Plattformen, keine Klickpreise pro Anfrage. In einer Branche, in der Wettbewerber Hunderte Euro pro Lead bezahlen, ist das ein struktureller Kostenvorteil.',
    ],
    quote_hint: 'Zitat von Solar Richter einholen – Themen: Wie viele Anfragen kamen über das Profil? Was war der wichtigste Hebel bei der Sichtbarkeit?',
    cta_h2: 'Du bist Handwerker, Installateur oder im Energiebereich?',
    cta_sub: 'Lass uns den Markt sichtbar für dich öffnen – ohne Lead-Plattformen, ohne Klick-Provisionen.',
    related: [
      { slug: 'sanitaer-susak', num: '+62,1%', metric: 'mehr Profilaufrufe in 3 Monaten', name: 'Sanitär Susak', cat: 'Handwerk' },
      { slug: 'muhis-restaurant', num: '+151%', metric: 'Aufrufe seit Profilstart', name: 'MUHIS Restaurant', cat: 'Gastronomie' },
    ],
  },
  {
    slug: 'elithera-physio',
    title: 'Elithera Physiotherapie: +95% mehr Suchanfragen in 3 Monaten | Lokalbesucher',
    desc: 'Wie die Elithera Physiotherapie ihre Google-Suchanfragen in nur 3 Monaten um 95% gesteigert hat – und ihr Profil auch bei bereits hohem Ausgangsniveau systematisch weiterentwickelt.',
    category: 'Medizin &amp; Gesundheit',
    name: 'Elithera Physio',
    h1: '+95% mehr Suchanfragen in nur 3 Monaten',
    subline: 'Elithera war schon vorher stark – trotzdem haben wir die Suchanfragen fast verdoppelt. Ein Case für alle, die glauben, „wir sind doch schon gut sichtbar".',
    tiles: [
      ['+95%', 'Mehr Suchanfragen'],
      ['3 Monate', 'Kurzer Zeitraum'],
      ['Hohes Startlevel', 'Noch Potenzial war da'],
    ],
    ausgangslage_h2: '"Wir werden ja gefunden, passt schon" – eine teure Falle',
    ausgangslage: [
      'Elithera Physio ist keine Praxis, die bei null anfängt. Das Profil war gepflegt, die Bewertungen solide, die Grundstruktur in Ordnung. Wer in der Region nach Physiotherapie suchte, fand Elithera – das war schon vor Lokalbesucher der Fall.',
      'Die Frage war eine andere: Reicht "gut" aus, oder geht da noch mehr? Viele Praxen hören an diesem Punkt auf zu investieren. "Wir werden ja gefunden, passt schon." Das ist eine Falle. Denn während du stehen bleibst, arbeiten Wettbewerber systematisch an ihrer Sichtbarkeit und überholen dich – langsam, aber stetig.',
      'Elithera hat diese Gefahr erkannt und wollte aktiv weiter optimieren, statt abzuwarten.',
    ],
    massnahmen_h2: 'Fünf Hebel für Wachstum auf bereits starkem Niveau',
    massnahmen: [
      ['Keyword-Analyse auf dem bestehenden Profil', 'Was wird bereits gut gefunden, wo sind blinde Flecken? Bei Elithera gab es eine ganze Reihe Suchbegriffe, bei denen die Praxis theoretisch passte, aber nicht sichtbar war – klassische Physio-Behandlungen, die im Profil nicht explizit genug benannt waren.'],
      ['Präzisierung der Kategorien und Beschreibungen', 'Nicht einfach "Physiotherapie", sondern granular: manuelle Therapie, Lymphdrainage, Krankengymnastik nach Bobath, Sportphysiotherapie. Jede zusätzliche präzise Kategorie öffnet ein neues Suchfeld – das ist direkt messbare Sichtbarkeit.'],
      ['Verstärkter Bewertungs-Fokus', 'Auch bei vorhandenen Bewertungen gab es Nachholbedarf: Die Response-Rate auf Bewertungen lag unter 100%, die Antwortzeit war länger als 60 Minuten. Beides haben wir systematisiert. Jede Bewertung bekommt Antwort, und zwar schnell.'],
      ['Google-Posts wöchentlich', 'Gesundheitsthemen, Tipps, Übungen, saisonale Beschwerdebilder – das sind Themen, die in der Google-Suche aufschlagen und auf die Praxis zurückführen. Vorher wurde das Post-Feature kaum genutzt.'],
      ['Verzeichniskonsistenz', 'NAP-Daten (Name, Adresse, Telefon) in allen relevanten Verzeichnissen geprüft und vereinheitlicht. Kleine Inkonsistenzen können Google-Vertrauen kosten – und das war ein unsichtbarer Bremsfaktor.'],
    ],
    ergebnis_h2: 'Fast doppelt so viele Suchanfragen – in nur 3 Monaten',
    ergebnis_big: '+95%',
    ergebnis_sub: 'mehr Suchanfragen in 3 Monaten – auf bereits starkem Ausgangsniveau',
    ergebnis: [
      '+95% mehr Suchanfragen mit Sichtbarkeit in 3 Monaten. Das heißt: Fast doppelt so viele Menschen sehen Elithera, wenn sie nach Physiotherapie oder spezifischen Behandlungen suchen – in einem Zeitraum, der für SEO-Verhältnisse kurz ist.',
      'Der Case zeigt etwas Wichtiges: Sichtbarkeit hat keine Obergrenze, bei der man "fertig" ist. Selbst Praxen, die sich schon gut aufgestellt fühlen, haben meistens noch erhebliches Potenzial – vor allem in der granularen Keyword-Abdeckung und der Aktivitätsrate.',
    ],
    quote_hint: 'Zitat vom Praxisteam Elithera einholen – Themen: Warum weiter optimieren, wenn schon viel läuft? Was war der größte Aha-Moment?',
    cta_h2: 'Deine Praxis läuft schon ganz gut – aber geht da noch mehr?',
    cta_sub: 'Wir zeigen dir ohne Bullshit, wo konkret Potenzial liegt. Auch wenn du glaubst, dass "eigentlich alles passt".',
    related: [
      { slug: 'orthoclinic-hamburg', num: '+82%', metric: 'mehr Profilaufrufe in 6 Monaten', name: 'Orthoclinic Hamburg', cat: 'Medizin &amp; Gesundheit' },
      { slug: 'praxis-theres', num: '+138%', metric: 'mehr Profilaufrufe', name: 'Praxis Theres', cat: 'Medizin &amp; Ästhetik' },
    ],
  },
  {
    slug: 'praxis-theres',
    title: 'Praxis Theres: +138% mehr Profilaufrufe bei Plastischer Chirurgie | Lokalbesucher',
    desc: 'Wie die Praxis Theres für Plastische Chirurgie ihre Google-Profilaufrufe um 138% gesteigert hat – in einem Markt, in dem Diskretion und Vertrauen über jede Patientenentscheidung bestimmen.',
    category: 'Medizin &amp; Ästhetik',
    name: 'Praxis Theres',
    h1: '+138% mehr Profilaufrufe bei Plastischer Chirurgie',
    subline: 'Wie die Praxis Theres Sichtbarkeit aufgebaut hat, ohne die Diskretion und Seriosität aufzugeben, die Patienten in diesem sensiblen Bereich erwarten.',
    tiles: [
      ['+138%', 'Mehr Profilaufrufe'],
      ['Seriös', 'Ohne Reißerei oder Vorher-Nachher-Werbung'],
      ['Premium', 'Patienten mit hohen Ansprüchen'],
    ],
    ausgangslage_h2: 'Gute Arbeit – aber die Online-Präsenz entsprach nicht dem fachlichen Niveau',
    ausgangslage: [
      'Plastische und ästhetische Chirurgie ist eines der sensibelsten Felder im medizinischen Online-Marketing. Patienten sind hochinformiert, oft emotional involviert, recherchieren wochenlang – und entscheiden letztlich über das Gefühl von Vertrauen.',
      'Das macht klassische Marketing-Mechanismen, die in anderen Branchen funktionieren, hier problematisch. Aggressive Vorher-Nachher-Werbung? Wirkt unseriös. Billig-Angebote? Senkt die wahrgenommene Qualität. Große Versprechen? Abschreckend.',
      'Die Praxis Theres stand vor einem klaren Problem: gute Arbeit, hochwertige Ausstattung, exzellente Reputation bei Bestandspatientinnen – aber die Online-Sichtbarkeit bewegte sich nicht in der Liga, die dem fachlichen Niveau entsprach.',
    ],
    massnahmen_h2: 'Sichtbarkeit mit Haltung – vier Hebel ohne Kompromisse bei Seriosität',
    massnahmen: [
      ['Werteorientierte Profilgestaltung', 'Keine reißerischen Bilder, keine "Jetzt Angebot sichern"-Banner. Das Profil wurde so aufgebaut, dass es Seriosität kommuniziert: Praxisräume, Zertifikate, ruhige Bildsprache, präzise medizinische Beschreibungen. Die Ästhetik des Profils spiegelt die Ästhetik der Praxis.'],
      ['Fokus auf Fachkategorien', 'In der ästhetischen Chirurgie gibt es dutzende spezifische Eingriffe und Fachbezeichnungen. Jede korrekte Kategorie öffnet Sichtbarkeit für die Patientinnen, die genau diesen Eingriff suchen. Vorher war das Profil zu breit aufgestellt, jetzt gezielt nach Behandlungsfeldern.'],
      ['Bewertungsmanagement mit Feingefühl', 'Gerade in dieser Branche sind Bewertungen eine komplexe Angelegenheit. Patientinnen wollen oft anonym bleiben, Bewertungen enthalten sensible Informationen. Wir antworten auf jede Bewertung – professionell, ohne Patientinnen zu exponieren, DSGVO-konform.'],
      ['Google-Posts zu fachlichen Themen, nicht zu Preisen', 'Neue Verfahren, medizinische Weiterentwicklungen, Aufklärung zu Risiken und Heilungsverläufen. Das positioniert die Praxis als Fachautorität – und zieht genau die Patientinnen an, die eine ernsthafte Entscheidung treffen wollen.'],
    ],
    ergebnis_h2: 'Doppelt so viele Aufrufe – und höhere Anfrage-Qualität',
    ergebnis_big: '+138%',
    ergebnis_sub: 'mehr Profilaufrufe in 12 Monaten',
    ergebnis: [
      '+138% mehr Profilaufrufe. Das bedeutet: Mehr als doppelt so viele Patientinnen in der Recherchephase sehen die Praxis Theres – und sehen sie in einem Aufbau, der Vertrauen schafft, statt es zu beschädigen.',
      'Wichtiger als die Zahl ist die Qualität der Aufrufe. Ein Aufruf, der zu einer ernsthaften Anfrage führt, ist in dieser Branche mehr wert als fünf oberflächliche Klicks aus einer Billig-Kampagne. Wer bei Praxis Theres anfragt, weiß bereits, dass es kein Schnäppchenbetrieb ist – und bringt entsprechend realistische Erwartungen mit.',
    ],
    quote_hint: 'Zitat vom Praxisteam Theres einholen – Themen: Wie wichtig ist Diskretion im Online-Marketing? Was hat sich in der Anfrage-Qualität verändert?',
    cta_h2: 'Du arbeitest in einem sensiblen Branchenumfeld?',
    cta_sub: 'Medizin, Recht, Finanzen, Therapie – wir wissen, wie Sichtbarkeit ohne Verlust von Seriosität funktioniert.',
    related: [
      { slug: 'orthoclinic-hamburg', num: '+82%', metric: 'mehr Profilaufrufe in 6 Monaten', name: 'Orthoclinic Hamburg', cat: 'Medizin &amp; Gesundheit' },
      { slug: 'elithera-physio', num: '+95%', metric: 'mehr Suchanfragen in 3 Monaten', name: 'Elithera Physio', cat: 'Medizin &amp; Gesundheit' },
    ],
  },
  {
    slug: 'sanitaer-susak',
    title: 'Sanitär Susak Datteln: +62% und Top-Ranking für lokale Suchen | Lokalbesucher',
    desc: 'Wie die Heizungs- und Sanitärtechnik P. Susak aus Datteln ihre Google-Aufrufe um 62% gesteigert hat – und heute bei "heizung sanitär datteln" ganz oben steht.',
    category: 'Handwerk',
    name: 'Sanitär Susak',
    h1: '+62,1% mehr Profilaufrufe in 3 Monaten',
    subline: 'Wie ein lokaler Sanitär- und Heizungsbetrieb aus Datteln zum Top-Ergebnis für „heizung sanitär datteln" wurde – und damit Kunden gewinnt, die den Firmennamen noch nie gehört haben.',
    tiles: [
      ['+62,1%', 'Mehr Profilaufrufe'],
      ['887 → 1.438', 'Aufrufe pro Quartal'],
      ['Top-Ranking', 'Für lokale Suchen in Datteln'],
    ],
    ausgangslage_h2: 'Bestandskunden kennen dich – Neukunden googeln',
    ausgangslage: [
      'Die Heizungs- und Sanitärtechnik P. Susak ist ein etablierter Handwerksbetrieb in Datteln. Die Stammkundschaft kennt den Betrieb, Bestandskunden rufen an, wenn die Therme ausfällt. So weit, so gut.',
      'Das Problem: Neue Kunden. Wenn in Datteln jemand eine neue Heizung braucht, googelt dieser Kunde. Er googelt nicht „P. Susak" – er kennt den Firmennamen nicht. Er googelt „heizung sanitär datteln" oder „heizung datteln". Wer bei diesen Suchen nicht unter den ersten Ergebnissen auftaucht, existiert faktisch nicht für Neukundschaft.',
      'Susak lag bei 887 Profilaufrufen pro Quartal – solide für Bestandskundenbeziehungen, aber zu wenig für Neukundengewinnung über Google. Im Handwerk kann ein einziger verlorener Auftrag lokal 20.000 Euro Umsatz bedeuten.',
    ],
    massnahmen_h2: 'Fünf Maßnahmen für Top-Sichtbarkeit bei generischen Suchen',
    massnahmen: [
      ['Keyword-Fokus auf generische lokale Suchen', 'Die wichtigste Erkenntnis: Der Markenname "Susak" ist für Neukunden irrelevant. Was zählt sind generische Suchen: "heizung sanitär datteln", "sanitär datteln", "heizung datteln", "klempner in der nähe". Das Profil wurde genau auf diese Suchen ausgerichtet.'],
      ['Profiloptimierung für lokale Suchintention', 'Kategorien, Beschreibungen, Leistungen alle so strukturiert, dass Google den Betrieb als klare Antwort auf genau diese Suchen einstuft. Dazu gehören Einzugsgebiet, angebotene Marken, Notdienst-Infos, Spezialisierungen.'],
      ['Bewertungsaufbau im Handwerk über TapTag', 'Handwerker haben es mit Bewertungen oft schwer – Kunden denken nach der Reparatur nicht mehr daran. TapTag löst das: Der Monteur zeigt nach Abschluss der Arbeit seinen Schlüsselanhänger mit QR-Code, der Kunde scannt ihn und landet direkt auf der Google-Bewertungsseite. Das erhöht die Bewertungsrate spürbar.'],
      ['Laufende Profil-Aktivität mit Projekt-Fotos', 'Regelmäßige Updates, Fotos von abgeschlossenen Projekten, Google-Posts zu Förderthemen (Heizungstausch, staatliche Zuschüsse) halten das Profil "frisch" in den Augen des Google-Algorithmus.'],
      ['Konsistente Verzeichniseinträge', 'Der Betrieb ist in allen relevanten Handwerker- und Branchenverzeichnissen gelistet, mit identischen Kontaktdaten. Das stärkt Autorität und liefert zusätzliche Findbarkeit über externe Plattformen.'],
    ],
    ergebnis_h2: 'Top-Ranking für lokale Suchen – Neukunden ohne Markennamen-Kenntnis',
    ergebnis_big: '+62,1%',
    ergebnis_sub: 'mehr Profilaufrufe – von 887 auf 1.438 pro Quartal',
    ergebnis: [
      '887 → 1.438 Profilaufrufe pro Quartal, +62,1% Steigerung in nur 3 Monaten. Noch entscheidender: Top-Ranking für "heizung sanitär datteln" – 63 Impressions allein für diesen einen generischen Suchbegriff. Dazu 49 Impressions für "sanitär datteln", 16 für "heizung datteln". Das sind Kunden, die den Firmennamen nicht kennen und einfach jemanden vor Ort brauchen.',
      'Der Wert für einen Handwerksbetrieb ist enorm: Ein einziger gewonnener Heizungstausch kann die Jahresinvestition in Local SEO bereits decken. Alle weiteren Kunden sind direkter Zugewinn. Bei Suchanfragen wurde eine Steigerung von +43,8% gemessen – also mehr qualifizierte Sichtbarkeit bei potenziellen Neukunden.',
    ],
    quote_hint: 'Zitat von Herrn Susak einholen – Themen: Wie viele Neukunden kamen über Google? Was war vorher das größte Problem bei der Neukundengewinnung?',
    cta_h2: 'Du bist Handwerker, Installateur oder im baunahen Gewerbe?',
    cta_sub: 'Deine Stammkunden kennen dich. Aber wer dich gerade erst braucht, googelt – und du willst der oberste Treffer sein.',
    related: [
      { slug: 'solar-richter', num: '16.000', metric: 'Profilaufrufe pro Monat', name: 'Solar Richter', cat: 'Handwerk &amp; Energie' },
      { slug: 'ristorante-peperoncino', num: '+158%', metric: 'mehr Profilaufrufe', name: 'Ristorante Peperoncino', cat: 'Gastronomie' },
    ],
  },
];

// ── HTML generator ─────────────────────────────────────────────────────────────
function buildMeasures(measures) {
  return measures.map(([title, text]) =>
    `<div class="cs-measure"><h3>${title}</h3><p>${text}</p></div>`
  ).join('\n        ');
}

function buildRelated(related) {
  return related.map(r =>
    `<a href="/case-studies/${r.slug}/" class="cs-related-card"><div class="cs-related-num">${r.num}</div><div class="cs-related-metric">${r.metric}</div><div class="cs-related-name">${r.name}</div><div class="cs-related-cat">${r.cat}</div><span class="cs-related-link">Case ansehen</span></a>`
  ).join('\n        ');
}

function buildTiles(tiles) {
  return tiles.map(([num, label]) =>
    `<div class="cs-tile"><div class="cs-tile-num">${num}</div><div class="cs-tile-label">${label}</div></div>`
  ).join('\n      ');
}

function buildParagraphs(paragraphs) {
  return paragraphs.map(p => `<p>${p}</p>`).join('\n          ');
}

function buildPage(c) {
  const url = `https://lokalbesucher.de/case-studies/${c.slug}/`;
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        "headline": c.h1,
        "description": c.desc,
        "url": url,
        "datePublished": "2026-04-24",
        "dateModified": "2026-04-24",
        "author": { "@type": "Organization", "name": "Lokalbesucher GmbH", "@id": "https://lokalbesucher.de/#organization" },
        "publisher": { "@type": "Organization", "name": "Lokalbesucher GmbH", "@id": "https://lokalbesucher.de/#organization" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://lokalbesucher.de/" },
          { "@type": "ListItem", "position": 2, "name": "Erfolge", "item": "https://lokalbesucher.de/case-studies/" },
          { "@type": "ListItem", "position": 3, "name": c.name.replace(/&amp;/g, '&'), "item": url }
        ]
      }
    ]
  });

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${c.title}</title>
  <meta name="description" content="${c.desc}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${c.title}">
  <meta property="og:description" content="${c.desc}">
  <meta property="og:image" content="https://lokalbesucher.de/assets/images/cases/${c.slug}-og.png">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" href="/assets/fonts/syne-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/dm-sans-400.woff2" as="font" type="font/woff2" crossorigin>
  <style>${CSS}</style>
  <link rel="stylesheet" href="/assets/css/global.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/assets/css/global.css"></noscript>
  <link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/images/favicon.webp" type="image/webp" sizes="any">
  <script type="application/ld+json">${schema}</script>
  ${GA4}
</head>
<body>
<a href="#main" class="skip-link">Zum Hauptinhalt springen</a>
${HEADER}
<main id="main">
  <div class="container section--sm">
    <nav class="breadcrumb" aria-label="Brotkrümelnavigation">
      <a href="/">Startseite</a><span class="breadcrumb-sep" aria-hidden="true">›</span>
      <a href="/case-studies/">Erfolge</a><span class="breadcrumb-sep" aria-hidden="true">›</span>
      <span aria-current="page">${c.name}</span>
    </nav>
  </div>
  <section class="cs-hero"><div class="container">
    <div class="cs-label">Case Study · ${c.category}</div>
    <h1 class="cs-h1">${c.h1}</h1>
    <p class="cs-subline">${c.subline}</p>
    <div class="cs-tiles">
      ${buildTiles(c.tiles)}
    </div>
  </div></section>
  <div class="container cs-body">
    <section aria-labelledby="ausgangslage" data-reveal><div class="cs-content">
      <span class="cs-tag">Die Ausgangslage</span>
      <h2 id="ausgangslage">${c.ausgangslage_h2}</h2>
      <div class="cs-prose">
          ${buildParagraphs(c.ausgangslage)}
      </div>
    </div></section>
    <hr class="cs-divider">
    <section aria-labelledby="massnahmen" data-reveal><div class="cs-content">
      <span class="cs-tag">Was wir gemacht haben</span>
      <h2 id="massnahmen">${c.massnahmen_h2}</h2>
      <div class="cs-measures">
        ${buildMeasures(c.massnahmen)}
      </div>
    </div></section>
    <hr class="cs-divider">
    <section aria-labelledby="ergebnis" data-reveal><div class="cs-content">
      <span class="cs-tag">Das Ergebnis</span>
      <h2 id="ergebnis">${c.ergebnis_h2}</h2>
      <div class="cs-result-card">
        <span class="cs-result-big">${c.ergebnis_big}</span>
        <div class="cs-result-sub">${c.ergebnis_sub}</div>
      </div>
      <div class="cs-prose">
          ${buildParagraphs(c.ergebnis)}
      </div>
    </div></section>
    <div class="cs-cta" data-reveal>
      <h2>${c.cta_h2}</h2>
      <p>${c.cta_sub}</p>
      <div class="cs-cta-btns">
        <a href="https://wa.me/4915122358883" class="btn btn-primary" target="_blank" rel="noopener noreferrer">${WA_SVG}WhatsApp: Jetzt anfragen</a>
        <a href="/#anfrage" class="btn btn-outline">Kostenloses Erstgespräch buchen</a>
      </div>
    </div>
    <section class="cs-related" aria-label="Weitere Erfolgsgeschichten" data-reveal>
      <h2>Weitere Erfolgsgeschichten</h2>
      <div class="cs-related-grid">
        ${buildRelated(c.related)}
      </div>
    </section>
  </div>
</main>
${FOOTER}
<a href="https://wa.me/4915122358883" class="whatsapp-float" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp Beratung starten">${WA_SVG_22}</a>
${SCRIPTS}
</body>
</html>`;
}

// ── Overview page ──────────────────────────────────────────────────────────────
// All 9 cases for the grid
const allCases = [
  { slug: 'battlekart',              num: '800+',    metric: '5-Sterne-Bewertungen in 9 Monaten', name: 'BattleKart',              cat: 'Freizeit',  catLabel: 'Freizeit &amp; Entertainment' },
  { slug: 'ristorante-peperoncino',  num: '+158%',   metric: 'mehr Profilaufrufe',                name: 'Ristorante Peperoncino',  cat: 'Gastro',    catLabel: 'Gastronomie' },
  { slug: 'muhis-restaurant',        num: '+151%',   metric: 'Aufrufe seit Profilstart',          name: 'MUHIS Restaurant',        cat: 'Gastro',    catLabel: 'Gastronomie' },
  { slug: 'viabeauty',               num: '+388%',   metric: 'mehr Profilaufrufe',                name: 'Viabeauty',               cat: 'Beauty',    catLabel: 'Beauty &amp; Kosmetik' },
  { slug: 'orthoclinic-hamburg',     num: '+82%',    metric: 'mehr Profilaufrufe in 6 Monaten',  name: 'Orthoclinic Hamburg',     cat: 'Medizin',   catLabel: 'Medizin &amp; Gesundheit' },
  { slug: 'elithera-physio',         num: '+95%',    metric: 'mehr Suchanfragen in 3 Monaten',   name: 'Elithera Physio',         cat: 'Medizin',   catLabel: 'Medizin &amp; Gesundheit' },
  { slug: 'praxis-theres',           num: '+138%',   metric: 'mehr Profilaufrufe',               name: 'Praxis Theres',           cat: 'Medizin',   catLabel: 'Medizin &amp; Ästhetik' },
  { slug: 'solar-richter',           num: '16.000',  metric: 'Profilaufrufe pro Monat',          name: 'Solar Richter',           cat: 'Handwerk',  catLabel: 'Handwerk &amp; Energie' },
  { slug: 'sanitaer-susak',          num: '+62,1%',  metric: 'mehr Profilaufrufe in 3 Monaten', name: 'Sanitär Susak',           cat: 'Handwerk',  catLabel: 'Handwerk' },
];

const CSS_OVERVIEW = CSS + `
.overview-hero{padding:5rem 0 4rem;position:relative;overflow:hidden}.overview-hero::before{content:'';position:absolute;top:-20%;right:-5%;width:50%;height:140%;background:radial-gradient(ellipse at center,rgba(255,189,89,.07) 0%,transparent 65%);pointer-events:none}
.filter-bar{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:2.5rem}
.filter-btn{background:#111328;border:1px solid #1e2240;border-radius:8px;padding:.5em 1.1em;font-family:'Syne',system-ui,sans-serif;font-size:.8rem;font-weight:700;color:#6b7099;cursor:pointer;transition:all .2s}
.filter-btn:hover{border-color:#ffbd59;color:#e8eaf6}
.filter-btn.active{background:#ffbd59;color:#0c0e1a;border-color:#ffbd59}
.cases-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1.5rem}
.case-card{display:block;background:#111328;border:1px solid #1e2240;border-radius:16px;padding:1.75rem;text-decoration:none;transition:border-color .25s ease,transform .25s ease}
.case-card:hover{border-color:#ffbd59;transform:translateY(-3px)}
.case-card[hidden]{display:none}
.case-num{font-family:'Syne',system-ui,sans-serif;font-size:2.25rem;font-weight:800;color:#ffbd59;line-height:1}
.case-metric{font-size:.8rem;color:#6b7099;margin-top:.2rem}
.case-name{font-size:1.05rem;font-weight:700;color:#e8eaf6;margin-top:1rem;font-family:'Syne',system-ui,sans-serif}
.case-cat{font-size:.8rem;color:#6b7099;margin-top:.25rem}
.case-cta{display:inline-flex;align-items:center;gap:.35rem;font-size:.85rem;font-weight:700;color:#ffbd59;text-decoration:none;margin-top:1.25rem;font-family:'Syne',system-ui,sans-serif}`;

function buildOverview() {
  const cards = allCases.map(c =>
    `<a href="/case-studies/${c.slug}/" class="case-card" data-cat="${c.cat}">
      <div class="case-num">${c.num}</div>
      <div class="case-metric">${c.metric}</div>
      <div class="case-name">${c.name}</div>
      <div class="case-cat">${c.catLabel}</div>
      <span class="case-cta">Case ansehen</span>
    </a>`
  ).join('\n    ');

  const schemaItems = allCases.map((c, i) =>
    `{"@type":"ListItem","position":${i + 1},"url":"https://lokalbesucher.de/case-studies/${c.slug}/","name":"${c.name}"}`
  ).join(',');

  const schema = `{"@context":"https://schema.org","@graph":[{"@type":"CollectionPage","@id":"https://lokalbesucher.de/case-studies/#page","name":"Erfolgsgeschichten","description":"9 dokumentierte Wachstums-Cases aus Google Business Optimierung, Bewertungsmanagement und Local SEO.","url":"https://lokalbesucher.de/case-studies/","isPartOf":{"@id":"https://lokalbesucher.de/#website"}},{"@type":"ItemList","name":"Lokalbesucher Case Studies","itemListElement":[${schemaItems}]},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Startseite","item":"https://lokalbesucher.de/"},{"@type":"ListItem","position":2,"name":"Erfolge","item":"https://lokalbesucher.de/case-studies/"}]}]}`;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Erfolgsgeschichten: 9 dokumentierte Cases | Lokalbesucher</title>
  <meta name="description" content="9 echte Wachstums-Cases aus Google Business Optimierung und Local SEO: +388% Aufrufe, 800+ Bewertungen in 9 Monaten, 0 → 16.000 Profilaufrufe. Alle Zahlen echt, nichts hochgerechnet.">
  <link rel="canonical" href="https://lokalbesucher.de/case-studies/">
  <meta property="og:title" content="Erfolgsgeschichten: 9 dokumentierte Cases | Lokalbesucher">
  <meta property="og:description" content="9 echte Wachstums-Cases aus Google Business Optimierung und Local SEO. Alle Zahlen echt, nichts hochgerechnet.">
  <meta property="og:image" content="https://lokalbesucher.de/assets/images/cases/case-studies-og.png">
  <meta property="og:url" content="https://lokalbesucher.de/case-studies/">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" href="/assets/fonts/syne-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/dm-sans-400.woff2" as="font" type="font/woff2" crossorigin>
  <style>${CSS_OVERVIEW}</style>
  <link rel="stylesheet" href="/assets/css/global.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/assets/css/global.css"></noscript>
  <link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/images/favicon.webp" type="image/webp" sizes="any">
  <script type="application/ld+json">${schema}</script>
  ${GA4}
</head>
<body>
<a href="#main" class="skip-link">Zum Hauptinhalt springen</a>
${HEADER}
<main id="main">
  <section class="overview-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Brotkrümelnavigation">
        <a href="/">Startseite</a><span class="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">Erfolge</span>
      </nav>
      <h1 style="font-size:clamp(2rem,5vw,3.25rem);font-weight:800;color:#e8eaf6;margin-bottom:1rem;max-width:700px">9 Cases. Echte Zahlen. Kein Marketing-Sprech.</h1>
      <p style="font-size:1.05rem;color:#6b7099;max-width:600px;line-height:1.75">Alle Wachstumszahlen sind aus echten Google-Business-Dashboards. Nichts hochgerechnet, nichts gerundet auf runde Nummern. Was du hier siehst, ist was unsere Kunden tatsächlich erreicht haben.</p>
    </div>
  </section>
  <div class="container" style="padding:3rem 0 5rem">
    <div class="filter-bar" role="group" aria-label="Nach Branche filtern">
      <button class="filter-btn active" data-filter="all">Alle</button>
      <button class="filter-btn" data-filter="Gastro">Gastronomie</button>
      <button class="filter-btn" data-filter="Medizin">Medizin &amp; Gesundheit</button>
      <button class="filter-btn" data-filter="Handwerk">Handwerk</button>
      <button class="filter-btn" data-filter="Beauty">Beauty</button>
      <button class="filter-btn" data-filter="Freizeit">Freizeit</button>
    </div>
    <div class="cases-grid" id="cases-grid">
    ${cards}
    </div>
  </div>
</main>
${FOOTER}
<a href="https://wa.me/4915122358883" class="whatsapp-float" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp Beratung starten">${WA_SVG_22}</a>
<script>
(function(){
  var t=document.querySelector('.nav-toggle'),d=document.getElementById('nav-drawer');
  if(t&&d){t.addEventListener('click',function(){var o=t.getAttribute('aria-expanded')==='true';t.setAttribute('aria-expanded',String(!o));d.classList.toggle('is-open',!o);});document.addEventListener('click',function(e){if(!t.contains(e.target)&&!d.contains(e.target)){t.setAttribute('aria-expanded','false');d.classList.remove('is-open');}});document.addEventListener('keydown',function(e){if(e.key==='Escape'){t.setAttribute('aria-expanded','false');d.classList.remove('is-open');t.focus();}});}
  // Filter
  var btns=document.querySelectorAll('.filter-btn');
  var cards=document.querySelectorAll('.case-card');
  btns.forEach(function(btn){
    btn.addEventListener('click',function(){
      btns.forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var f=btn.getAttribute('data-filter');
      cards.forEach(function(card){
        if(f==='all'||card.getAttribute('data-cat')===f){card.removeAttribute('hidden');}
        else{card.setAttribute('hidden','');}
      });
    });
  });
}());
</script>
<script src="/assets/js/cookie-consent.js" defer></script>
</body>
</html>`;
}

// ── Write files ────────────────────────────────────────────────────────────────
cases.forEach(function(c) {
  const dir = path.join(ROOT, 'case-studies', c.slug);
  fs.mkdirSync(dir, { recursive: true });
  const html = buildPage(c);
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log('✓  case-studies/' + c.slug + '/index.html');
});

// Overview
const overviewDir = path.join(ROOT, 'case-studies');
fs.mkdirSync(overviewDir, { recursive: true });
fs.writeFileSync(path.join(overviewDir, 'index.html'), buildOverview(), 'utf8');
console.log('✓  case-studies/index.html');

console.log('\nDone. ' + (cases.length + 1) + ' files written.');
