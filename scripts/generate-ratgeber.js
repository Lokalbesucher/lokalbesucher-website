/* Generator: Ratgeber-Artikel aus Content-Objekten + gemeinsamem Seitenrahmen.
   Rahmen = 1:1 die Blaupause von /ratgeber/google-update-traffic-eingebrochen/. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const V = '2026082201';

const WA = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
const OG_IMG = 'https://lokalbesucher.de/assets/images/og-lokalbesucher.png';
const stripTags = h => h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

function page(a) {
  const url = 'https://lokalbesucher.de/ratgeber/' + a.slug + '/';
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', '@id': url + '#article', headline: a.h1.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        description: a.metaDesc, image: OG_IMG, datePublished: a.date, dateModified: a.date, inLanguage: 'de',
        author: { '@type': 'Person', name: 'Tobias Frank', jobTitle: 'Inhaber Lokalbesucher GmbH', worksFor: { '@id': 'https://lokalbesucher.de/#organization' } },
        publisher: { '@id': 'https://lokalbesucher.de/#organization' }, mainEntityOfPage: url
      },
      {
        '@type': 'WebPage', '@id': url + '#webpage', url, name: a.title.replace(' | Lokalbesucher', ''),
        isPartOf: { '@id': 'https://lokalbesucher.de/#website' }, datePublished: a.date, dateModified: a.date,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://lokalbesucher.de/' },
          { '@type': 'ListItem', position: 2, name: 'Ratgeber', item: 'https://lokalbesucher.de/ratgeber/' },
          { '@type': 'ListItem', position: 3, name: a.crumb, item: url }
        ] }
      },
      { '@type': 'FAQPage', mainEntity: a.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) } })) }
    ]
  };

  const faqHtml = '<h2 id="faq">' + a.faqTitle + '</h2>\n' +
    a.faqs.map(f => '        <h3 id="' + f.id + '">' + f.q + '</h3>\n        <p>' + f.a + '</p>').join('\n');

  const related = '<div class="capsule" style="border-left-color:#4f82ff"><p><strong>Weiterlesen:</strong> ' +
    a.related.map(r => '<a href="' + r.href + '">' + r.label + '</a>').join(' · ') + '</p></div>';

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a.title}</title>
  <meta name="description" content="${a.metaDesc}">
  <link rel="canonical" href="${url}">

  <meta property="og:type"        content="article">
  <meta property="og:url"         content="${url}">
  <meta property="og:title"       content="${a.title.replace(' | Lokalbesucher', '')}">
  <meta property="og:description" content="${a.metaDesc}">
  <meta property="og:image"       content="${OG_IMG}">
  <meta property="og:locale"      content="de_DE">
  <meta property="og:site_name"   content="Lokalbesucher">

  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${a.title.replace(' | Lokalbesucher', '')}">
  <meta name="twitter:description" content="${a.metaDesc}">
  <meta name="twitter:image"       content="${OG_IMG}">

  <link rel="preload" href="/assets/fonts/dm-sans-400-v2.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/css/global.css?v=${V}" as="style">

  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:#0c0e1a;color:#e8eaf6;font-family:'DM Sans',system-ui,sans-serif;font-weight:400;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
    h1,h2,h3,h4,h5,h6{font-family:'DM Sans',system-ui,sans-serif;line-height:1.15}
    img{display:block;max-width:100%;height:auto}
    a{color:inherit;text-decoration:none}
    ul{list-style:none}
    .container{width:100%;max-width:1200px;margin-inline:auto;padding-inline:1.5rem}
    @media(min-width:768px){.container{padding-inline:2rem}}
    @media(min-width:1200px){.container{padding-inline:3rem}}
    .site-header{position:sticky;top:0;z-index:100;background:rgba(12,14,26,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid #1e2240}
    .nav{display:flex;align-items:center;gap:2rem;height:4rem}
    .nav-logo{display:flex;align-items:center;gap:.55rem;font-family:Arial,sans-serif;font-weight:700;font-size:1.2rem;color:#e8eaf6;flex-shrink:0}
    .nav-logo img{height:2.4rem;width:auto;display:block}
    .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.8em 1.6em;font-family:'DM Sans',system-ui,sans-serif;font-weight:700;font-size:.95rem;line-height:1;border-radius:12px;border:2px solid transparent;cursor:pointer;white-space:nowrap;transition:all .25s cubic-bezier(.4,0,.2,1);text-decoration:none}
    .btn-primary{background:#ffbd59;color:#0c0e1a;box-shadow:0 4px 24px rgba(255,189,89,.2)}
    .btn-primary:hover{background:#ffc96d;transform:translateY(-1px)}
    .btn-ghost{background:transparent;color:#e8eaf6;border-color:#1e2240}
    .btn-ghost:hover{background:#111328;border-color:#7c83aa}
    .btn-lg{font-size:1.05rem;padding:1em 2em}
    .page-hero{padding-block:4rem 2.5rem}
    @media(min-width:768px){.page-hero{padding-block:5.5rem 3rem}}
    .article{max-width:760px;margin-inline:auto}
    .article p{color:#b9bedd;margin-bottom:1.1rem}
    .article h2{font-size:1.45rem;font-weight:700;margin:2.75rem 0 1rem;letter-spacing:-.01em}
    .article h3{font-size:1.1rem;font-weight:700;margin:1.75rem 0 .6rem}
    .article ul,.article ol{margin:0 0 1.1rem 1.25rem;color:#b9bedd;display:flex;flex-direction:column;gap:.45rem}
    .article ul{list-style:disc}
    .article ol{list-style:decimal}
    .article strong{color:#e8eaf6}
    .article a{color:#ffbd59;text-decoration:underline;text-underline-offset:2px}
    .capsule{background:#111328;border:1px solid #1e2240;border-left:3px solid #ffbd59;border-radius:12px;padding:1.1rem 1.25rem;margin:1.5rem 0}
    .capsule p{margin:0;font-size:.97rem}
    .statbox{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin:1.5rem 0}
    .statbox>div{background:#111328;border:1px solid #1e2240;border-radius:12px;padding:1rem 1.1rem}
    .statbox .n{font-family:'DM Sans',sans-serif;font-weight:800;font-size:1.7rem;color:#ffbd59}
    .statbox p{font-size:.85rem;margin:0;color:#7c83aa}
    .ptable{width:100%;border-collapse:collapse;margin:1.25rem 0;font-size:.92rem}
    .ptable th,.ptable td{border:1px solid #1e2240;padding:.65rem .8rem;text-align:left;color:#b9bedd;vertical-align:top}
    .ptable th{background:#111328;color:#e8eaf6;font-family:'DM Sans',sans-serif;font-size:.85rem}
    .tablewrap{overflow-x:auto}
  @media(max-width:400px){.btn{white-space:normal;text-align:center;max-width:100%}}
  </style>

  <link rel="stylesheet" href="/assets/css/global.css?v=${V}" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/assets/css/global.css?v=${V}"></noscript>
  <link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">

  <!-- ── Schema.org JSON-LD ────────────────────────────────────── -->
  <script type="application/ld+json">
  ${JSON.stringify(graph, null, 2).split('\n').join('\n  ')}
  </script>

  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://cdn.leadinfo.eu">
  <link rel="dns-prefetch" href="https://cdn.leadinfo.net">
  <link rel="dns-prefetch" href="https://collector4.leadinfo.net">
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','wait_for_update':500});</script>
  <script src="/assets/js/third-party.js?v=${V}" defer></script>
  <script>gtag('js',new Date());gtag('config','G-KRKS5RL7MP',{anonymize_ip:true});gtag('config','AW-11287998127');</script>
</head>
<body>

<a href="#main" class="skip-link">Zum Hauptinhalt springen</a>

<header class="site-header">
  <div class="container">
    <nav class="nav" aria-label="Hauptnavigation">
      <a href="/" class="nav-logo" aria-label="Lokalbesucher – Startseite">
        <img src="/assets/images/lokalbesucher-logo-invers.webp" alt="Lokalbesucher Logo" width="35" height="38" loading="eager">
        Lokalbesucher
      </a>
      <ul class="nav-links" role="list">
        <li class="nav-has-dropdown">
          <a href="/google-business-agentur/" aria-haspopup="true">Leistungen</a>
          <ul class="nav-dropdown">
            <li><a href="/google-business-agentur/">Google Business Optimierung</a></li>
            <li><a href="/bewertungsmanagement/">Bewertungsmanagement</a></li>
            <li><a href="/seo-agentur/">SEO Agentur</a></li>
            <li><a href="/google-ads/">Google &amp; YouTube Ads</a></li>
            <li><a href="/meta-ads/">Facebook &amp; Instagram Ads</a></li>
            <li><a href="/social-media-agentur/">Social Media Agentur</a></li>
          </ul>
        </li>
        <li><a href="/case-studies/">Erfolge</a></li>
        <li><a href="/faq/">FAQ</a></li>
        <li><a href="/jobs/">Jobs</a></li>
        <li class="nav-has-dropdown">
          <a href="#" aria-haspopup="true">Tools</a>
          <ul class="nav-dropdown">
            <li><a href="/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/">ROI-Kalkulator <span class="dropdown-badge">Kostenlos</span></a></li>
            <li><a href="/schema-org-generator/">Schema Generator</a></li>
            <li><a href="/ki-sichtbarkeits-check/">KI-Sichtbarkeits-Check <span class="dropdown-badge">Neu</span></a></li>
          </ul>
        </li>
      </ul>
      <a href="https://wa.me/4915122358883"
         class="btn btn-primary nav-cta"
         rel="noopener noreferrer"
         target="_blank"
         aria-label="Kostenlose Beratung via WhatsApp">
        ${WA}
        Kostenlos beraten
      </a>
      <button class="nav-toggle" aria-controls="nav-drawer" aria-expanded="false" aria-label="Navigation öffnen">
        <span></span><span></span><span></span>
      </button>
    </nav>
  </div>
  <div id="nav-drawer" class="nav-drawer" role="navigation" aria-label="Mobile Navigation">
    <span class="drawer-sub-label">Leistungen</span>
    <a href="/google-business-agentur/" class="drawer-sub-link">Google Business Optimierung</a>
    <a href="/bewertungsmanagement/" class="drawer-sub-link">Bewertungsmanagement</a>
    <a href="/seo-agentur/" class="drawer-sub-link">SEO Agentur</a>
    <a href="/google-ads/" class="drawer-sub-link">Google &amp; YouTube Ads</a>
    <a href="/meta-ads/" class="drawer-sub-link">Facebook &amp; Instagram Ads</a>
    <a href="/social-media-agentur/" class="drawer-sub-link">Social Media Agentur</a>
    <a href="/case-studies/">Erfolge</a>
    <a href="/faq/">FAQ</a>
    <a href="/jobs/">Jobs</a>
    <span class="drawer-sub-label">Tools</span>
    <a href="/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/" class="drawer-sub-link">ROI-Kalkulator</a>
    <a href="/schema-org-generator/" class="drawer-sub-link">Schema Generator</a>
    <a href="/ki-sichtbarkeits-check/" class="drawer-sub-link">KI-Sichtbarkeits-Check</a>
    <a href="/impressum/">Impressum</a>
    <a href="https://wa.me/4915122358883" rel="noopener noreferrer" target="_blank" class="btn btn-primary" style="width:fit-content;margin-top:.5rem">WhatsApp Beratung</a>
  </div>
</header>

<main id="main">

  <!-- HERO -->
  <section class="page-hero grid-bg" aria-labelledby="art-title">
    <div class="container">
      <nav class="breadcrumb" aria-label="Brotkrümelnavigation">
        <a href="/">Startseite</a>
        <span class="breadcrumb-sep" aria-hidden="true">›</span>
        <a href="/ratgeber/">Ratgeber</a>
        <span class="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">${a.crumb}</span>
      </nav>

      <div style="max-width:820px">
        <span class="section-label">Ratgeber · ${a.tag}</span>
        <h1 id="art-title" style="font-size:clamp(1.875rem,4.5vw,2.9rem);font-weight:800;margin-bottom:1rem">
          ${a.h1}
        </h1>
        <p style="font-size:1.05rem;color:#7c83aa;max-width:640px;line-height:1.75;margin-bottom:1.5rem">
          ${a.heroSub}
        </p>
        <a href="https://wa.me/4915122358883?text=${a.waText}"
           class="btn btn-primary btn-lg" rel="noopener noreferrer" target="_blank"
           aria-label="Kostenlose Beratung via WhatsApp">
          ${a.heroCta}
        </a>
      </div>
    </div>
  </section>

  <!-- Autorenbox (E-E-A-T) -->
  <div style="border-bottom:1px solid #1e2240;padding:1rem 0">
    <div class="container">
      <div style="display:flex;align-items:center;gap:1.25rem;background:#111328;border:1px solid #1e2240;border-radius:16px;padding:1rem 1.25rem;max-width:680px">
        <img src="/assets/images/tobias-frank-inhaber-lokalbesucher-gmbh.webp"
             alt="Tobias Frank — Inhaber Lokalbesucher GmbH"
             width="80" height="104" loading="lazy"
             style="width:80px;height:auto;border-radius:10px;flex-shrink:0;object-fit:cover;object-position:top">
        <div>
          <p style="font-size:.7rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#ffbd59;margin-bottom:.25rem">Verfasst von</p>
          <p style="font-family:'DM Sans',system-ui,sans-serif;font-weight:700;font-size:.95rem;color:#e8eaf6;margin-bottom:.2rem">Tobias Frank</p>
          <p style="font-size:.8rem;color:#7c83aa;line-height:1.5">Inhaber &amp; Geschäftsführer · Lokalbesucher GmbH · 20&nbsp;Jahre Erfahrung (Salesforce, Amazon, StepStone) · <time datetime="${a.date}">Stand: ${a.dateNice}</time></p>
        </div>
      </div>
    </div>
  </div>

  <!-- ARTIKEL -->
  <section class="section" aria-label="Ratgeber-Artikel">
    <div class="container">
      <article class="article">

        <div class="capsule" id="antwort-kurz">
          <p><strong>Die kurze Antwort:</strong> ${a.capsule}</p>
        </div>

${a.body}

        ${faqHtml}

        ${related}

      </article>
    </div>
  </section>

  <!-- CTA -->
  <section class="section" aria-labelledby="art-cta">
    <div class="container">
      <div class="cta-section">
        <span class="section-label">${a.ctaLabel}</span>
        <h2 class="cta-section-title" id="art-cta">${a.ctaTitle}</h2>
        <p class="cta-section-desc">
          ${a.ctaDesc}
        </p>
        <div class="cta-group">
          <a href="https://wa.me/4915122358883?text=${a.waText}"
             class="btn btn-primary btn-lg"
             rel="noopener noreferrer"
             target="_blank"
             aria-label="Beratung via WhatsApp anfragen">
            ${WA.replace('width="16" height="16"', 'width="20" height="20"')}
            ${a.ctaBtn}
          </a>
          <a href="${a.ctaGhostHref}" class="btn btn-ghost btn-lg">
            ${a.ctaGhost}
          </a>
        </div>
      </div>
    </div>
  </section>

</main>

<footer class="site-footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-brand">
          <img src="/assets/images/lokalbesucher-logo-invers.webp" alt="Lokalbesucher Logo" width="34" height="37" loading="lazy">
          Lokalbesucher
        </div>
        <p class="footer-tagline">einfach. lokal. erfolgreich.</p>
        <address class="footer-nap" style="font-style:normal">
          <strong>Lokalbesucher GmbH</strong>
          Karl-Breuing-Str. 2<br>
          45770 Marl<br>
          <a href="tel:+4915122358883">+49&nbsp;151&nbsp;22358883</a><br>
          <!--email_off--><a href="mailto:info@lokalbesucher.de">info@lokalbesucher.de</a><!--/email_off-->
        </address>
      </div>
      <nav aria-label="Leistungen">
        <div class="footer-col-title">Leistungen</div>
        <ul class="footer-links" role="list">
          <li><a href="/google-business-agentur/">Google Business Optimierung</a></li>
          <li><a href="/bewertungsmanagement/">Bewertungsmanagement</a></li>
          <li><a href="/google-business-agentur/#verzeichnisse">Branchenverzeichnisse</a></li>
          <li><a href="/google-business-agentur/#reporting">Monatliches Reporting</a></li>
          <li><a href="/werbeagentur-recklinghausen/">Werbeagentur Recklinghausen</a></li>
          <li><a href="/seo-agentur/">SEO Agentur</a></li>
          <li><a href="/google-ads/">Google &amp; YouTube Ads</a></li>
          <li><a href="/meta-ads/">Facebook &amp; Instagram Ads</a></li>
        </ul>
      </nav>
      <nav aria-label="Unternehmen">
        <div class="footer-col-title">Unternehmen</div>
        <ul class="footer-links" role="list">
          <li><a href="/case-studies/">Erfolgsgeschichten</a></li>
          <li><a href="/faq/">FAQ</a></li><li><a href="/ratgeber/">Ratgeber</a></li><li><a href="/jobs/">Jobs</a></li>
          <li><a href="/schema-org-generator/">Schema Generator</a></li><li><a href="/ki-sichtbarkeits-check/">KI-Sichtbarkeits-Check</a></li>
          <li><a href="/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/">ROI Kalkulator</a></li>
        </ul>
      </nav>
      <div>
        <div class="footer-col-title">Jetzt starten</div>
        <p style="font-size:.875rem;color:#7c83aa;margin-bottom:1rem;line-height:1.7">Kostenlose Erstberatung — direkt via WhatsApp.</p>
        <a href="https://wa.me/4915122358883" class="btn btn-primary" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp Beratung">
          ${WA}
          WhatsApp Beratung
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Lokalbesucher GmbH &middot; Alle Rechte vorbehalten</p>
      <nav class="footer-legal-links" aria-label="Rechtliches">
        <a href="/impressum/">Impressum</a>
        <a href="/datenschutz/">Datenschutz</a>
        <a href="/agb/">AGB</a>
        <a href="#cookie-settings" id="cookie-settings-link">Cookie-Einstellungen</a>
      </nav>
    </div>
  </div>
</footer>

<a href="https://wa.me/4915122358883" class="whatsapp-float" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp Beratung starten">
  ${WA.replace('width="16" height="16"', 'width="22" height="22"')}
  Jetzt beraten lassen
</a>

<script>
(function(){
  'use strict';
  var toggle=document.querySelector('.nav-toggle'),drawer=document.getElementById('nav-drawer');
  if(toggle&&drawer){
    toggle.addEventListener('click',function(){var o=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!o));drawer.classList.toggle('is-open',!o);});
    document.addEventListener('click',function(e){if(!toggle.contains(e.target)&&!drawer.contains(e.target)){toggle.setAttribute('aria-expanded','false');drawer.classList.remove('is-open');}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){toggle.setAttribute('aria-expanded','false');drawer.classList.remove('is-open');toggle.focus();}});
  }
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible','revealed');obs.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('[data-reveal]').forEach(function(el){obs.observe(el);});
  }
}());
</script>
<style>.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}</style>
<script src="/assets/js/cookie-consent.js?v=${V}" defer></script>
</body>
</html>
`;
}

/* ═══════════════════ INHALTE ═══════════════════ */
const D = '2026-08-21', DN = '21. August 2026';

const ARTICLES = [

/* ── 1. KOSTEN ─────────────────────────────────── */
{
  slug: 'google-business-optimierung-kosten', date: D, dateNice: DN,
  tag: 'Preise', crumb: 'Kosten Google Business Optimierung',
  title: 'Was kostet Google Business Optimierung? Preise 2026 | Lokalbesucher',
  metaDesc: 'Google Business Optimierung kostet 150–600 € pro Monat bei Agenturen. Alle Preismodelle im Vergleich, unsere Preise transparent — und woran du unseriöse Anbieter erkennst.',
  h1: 'Was kostet Google Business Optimierung?<br>Alle Preise transparent',
  heroSub: 'Marktübersicht, unsere eigenen Preise ohne Sternchen-Versteckspiel — und die Warnsignale, an denen du Abzocker erkennst.',
  heroCta: 'Kostenlose Potenzialanalyse via WhatsApp',
  waText: 'Hallo%20Tobias%2C%20was%20w%C3%BCrde%20Google%20Business%20Optimierung%20f%C3%BCr%20mein%20Unternehmen%20kosten%3F',
  capsule: 'Professionelle Google Business Optimierung kostet in Deutschland typischerweise <strong>150–600&nbsp;€ pro Monat</strong>. Bei Lokalbesucher: <strong>279&nbsp;€/Monat zzgl. 19&nbsp;% MwSt.</strong>, einmalig 379&nbsp;€ Einrichtung, Laufzeit 12 Monate — alles inklusive, auch das TapTag-System. Das Google Business Profil selbst ist kostenlos; bezahlt wird die laufende professionelle Arbeit daran.',
  body: `        <h2 id="preisuebersicht">Die drei Wege — und was sie wirklich kosten</h2>
        <div class="tablewrap"><table class="ptable">
          <tr><th>Weg</th><th>Kosten</th><th>Für wen sinnvoll</th></tr>
          <tr><td><strong>Selbst machen</strong></td><td>0&nbsp;€ — aber realistisch 5–10 Stunden pro Monat</td><td>Gründer mit Zeit und Lust, sich in Rankingfaktoren, Bewertungsrichtlinien und Verzeichnispflege einzuarbeiten</td></tr>
          <tr><td><strong>Freelancer</strong></td><td>ca. 80–250&nbsp;€/Monat oder Stundensätze von 60–120&nbsp;€</td><td>Einzelne Aufgaben (z.&nbsp;B. Ersteinrichtung) — laufende Betreuung steht und fällt mit der Person</td></tr>
          <tr><td><strong>Agentur</strong></td><td>ca. 150–600&nbsp;€/Monat je nach Leistungsumfang</td><td>Wer das Thema komplett abgeben will — inklusive Bewertungsmanagement, Posts und Reporting</td></tr>
        </table></div>
        <p>Wichtig zur Einordnung: Das <strong>Google Business Profil selbst ist kostenlos</strong> — Google verlangt dafür keinen Cent, egal was dir jemand am Telefon erzählt. Bezahlt wird immer nur die Arbeit daran: Pflege, Inhalte, Bewertungen, Verzeichnisse, Auswertung.</p>

        <h2 id="unsere-preise">Unsere Preise — komplett offen</h2>
        <p>Wir haben genau ein Paket, damit niemand rechnen muss, welche Funktion in welcher Stufe fehlt. Das <strong><a href="/google-business-agentur/">Ultimate Paket</a> kostet 279&nbsp;€ pro Monat zzgl. 19&nbsp;% MwSt.</strong>, dazu einmalig 379&nbsp;€ Einrichtung. Laufzeit: 12 Monate. Enthalten ist alles:</p>
        <ul>
          <li>Eintragung und Pflege in <strong>50+ Branchenverzeichnissen</strong> (konsistente Firmendaten sind ein Rankingfaktor)</li>
          <li>Antwort auf <strong>jede</strong> Google-Bewertung in <strong>unter 60 Minuten</strong></li>
          <li><strong>4 Posts pro Monat auf 9 Plattformen</strong> — über 600 Profil-Updates pro Jahr</li>
          <li><strong>TapTag</strong>: Schlüsselanhänger mit individuellem QR-Code pro Mitarbeiter, inklusive Echtzeit-Dashboard und monatlicher Sachpreis-Verlosung fürs Team — weltweit einzigartig, kein Aufpreis</li>
          <li>Reputationsschutz: 1 fachgerechter Löschantrag pro Woche bei richtlinienwidrigen Bewertungen</li>
          <li>Monatliches Reporting mit echten Kennzahlen (Aufrufe, Anrufe, Routen)</li>
        </ul>
        <p>Warum 12 Monate? Weil lokale Rankings in <strong>3–6 Monaten</strong> entstehen, nicht in 4 Wochen. Wer dir schnellere Garantien verkauft, verkauft dir Luft. Über 100 Unternehmen betreuen wir mit diesem Modell — zusammen 3,9&nbsp;Mio. Profilaufrufe und 780.000 Aktionen (Anrufe, Routen, Klicks).</p>

        <h2 id="preisfaktoren">Wovon der Preis am Markt abhängt</h2>
        <ol>
          <li><strong>Leistungsumfang:</strong> Nur Profilpflege ist billiger als Profilpflege + Bewertungsmanagement + Content + Verzeichnisse. Vergleiche nie nur den Monatspreis, sondern die Leistungsliste dahinter.</li>
          <li><strong>Anzahl der Standorte:</strong> Ketten und Filialisten zahlen pro Standort — meist mit Staffelrabatt.</li>
          <li><strong>Ausgangszustand:</strong> Ein verwaistes oder gesperrtes Profil, Duplikate oder falsche Altdaten in Verzeichnissen machen die Einrichtung aufwendiger — dafür gibt es Einrichtungsgebühren.</li>
          <li><strong>Wettbewerbsdichte:</strong> Ein Zahnarzt in Köln braucht mehr kontinuierliche Arbeit als ein Spezialbetrieb ohne lokale Konkurrenz.</li>
        </ol>

        <h2 id="warnsignale">Woran du unseriöse Anbieter erkennst</h2>
        <ul>
          <li><strong>„Wir garantieren Platz 1"</strong> — niemand kann Google-Rankings garantieren. Punkt.</li>
          <li><strong>Gekaufte Bewertungen im Angebot</strong> — wettbewerbswidrig, abmahnfähig, und Google löscht sie in Wellen. Mehr dazu im Artikel <a href="/ratgeber/mehr-google-bewertungen-bekommen/">Mehr Google-Bewertungen bekommen</a>.</li>
          <li><strong>Anrufe „Ihr Google-Eintrag wird sonst gelöscht"</strong> — eine bekannte Betrugsmasche. Google ruft nicht an und droht nicht mit Löschung.</li>
          <li><strong>Jahresgebühr im Voraus per Vorkasse</strong> ohne nachvollziehbares Reporting.</li>
          <li><strong>Erfundene „Google-Maps-Zertifikate"</strong> — für Google-Business-Optimierung vergibt Google keine Zertifikate. Echte Auszeichnungen (wie der offizielle Google-Partner-Status) lassen sich immer über eine Google-Statusseite verifizieren — frag nach dem Link.</li>
        </ul>

        <h2 id="lohnt-sich-das">Rechnet sich das überhaupt?</h2>
        <p>Rechne es an deinem eigenen Fall durch, nicht an unseren Werbeversprechen: Was ist dir ein neuer Kunde wert, und wie viele zusätzliche Anrufe pro Monat brauchst du, damit sich 279&nbsp;€ lohnen? Für die meisten lokalen Betriebe sind das <strong>1–3 Aufträge im Monat</strong>. Unser kostenloser <a href="/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/">ROI-Kalkulator</a> rechnet es dir mit deinen Zahlen vor. Reale Beispiele: Ristorante Peperoncino +158&nbsp;% Profilaufrufe, ein Schlosshotel in NRW erreichte organisch einen ROAS von 40x — ohne einen Euro Werbebudget.</p>`,
  faqTitle: 'Häufige Fragen zu den Kosten',
  faqs: [
    { id: 'faq-kosten-lokalbesucher', q: 'Was kostet Google Business Optimierung bei Lokalbesucher?', a: 'Das Ultimate Paket kostet 279&nbsp;€ pro Monat zzgl. 19&nbsp;% MwSt., dazu einmalig 379&nbsp;€ Einrichtungsgebühr. Laufzeit: 12 Monate. Alles ist enthalten — 50+ Verzeichnisse, Bewertungsantworten in unter 60 Minuten, 4 Posts/Monat auf 9 Plattformen, TapTag-System und monatliches Reporting.' },
    { id: 'faq-versteckte-kosten', q: 'Gibt es versteckte Kosten oder Aufpreise?', a: 'Nein. Es gibt genau ein Paket mit einem Preis. Auch das TapTag-System inklusive Dashboard und monatlicher Sachpreis-Verlosung (iPad, 4K-TV, SmartWatch — bezahlt und versteuert von Lokalbesucher) kostet keinen Aufpreis.' },
    { id: 'faq-kostenlos-selbst', q: 'Kann ich mein Google Business Profil kostenlos selbst optimieren?', a: 'Ja — das Profil selbst ist gratis, und die Grundlagen (Kategorien, Öffnungszeiten, Fotos) kann jeder selbst pflegen. Rechne aber mit 5–10 Stunden pro Monat für Bewertungsantworten, Posts und Verzeichnispflege. Die meisten Betriebe scheitern nicht am Können, sondern an der Kontinuität.' },
    { id: 'faq-warum-laufzeit', q: 'Warum 12 Monate Laufzeit?', a: 'Weil lokale Rankings in 3–6 Monaten entstehen. Erste messbare Effekte zeigen sich nach 4–8 Wochen, stabile Top-Platzierungen brauchen länger. Wer nach 4 Wochen abbricht, hat Geld für einen halben Hausbau ausgegeben. Die 12 Monate sind die Zeit, in der die Arbeit ihre Wirkung entfaltet.' },
    { id: 'faq-kleine-betriebe', q: 'Lohnt sich das auch für kleine Betriebe?', a: 'Gerade für kleine: Wenn ein neuer Kunde dir im Schnitt 200&nbsp;€ oder mehr bringt, reichen 1–3 zusätzliche Aufträge pro Monat, um die Kosten zu decken — alles darüber ist Gewinn. Ein Küchenstudio aus Bochum zahlt bei uns umgerechnet unter 10&nbsp;€ pro Anfrage.' }
  ],
  related: [
    { href: '/ratgeber/google-maps-top-3-ranking/', label: 'Top 3 bei Google Maps' },
    { href: '/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/', label: 'ROI-Kalkulator' }
  ],
  ctaLabel: 'Konkrete Zahlen für deinen Betrieb?',
  ctaTitle: 'Wir rechnen es dir ehrlich vor', ctaDesc: '15 Minuten, deine Branche, deine Stadt, dein Potenzial — und wenn es sich für dich nicht lohnt, sagen wir dir auch das.',
  ctaBtn: 'Kostenlose Potenzialanalyse', ctaGhost: 'ROI selbst berechnen →', ctaGhostHref: '/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/'
},

/* ── 2. MAPS TOP 3 ─────────────────────────────── */
{
  slug: 'google-maps-top-3-ranking', date: D, dateNice: DN,
  tag: 'Local SEO', crumb: 'Top 3 bei Google Maps',
  title: 'Top 3 bei Google Maps: So funktioniert das Ranking | Lokalbesucher',
  metaDesc: 'Google Maps sortiert nach Relevanz, Entfernung und Bekanntheit. Die komplette Checkliste für das Local Pack — mit realistischem Zeitplan und dem, was du lassen solltest.',
  h1: 'Top 3 bei Google Maps:<br>So funktioniert das lokale Ranking wirklich',
  heroSub: 'Drei Faktoren entscheiden, wer im Local Pack steht. Zwei davon kannst du systematisch beeinflussen — hier steht, wie.',
  heroCta: 'Kostenlosen Profil-Check anfragen',
  waText: 'Hallo%20Tobias%2C%20k%C3%B6nnt%20ihr%20mein%20Google-Profil%20mal%20kostenlos%20checken%3F',
  capsule: 'Google sortiert das Local Pack (die Top 3 bei Google Maps) nach drei Faktoren: <strong>Relevanz</strong> (passt dein Profil zur Suche?), <strong>Entfernung</strong> (Standort des Suchenden) und <strong>Bekanntheit</strong> (Bewertungen, Verzeichnisse, Erwähnungen). Entfernung ist kaum beeinflussbar — Relevanz und Bekanntheit sind es voll. Realistischer Zeitrahmen bis zu stabilen Top-3-Plätzen: 3–6 Monate.',
  body: `        <h2 id="faktoren">Die drei Rankingfaktoren im Local Pack</h2>
        <p>Google dokumentiert die Faktoren selbst — die Kunst liegt in der Umsetzung:</p>
        <ol>
          <li><strong>Relevanz.</strong> Wie gut passt dein Profil zur konkreten Suchanfrage? Gesteuert über: die richtige Hauptkategorie (der stärkste einzelne Hebel im Profil), Zusatzkategorien, eingetragene Leistungen, Produktbeschreibungen, Fotos und regelmäßige Posts.</li>
          <li><strong>Entfernung.</strong> Wo steht der Suchende gerade? Darauf hast du fast keinen Einfluss — außer über ein korrekt gepflegtes Einzugsgebiet bei Dienstleistern ohne Ladenlokal.</li>
          <li><strong>Bekanntheit.</strong> Wie präsent ist dein Unternehmen im Netz? Anzahl, Frische und Beantwortung von Bewertungen, konsistente Einträge in Branchenverzeichnissen, Erwähnungen und Verlinkungen. Hier liegt das größte Hebelpotenzial — und hier verlieren die meisten.</li>
        </ol>

        <h2 id="checkliste">Die Checkliste: Das machen die Top-3-Profile anders</h2>
        <ul>
          <li><strong>Hauptkategorie exakt gewählt</strong> — „Pizzeria" rankt für Pizza-Suchen besser als das generische „Restaurant". Alle passenden Zusatzkategorien ergänzt.</li>
          <li><strong>Leistungen und Produkte vollständig eingetragen</strong> — jede Leistung ist eine Chance, für eine Suchanfrage relevant zu sein.</li>
          <li><strong>Wöchentlich frischer Inhalt</strong> — Posts, neue Fotos, aktuelle Angebote. Ein Profil, auf dem sichtbar gearbeitet wird, schlägt das verwaiste des Wettbewerbers. Wir liefern 600+ Profil-Updates pro Jahr.</li>
          <li><strong>Bewertungen: Menge, Frische, Antworten.</strong> Ein Profil mit 40 Bewertungen, die letzte von 2023, verliert gegen eines mit 400 und täglich neuen. Und: Google wertet auch die Antworten — wir beantworten jede in unter 60 Minuten. Wie du systematisch Bewertungen aufbaust: <a href="/ratgeber/mehr-google-bewertungen-bekommen/">7 legale Wege</a>.</li>
          <li><strong>NAP-Konsistenz:</strong> Name, Adresse, Telefonnummer überall identisch — Website, Profil, 50+ Verzeichnisse. Jede Abweichung (alte Nummer bei Gelbe Seiten, andere Schreibweise bei Cylex) kostet Vertrauen.</li>
          <li><strong>Website verknüpft und lokal optimiert</strong> — mit Stadt im Titel, strukturierten Daten (kostenlos mit unserem <a href="/schema-org-generator/">Schema-Generator</a>) und schneller Ladezeit.</li>
        </ul>

        <h2 id="was-nicht-geht">Was du lassen solltest</h2>
        <ul>
          <li><strong>Keywords in den Firmennamen stopfen</strong> („Müller GmbH — Klempner Notdienst 24h billig"): verstößt gegen die Google-Richtlinien und kann zur Sperrung des Profils führen. Der Rankingvorteil ist die Sperrung nie wert.</li>
          <li><strong>Bewertungen kaufen oder Kunden dafür belohnen</strong> — wettbewerbswidrig und löschgefährdet.</li>
          <li><strong>Fake-Standorte oder Briefkastenadressen</strong> — fliegen bei Googles Verifizierungen regelmäßig auf, danach ist das Profil weg.</li>
        </ul>

        <h2 id="dauer">Wie lange dauert es bis in die Top 3?</h2>
        <p>Erste messbare Effekte — mehr Profilaufrufe, mehr Anrufe — zeigen sich typischerweise nach <strong>4–8 Wochen</strong>. Stabile Top-3-Plätze entstehen je nach Branche und Wettbewerb in <strong>3–6 Monaten</strong>. Praxisbeispiel: <a href="/case-studies/battlekart/">BattleKart Bochum</a> baute mit unserem TapTag-System in 9 Monaten über 800 Bewertungen auf und ist seither die Nr.&nbsp;1 der Region in seiner Kategorie.</p>
        <p>Messen kannst du den Fortschritt kostenlos in den Statistiken deines Google Business Profils: Aufrufe, Anrufe, Routenanfragen, Website-Klicks. Genau diese vier Zahlen stehen auch in unserem monatlichen Reporting — Rankings allein zahlen keine Rechnungen, Anrufe schon.</p>`,
  faqTitle: 'Häufige Fragen zum Maps-Ranking',
  faqs: [
    { id: 'faq-wichtigster-faktor', q: 'Was ist der wichtigste Rankingfaktor bei Google Maps?', a: 'Die Kombination aus korrekter Hauptkategorie (Relevanz) und Bewertungssignalen (Bekanntheit). Die Kategorie entscheidet, ob du überhaupt für eine Suche infrage kommst — Bewertungen entscheiden, ob du vor deinen Wettbewerbern stehst. Entfernung ist wichtig, aber kaum beeinflussbar.' },
    { id: 'faq-dauer-top3', q: 'Wie schnell komme ich in die Top 3 bei Google Maps?', a: 'Erste messbare Verbesserungen nach 4–8 Wochen, stabile Top-3-Platzierungen je nach Wettbewerbsintensität in 3–6 Monaten. Seriöse Anbieter nennen dir diesen Zeitrahmen — Platz-1-Garantien in 30 Tagen sind ein Warnsignal.' },
    { id: 'faq-profil-kostenlos', q: 'Kostet das Google Business Profil etwas?', a: 'Nein, das Profil selbst ist komplett kostenlos — anders als es Betrugsanrufe („Ihr Eintrag wird gelöscht, zahlen Sie jetzt") behaupten. Kosten entstehen nur, wenn du die laufende Pflege an eine Agentur oder einen Freelancer abgibst.' },
    { id: 'faq-keyword-name', q: 'Darf ich Keywords in meinen Firmennamen bei Google schreiben?', a: 'Nein. Der Profilname muss dem echten Firmennamen entsprechen. Zusätze wie Ort oder Leistung („… Klempner Essen 24h") verstoßen gegen die Google-Richtlinien und können zur Sperrung des Profils führen — dann ist die gesamte aufgebaute Sichtbarkeit weg.' },
    { id: 'faq-website-noetig', q: 'Brauche ich eine Website für ein gutes Maps-Ranking?', a: 'Ein Profil kann auch ohne Website ranken, aber eine verknüpfte, schnelle Website mit lokalen Signalen und strukturierten Daten stärkt Relevanz und Bekanntheit messbar — und fängt die Klicks auf, die das Profil erzeugt.' }
  ],
  related: [
    { href: '/ratgeber/mehr-google-bewertungen-bekommen/', label: 'Mehr Google-Bewertungen bekommen' },
    { href: '/ratgeber/google-business-optimierung-kosten/', label: 'Was kostet Google Business Optimierung?' }
  ],
  ctaLabel: 'Wo stehst du gerade?',
  ctaTitle: 'Kostenloser Profil-Check — wir sagen dir, was fehlt', ctaDesc: 'Wir schauen auf Kategorie, Bewertungen und Verzeichnisse und sagen dir ehrlich, wie weit die Top 3 entfernt sind.',
  ctaBtn: 'Profil-Check via WhatsApp', ctaGhost: 'KI-Sichtbarkeit testen →', ctaGhostHref: '/ki-sichtbarkeits-check/'
},

/* ── 3. MEHR BEWERTUNGEN ───────────────────────── */
{
  slug: 'mehr-google-bewertungen-bekommen', date: D, dateNice: DN,
  tag: 'Bewertungen', crumb: 'Mehr Google-Bewertungen',
  title: 'Mehr Google-Bewertungen bekommen: 7 legale Wege | Lokalbesucher',
  metaDesc: 'So bekommst du systematisch mehr echte Google-Bewertungen: 7 erlaubte Methoden aus der Praxis — und warum gekaufte Bewertungen dich Abmahnung und Profil kosten können.',
  h1: 'Mehr Google-Bewertungen bekommen:<br>7 Wege, die erlaubt sind',
  heroSub: '800+ Bewertungen in 9 Monaten sind machbar — ohne einen Cent für Fake-Bewertungen. So haben wir es bei echten Kunden gemacht.',
  heroCta: 'Bewertungsstrategie kostenlos besprechen',
  waText: 'Hallo%20Tobias%2C%20wie%20bekomme%20ich%20mehr%20Google-Bewertungen%20f%C3%BCr%20meinen%20Betrieb%3F',
  capsule: 'Mehr echte Google-Bewertungen bekommst du über zwei Prinzipien: <strong>im richtigen Moment fragen</strong> und <strong>das Bewerten maximal einfach machen</strong> (QR-Code statt „such uns mal bei Google"). Bewertungen kaufen oder Kunden mit Rabatten belohnen ist dagegen wettbewerbswidrig und gefährdet dein Profil. BattleKart Bochum kam mit System auf 800+ echte Bewertungen in 9 Monaten.',
  body: `        <h2 id="warum">Warum Bewertungen der stärkste Hebel sind</h2>
        <p>Bewertungen wirken dreifach: Sie sind ein direkter <strong>Rankingfaktor</strong> im Local Pack (Bekanntheit), sie entscheiden über den <strong>Klick</strong> (4,2 Sterne mit 400 Bewertungen schlägt 4,8 mit 12), und sie sind inzwischen die wichtigste Quelle für <strong>KI-Empfehlungen</strong> — ChatGPT und Co. lesen Bewertungen, um den Ruf eines Betriebs einzuschätzen. Ein Profil ohne frische Bewertungen ist auf allen drei Ebenen unsichtbar.</p>

        <h2 id="wege">Die 7 Wege aus der Praxis</h2>
        <ol>
          <li><strong>Im besten Moment fragen.</strong> Direkt nach dem Lob („Das sieht ja super aus!"), nach gelöstem Problem, bei der Verabschiedung. Nicht per Rundmail drei Wochen später — die Bewertungsbereitschaft fällt mit jeder Stunde.</li>
          <li><strong>Den Weg auf einen Scan verkürzen.</strong> QR-Code direkt zur Bewertungsseite — auf Rechnung, Tischaufsteller, Visitenkarte. Jeder zusätzliche Schritt („geh auf Google, such uns, klick auf Rezensionen…") halbiert die Quote.</li>
          <li><strong>Jedem Mitarbeiter seinen eigenen Code geben.</strong> Genau das ist unser <a href="/bewertungsmanagement/">TapTag</a>: ein Schlüsselanhänger mit individuellem QR-Code pro Mitarbeiter. Der Kunde scannt beim Mitarbeiter, der ihn gerade begeistert hat — persönlicher Moment, höchste Quote.</li>
          <li><strong>Das Team motivieren — nicht die Kunden.</strong> Anreize für Kunden sind verboten (dazu unten), Anreize fürs eigene Team nicht: Im Echtzeit-Dashboard sieht jeder Mitarbeiter seine gesammelten Bewertungen, und Lokalbesucher verlost monatlich Sachpreise unter allen TapTag-Trägern — iPad, 4K-TV, SmartWatch, Sony-Kopfhörer, bezahlt und versteuert von uns. So wird Bewertungen-Sammeln zum Sport.</li>
          <li><strong>Auf jede Bewertung antworten.</strong> Wer sieht, dass der Inhaber antwortet, bewertet eher — und Google wertet aktive Profile höher. Bei uns wird jede Bewertung in unter 60 Minuten individuell beantwortet.</li>
          <li><strong>Nachfassen mit Einwilligung.</strong> Eine kurze Nachricht am Abend („Danke für deinen Besuch — hier kannst du uns bewerten: [Link]") funktioniert, braucht aber die Einwilligung des Kunden (DSGVO/UWG). Einmal sauber aufgesetzt, läuft es nebenbei.</li>
          <li><strong>Den Anlass liefern.</strong> Menschen bewerten Erlebnisse, nicht Durchschnitt. Die Bewertung beginnt beim Service — kein System der Welt macht aus unzufriedenen Kunden gute Rezensionen.</li>
        </ol>

        <h2 id="verboten">Was verboten ist — und was es dich kosten kann</h2>
        <ul>
          <li><strong>Bewertungen kaufen:</strong> Verstößt gegen Googles Richtlinien und gegen das Gesetz gegen den unlauteren Wettbewerb (UWG). Folgen: Abmahnungen durch Wettbewerber, Löschwellen durch Google — und im schlimmsten Fall die Sperrung des Profils samt aller echten Bewertungen.</li>
          <li><strong>Kunden fürs Bewerten belohnen</strong> (Rabatt, Gratis-Dessert gegen 5 Sterne): gilt als gekaufte Bewertung, gleiche Konsequenzen.</li>
          <li><strong>Selbst bewerten oder Familie rekrutieren:</strong> Google erkennt Muster (Gerät, Konto, Standort) erstaunlich gut. Auffällige Profile verlieren Bewertungen ohne Vorwarnung.</li>
          <li><strong>Review-Gating:</strong> Vorab filtern und nur zufriedene Kunden zur Google-Bewertung leiten, Unzufriedene in ein internes Formular — verstößt ebenfalls gegen die Google-Richtlinien.</li>
        </ul>

        <h2 id="proof">Was mit System realistisch ist</h2>
        <div class="statbox">
          <div><span class="n">800+</span><p>echte Bewertungen in 9 Monaten — BattleKart Bochum mit TapTag, seither Nr. 1 der Region</p></div>
          <div><span class="n">&lt;60 Min.</span><p>bis zur individuellen Antwort auf jede neue Bewertung — positiv wie negativ</p></div>
          <div><span class="n">+158 %</span><p>Profilaufrufe beim Ristorante Peperoncino nach Umstellung auf systematisches Bewertungsmanagement</p></div>
        </div>
        <p>Der Unterschied zwischen „wir fragen halt manchmal" und einem System ist kein Fleiß, sondern Infrastruktur: eigener Code pro Mitarbeiter, Dashboard, Motivation, Antworten. Genau das ist der Kern unseres <a href="/bewertungsmanagement/">Bewertungsmanagements</a>.</p>`,
  faqTitle: 'Häufige Fragen zu Google-Bewertungen',
  faqs: [
    { id: 'faq-kunden-belohnen', q: 'Darf ich Kunden für eine Google-Bewertung belohnen?', a: 'Nein. Rabatte, Gutscheine oder Geschenke gegen Bewertungen gelten als gekaufte Bewertungen — das verstößt gegen die Google-Richtlinien und gegen das UWG. Erlaubt ist, das eigene Team zu motivieren: interne Anreize für Mitarbeiter, die Kunden um ehrliche Bewertungen bitten, sind zulässig.' },
    { id: 'faq-kaufen-strafbar', q: 'Sind gekaufte Google-Bewertungen strafbar?', a: 'Sie sind wettbewerbswidrig (UWG) und damit abmahnfähig — Wettbewerber und Verbraucherschützer mahnen regelmäßig ab, Gerichte verurteilen zu Unterlassung und Kostenübernahme. Zusätzlich löscht Google gekaufte Bewertungen in Wellen und kann das gesamte Profil sperren.' },
    { id: 'faq-wie-viele', q: 'Wie viele Google-Bewertungen brauche ich?', a: 'Mehr und frischere als der Wettbewerber, der aktuell über dir steht — eine absolute Zahl gibt es nicht. Faustregel: Schau dir die Top 3 deiner Kategorie in deiner Stadt an. Deren Bewertungszahl und -frequenz ist deine Messlatte.' },
    { id: 'faq-negative-bewertung', q: 'Was mache ich mit einer negativen Bewertung?', a: 'Innerhalb von 24 Stunden sachlich und lösungsorientiert antworten — die Antwort lesen hunderte künftige Kunden, nicht nur der Verfasser. Verstößt die Bewertung gegen Richtlinien (Fake, Beleidigung, kein Kundenkontakt), kannst du sie melden. Details im Artikel „Google-Bewertung löschen lassen".' },
    { id: 'faq-was-ist-taptag', q: 'Was ist der TapTag?', a: 'Ein Schlüsselanhänger mit individuellem QR-Code pro Mitarbeiter: Der Kunde scannt und landet direkt auf der Google-Bewertungsseite. Im Echtzeit-Dashboard ist sichtbar, welcher Mitarbeiter wie viele Bewertungen generiert — und Lokalbesucher verlost monatlich Sachpreise unter allen Trägern. Weltweit einzigartig, im Ultimate Paket enthalten.' }
  ],
  related: [
    { href: '/ratgeber/google-bewertung-loeschen-lassen/', label: 'Google-Bewertung löschen lassen' },
    { href: '/ratgeber/google-maps-top-3-ranking/', label: 'Top 3 bei Google Maps' }
  ],
  ctaLabel: 'Bewertungen mit System?',
  ctaTitle: 'Wir bauen dir die Bewertungs-Maschine', ctaDesc: 'TapTag für jeden Mitarbeiter, Antworten in unter 60 Minuten, monatliche Team-Verlosung — alles im Ultimate Paket.',
  ctaBtn: 'Kostenlos beraten lassen', ctaGhost: 'Zum Bewertungsmanagement →', ctaGhostHref: '/bewertungsmanagement/'
},

/* ── 4. BEWERTUNG LÖSCHEN ──────────────────────── */
{
  slug: 'google-bewertung-loeschen-lassen', date: D, dateNice: DN,
  tag: 'Reputation', crumb: 'Google-Bewertung löschen lassen',
  title: 'Google-Bewertung löschen lassen: Das geht wirklich | Lokalbesucher',
  metaDesc: 'Google löscht nur Bewertungen, die gegen Richtlinien verstoßen: Fakes, Beleidigungen, falsche Tatsachen. So meldest du richtig — und das ist die ehrliche Erfolgsquote.',
  h1: 'Google-Bewertung löschen lassen:<br>Was wirklich geht — und was nicht',
  heroSub: 'Keine Löschversprechen, sondern die ehrliche Rechtslage: welche Bewertungen Google entfernt, wie du richtig meldest und wann sich der Rechtsweg lohnt.',
  heroCta: 'Bewertung kostenlos einschätzen lassen',
  waText: 'Hallo%20Tobias%2C%20wir%20haben%20eine%20unfaire%20Google-Bewertung%20—%20was%20kann%20man%20da%20machen%3F',
  capsule: 'Google löscht Bewertungen nur bei <strong>Richtlinienverstößen</strong>: gefälschte Bewertungen, Beleidigungen, falsche Tatsachenbehauptungen, Bewertungen ohne echten Kundenkontakt, Spam und Konkurrenz-Sabotage. Eine schlechte, aber ehrliche Meinung ist von der Meinungsfreiheit gedeckt und bleibt stehen. Melden ist kostenlos, dauert Tage bis Wochen — eine Garantie gibt es nie, die Entscheidung liegt allein bei Google.',
  body: `        <h2 id="was-geht">Diese Bewertungen kann Google löschen</h2>
        <ul>
          <li><strong>Fake-Bewertungen</strong> — der Verfasser war nie Kunde. Der häufigste und am besten belegbare Fall.</li>
          <li><strong>Falsche Tatsachenbehauptungen</strong> — „Die haben mir 500&nbsp;€ zu viel berechnet", wenn das nachweislich nicht stimmt. (Achtung: „Ich fand es zu teuer" ist dagegen Meinung — und bleibt.)</li>
          <li><strong>Beleidigungen, Hassrede, Diffamierung</strong> — persönliche Angriffe statt Kritik an der Leistung.</li>
          <li><strong>Interessenkonflikte</strong> — Bewertungen von Wettbewerbern, Ex-Mitarbeitern im Rachemodus oder aus dem eigenen Haus.</li>
          <li><strong>Spam und Offtopic</strong> — Werbelinks, kopierte Texte, Inhalte ohne Bezug zum Unternehmen.</li>
          <li><strong>Verstöße gegen Persönlichkeitsrechte</strong> — z.&nbsp;B. volle Namen von Mitarbeitern mit Anschuldigungen, Fotos ohne Einwilligung.</li>
        </ul>
        <p><strong>Nicht löschbar:</strong> die 1-Sterne-Bewertung eines echten Kunden, der schlicht unzufrieden war. Auch nicht mit Anwalt, auch nicht mit „Löschagentur". Wer dir die Löschung <em>garantiert</em>, ist unseriös — die Entscheidung trifft immer Google (oder ein Gericht).</p>

        <h2 id="so-meldest-du">So meldest du eine Bewertung — Schritt für Schritt</h2>
        <ol>
          <li><strong>Direkt melden:</strong> In deinem Google-Unternehmensprofil die Bewertung öffnen → Dreipunkt-Menü → „Rezension melden" → passenden Verstoß auswählen. Kostenlos, Bearbeitung meist wenige Tage bis Wochen.</li>
          <li><strong>Status verfolgen und eskalieren:</strong> Über Googles „Bewertungen verwalten"-Tool (Reviews Management) kannst du den Stand einsehen und nach einer Ablehnung <strong>einmal Einspruch</strong> einlegen — dann prüft ein Mensch.</li>
          <li><strong>Begründung liefern:</strong> Je konkreter der Verstoß benannt ist (kein Kundenkontakt nachweisbar, falsche Tatsache X, Beleidigung Y), desto höher die Chance. Pauschal „gefällt mir nicht" wird abgelehnt.</li>
          <li><strong>Rechtsweg bei falschen Tatsachen:</strong> Bei geschäftsschädigenden Tatsachenbehauptungen kann ein Anwalt Google zur Prüfung auffordern — nach deutscher Rechtsprechung muss Google beim Verdacht auf fehlenden Kundenkontakt den Verfasser zur Stellungnahme auffordern. Meldet der sich nicht, wird gelöscht. Kosten: meist ab einigen hundert Euro.</li>
        </ol>

        <h2 id="strategie">Die ehrliche Wahrheit: Löschen ist Plan B</h2>
        <p>Selbst im besten Fall entfernst du einzelne Ausreißer. Deinen Schnitt und dein Ranking rettet das nicht — das schaffen nur <strong>viele echte, frische Bewertungen</strong>, die einzelne schlechte statistisch bedeutungslos machen. Ein Betrieb mit 500 Bewertungen übersteht jede 1-Sterne-Wertung; einer mit 15 nicht. Wie du dahin kommst: <a href="/ratgeber/mehr-google-bewertungen-bekommen/">Mehr Google-Bewertungen bekommen</a>.</p>
        <p>Und: <strong>Antworte immer</strong> — auch auf die Bewertung, die du gemeldet hast. Eine souveräne, sachliche Antwort neutralisiert den Schaden bei allen, die mitlesen. Genau deshalb kombiniert unser <a href="/bewertungsmanagement/">Reputationsmanagement</a> beides: Antwort auf jede Bewertung in unter 60 Minuten plus <strong>1 fachgerechten Löschantrag pro Woche</strong> für richtlinienwidrige Bewertungen — sauber nach Google-Richtlinien begründet. Die Erfolgsquote ist hoch, wenn der Verstoß klar ist; eine Garantie wäre gelogen.</p>`,
  faqTitle: 'Häufige Fragen zum Löschen von Bewertungen',
  faqs: [
    { id: 'faq-jede-loeschen', q: 'Kann man jede schlechte Google-Bewertung löschen lassen?', a: 'Nein. Google löscht nur Bewertungen, die gegen die Richtlinien verstoßen — Fakes, Beleidigungen, falsche Tatsachenbehauptungen, fehlender Kundenkontakt. Eine ehrliche schlechte Meinung ist von der Meinungsfreiheit gedeckt und bleibt stehen. Anbieter, die die Löschung jeder Bewertung garantieren, sind unseriös.' },
    { id: 'faq-dauer-loeschung', q: 'Wie lange dauert es, bis Google eine gemeldete Bewertung löscht?', a: 'Die Prüfung dauert meist einige Tage bis mehrere Wochen. Nach einer Ablehnung kannst du über Googles Bewertungs-Management-Tool einmal Einspruch einlegen. Der anwaltliche Weg bei falschen Tatsachenbehauptungen dauert typischerweise mehrere Wochen.' },
    { id: 'faq-kosten-loeschung', q: 'Was kostet es, eine Google-Bewertung löschen zu lassen?', a: 'Selbst melden ist kostenlos. Ein Anwalt kostet bei einfachen Fällen meist einige hundert Euro. Bei Lokalbesucher ist 1 fachgerecht begründeter Löschantrag pro Woche im Ultimate Paket (279 € pro Monat zzgl. MwSt.) enthalten — als Teil des gesamten Reputationsmanagements, nicht als Einzelleistung.' },
    { id: 'faq-ein-stern-ohne-text', q: 'Kann ich eine 1-Sterne-Bewertung ohne Text löschen lassen?', a: 'Nur, wenn der Verfasser nachweislich nie Kunde war — dann greift der fehlende Kundenkontakt als Löschgrund, und Google muss den Verfasser nach deutscher Rechtsprechung zur Stellungnahme auffordern. Von einem echten Kunden ist auch eine Sterne-Wertung ohne Begründung zulässig.' },
    { id: 'faq-antworten-trotzdem', q: 'Soll ich auf eine Bewertung antworten, die ich gemeldet habe?', a: 'Ja, immer. Die Prüfung dauert Wochen, und in dieser Zeit lesen potenzielle Kunden die Bewertung — ohne deine Sicht. Eine sachliche, souveräne Antwort begrenzt den Schaden, egal wie die Prüfung ausgeht.' }
  ],
  related: [
    { href: '/ratgeber/mehr-google-bewertungen-bekommen/', label: 'Mehr Google-Bewertungen bekommen' },
    { href: '/bewertungsmanagement/', label: 'Bewertungsmanagement von Lokalbesucher' }
  ],
  ctaLabel: 'Unfaire Bewertung erwischt?',
  ctaTitle: 'Schick sie uns — wir schätzen die Löschchance ehrlich ein', ctaDesc: 'Screenshot per WhatsApp genügt. Wir sagen dir kostenlos, ob ein Richtlinienverstoß vorliegt und welcher Weg sich lohnt.',
  ctaBtn: 'Bewertung einschätzen lassen', ctaGhost: 'Zum Reputationsmanagement →', ctaGhostHref: '/bewertungsmanagement/'
},

/* ── 5. KI-SICHTBARKEIT ────────────────────────── */
{
  slug: 'ki-sichtbarkeit-lokale-unternehmen', date: D, dateNice: DN,
  tag: 'KI-Sichtbarkeit', crumb: 'KI-Sichtbarkeit für lokale Unternehmen',
  title: 'KI-Sichtbarkeit: So empfehlen ChatGPT & Co. dein Unternehmen | Lokalbesucher',
  metaDesc: 'ChatGPT, Gemini und Claude empfehlen lokale Unternehmen anhand von Google-Profil, Bewertungen und Verzeichnissen. Die 5 Hebel für KI-Sichtbarkeit — mit kostenlosem Live-Check.',
  h1: 'KI-Sichtbarkeit: So empfehlen<br>ChatGPT &amp; Co. dein Unternehmen',
  heroSub: 'Immer mehr Kunden fragen die KI statt Google. Hier steht, woraus KI-Empfehlungen entstehen — und wie du systematisch hineinkommst.',
  heroCta: 'Jetzt kostenlos testen: Empfiehlt dich die KI?',
  waText: 'Hallo%20Tobias%2C%20wie%20wird%20mein%20Unternehmen%20f%C3%BCr%20ChatGPT%20%26%20Co.%20sichtbar%3F',
  capsule: 'KI-Assistenten empfehlen lokale Unternehmen auf Basis öffentlicher Quellen: <strong>Google-Business-Profil, echte Bewertungen, Branchenverzeichnisse, die eigene Website</strong> und aktuelle Inhalte im Netz. ChatGPT stützt sich zusätzlich stark auf den Bing-Index. Wer diese Quellen systematisch pflegt, wird zitiert und empfohlen — messbar mit unserem kostenlosen KI-Sichtbarkeits-Check in 30 Sekunden.',
  body: `        <h2 id="warum-jetzt">Warum das jetzt zählt — drei Zahlen</h2>
        <div class="statbox">
          <div><span class="n">45&nbsp;%</span><p>der Verbraucher nutzen bereits KI-Tools für lokale Empfehlungen — im Vorjahr waren es 6&nbsp;% (Searchable, 2026)</p></div>
          <div><span class="n">~28&nbsp;%</span><p>der Google-Suchen in Deutschland zeigen KI-Übersichten statt klassischer Ergebnisliste</p></div>
          <div><span class="n">≈&nbsp;50&nbsp;%</span><p>weniger Klicks auf normale Ergebnisse, wenn eine KI-Zusammenfassung erscheint (Pew Research, 2025)</p></div>
        </div>
        <p>Die Konsequenz ist unbequem: Selbst wer klassisch gut rankt, verliert Klicks an KI-Antworten. Gewinnen kann nur, wer <strong>in</strong> den KI-Antworten auftaucht — als Empfehlung oder als zitierte Quelle. Zitierte Unternehmen erzielen laut Seer Interactive rund 35&nbsp;% mehr Klicks.</p>

        <h2 id="quellen">Woher die KIs ihre Empfehlungen nehmen</h2>
        <p>KI-Assistenten erfinden keine Empfehlungen — sie verdichten, was sie im Netz über dich finden:</p>
        <ul>
          <li><strong>Google-Business-Profil:</strong> die wichtigste Einzelquelle für „Wer ist gut in [Stadt]?" — Kategorien, Leistungen, Öffnungszeiten, Fotos.</li>
          <li><strong>Bewertungen:</strong> Menge, Schnitt, Frische und deine Antworten fließen direkt in die Ruf-Einschätzung ein.</li>
          <li><strong>Branchenverzeichnisse:</strong> konsistente Einträge auf 50+ Portalen bestätigen der KI, dass es dich wirklich gibt — Widersprüche machen sie misstrauisch.</li>
          <li><strong>Deine Website:</strong> klare Antworten, Fakten, strukturierte Daten (Schema.org) — maschinenlesbar aufbereitet mit unserem kostenlosen <a href="/schema-org-generator/">Schema-Generator</a>.</li>
          <li><strong>Der Bing-Index:</strong> ChatGPT sucht über Bing. Ein gepflegtes Bing-Places-Profil und eine bei Bing indexierte Website sind darum Pflicht — die meisten Betriebe ignorieren Bing komplett und sind für ChatGPT halb blind.</li>
        </ul>
        <p>Dazu kommt Frische: KIs bevorzugen nachweislich aktuelle Quellen — rund die Hälfte der von KI zitierten Inhalte ist jünger als drei Monate. Ein Profil, auf dem seit 2024 nichts passiert ist, existiert für die KI praktisch nicht.</p>

        <h2 id="hebel">Die 5 Hebel für deine KI-Sichtbarkeit</h2>
        <ol>
          <li><strong><a href="/google-business-agentur/">Google-Business-Profil</a> vollständig pflegen</strong> — Kategorien, Leistungen, Fotos, wöchentliche Posts.</li>
          <li><strong><a href="/ratgeber/mehr-google-bewertungen-bekommen/">Echte Bewertungen</a> aufbauen und beantworten</strong> — BattleKart Bochum: 800+ in 9 Monaten mit TapTag.</li>
          <li><strong>Verzeichnisse konsistent halten</strong> — Name, Adresse, Telefonnummer identisch auf 50+ Portalen, inklusive Bing Places.</li>
          <li><strong>Frische Inhalte liefern</strong> — regelmäßige Posts und aktuelle Website-Inhalte halten dich zitierfähig.</li>
          <li><strong>Strukturierte Daten einbauen</strong> — Schema.org-Markup macht deine Fakten maschinenlesbar.</li>
        </ol>
        <p>Falls dir das bekannt vorkommt: Es sind größtenteils dieselben Hebel wie fürs <a href="/ratgeber/google-maps-top-3-ranking/">Maps-Ranking</a>. Das ist die gute Nachricht — wer lokale Sichtbarkeit sauber aufbaut, gewinnt beide Kanäle gleichzeitig. Genau deshalb ist KI-Sichtbarkeit bei uns kein Zusatzprodukt, sondern Ergebnis des normalen Handwerks.</p>

        <h2 id="messen">So misst du deine KI-Sichtbarkeit — kostenlos</h2>
        <ol>
          <li><strong>Der direkte Test:</strong> Unser <a href="/ki-sichtbarkeits-check/">KI-Sichtbarkeits-Check</a> fragt ChatGPT, Claude und Gemini live nach deinem Unternehmen — Empfehlung, Bekanntheit, Ruf — und zeigt dir in 30 Sekunden einen Score von 0–100 plus die Quellen, die stattdessen genannt werden.</li>
          <li><strong>Search Console beobachten:</strong> Tauchen ganze KI-Prompts als „Suchanfragen" auf, recherchieren KIs über Google — und sehen dabei deine Seite. Ein wachsendes Signal.</li>
          <li><strong>GA4-Referrals prüfen:</strong> Besucher von chatgpt.com, perplexity.ai oder gemini.google.com sind direkte KI-Empfehlungen.</li>
          <li><strong>Bing Webmaster Tools:</strong> Der „AI Performance"-Bericht zeigt, wie oft Copilot dich zitiert.</li>
        </ol>`,
  faqTitle: 'Häufige Fragen zur KI-Sichtbarkeit',
  faqs: [
    { id: 'faq-empfiehlt-mich-chatgpt', q: 'Woher weiß ich, ob ChatGPT mein Unternehmen empfiehlt?', a: 'Am schnellsten mit dem kostenlosen KI-Sichtbarkeits-Check von Lokalbesucher: Er stellt ChatGPT, Claude und Gemini live drei Fragen zu deinem Unternehmen (Empfehlung in deiner Stadt, Bekanntheit, Ruf) und liefert in 30 Sekunden einen Score von 0–100 — inklusive der Wettbewerber, die stattdessen genannt werden.' },
    { id: 'faq-bing-rolle', q: 'Welche Rolle spielt Bing für die KI-Sichtbarkeit?', a: 'Eine große, unterschätzte: ChatGPT nutzt für Websuchen den Bing-Index. Ein gepflegtes Bing-Places-Profil und eine bei Bing indexierte Website (Bing Webmaster Tools, Sitemap einreichen) sind darum Grundvoraussetzung, um von ChatGPT gefunden zu werden — die meisten lokalen Betriebe ignorieren Bing komplett.' },
    { id: 'faq-ai-overviews', q: 'Wie komme ich in die KI-Übersichten von Google?', a: 'KI-Übersichten zitieren bevorzugt Seiten, die Fragen direkt und faktendicht beantworten: klare Antwort-Absätze, Fragen als Überschriften, strukturierte Daten, aktuelle Inhalte und ein starkes Google-Business-Profil. Es gibt keine Anmeldung und keine Abkürzung — es ist Qualitätsarbeit an denselben Quellen.' },
    { id: 'faq-dauer-ki', q: 'Wie schnell wirkt sich Optimierung auf KI-Antworten aus?', a: 'Nach Verbesserungen an Profil, Bewertungen oder Website dauert es einige Wochen, bis KI-Systeme die neuen Daten übernehmen. KI-Antworten ändern sich mit ihren Quellen — deshalb lohnt ein monatlicher Kontroll-Check.' },
    { id: 'faq-kostet-ki-sichtbarkeit', q: 'Was kostet KI-Sichtbarkeit?', a: 'Der Check ist kostenlos. Die Hebel dahinter — Google-Business-Profil, Bewertungsmanagement, Verzeichnisse, frische Inhalte — sind exakt der Leistungsumfang des Ultimate Pakets von Lokalbesucher (279 € pro Monat zzgl. 19 % MwSt.). KI-Sichtbarkeit entsteht dabei als Ergebnis, nicht als Aufpreis.' }
  ],
  related: [
    { href: '/ki-sichtbarkeits-check/', label: 'KI-Sichtbarkeits-Check (Tool)' },
    { href: '/ratgeber/google-update-traffic-eingebrochen/', label: 'Traffic-Einbruch nach Google-Update' }
  ],
  ctaLabel: 'Der 30-Sekunden-Test',
  ctaTitle: 'Empfiehlt die KI dich — oder deine Konkurrenz?', ctaDesc: 'Drei Live-Fragen an ChatGPT, Claude und Gemini. Kostenlos, ohne Anmeldung, Ergebnis sofort.',
  ctaBtn: 'Beratung via WhatsApp', ctaGhost: 'KI-Check starten →', ctaGhostHref: '/ki-sichtbarkeits-check/'
}
];

for (const a of ARTICLES) {
  const dir = path.join(ROOT, 'ratgeber', a.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(a), 'utf8');
  console.log('OK', a.slug);
}
