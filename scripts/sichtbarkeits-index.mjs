/**
 * Sichtbarkeits-Index — Daten holen und auswerten.
 *
 * Schritt 1 (fetch):  node scripts/sichtbarkeits-index.mjs fetch
 *   Lädt die Apify-Datensätze aus tmp/index-data/runs.json nach tmp/index-data/raw/<Stadt>.json.
 *   Braucht APIFY_TOKEN in .env (Repo-Root, gitignored) oder als Umgebungsvariable.
 *
 * Schritt 2 (aggregate):  node scripts/sichtbarkeits-index.mjs aggregate
 *   Dedupliziert nach placeId, ordnet Stadt + Branche zu, berechnet je Betrieb den
 *   Google-Index (0–100) und schreibt tmp/index-data/aggregate.json + Kurzbericht.
 *
 * Es werden nur Auswertungen nach Stadt/Branche veröffentlicht, nie einzelne Betriebe.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'tmp', 'index-data');
const RAW = path.join(DATA, 'raw');

/* .env laden (ohne dotenv) */
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const runs = JSON.parse(fs.readFileSync(path.join(DATA, 'runs.json'), 'utf8'));

/* Branchen-Zuordnung: Suchbegriff -> Anzeigename */
const BRANCHEN = {
  'Zahnarzt': 'Zahnärzte',
  'Friseur': 'Friseure',
  'Restaurant': 'Restaurants',
  'Physiotherapie': 'Physiotherapie',
  'Autowerkstatt': 'Kfz-Werkstätten',
  'Steuerberater': 'Steuerberater',
  'Fitnessstudio': 'Fitnessstudios',
  'Maler': 'Malerbetriebe',
  'Sanitär Heizung': 'Sanitär & Heizung',
  'Bäckerei': 'Bäckereien',
};

/* Stadt-Normalisierung: Google schreibt z. B. "Haltern" oder "Haltern am See" */
const CITY_ALIAS = { 'Haltern': 'Haltern am See', 'Castrop Rauxel': 'Castrop-Rauxel', 'Oer Erkenschwick': 'Oer-Erkenschwick' };
const CITIES = Object.keys(runs.runs);
function normCity(c) {
  if (!c) return null;
  const x = CITY_ALIAS[c] || c;
  return CITIES.includes(x) ? x : null;
}

const FIELDS = ['placeId', 'title', 'searchString', 'categoryName', 'city', 'postalCode', 'website', 'totalScore',
  'reviewsCount', 'imagesCount', 'claimThisBusiness', 'openingHours', 'permanentlyClosed', 'temporarilyClosed', 'isAdvertisement'];

/* ── fetch ─────────────────────────────────────────────────── */
async function fetchAll() {
  const token = process.env.APIFY_TOKEN;
  if (!token) { console.error('APIFY_TOKEN fehlt (in .env eintragen: APIFY_TOKEN=apify_api_...)'); process.exit(1); }
  fs.mkdirSync(RAW, { recursive: true });
  for (const [city, r] of Object.entries(runs.runs)) {
    const url = `https://api.apify.com/v2/datasets/${r.datasetId}/items?token=${token}&clean=true&format=json&fields=${FIELDS.join(',')}`;
    const res = await fetch(url);
    if (!res.ok) { console.error(`${city}: HTTP ${res.status}`); continue; }
    const items = await res.json();
    fs.writeFileSync(path.join(RAW, `${city}.json`), JSON.stringify(items));
    console.log(`${city.padEnd(18)} ${String(items.length).padStart(5)} Einträge`);
  }
}

/* ── Index je Betrieb (Google-Teil, 0–100) ─────────────────── */
function reviewPoints(n, score) {
  // logarithmisch: 0→0, 10→12, 50→25, 150→35, 300+→40
  let p = n <= 0 ? 0 : Math.min(40, Math.round(12.5 * Math.log10(n + 1) * 1.33));
  if (n >= 150) p = Math.max(p, 35);
  if (n >= 300) p = 40;
  if (n >= 5 && score && score < 4.0) p -= 5;
  return Math.max(0, p);
}
function scorePlace(p) {
  const hasWeb = !!p.website;
  const hasHours = Array.isArray(p.openingHours) && p.openingHours.length > 0;
  const photos = p.imagesCount || 0;
  const claimed = p.claimThisBusiness === false;
  const reviews = p.reviewsCount || 0;
  const profil = (claimed ? 10 : 0) + (hasHours ? 10 : 0) + (photos >= 5 ? 10 : 0) + (photos >= 20 ? 5 : 0); // max 35
  const bew = reviewPoints(reviews, p.totalScore); // max 40
  const web = hasWeb ? 25 : 0;
  return { index: profil + bew + web, hasWeb, hasHours, photos, claimed, reviews, score: p.totalScore ?? null };
}

/* ── aggregate ─────────────────────────────────────────────── */
function pct(a, b) { return b ? Math.round((a / b) * 1000) / 10 : null; }
function median(arr) { if (!arr.length) return null; const s = [...arr].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
function mean(arr) { return arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null; }

function summarize(list) {
  const n = list.length;
  const idx = list.map(x => x.m.index);
  const withReviews = list.filter(x => x.m.reviews > 0);
  return {
    betriebe: n,
    index: mean(idx),
    medianBewertungen: median(list.map(x => x.m.reviews)),
    schnittSterne: mean(withReviews.map(x => x.m.score).filter(v => v != null)),
    websiteQuote: pct(list.filter(x => x.m.hasWeb).length, n),
    oeffnungszeitenQuote: pct(list.filter(x => x.m.hasHours).length, n),
    fotos5Quote: pct(list.filter(x => x.m.photos >= 5).length, n),
    beanspruchtQuote: pct(list.filter(x => x.m.claimed).length, n),
    unter10Bewertungen: pct(list.filter(x => x.m.reviews < 10).length, n),
    ab150Bewertungen: pct(list.filter(x => x.m.reviews >= 150).length, n),
    ohneBewertung: pct(list.filter(x => x.m.reviews === 0).length, n),
  };
}

function aggregate() {
  const seen = new Map();
  let total = 0, dropped = { closed: 0, ad: 0, fremdeStadt: 0, dupl: 0 };
  for (const city of CITIES) {
    const file = path.join(RAW, `${city}.json`);
    if (!fs.existsSync(file)) { console.warn(`fehlt: ${file}`); continue; }
    for (const p of JSON.parse(fs.readFileSync(file, 'utf8'))) {
      total++;
      if (p.permanentlyClosed) { dropped.closed++; continue; }
      if (p.isAdvertisement) { dropped.ad++; continue; }
      const c = normCity(p.city);
      if (!c) { dropped.fremdeStadt++; continue; }
      if (seen.has(p.placeId)) { dropped.dupl++; continue; }
      seen.set(p.placeId, { city: c, branche: BRANCHEN[p.searchString] || p.searchString, m: scorePlace(p) });
    }
  }
  const all = [...seen.values()];
  const kreis = all.filter(x => !runs.runs[x.city].vergleich);
  const by = (key, src) => Object.fromEntries(
    [...new Set(src.map(x => x[key]))].sort().map(k => [k, summarize(src.filter(x => x[key] === k))]));

  const out = {
    stand: runs.date,
    gesamt: { roh: total, verworfen: dropped, ausgewertet: all.length, kreis: kreis.length },
    kreisRecklinghausen: summarize(kreis),
    staedte: by('city', all),
    branchenKreis: by('branche', kreis),
    branchenJeStadt: Object.fromEntries(CITIES.map(c => [c, by('branche', all.filter(x => x.city === c))])),
    // Schwellen-Analyse: Index-Gewinn durch Website / Bewertungen
    befunde: {
      mitWebsite: summarize(kreis.filter(x => x.m.hasWeb)),
      ohneWebsite: summarize(kreis.filter(x => !x.m.hasWeb)),
      ab150: summarize(kreis.filter(x => x.m.reviews >= 150)),
      unter50: summarize(kreis.filter(x => x.m.reviews < 50)),
    },
  };
  fs.writeFileSync(path.join(DATA, 'aggregate.json'), JSON.stringify(out, null, 2));

  /* Kurzbericht */
  console.log(`\nBetriebe gesamt ${total}, ausgewertet ${all.length} (Kreis RE: ${kreis.length}), verworfen:`, dropped);
  console.log('\nStädte (Index / Betriebe / Median Bew. / Website / Öffnungszeiten / <10 Bew.)');
  for (const [c, s] of Object.entries(out.staedte).sort((a, b) => b[1].index - a[1].index))
    console.log(`${c.padEnd(18)} ${String(s.index).padStart(5)} ${String(s.betriebe).padStart(5)} ${String(s.medianBewertungen).padStart(6)} ${String(s.websiteQuote).padStart(6)}% ${String(s.oeffnungszeitenQuote).padStart(6)}% ${String(s.unter10Bewertungen).padStart(6)}%`);
  console.log('\nBranchen Kreis RE (Index / Betriebe / Median Bew. / Website / <10 Bew.)');
  for (const [b, s] of Object.entries(out.branchenKreis).sort((a, b) => b[1].index - a[1].index))
    console.log(`${b.padEnd(18)} ${String(s.index).padStart(5)} ${String(s.betriebe).padStart(5)} ${String(s.medianBewertungen).padStart(6)} ${String(s.websiteQuote).padStart(6)}% ${String(s.unter10Bewertungen).padStart(6)}%`);
  console.log('\nKreis RE gesamt:', out.kreisRecklinghausen);
}

const cmd = process.argv[2];
if (cmd === 'fetch') await fetchAll();
else if (cmd === 'aggregate') aggregate();
else { console.log('Nutzung: node scripts/sichtbarkeits-index.mjs fetch | aggregate'); }
