/* Social-Vorschaubilder (WhatsApp, LinkedIn, Facebook) je Seite im Look des Seitenkopfs.
   Liest H1 + Rubrik aus der fertigen Seite, rendert 1200×630 mit Playwright, speichert JPG unter
   assets/images/og/<slug>.jpg und trägt og:image/twitter:image in die Seite ein.
   Aufruf:  npm run og            (alle Seiten aus SEITEN)
            npm run og -- faq     (nur Seiten, deren Pfad „faq“ enthält)
   Einmalig vorher: npx playwright install chromium. Läuft lokal, nicht in der GitHub-Action. */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { ogSlug, ogDatei, ogBild } from './og-bild.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = p => pathToFileURL(path.join(ROOT, p)).href;

/* Seite → Motiv rechts. q = Suchbegriff im Maps-Motiv. Seiten ohne Eintrag bekommen kein eigenes Bild. */
const SEITEN = {
  'index.html': { motiv: 'hero' },
  'google-business-agentur': { motiv: 'maps', q: 'Physiotherapie in der Nähe' },
  'google-business-agentur-bochum': { motiv: 'maps', q: 'Zahnarzt Bochum' },
  'google-business-agentur-recklinghausen': { motiv: 'maps', q: 'Friseur Recklinghausen' },
  'werbeagentur-recklinghausen': { motiv: 'maps', q: 'Elektriker Recklinghausen' },
  'bewertungsmanagement': { motiv: 'bewertungen' },
  'google-ads': { motiv: 'ads' },
  'meta-ads': { motiv: 'meta' },
  'seo-agentur': { motiv: 'seo' },
  'social-media-agentur': { motiv: 'social' },
  'ki-sichtbarkeits-check': { motiv: 'ki' },
  'google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher': { motiv: 'roi', kicker: 'Kostenloser ROI-Kalkulator' },
  'schema-org-generator': { motiv: 'schema' },
  'faq': { motiv: 'faq' },
  'unser-team': { motiv: 'team' },
  'jobs': { motiv: 'team', kicker: 'Jobs · Marl · Ruhrgebiet', chip: 'Wir stellen ein' },
  'partner': { motiv: 'partner' },
  'impressum': { motiv: 'pin', kicker: 'Rechtliches' },
  'datenschutz': { motiv: 'pin', kicker: 'Rechtliches' },
  'agb': { motiv: 'pin', kicker: 'Rechtliches' },
  'google-unternehmensprofil': { motiv: 'maps', q: 'Bäckerei in der Nähe' },
  'ratgeber': { motiv: 'autor' },
  'ratgeber/google-bewertung-loeschen-lassen': { motiv: 'bewertungen' },
  'ratgeber/mehr-google-bewertungen-bekommen': { motiv: 'bewertungen' },
  'ratgeber/ki-sichtbarkeit-lokale-unternehmen': { motiv: 'ki' },
  'ratgeber/google-update-traffic-eingebrochen': { motiv: 'seo' },
  'ratgeber/google-business-optimierung-kosten': { motiv: 'roi', preis: true },
  'ratgeber/google-maps-top-3-ranking': { motiv: 'maps', q: 'Steuerberater in der Nähe' },
  'ratgeber/google-my-business-vs-google-unternehmensprofil': { motiv: 'maps', q: 'Café in der Nähe' },
  'ratgeber/google-unternehmensprofil-beitraege': { motiv: 'maps', q: 'Blumenladen in der Nähe' },
  'ratgeber/google-unternehmensprofil-erstellen': { motiv: 'maps', q: 'Kosmetikstudio in der Nähe' },
  'ratgeber/google-unternehmensprofil-fotos': { motiv: 'maps', q: 'Restaurant in der Nähe' },
  'ratgeber/google-unternehmensprofil-gesperrt': { motiv: 'maps', q: 'Autowerkstatt in der Nähe' },
  'ratgeber/google-unternehmensprofil-kategorien': { motiv: 'maps', q: 'Tierarzt in der Nähe' },
  'ratgeber/google-unternehmensprofil-optimieren': { motiv: 'maps', q: 'Fahrschule in der Nähe' },
  'ratgeber/google-unternehmensprofil-verifizieren': { motiv: 'maps', q: 'Malerbetrieb in der Nähe' },
  'news': { motiv: 'news' },
  'news/redaktion': { motiv: 'autor' },
  'newsletter': { motiv: 'mail' },
};
// Case Studies: Ergebnis-Kachel der Seite; Übersicht mit der Gesamtzahl von der Startseite
SEITEN['case-studies'] = { motiv: 'case', kicker: 'Erfolgsgeschichten', zahl: '3,9 Mio.', metrik: 'Profilaufrufe für unsere Kunden' };
for (const d of fs.readdirSync(path.join(ROOT, 'case-studies')))
  if (fs.existsSync(path.join(ROOT, 'case-studies', d, 'index.html'))) SEITEN['case-studies/' + d] = { motiv: 'case' };
// News-Rubriken und ältere Meldungen ohne eigenes Bild: Zeitungsmotiv
for (const d of fs.readdirSync(path.join(ROOT, 'news'))) {
  const k = 'news/' + d;
  if (!SEITEN[k] && fs.existsSync(path.join(ROOT, k, 'index.html'))) SEITEN[k] = { motiv: 'news', nurOhneBild: true };
}

const STERNE = n => '<span class="st">' + '★'.repeat(n) + '</span>';
const FOTO = f => `<img src="${A('assets/images/' + f)}" alt="">`;
const TEAM = ['tobias-frank-inhaber-lokalbesucher-gmbh.webp', 'kim-frank-lokalbesucher-team.webp', 'mara-goronschewski-lokalbesucher-team.webp',
  'milena-booken-lokalbesucher-team-2026-09.webp', 'luca-domina-lokalbesucher-team.webp', 'lucy-kalweit-lokalbesucher-team-2026.webp',
  'berre-guemustas-lokalbesucher-team.webp', 'alireza-zarkani-lokalbesucher-team.webp', 'milana-wedau-lokalbesucher.webp'];

const MOTIVE = {
  hero: () => `<div class="hero"><img src="${A('assets/images/lokalbesucher-hero-google-business-agentur-nrw-617.webp')}" alt="">
    <div class="chip chip-a"><b>+158 %</b><small>mehr Profilaufrufe in 3 Monaten</small></div></div>`,
  maps: s => `<div class="card maps">
    <div class="sbar"><span class="g">G</span>${s.q}</div>
    <div class="karte"><i class="pin p1"></i><i class="pin p2"></i><i class="pin p3"></i><i class="me"></i></div>
    <div class="erg top"><div><b>Dein Betrieb</b><span>4,9 ${STERNE(5)} (214)</span><em>Geöffnet · Route · Anrufen</em></div><span class="platz">Platz 1</span></div>
    <div class="erg"><div><b>Mitbewerber</b><span>4,3 ${STERNE(4)} (38)</span></div></div>
    <div class="erg"><div><b>Mitbewerber</b><span>3,9 ${STERNE(4)} (12)</span></div></div></div>`,
  bewertungen: () => `<div class="card rev">
    <div class="rev-kopf"><div class="big">4,9</div><div>${STERNE(5)}<small>214 Google-Rezensionen</small></div></div>
    <div class="rv"><b>Sandra K.</b> ${STERNE(5)}<p>Super freundlich, schnelle Termine. Klare Empfehlung!</p></div>
    <div class="rv"><b>Murat Y.</b> ${STERNE(5)}<p>Top Beratung, faire Preise.</p>
      <div class="antw"><b>Antwort des Inhabers</b><p>Danke dir, Murat! Bis zum nächsten Mal.</p></div></div></div>
    <div class="chip chip-o"><b>+1</b><small>neue 5-Sterne-Bewertung</small></div>`,
  ki: () => `<div class="card chat">
    <div class="chat-kopf"><span class="ai">✦</span>KI-Assistent</div>
    <div class="msg du">Welchen Friseur in Recklinghausen kannst du empfehlen?</div>
    <div class="msg ki">Gute Adressen in Recklinghausen:<ol><li><b>Dein Betrieb</b>, 4,9 ★ bei 214 Bewertungen, schnelle Termine</li><li>Salon am Markt, 4,4 ★</li></ol>
      <div class="quellen"><span>Google Maps</span><span>Website</span><span>Gelbe Seiten</span></div></div></div>`,
  meta: () => `<div class="card ad">
    <div class="ad-kopf"><span class="av">DB</span><div><b>Dein Betrieb</b><small>Gesponsert</small></div></div>
    <div class="ad-bild"><span>Jetzt Termin<br>in deiner Nähe</span></div>
    <div class="ad-cta"><span>Termin sichern</span><b>Mehr dazu</b></div></div>
    <div class="chip chip-b"><b>Neue Anfrage</b><small>über Instagram, gerade eben</small></div>`,
  ads: () => `<div class="card gads">
    <div class="sbar"><span class="g">G</span>Klempner Notdienst</div>
    <div class="gad"><small><b>Gesponsert</b> · dein-betrieb.de</small><h4>Klempner in deiner Nähe | In 60 Min. vor Ort</h4><p>Festpreise, 24/7 erreichbar, 4,9 ★ bei Google.</p>
      <div class="sl"><span>Notdienst</span><span>Preise</span><span>Kontakt</span></div></div>
    <div class="gad dim"><small>Anzeige · andere-firma.de</small><h4>Sanitär & Heizung</h4></div></div>
    <div class="chip chip-b"><b>Neuer Anruf</b><small>über Google Ads</small></div>`,
  seo: () => `<div class="card seo">
    <div class="seo-kopf"><b>Organische Besucher</b><span class="up">▲ steigend</span></div>
    <svg viewBox="0 0 400 190" class="kurve"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffbd59" stop-opacity=".35"/><stop offset="1" stop-color="#ffbd59" stop-opacity="0"/></linearGradient></defs>
      <path d="M0 170 C40 165 70 160 100 150 S160 140 190 118 S250 96 280 70 S340 40 400 18 L400 190 L0 190Z" fill="url(#f)"/>
      <path d="M0 170 C40 165 70 160 100 150 S160 140 190 118 S250 96 280 70 S340 40 400 18" fill="none" stroke="#ffbd59" stroke-width="4"/></svg>
    <div class="serp"><small>dein-betrieb.de › leistungen</small><b>Platz 1 für deine wichtigsten Suchbegriffe</b></div></div>`,
  social: () => `<div class="phone"><div class="ig-kopf"><span class="av">DB</span><b>dein.betrieb</b></div><div class="ig">${
    fs.readdirSync(path.join(ROOT, 'assets/images/insta')).filter(f => f.endsWith('.webp')).slice(0, 9).map(f => FOTO('insta/' + f)).join('')}</div></div>
    <div class="chip chip-b"><b>9 Plattformen</b><small>ein Team, ein Ansprechpartner</small></div>`,
  roi: s => s.preis ? `<div class="card roi"><small>Google Business Optimierung</small><div class="preis"><b>279 €</b><span>pro Monat zzgl. MwSt.</span></div>
      <ul><li>Profilpflege & Beiträge</li><li>Bewertungsaufbau mit TapTag</li><li>50 Verzeichnisse</li><li>Monatliches Reporting</li></ul></div>`
    : `<div class="card roi"><small>Beispiel aus dem Rechner</small><div class="zeile"><span>Ø Bon pro Besuch</span><b>45 €</b></div>
      <div class="zeile"><span>Bewertungsschnitt</span><b>4,2 ★</b></div><div class="zeile"><span>Eine positive Bewertung</span><b class="gruen">+5.040 €</b></div>
      <div class="zeile summe"><span>Eine 1-Stern-Bewertung</span><b class="rot">−3.780 €</b></div>
      <div class="hinweis">Rechne es für deinen Betrieb aus</div></div>`,
  schema: () => `<div class="card code"><div class="dots"><i></i><i></i><i></i></div><pre><span class="k">{</span>
  <span class="s">"@type"</span>: <span class="v">"LocalBusiness"</span>,
  <span class="s">"name"</span>: <span class="v">"Dein Betrieb"</span>,
  <span class="s">"address"</span>: { … },
  <span class="s">"openingHours"</span>: <span class="v">"Mo-Fr 9-18"</span>,
  <span class="s">"aggregateRating"</span>: {
    <span class="s">"ratingValue"</span>: <span class="v">"4.9"</span>
  }
<span class="k">}</span></pre></div><div class="chip chip-b"><b>✓ Gültig</b><small>bereit zum Einfügen</small></div>`,
  faq: () => `<div class="card faq">${['Was kostet die Betreuung?', 'Wie schnell sehe ich Ergebnisse?', 'Gibt es eine Mindestlaufzeit?', 'Muss ich selbst etwas tun?']
    .map((f, i) => `<div class="fq${i === 1 ? ' auf' : ''}"><b>${f}</b><span>${i === 1 ? '−' : '+'}</span>${i === 1 ? '<p>Die ersten Effekte siehst du meist nach wenigen Wochen im Profil.</p>' : ''}</div>`).join('')}</div>`,
  team: s => `<div class="team">${TEAM.map(f => `<div class="tf">${FOTO(f)}</div>`).join('')}</div>${s.chip ? `<div class="chip chip-b"><b>${s.chip}</b><small>Marl, Ruhrgebiet</small></div>` : ''}`,
  partner: () => `<div class="card partner"><img class="gp" src="${A('assets/images/google-partner-badge.svg')}" alt="">
    <div class="pl">${['bvmw-der-mittelstand-mitglied-2x.webp', 'bni-chapter-vest-recklinghausen-2x.webp', 'leadinfo-certified-partner-2x.webp'].map(f => FOTO('partner/' + f)).join('')}</div></div>`,
  autor: () => `<div class="card autor">${FOTO('tobias-frank-inhaber-lokalbesucher-gmbh.webp')}<div><small>Geschrieben von</small><b>Tobias Frank</b>
    <span>Inhaber Lokalbesucher GmbH · 23 Jahre Sales & Marketing</span></div></div>`,
  news: s => `<div class="card zeitung"><div class="mast">Lokalbesucher <b>News</b></div><div class="nz">${s.tags || 'Google · Meta · KI-Suche'}</div>
    <div class="zz"><i></i><i></i><i class="k"></i></div><div class="zz"><i></i><i class="k"></i></div>
    <div class="autor-mini">${FOTO('tobias-frank-inhaber-lokalbesucher-gmbh.webp')}<span>Tobias Frank<small>Redaktion</small></span></div></div>`,
  mail: () => `<div class="card mail"><div class="mk"><span class="av">LB</span><div><b>Lokalbesucher News</b><small>Diese Woche: 4 Änderungen bei Google, die du kennen musst</small></div></div>
    <div class="zz"><i></i><i></i><i class="k"></i></div><div class="mail-btn">Jeden Freitag · kostenlos</div></div>`,
  pin: () => `<img class="pin-gross" src="${A('assets/images/lokalbesucher-logo-invers.webp')}" alt="">`,
  case: s => `<div class="card case"><small>Ergebnis</small><div class="big"${s.zahl.length > 6 ? ' style="font-size:80px"' : ''}>${s.zahl}</div><span>${s.metrik}</span></div>`,
};

const CSS = `
@font-face{font-family:'DM Sans';src:url(${A('assets/fonts/dm-sans-400-v2.woff2')});font-weight:400}
@font-face{font-family:'DM Sans';src:url(${A('assets/fonts/dm-sans-500-v2.woff2')});font-weight:500 800}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1200px;height:630px;overflow:hidden;background:#0c0e1a;color:#e8eaf6;font-family:'DM Sans',sans-serif;position:relative}
.bg{position:absolute;inset:0;background:
 radial-gradient(ellipse 60% 70% at 85% 30%,rgba(255,189,89,.13),transparent 65%),
 radial-gradient(ellipse 50% 60% at 0% 100%,rgba(90,110,255,.10),transparent 70%),
 linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px) 0 0/48px 48px,
 linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px) 0 0/48px 48px}
.l{position:absolute;left:64px;top:56px;bottom:52px;width:var(--lw,640px);display:flex;flex-direction:column}
.logo{display:flex;align-items:center;gap:12px;font:700 30px Arial,Helvetica,sans-serif}
.logo img{height:44px}
.mitte{margin:auto 0;padding:10px 0}
.kick{color:#ffbd59;font-weight:700;font-size:19px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:20px}
h1{font:800 var(--fs,62px)/1.12 Arial,Helvetica,sans-serif;letter-spacing:-.01em}
h1 em,h1 .hl,h1 span{font-style:normal;color:#ffbd59}h1 .light{color:#9da2cf}
h1 svg{display:none}
.fuss{display:flex;align-items:center;gap:14px;font-size:20px;color:#8a8fbf}
.fuss b{color:#ffbd59}
.r{position:absolute;right:56px;top:50%;transform:translateY(-50%);width:430px;display:flex;justify-content:center}
.card{width:420px;background:#111328;border:1px solid #262a52;border-radius:22px;padding:22px;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.st{color:#ffbd59;letter-spacing:1px}
.chip{position:absolute;background:#181b35;border:1px solid #2c3160;border-radius:14px;padding:12px 16px;box-shadow:0 14px 40px rgba(0,0,0,.5)}
.chip b{display:block;color:#ffbd59;font-size:22px}.chip small{color:#9da2cf;font-size:14px}
.chip-a{left:-30px;bottom:30px}.chip-b{left:-50px;bottom:-34px}.chip-o{right:-24px;top:-40px}.team+.chip-b{left:-40px;bottom:-30px}
.hero img{height:500px}
.sbar{display:flex;align-items:center;gap:12px;background:#1b1e3b;border-radius:30px;padding:12px 18px;font-size:19px;color:#cfd2f0}
.g{font:700 20px Arial;color:#ffbd59}
.karte{height:110px;margin:14px 0;border-radius:14px;position:relative;background:linear-gradient(135deg,#1a2a3e,#18233a);overflow:hidden}
.karte:before{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 45%,rgba(255,255,255,.07) 46%,rgba(255,255,255,.07) 49%,transparent 50%),linear-gradient(20deg,transparent 60%,rgba(255,255,255,.05) 61%,rgba(255,255,255,.05) 64%,transparent 65%)}
.pin{position:absolute;width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#6b7099}
.p1{left:30%;top:30%;background:#ffbd59;width:28px;height:28px}.p2{left:62%;top:50%}.p3{left:80%;top:22%}
.me{position:absolute;left:46%;top:62%;width:14px;height:14px;border-radius:50%;background:#4f8cff;box-shadow:0 0 0 6px rgba(79,140,255,.25)}
.erg{display:flex;justify-content:space-between;align-items:center;padding:12px 6px;border-top:1px solid #23264a}
.erg b{display:block;font-size:19px;color:#cfd2f0}.erg span{font-size:15px;color:#8a8fbf}
.erg em{display:block;font-style:normal;font-size:14px;color:#3ecf8e;margin-top:2px}
.erg.top{background:rgba(255,189,89,.08);border:1px solid rgba(255,189,89,.5);border-radius:14px;padding:12px 14px}
.erg.top b{color:#fff}
.platz{background:#ffbd59;color:#0c0e1a!important;font-weight:800;font-size:15px!important;padding:6px 12px;border-radius:20px}
.erg:not(.top){opacity:.55}
.rev-kopf{display:flex;align-items:center;gap:16px;padding-bottom:14px;border-bottom:1px solid #23264a}
.rev-kopf .big{font:800 60px Arial;color:#fff}.rev-kopf .st{font-size:28px}.rev-kopf small{display:block;color:#8a8fbf;font-size:16px}
.rv{padding:14px 0 0;font-size:17px}.rv b{color:#fff;margin-right:6px}.rv p{color:#b4b8de;margin-top:4px}
.antw{margin:10px 0 0 14px;padding:10px 14px;border-left:3px solid #ffbd59;background:#181b35;border-radius:0 10px 10px 0}
.antw b{font-size:14px;color:#ffbd59}.antw p{font-size:15px}
.chat-kopf{display:flex;align-items:center;gap:10px;font-weight:700;font-size:18px;margin-bottom:14px}
.ai{width:30px;height:30px;border-radius:50%;background:#ffbd59;color:#0c0e1a;display:grid;place-items:center}
.msg{border-radius:16px;padding:14px 16px;font-size:17px;line-height:1.45;margin-bottom:12px}
.du{background:#262a52;margin-left:50px}.ki{background:#181b35;border:1px solid #2c3160;color:#cfd2f0}
.ki ol{padding-left:22px;margin-top:6px}.ki li:first-child{color:#fff}.ki li:first-child b{color:#ffbd59}
.quellen{display:flex;gap:6px;margin-top:10px}.quellen span{font-size:12px;background:#262a52;padding:4px 10px;border-radius:20px;color:#9da2cf}
.ad-kopf{display:flex;gap:12px;align-items:center;margin-bottom:14px}.ad-kopf small{display:block;color:#8a8fbf;font-size:14px}
.av{width:42px;height:42px;border-radius:50%;background:#ffbd59;color:#0c0e1a;font-weight:800;display:grid;place-items:center;flex:none}
.ad-bild{height:230px;border-radius:14px;background:radial-gradient(circle at 70% 30%,#ffbd59,#e0703a 45%,#3a1d4f);display:flex;align-items:flex-end;padding:20px}
.ad-bild span{font:800 32px/1.1 Arial;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.4)}
.ad-cta{display:flex;justify-content:space-between;align-items:center;margin-top:14px;font-size:17px}
.ad-cta b{background:#ffbd59;color:#0c0e1a;padding:8px 16px;border-radius:10px}
.gad{margin-top:16px;padding:14px;border-radius:14px;border:1px solid rgba(255,189,89,.5);background:rgba(255,189,89,.06)}
.gad small{color:#9da2cf;font-size:14px}.gad small b{color:#fff}.gad h4{font:700 21px/1.25 Arial;color:#8ab4ff;margin:6px 0}
.gad p{font-size:16px;color:#b4b8de}.sl{display:flex;gap:8px;margin-top:10px}.sl span{font-size:14px;border:1px solid #2c3160;border-radius:20px;padding:4px 12px;color:#8ab4ff}
.gad.dim{opacity:.45;border-color:#23264a;background:none}
.seo-kopf{display:flex;justify-content:space-between;font-size:18px}.up{color:#3ecf8e;font-weight:700}
.kurve{width:100%;height:190px;margin:10px 0}
.serp{border-top:1px solid #23264a;padding-top:12px}.serp small{color:#3ecf8e;font-size:14px}.serp b{display:block;font-size:19px;color:#8ab4ff;margin-top:4px}
.phone{width:330px;border-radius:40px;border:8px solid #262a52;background:#111328;padding:16px;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.ig-kopf{display:flex;align-items:center;gap:10px;margin-bottom:12px;font-size:17px}.ig-kopf .av{width:36px;height:36px;font-size:14px}
.ig{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}.ig img{width:100%;aspect-ratio:1;object-fit:cover;display:block;border-radius:4px}
.roi small{color:#ffbd59;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:14px}
.zeile{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #23264a;font-size:19px;color:#b4b8de}.zeile b{color:#fff}
.summe b{font:800 34px Arial}.rot{color:#ff6b6b!important}.gruen{color:#3ecf8e!important}
.hinweis{margin-top:16px;text-align:center;background:#ffbd59;color:#0c0e1a;font-weight:800;border-radius:12px;padding:12px;font-size:18px}
.preis{margin:12px 0 16px;font-size:22px;color:#b4b8de}.preis b{font:800 62px Arial;color:#fff}.preis span{display:block;font-size:16px}
.roi ul{list-style:none}.roi li{padding:9px 0;border-top:1px solid #23264a;font-size:18px}.roi li:before{content:'✓ ';color:#ffbd59;font-weight:800}
.code pre{font:17px/1.6 'DM Mono',Menlo,monospace;color:#cfd2f0;margin-top:12px}.code .s{color:#8ab4ff}.code .v{color:#ffbd59}.code .k{color:#fff}
.dots{display:flex;gap:7px}.dots i{width:12px;height:12px;border-radius:50%;background:#2c3160}
.fq{padding:16px 6px;border-bottom:1px solid #23264a;display:flex;flex-wrap:wrap;justify-content:space-between;font-size:18px}
.fq span{color:#ffbd59;font-weight:800}.fq p{width:100%;color:#9da2cf;font-size:16px;margin-top:8px}.fq.auf b{color:#ffbd59}.fq:last-child{border:0}
.team{display:grid;grid-template-columns:repeat(3,120px);gap:16px}
.tf{width:120px;height:120px;border-radius:50%;overflow:hidden;border:3px solid #262a52;box-shadow:0 10px 30px rgba(0,0,0,.4)}
.tf:first-child{border-color:#ffbd59}.tf img{width:100%;height:100%;object-fit:cover}
.partner{text-align:center}.gp{width:240px}.pl{display:flex;gap:12px;justify-content:center;margin-top:20px}
.pl img{height:64px;background:#fff;border-radius:10px;padding:6px}
.autor{display:flex;gap:18px;align-items:center}.autor img{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid #ffbd59}
.autor small{color:#ffbd59;font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:13px}.autor b{display:block;font-size:26px;margin:4px 0}
.autor span{color:#9da2cf;font-size:16px}
.mast{font:800 34px Arial;border-bottom:3px double #2c3160;padding-bottom:10px}.mast b{color:#ffbd59}
.nz{color:#9da2cf;font-size:15px;margin:10px 0 14px;text-transform:uppercase;letter-spacing:.1em}
.zz{display:grid;gap:9px;margin-bottom:16px}.zz i{height:12px;border-radius:6px;background:#23264a}.zz i.k{width:60%}
.autor-mini{display:flex;align-items:center;gap:12px;font-size:17px}.autor-mini img{width:52px;height:52px;border-radius:50%;object-fit:cover}
.autor-mini small{display:block;color:#8a8fbf;font-size:14px}
.mk{display:flex;gap:14px;margin-bottom:18px}.mk small{display:block;color:#b4b8de;font-size:16px;margin-top:4px}
.mail-btn{background:#ffbd59;color:#0c0e1a;font-weight:800;text-align:center;border-radius:12px;padding:12px;font-size:18px}
.pin-gross{height:330px;opacity:.9;filter:drop-shadow(0 30px 60px rgba(255,189,89,.25))}
.case{text-align:center;padding:40px 24px}.case small{color:#ffbd59;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:16px}
.case .big{white-space:nowrap;font:800 104px/1.05 Arial;color:#ffbd59;margin:14px 0}.case span{font-size:22px;color:#cfd2f0}
`;

function html(s) {
  const mit = s.motiv && MOTIVE[s.motiv];
  return `<!doctype html><meta charset="utf-8"><style>${CSS}</style><div class="bg"></div>
<div class="l" style="--lw:${mit ? 610 : 1000}px">
  <div class="logo"><img src="${A('assets/images/lokalbesucher-logo-invers.webp')}" alt="">Lokalbesucher</div>
  <div class="mitte">${s.kicker ? `<div class="kick">${s.kicker}</div>` : ''}<h1>${s.h1}</h1></div>
  <div class="fuss"><b>lokalbesucher.de</b><span>·</span><span>Offizieller Google Partner</span></div>
</div>${mit ? `<div class="r">${MOTIVE[s.motiv](s)}</div>` : ''}`;
}

/* Seite einlesen: H1 (mit Hervorhebungen) und Rubrik wie im Seitenkopf */
async function lesen(p, rel) {
  const h = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  await p.setContent(h, { waitUntil: 'domcontentloaded' });
  return p.evaluate(() => {
    const h1 = document.querySelector('h1');
    const box = h1?.closest('section,header,div');
    const k = box?.querySelector('[class*=label],[class*=badge],[class*=kicker],[class*=eyebrow],[class*=tag]');
    const tile = document.querySelector('.cs-tile-num'), tl = document.querySelector('.cs-tile-label');
    const og = document.querySelector('meta[property="og:image"]')?.content || '';
    return { h1: h1 ? h1.innerHTML.replace(/<br\s*\/?>/g, ' ').replace(/(\S)<em>/g, '$1 <em>').replace(/\s+/g, ' ').trim() : '', kicker: k ? k.textContent.replace(/\s+/g, ' ').trim() : '',
      zahl: tile?.textContent.trim(), metrik: tl?.textContent.trim(), og };
  });
}

/* og:image + twitter:image auf das neue Bild setzen, Maße ergänzen */
function eintragen(rel, url) {
  const f = path.join(ROOT, rel);
  let h = fs.readFileSync(f, 'utf8');
  h = h.replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${url}$2`)
       .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, `$1${url}$2`)
       .replace(/\s*<meta\s+property="og:image:(type|width|height)"[^>]*>/g, '');
  h = h.replace(/(<meta\s+property="og:image"\s+content="[^"]*">)/, '$1\n  <meta property="og:image:type" content="image/jpeg">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">');
  fs.writeFileSync(f, h, 'utf8');
}

const filter = process.argv[2] || '';
fs.mkdirSync(path.join(ROOT, 'assets/images/og'), { recursive: true });
const tmp = path.join(os.tmpdir(), 'lb-og.html');
const b = await chromium.launch();
const leser = await b.newPage();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
let n = 0;
for (const [k, s0] of Object.entries(SEITEN)) {
  const rel = k.endsWith('.html') ? k : k + '/index.html';
  if (filter && !rel.includes(filter)) continue;
  const seite = await lesen(leser, rel);
  // Meldungen mit eigenem Bild (Comic) behalten ihr Bild
  if (s0.nurOhneBild && !/og-lokalbesucher\.png|\/og\//.test(seite.og)) continue;
  const s = { ...seite, ...s0, zahl: s0.zahl || seite.zahl, metrik: s0.metrik || seite.metrik, h1: s0.h1 || seite.h1, kicker: s0.kicker ?? seite.kicker.replace(/^[⚡★]\s*/, '').replace(/ · Stand .*$/, '') };
  if (s.motiv === 'news') s.tags = seite.kicker.startsWith('News · Stand') ? (rel === 'news/index.html' ? '' : s.h1.replace(/^News: |-News für.*$/g, '').replace(/<[^>]+>/g, '')) : seite.kicker.replace(/^News · /, '');
  fs.writeFileSync(tmp, html(s));
  await p.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  // Überschrift so groß wie möglich, aber höchstens 5 Zeilen Platz
  await p.evaluate(() => { const h = document.querySelector('h1'), m = document.querySelector('.mitte'), l = document.querySelector('.l');
    for (let fs = 64; fs > 34; fs -= 2) { h.style.setProperty('--fs', fs + 'px'); if (m.offsetHeight <= l.offsetHeight - 150) break; } });
  const slug = ogSlug(rel);
  await sharp(await p.screenshot({ type: 'png' })).jpeg({ quality: 86, mozjpeg: true }).toFile(ogDatei(slug));
  eintragen(rel, ogBild(rel));
  console.log('✓', slug);
  n++;
}
await b.close();
fs.rmSync(tmp, { force: true });
console.log(n + ' Vorschaubilder erzeugt → assets/images/og/');
