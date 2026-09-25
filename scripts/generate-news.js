/* News-Generator: rendert /news/ (Übersicht), /news/<plattform|thema>/ (Kategorie-Seiten,
   nur wenn Meldungen vorhanden), /news/<slug>/ (Meldungen), RSS-Feeds (/news/feed.xml,
   /news/<kategorie>/feed.xml) und den News-Block in sitemap.xml.
   Aufruf: node scripts/generate-news.js
   Danach `node scripts/generate-gup-hub.js`, damit die Änderungs-Tabelle der Leitseite
   die neuen Zeilen (hub: true) bekommt.
   Rahmen (Nav/Footer/Schema/Autorenbox) kommt aus generate-ratgeber.js (page()),
   Inhalte aus scripts/news/items.js. Generierte Dateien nie direkt editieren. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { page } from './generate-ratgeber.js';
import { NEWS, PLATFORMS, TOPICS } from './news/items.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://lokalbesucher.de';
const OG_IMG = SITE + '/assets/images/og-lokalbesucher.png';
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

const nice = d => { const [y, m, dd] = d.split('-'); return `${+dd}. ${MONTHS[+m - 1]} ${y}`; };
const monthYear = d => { const [y, m] = d.split('-'); return `${MONTHS[+m - 1]} ${y}`; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = h => h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const wordCount = h => strip(h).split(' ').filter(Boolean).length;

/* ── Validierung: lieber hier scheitern als kaputt live gehen ─────────── */
const ITEMS = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
const catKeys = [...Object.keys(PLATFORMS), ...Object.keys(TOPICS)];
if (new Set(catKeys).size !== catKeys.length) throw new Error('Plattform- und Themen-Slugs müssen eindeutig sein');
const seen = new Set();
for (const n of ITEMS) {
  if (!/^\d{4}-\d{2}-[a-z0-9-]+$/.test(n.slug)) throw new Error('Slug muss mit JJJJ-MM- beginnen: ' + n.slug);
  if (seen.has(n.slug)) throw new Error('Doppelter Slug: ' + n.slug);
  seen.add(n.slug);
  if (!PLATFORMS[n.platform]) throw new Error(n.slug + ': unbekannte Plattform ' + n.platform);
  if (!TOPICS[n.topic]) throw new Error(n.slug + ': unbekanntes Thema ' + n.topic);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date)) throw new Error(n.slug + ': Datum muss ISO sein');
  const w = wordCount(n.summary);
  if (w < 40 || w > 75) console.warn('WARN', n.slug, 'summary hat', w, 'Wörter (Ziel 50–60)');
  if (n.metaDesc.length > 165) console.warn('WARN', n.slug, 'metaDesc', n.metaDesc.length, 'Zeichen');
  if (/\bNFC\b|keine Mindestlaufzeit/i.test(n.body + n.summary)) throw new Error(n.slug + ': verbotene Formulierung');
}

const itemUrl = n => `/news/${n.slug}/`;
const catUrl = k => `/news/${k}/`;
const catName = k => (PLATFORMS[k] || TOPICS[k]).name;
const has = k => ITEMS.some(n => n.platform === k || n.topic === k);
const inCat = k => ITEMS.filter(n => n.platform === k || n.topic === k);
const latest = ITEMS[0].date;

/* ── Gemeinsames CSS für News-Seiten (inline, kein global.css-Bump nötig) ── */
const CSS = `
    .chips{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-top:.75rem}
    .chips-label{font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b7099;margin-right:.25rem;min-width:5.5rem}
    .chip{display:inline-flex;align-items:center;padding:.42rem .9rem;border:1px solid #1e2240;border-radius:999px;font-size:.85rem;color:#b9bedd;background:#111328;transition:border-color .2s,color .2s}
    .chip:hover{border-color:#ffbd59;color:#e8eaf6}
    .chip.is-active{background:#ffbd59;color:#0c0e1a;border-color:#ffbd59;font-weight:600}
    .news-list{display:flex;flex-direction:column;gap:1rem;max-width:860px}
    .news-card{display:block;background:#111328;border:1px solid #1e2240;border-radius:16px;padding:1.35rem 1.5rem;transition:border-color .25s,transform .25s}
    .news-card:hover{border-color:#ffbd59;transform:translateY(-2px)}
    .news-card h2{font-size:1.15rem;font-weight:700;margin:.5rem 0 .5rem;line-height:1.3}
    .news-card p{color:#7c83aa;font-size:.92rem}
    .news-meta{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;font-size:.78rem;color:#7c83aa}
    .news-meta time{color:#ffbd59;font-weight:600}
    .news-tag{font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:.2rem .55rem;border-radius:6px;background:#181b35;color:#b9bedd}
    .news-tag:hover{color:#ffbd59}
    .news-src{font-size:.85rem;color:#7c83aa;margin:1.25rem 0}
    .news-src a{color:#b9bedd}
    .impact{background:#111328;border:1px solid #1e2240;border-left:3px solid #3ecf8e;border-radius:12px;padding:1.1rem 1.25rem;margin:1.75rem 0}
    .impact p{margin:0}
    .news-more{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.6rem}
    .news-more li{display:flex;gap:.75rem;align-items:baseline;font-size:.95rem}
    .news-more time{color:#ffbd59;font-size:.8rem;font-weight:600;white-space:nowrap}
    .news-more a{text-decoration:none;color:#e8eaf6}
    .news-more a:hover{color:#ffbd59}
    .rss-hint{font-size:.85rem;color:#7c83aa;margin-top:1.5rem}
    .rss-hint a{color:#ffbd59;text-decoration:underline;text-underline-offset:2px}
    .article{margin-inline:0;max-width:none}
    .page-hero .container > div{max-width:none!important}
    .page-hero .container > div > p{max-width:none!important;margin-bottom:0!important}
    .page-hero{padding-bottom:1.5rem!important}
    .article > .capsule:first-child{margin-top:.25rem}
    .article figure{margin:0 0 1.75rem}
    .article figure img{width:100%;height:auto}
    @media(min-width:900px){.article figure{float:right;width:min(40%,460px);margin:0 0 1.5rem 2.5rem}.article::after{content:'';display:block;clear:both}}
    .article + div[style*="max-width:760px"]{max-width:none!important}
    .news-hero{padding-block:2.75rem 1.5rem}
    .news-section{padding-top:1.25rem}
    .news-featured{display:grid;gap:1.75rem;background:#111328;border:1px solid #1e2240;border-radius:20px;padding:1.5rem;margin-bottom:2rem;align-items:center}
    @media(min-width:900px){.news-featured{padding:2rem}.news-featured.has-img{grid-template-columns:minmax(0,11fr) minmax(0,10fr);gap:2.5rem}}
    .news-featured-img img{width:100%;height:auto;border-radius:14px;border:1px solid #1e2240;display:block}
    .news-kicker{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#ffbd59;margin-bottom:.6rem}
    .news-featured h2{font-size:clamp(1.5rem,2.6vw,2.25rem);font-weight:800;line-height:1.15;margin:.7rem 0 .9rem;letter-spacing:-.01em}
    .news-featured h2 a{color:#e8eaf6}
    .news-featured h2 a:hover{color:#ffbd59}
    .news-featured .lead{color:#b9bedd;font-size:1.02rem;line-height:1.7;margin-bottom:1rem}
    .news-featured .impact-line{color:#7c83aa;font-size:.92rem;line-height:1.6;margin-bottom:1.4rem;padding-left:.9rem;border-left:3px solid #3ecf8e}
    .news-featured .impact-line strong{color:#e8eaf6}
    .news-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1.25rem}
    .news-grid .news-card{display:flex;flex-direction:column;height:100%}
    .news-card .more{margin-top:auto;padding-top:1rem;font-size:.85rem;font-weight:600;color:#ffbd59}
    .quellen{margin:0 0 1.1rem 1.25rem;color:#b9bedd;display:flex;flex-direction:column;gap:.45rem;font-size:.92rem}
    .quellen a{color:#b9bedd}`;

const CTA_BY_TOPIC = {
  'bewertungen':            { ghost: 'Zum Bewertungsmanagement →', href: '/bewertungsmanagement/' },
  'werbeanzeigen':          { ghost: 'Zu Google Ads →', href: '/google-ads/' },
  'social-media':           { ghost: 'Zur Social Media Agentur →', href: '/social-media-agentur/' },
  'conversion-optimierung': { ghost: 'Zum ROI-Kalkulator →', href: '/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/' },
  'local-seo':              { ghost: 'KI-Check starten →', href: '/ki-sichtbarkeits-check/' },
  'unternehmensprofile':    { ghost: 'Zum kompletten Leitfaden →', href: '/google-unternehmensprofil/' }
};
const cta = n => ({
  ctaLabel: 'Kurz einordnen lassen',
  ctaTitle: 'Betrifft dich diese Änderung?',
  ctaDesc: 'Schreib Tobias, was du machst und wo. Du bekommst eine ehrliche Einschätzung, ob du handeln musst. Kostenlos, per WhatsApp, meist innerhalb einer Stunde.',
  ctaBtn: 'Einschätzung via WhatsApp',
  ctaGhost: CTA_BY_TOPIC[n.topic].ghost, ctaGhostHref: CTA_BY_TOPIC[n.topic].href
});

const rssLinks = (extraKey) =>
  `\n  <link rel="alternate" type="application/rss+xml" title="Lokalbesucher News" href="${SITE}/news/feed.xml">` +
  (extraKey ? `\n  <link rel="alternate" type="application/rss+xml" title="Lokalbesucher News: ${esc(catName(extraKey))}" href="${SITE}/news/${extraKey}/feed.xml">` : '');

/* ── Filter-Chips: nur Kategorien mit Inhalt, als echte Links (für KI + Google lesbar) ── */
function chips(active) {
  const row = (label, dict) => {
    const links = Object.keys(dict).filter(has).map(k =>
      `<a class="chip${active === k ? ' is-active' : ''}" href="${catUrl(k)}"${active === k ? ' aria-current="page"' : ''}>${esc(dict[k].name)}</a>`);
    if (!links.length) return '';
    return `<div class="chips"><span class="chips-label">${label}</span>${links.join('')}</div>`;
  };
  return `<nav aria-label="News filtern" style="margin-top:1.5rem">
          <div class="chips"><span class="chips-label">Alle</span><a class="chip${active ? '' : ' is-active'}" href="/news/"${active ? '' : ' aria-current="page"'}>Alle Meldungen</a></div>
          ${row('Plattform', PLATFORMS)}
          ${row('Thema', TOPICS)}
        </nav>`;
}

const meta = n => `<div class="news-meta"><time datetime="${n.date}">${nice(n.date)}</time><span class="news-tag">${esc(PLATFORMS[n.platform].name)}</span><span class="news-tag">${esc(TOPICS[n.topic].name)}</span></div>`;

const card = n => `        <a class="news-card" href="${itemUrl(n)}">
          ${meta(n)}
          <h2>${esc(n.title)}</h2>
          <p>${esc(n.teaser)}</p>
          <span class="more">Weiterlesen →</span>
        </a>`;

/* Aktuellste Meldung: groß, aufgeklappt (Kurzfassung sichtbar), mit Bild, volle Breite */
const featured = n => `      <article class="news-featured${n.image ? ' has-img' : ''}" aria-labelledby="featured-title">
        ${n.image ? `<a href="${itemUrl(n)}" class="news-featured-img" tabindex="-1" aria-hidden="true"><img src="${n.image}" alt="" width="1200" height="630" loading="eager" fetchpriority="high"></a>` : ''}
        <div>
          <p class="news-kicker">Aktuelle Meldung</p>
          ${meta(n)}
          <h2 id="featured-title"><a href="${itemUrl(n)}">${esc(n.title)}</a></h2>
          <p class="lead">${n.summary}</p>
          <a href="${itemUrl(n)}" class="btn btn-ghost">Ganze Meldung lesen →</a>
        </div>
      </article>`;

/* ── Übersicht + Kategorie-Seiten ─────────────────────────────────────── */
function listPage({ key, url, title, h1, intro, metaDesc, crumb, items, feed }) {
  const fullUrl = SITE + url;
  const graph = () => [
    {
      '@type': 'CollectionPage', '@id': fullUrl + '#webpage', url: fullUrl, name: title.replace(' | Lokalbesucher', ''),
      description: metaDesc, inLanguage: 'de', isPartOf: { '@id': SITE + '/#website' },
      dateModified: items[0].date,
      breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: SITE + '/' },
        ...(key ? [{ '@type': 'ListItem', position: 2, name: 'News', item: SITE + '/news/' }, { '@type': 'ListItem', position: 3, name: crumb, item: fullUrl }]
                : [{ '@type': 'ListItem', position: 2, name: 'News', item: fullUrl }])
      ] }
    },
    { '@type': 'ItemList', itemListElement: items.map((n, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + itemUrl(n), name: n.title })) }
  ];
  const main = `
  <section class="page-hero news-hero grid-bg" aria-labelledby="news-title" style="padding-bottom:1.5rem">
    <div class="container">
      <nav class="breadcrumb" aria-label="Brotkrümelnavigation">
        <a href="/">Startseite</a>
        <span class="breadcrumb-sep" aria-hidden="true">›</span>
        ${key ? `<a href="/news/">News</a>
        <span class="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">${esc(crumb)}</span>` : `<span aria-current="page">News</span>`}
      </nav>
      <div style="max-width:820px">
        <span class="section-label">News · Stand ${nice(items[0].date)}</span>
        <h1 id="news-title" style="font-size:clamp(1.875rem,5vw,3rem);font-weight:800;margin-bottom:1rem">${h1}</h1>
        <p style="font-size:1.05rem;color:#7c83aa;max-width:640px;line-height:1.75">${intro}</p>
        ${chips(key)}
      </div>
    </div>
  </section>

  <section class="section news-section" aria-label="Meldungen" style="padding-top:1rem">
    <div class="container">
${featured(items[0])}
      <div class="news-grid">
${items.slice(1).map(card).join('\n')}
      </div>
      <p class="rss-hint">Meldungen abonnieren: <a href="${feed}">RSS-Feed${key ? ' „' + esc(catName(key)) + '"' : ''}</a>${key ? ' · <a href="/news/feed.xml">alle Meldungen</a>' : ''}. Wer schreibt und wie wir arbeiten: <a href="/news/redaktion/">Redaktion</a>. Zeitlose Anleitungen findest du im <a href="/ratgeber/">Ratgeber</a>${key && PLATFORMS[key] && key === 'google' ? ' und im <a href="/google-unternehmensprofil/">Leitfaden zum Google Unternehmensprofil</a>' : ''}.</p>
    </div>
  </section>

  <section class="section" aria-labelledby="news-cta">
    <div class="container">
      <div class="cta-section">
        <span class="section-label">Nicht jede Änderung betrifft dich</span>
        <h2 class="cta-section-title" id="news-cta">Willst du wissen, was davon für dich wichtig ist?</h2>
        <p class="cta-section-desc">Schreib Tobias, was du machst und wo. Du bekommst eine ehrliche Einschätzung, welche Änderungen du umsetzen musst und welche du ignorieren kannst. Kostenlos, per WhatsApp.</p>
        <div class="cta-group">
          <a href="https://wa.me/4915122358883?text=Hallo%20Tobias%2C%20welche%20aktuellen%20%C3%84nderungen%20betreffen%20mein%20Unternehmen%3F" class="btn btn-primary btn-lg" rel="noopener noreferrer" target="_blank" aria-label="Beratung via WhatsApp anfragen">Einschätzung via WhatsApp</a>
          <a href="/ki-sichtbarkeits-check/" class="btn btn-ghost btn-lg">KI-Sichtbarkeit testen →</a>
        </div>
      </div>
    </div>
  </section>
`;
  return page({
    url: fullUrl, parent: { name: 'News', href: '/news/' }, ogType: 'website',
    title, metaDesc, h1: strip(h1), crumb, tag: '', date: items[0].date, dateNice: nice(items[0].date),
    headExtra: rssLinks(key), cssExtra: CSS, graph, main
  });
}

/* ── Einzelne Meldung ─────────────────────────────────────────────────── */
function newsPage(n) {
  const p = PLATFORMS[n.platform], t = TOPICS[n.topic];
  const others = ITEMS.filter(o => o !== n && (o.platform === n.platform || o.topic === n.topic)).slice(0, 4);
  const more = ITEMS.filter(o => o !== n && !others.includes(o)).slice(0, Math.max(0, 4 - others.length));
  const list = [...others, ...more];
  return page({
    slug: n.slug, url: SITE + itemUrl(n), parent: { name: 'News', href: '/news/' },
    type: 'NewsArticle', tag: `${p.name} · ${t.name}`, crumb: n.title,
    title: n.title + ' | Lokalbesucher', metaDesc: n.metaDesc,
    h1: esc(n.title), heroSub: esc(n.teaser),
    heroCta: '', authorBottom: true, /* Tobias: kein Button im Hero, Autorenbox ans Ende, nur ein CTA */
    waText: encodeURIComponent(`Hallo Tobias, ich habe eure Meldung „${n.title}" gelesen. Betrifft das mein Unternehmen?`),
    date: n.date + 'T08:00:00+02:00', dateNice: nice(n.date),
    articleExtra: { articleSection: t.name, isAccessibleForFree: true, dateline: 'Marl, ' + nice(n.date), publishingPrinciples: SITE + '/news/redaktion/' },
    image: n.image ? SITE + n.image : undefined,
    /* Share-Vorschau (WhatsApp, LinkedIn, Facebook) braucht JPG, WebP wird dort oft nicht gerendert.
       Das JPG liegt neben dem WebP (gleicher Name, -og.jpg); ?v= bricht alte Vorschau-Caches. */
    ogImage: n.image && fs.existsSync(path.join(ROOT, n.image.replace('-og.webp', '-og.jpg'))) ? SITE + n.image.replace('-og.webp', '-og.jpg') + '?v=' + n.date.replace(/-/g, '') : undefined,
    keywords: n.keywords, about: [{ '@type': 'Thing', name: p.name }, { '@type': 'Thing', name: t.name }],
    capsuleLabel: 'Das Wichtigste:', capsule: n.summary,
    beforeBody: `
        <p class="news-src">Plattform: <a href="${catUrl(n.platform)}" class="news-tag">${esc(p.name)}</a> &nbsp; Thema: <a href="${catUrl(n.topic)}" class="news-tag">${esc(t.name)}</a></p>
`,
    body: n.body,
    afterBody: `
        <h2 id="fazit">Fazit</h2>
        <p>${n.fazit || n.impact}</p>

        <h2 id="quellen">Quellen</h2>
        <ul class="quellen">
${n.sources.map(x => `          <li><a href="${x.url}" rel="noopener noreferrer" target="_blank">${esc(x.label)}</a></li>`).join('\n')}
        </ul>

        <h2 id="weitere-meldungen">Weitere Meldungen</h2>
        <ul class="news-more">
${list.map(o => `          <li><time datetime="${o.date}">${nice(o.date)}</time><a href="${itemUrl(o)}">${esc(o.title)}</a></li>`).join('\n')}
        </ul>
        <p class="rss-hint">Alle Meldungen zu <a href="${catUrl(n.platform)}">${esc(p.name)}</a> und <a href="${catUrl(n.topic)}">${esc(t.name)}</a> · <a href="/news/feed.xml">RSS-Feed</a></p>
`,
    faqs: n.faqs || [], faqTitle: n.faqTitle || 'Häufige Fragen',
    related: n.related || [],
    headExtra: rssLinks(n.platform) +
      `
  <meta property="article:published_time" content="${n.date}T08:00:00+02:00">` +
      `
  <meta property="article:modified_time" content="${n.date}T08:00:00+02:00">` +
      `
  <meta property="article:section" content="${esc(t.name)}">` +
      `
  <meta property="article:author" content="Tobias Frank">` +
      n.keywords.map(k => `
  <meta property="article:tag" content="${esc(k)}">`).join(''),
    cssExtra: CSS,
    ...cta(n)
  });
}

/* ── RSS ──────────────────────────────────────────────────────────────── */
function rss(items, { title, link, desc, self }) {
  const pub = d => new Date(d + 'T08:00:00+02:00').toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(title)}</title>
  <link>${link}</link>
  <description>${esc(desc)}</description>
  <language>de-de</language>
  <lastBuildDate>${pub(items[0].date)}</lastBuildDate>
  <atom:link href="${self}" rel="self" type="application/rss+xml"/>
  <image><url>${OG_IMG}</url><title>${esc(title)}</title><link>${link}</link></image>
${items.map(n => `  <item>
    <title>${esc(n.title)}</title>
    <link>${SITE + itemUrl(n)}</link>
    <guid isPermaLink="true">${SITE + itemUrl(n)}</guid>
    <pubDate>${pub(n.date)}</pubDate>
    <author>info@lokalbesucher.de (Tobias Frank)</author>
    <category>${esc(PLATFORMS[n.platform].name)}</category>
    <category>${esc(TOPICS[n.topic].name)}</category>
    <description><![CDATA[${strip(n.summary)}]]></description>
  </item>`).join('\n')}
</channel>
</rss>
`;
}

/* ── Sitemap-Block zwischen Markern ───────────────────────────────────── */
/* Aktuelles-Block fuer die Startseite: dezenter Slider mit den letzten drei
   Meldungen. Steht dort zwischen <!-- home-news:start --> und <!-- home-news:end -->
   und wird bei jedem Lauf neu geschrieben — eine neue Meldung steht damit ohne
   Handarbeit vorne. Das Blaettern macht CSS scroll-snap; die Punkte und Pfeile
   bedient ein kleines Skript in der index.html. */
function homeBlock() {
  const drei = ITEMS.slice(0, 3);

  const folien = drei.map((n, i) => `          <a class="hn-slide" href="/news/${n.slug}/" role="group" aria-roledescription="Meldung" aria-label="${i + 1} von ${drei.length}: ${esc(n.title)}">
            <img src="${n.image || '/assets/images/og-lokalbesucher.png'}" alt="" width="1200" height="630" loading="lazy" decoding="async">
            <div class="hn-body">
              <div class="hn-meta">${i === 0 ? '<span class="hn-chip">Neu</span>' : ''}<time datetime="${n.date}">${nice(n.date)}</time></div>
              <h3>${esc(n.title)}</h3>
              <p>${esc(n.teaser)}</p>
            </div>
          </a>`).join('\n');

  const punkte = drei.map((n, i) => `          <button type="button" class="hn-dot" data-hn-go="${i}" aria-current="${i === 0}" aria-label="Meldung ${i + 1}: ${esc(n.title)}"></button>`).join('\n');

  return `      <div class="hn-slider">
        <div class="hn-track" id="hn-track" tabindex="0" role="region" aria-roledescription="Slider" aria-label="Neueste Meldungen">
${folien}
        </div>
        <div class="hn-nav">
          <button type="button" class="hn-step" id="hn-prev" aria-label="Vorherige Meldung" aria-controls="hn-track" disabled><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18 9 12l6-6"/></svg></button>
${punkte}
          <button type="button" class="hn-step" id="hn-next" aria-label="Nächste Meldung" aria-controls="hn-track"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>
        <div class="hn-cta"><a href="/news/" class="btn btn-o">Alle Meldungen ansehen</a></div>
      </div>`;
}

function sitemapBlock() {
  const u = (loc, lastmod, freq, prio) => `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;
  const out = [u('/news/', latest, 'daily', '0.8'), u('/news/redaktion/', latest, 'monthly', '0.4')];
  for (const k of catKeys.filter(has)) out.push(u(catUrl(k), inCat(k)[0].date, 'weekly', '0.6'));
  for (const n of ITEMS) out.push(u(itemUrl(n), n.date, 'monthly', '0.6'));
  return out.join('\n\n');
}

/* ── Google-News-Sitemap: nur Meldungen der letzten 48 Stunden (Google-Vorgabe) ── */
function newsSitemap() {
  const cutoff = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
  /* Google ignoriert Einträge älter als 2 Tage, eine leere Sitemap meldet die Search Console aber als Fehler: dann die 3 neuesten Meldungen. */
  let fresh = ITEMS.filter(n => n.date >= cutoff);
  if (!fresh.length) fresh = ITEMS.slice(0, 3);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${fresh.map(n => `  <url>
    <loc>${SITE + itemUrl(n)}</loc>
    <news:news>
      <news:publication><news:name>Lokalbesucher</news:name><news:language>de</news:language></news:publication>
      <news:publication_date>${n.date}T08:00:00+02:00</news:publication_date>
      <news:title>${esc(n.title)}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>
`;
}

/* ── Redaktionsseite: Transparenz-Pflicht für Google News / Bing PubHub ──── */
function redaktionPage() {
  const url = SITE + '/news/redaktion/';
  const graph = () => [
    {
      '@type': 'AboutPage', '@id': url + '#webpage', url, name: 'Redaktion der Lokalbesucher News',
      description: 'Wer die Lokalbesucher News schreibt, wie wir arbeiten und wie du Fehler meldest.',
      inLanguage: 'de', isPartOf: { '@id': SITE + '/#website' }, dateModified: latest,
      about: { '@id': SITE + '/#organization' },
      breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'News', item: SITE + '/news/' },
        { '@type': 'ListItem', position: 3, name: 'Redaktion', item: url }
      ] }
    },
    {
      '@type': 'Person', '@id': SITE + '/#tobias-frank', name: 'Tobias Frank', jobTitle: 'Inhaber und Chefredakteur',
      worksFor: { '@id': SITE + '/#organization' }, email: 'info@lokalbesucher.de',
      sameAs: ['https://www.linkedin.com/in/tobiasfrank/'],
      knowsAbout: ['Google Unternehmensprofil', 'Local SEO', 'Bewertungsmanagement', 'Google Ads', 'Meta Ads', 'KI-Suche']
    }
  ];
  const main = `
  <section class="page-hero grid-bg" aria-labelledby="red-title">
    <div class="container">
      <nav class="breadcrumb" aria-label="Brotkrümelnavigation">
        <a href="/">Startseite</a>
        <span class="breadcrumb-sep" aria-hidden="true">›</span>
        <a href="/news/">News</a>
        <span class="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">Redaktion</span>
      </nav>
      <div style="max-width:820px">
        <span class="section-label">Redaktion</span>
        <h1 id="red-title" style="font-size:clamp(1.875rem,5vw,3rem);font-weight:800;margin-bottom:1rem">Wer die Lokalbesucher News schreibt<br>und wie wir arbeiten</h1>
        <p style="font-size:1.05rem;color:#7c83aa;max-width:640px;line-height:1.75">Die Lokalbesucher News melden Änderungen bei Google, Meta, Apple Maps, Bing Places und in der KI-Suche, die lokale Unternehmen in Deutschland betreffen. Diese Seite erklärt, wer schreibt, woher die Fakten kommen und wie du Fehler meldest.</p>
      </div>
    </div>
  </section>

  <section class="section" aria-label="Redaktion">
    <div class="container">
      <article class="article">
        <h2 id="wer">Wer schreibt?</h2>
        <div style="display:flex;align-items:center;gap:1.25rem;background:#111328;border:1px solid #1e2240;border-radius:16px;padding:1rem 1.25rem;margin:1rem 0 1.5rem">
          <img src="/assets/images/tobias-frank-inhaber-lokalbesucher-gmbh.webp" alt="Tobias Frank, Inhaber Lokalbesucher GmbH" width="80" height="104" loading="lazy" style="width:80px;height:auto;border-radius:10px;flex-shrink:0;object-fit:cover;object-position:top">
          <div>
            <p style="font-family:var(--font-head,Arial,Helvetica,sans-serif);font-weight:700;color:#e8eaf6;margin:0 0 .2rem">Tobias Frank</p>
            <p style="font-size:.9rem;margin:0">Inhaber der Lokalbesucher GmbH und verantwortlich für alle Meldungen. 20 Jahre in Vertrieb und Marketing, davor bei Salesforce, Amazon und StepStone. Betreut mit seinem Team seit 2021 über 100 lokale Unternehmen bei Google.</p>
          </div>
        </div>
        <p>Verantwortlich im Sinne des Presserechts ist Tobias Frank, Lokalbesucher GmbH, Karl-Breuing-Str. 2, 45770 Marl. Die vollständigen Angaben stehen im <a href="/impressum/">Impressum</a>.</p>

        <h2 id="wie">Wie entsteht eine Meldung?</h2>
        <ul>
          <li><strong>Quelle zuerst.</strong> Jede Meldung geht auf eine nachprüfbare Quelle zurück: Google-Hilfe, offizielle Blogs, Richtlinientexte, Studien oder Fachmedien wie Search Engine Roundtable und Sterling Sky. Die Quelle ist in jeder Meldung verlinkt.</li>
          <li><strong>Eigene Prüfung.</strong> Was sich in Profilen prüfen lässt, prüfen wir in den Unternehmensprofilen unserer Kunden, bevor wir es melden.</li>
          <li><strong>Einordnung für Deutschland.</strong> Viele Änderungen starten in den USA. Wir schreiben dazu, ob und wann sie hier gelten. Was im Europäischen Wirtschaftsraum nicht verfügbar ist, nennen wir so.</li>
          <li><strong>Datum sichtbar.</strong> Jede Meldung trägt das Datum der Änderung. Wird eine Meldung nachträglich geändert, steht das am Ende der Meldung mit Datum.</li>
        </ul>

        <h2 id="was-nicht">Was wir nicht tun</h2>
        <ul>
          <li>Keine bezahlten Meldungen, keine Werbung Dritter im News-Bereich.</li>
          <li>Keine Firmen-Nachrichten über Lokalbesucher selbst. Dafür gibt es LinkedIn.</li>
          <li>Keine Meldung ohne Quelle, keine Gerüchte, keine KI-generierten Fakten. Wir nutzen KI-Werkzeuge beim Schreiben, jede Aussage prüft ein Mensch.</li>
        </ul>
        <p>Lokalbesucher verkauft Google-Business-Optimierung. Wo eine Meldung unsere eigene Leistung berührt, etwa bei Bewertungsrichtlinien, schreiben wir das dazu.</p>

        <h2 id="fehler">Fehler gefunden?</h2>
        <p>Schreib an <a href="mailto:info@lokalbesucher.de">info@lokalbesucher.de</a> oder per <a href="https://wa.me/4915122358883" rel="noopener noreferrer" target="_blank">WhatsApp</a>. Wir prüfen jede Meldung innerhalb eines Werktags und korrigieren sichtbar mit Datum.</p>

        <h2 id="abonnieren">Abonnieren</h2>
        <p>Alle Meldungen als <a href="/news/feed.xml">RSS-Feed</a>, je Plattform und Thema unter <a href="/news/">lokalbesucher.de/news</a>. Kürzere Fassungen erscheinen auf <a href="https://www.linkedin.com/in/tobiasfrank/" rel="noopener noreferrer" target="_blank">LinkedIn</a> und im Google Unternehmensprofil von Lokalbesucher.</p>
      </article>
    </div>
  </section>
`;
  return page({
    url, parent: { name: 'News', href: '/news/' }, ogType: 'website',
    title: 'Redaktion der Lokalbesucher News | Lokalbesucher',
    metaDesc: 'Wer die Lokalbesucher News schreibt, woher die Fakten kommen, was wir nicht tun und wie du Fehler meldest. Verantwortlich: Tobias Frank, Lokalbesucher GmbH, Marl.',
    h1: 'Wer die Lokalbesucher News schreibt und wie wir arbeiten', crumb: 'Redaktion', tag: '',
    date: latest, dateNice: nice(latest), headExtra: rssLinks(), cssExtra: CSS, graph, main
  });
}

/* ── Zeilen für die Änderungs-Tabelle der Leitseite ───────────────────── */
export function hubRows(after = '0000-00-00') {
  return ITEMS.filter(n => n.hub && n.date > after).sort((a, b) => a.date.localeCompare(b.date))
    .map(n => `            <tr><td>${monthYear(n.date)}</td><td><a href="${itemUrl(n)}">${esc(n.hubWhat || n.title)}</a></td><td>${esc(n.impact)}</td></tr>`);
}
export const NEWS_LATEST = latest;
export const NEWS_ITEMS = ITEMS;

/* ── Schreiben ────────────────────────────────────────────────────────── */
function write(rel, content) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  console.log('OK', rel, Math.round(content.length / 1024) + ' KB');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  /* Übersicht */
  write('news/index.html', listPage({
    key: null, url: '/news/', crumb: 'News',
    title: 'News für lokales Marketing: Google, Meta, KI-Suche | Lokalbesucher',
    metaDesc: 'Aktuelle Änderungen bei Google Unternehmensprofil, Bewertungen, Meta, Apple Maps, Bing Places und KI-Suche. Kurz, datiert, mit Quelle und dem, was du jetzt tun musst.',
    h1: 'News für lokales Marketing',
    intro: 'Was sich bei Google, Meta, Apple Maps, Bing und in der KI-Suche ändert, und was ein lokaler Betrieb daraus machen muss. Jede Meldung datiert, mit Quelle, in unter drei Minuten gelesen. Nach Plattform oder Thema filtern:',
    items: ITEMS, feed: '/news/feed.xml'
  }));
  write('news/feed.xml', rss(ITEMS, { title: 'Lokalbesucher News: Lokales Marketing', link: SITE + '/news/', desc: 'Änderungen bei Google, Meta, Apple Maps, Bing Places und KI-Suche, eingeordnet für lokale Unternehmen.', self: SITE + '/news/feed.xml' }));

  /* Kategorie-Seiten, nur mit Inhalt */
  for (const k of catKeys) {
    if (!has(k)) continue;
    const isPlatform = !!PLATFORMS[k];
    const c = PLATFORMS[k] || TOPICS[k];
    const items = inCat(k);
    write(`news/${k}/index.html`, listPage({
      key: k, url: catUrl(k), crumb: c.name,
      title: isPlatform ? `${c.name} News für lokale Unternehmen | Lokalbesucher` : `News: ${c.name} für lokale Unternehmen | Lokalbesucher`,
      metaDesc: `${c.desc} Alle Änderungen chronologisch, datiert, mit Quelle und dem, was lokale Betriebe jetzt tun müssen. Stand ${nice(items[0].date)}.`,
      h1: isPlatform ? `${esc(c.name)}-News für<br>lokale Unternehmen` : `News: ${esc(c.name)}`,
      intro: `${esc(c.desc)} ${items.length} ${items.length === 1 ? 'Meldung' : 'Meldungen'}, neueste zuerst.`,
      items, feed: `/news/${k}/feed.xml`
    }));
    write(`news/${k}/feed.xml`, rss(items, { title: `Lokalbesucher News: ${c.name}`, link: SITE + catUrl(k), desc: c.desc, self: SITE + `/news/${k}/feed.xml` }));
  }

  /* Meldungen */
  for (const n of ITEMS) write(`news/${n.slug}/index.html`, newsPage(n));

  write('news/redaktion/index.html', redaktionPage());
  write('sitemap-news.xml', newsSitemap());

  /* Sitemap */
  const smPath = path.join(ROOT, 'sitemap.xml');
  let sm = fs.readFileSync(smPath, 'utf8');
  const start = '<!-- news:start -->', end = '<!-- news:end -->';
  if (!sm.includes(start) || !sm.includes(end)) throw new Error('sitemap.xml: Marker <!-- news:start --> / <!-- news:end --> fehlen');
  const eol = sm.includes('\r\n') ? '\r\n' : '\n';
  sm = sm.slice(0, sm.indexOf(start) + start.length) + eol + sitemapBlock().replace(/\n/g, eol) + eol + '  ' + sm.slice(sm.indexOf(end));
  fs.writeFileSync(smPath, sm, 'utf8');
  console.log('OK sitemap.xml', 1 + catKeys.filter(has).length + ITEMS.length, 'News-URLs');

  /* Aktuelles-Block auf der Startseite */
  const hpPath = path.join(ROOT, 'index.html');
  let hp = fs.readFileSync(hpPath, 'utf8');
  const hs = '<!-- home-news:start -->', he = '<!-- home-news:end -->';
  if (!hp.includes(hs) || !hp.includes(he)) throw new Error('index.html: Marker <!-- home-news:start --> / <!-- home-news:end --> fehlen');
  const heol = hp.includes('\r\n') ? '\r\n' : '\n';
  hp = hp.slice(0, hp.indexOf(hs) + hs.length) + heol + homeBlock().replace(/\n/g, heol) + heol + '      ' + hp.slice(hp.indexOf(he));
  fs.writeFileSync(hpPath, hp, 'utf8');
  console.log('OK index.html  Aktuelles-Block:', ITEMS.slice(0, 3).map(n => n.slug).join(', '));
}
