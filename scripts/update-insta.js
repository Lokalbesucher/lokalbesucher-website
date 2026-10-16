/* Instagram-Feed der Startseite aktualisieren (seit 2026-10-16).
   Holt die neuesten Beiträge von @lokalbesucher über das Admin (lokalbesucher.de/admin/api/insta-feed, Quelle Metricool),
   speichert die Vorschaubilder selbst (Instagram-Bildadressen laufen nach Tagen ab) und schreibt die Kacheln statisch
   zwischen <!-- INSTA:START --> und <!-- INSTA:END --> in index.html. Kein Fremd-Script, keine Cookies auf der Seite.
   Aufruf: node scripts/update-insta.js   (täglich per .github/workflows/insta-feed.yml) */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const FEED = 'https://lokalbesucher.de/admin/api/insta-feed';
const DIR = 'assets/images/insta';
const N = 8;
const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const short = (u) => (u.match(/instagram\.com\/(?:p|reel)\/([\w-]+)/) || [])[1];

const res = await fetch(FEED + '?t=' + Date.now());
if (!res.ok) throw new Error('Feed ' + res.status);
const posts = (await res.json()).filter((p) => p.img && short(p.link)).slice(0, N);
if (posts.length < 4) { console.log('Zu wenige Beiträge (' + posts.length + ') – Startseite bleibt unverändert.'); process.exit(0); }

fs.mkdirSync(DIR, { recursive: true });
const keep = new Set();
for (const p of posts) {
  const id = short(p.link); const file = path.join(DIR, id + '.webp'); keep.add(id + '.webp');
  if (fs.existsSync(file)) continue;
  const r = await fetch(p.img); if (!r.ok) throw new Error('Bild ' + id + ' ' + r.status);
  await sharp(Buffer.from(await r.arrayBuffer())).resize(360, 450, { fit: 'cover', position: 'attention' }).webp({ quality: 78 }).toFile(file);
}
for (const f of fs.readdirSync(DIR)) if (!keep.has(f)) fs.unlinkSync(path.join(DIR, f));

const tiles = posts.map((p) => {
  const id = short(p.link); const alt = esc(p.text.replace(/[^\p{L}\p{N}\s.,!?:–-]/gu, '').trim().slice(0, 110)) || 'Beitrag von Lokalbesucher auf Instagram';
  return `        <a class="ig-tile" href="${esc(p.link)}" target="_blank" rel="noopener" aria-label="${p.reel ? 'Reel' : 'Beitrag'} auf Instagram ansehen: ${alt}"><img src="/assets/images/insta/${id}.webp" alt="${alt}" width="360" height="450" loading="lazy" decoding="async">${p.reel ? '<span class="ig-play" aria-hidden="true"></span>' : ''}</a>`;
}).join('\n');

const f = 'index.html'; const html = fs.readFileSync(f, 'utf8');
const re = /(<!-- INSTA:START -->)[\s\S]*?(<!-- INSTA:END -->)/;
if (!re.test(html)) throw new Error('Markierungen INSTA:START/END fehlen in index.html');
const next = html.replace(re, `$1\n${tiles}\n        $2`);
if (next !== html) { fs.writeFileSync(f, next); console.log('Startseite aktualisiert:', posts.length, 'Beiträge, neuester vom', posts[0].date); }
else console.log('Keine Änderung.');
