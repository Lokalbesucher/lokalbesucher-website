/* Automatische News-Veröffentlichung (läuft in .github/workflows/news-publish.yml).
   Holt freigegebene, fällige Meldungen aus dem Admin (lokalbesucher.de/admin/news), baut Bilder,
   schreibt scripts/news/auto-items.json und rendert die Seiten. Commit + Push macht der Workflow.
   Ohne Freigabe im Admin passiert hier nichts.

   node scripts/news/publish-auto.mjs prepare   → Meldungen holen, Bilder, auto-items.json, npm run news
   node scripts/news/publish-auto.mjs confirm   → nach dem Push: warten bis die URL live ist, dem Admin melden
   Umgebung: NEWS_PUBLISH_KEY (Pflicht), NEWS_ADMIN (optional, Standard https://lokalbesucher.de/admin) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const ADMIN = process.env.NEWS_ADMIN || 'https://lokalbesucher.de/admin';
const KEY = process.env.NEWS_PUBLISH_KEY;
const SITE = 'https://lokalbesucher.de';
const AUTO = path.join(__dirname, 'auto-items.json');
const STATE = path.join(ROOT, 'tmp', 'news-publish-state.json');
const IMG_DIR = path.join(ROOT, 'assets', 'images', 'news');
const RULES = path.join(ROOT, 'docs', 'news-regeln.md');

if (!KEY) { console.error('NEWS_PUBLISH_KEY fehlt'); process.exit(1); }
const api = async (p, body) => {
  const r = await fetch(ADMIN + '/api/news/' + p, { method: body ? 'POST' : 'GET', headers: { 'X-LB-News': KEY, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`Admin ${p}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
};
const fail = async (id, msg) => { console.error('FEHLER', msg); try { await api('error', { id, error: msg }); } catch (e) { console.error(e.message); } };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Hochformat → OG 1200×630: Motiv auf volle Höhe mittig, Ränder gespiegelt und weichgezeichnet (CLAUDE.md §20) */
async function ogImage(buf) {
  const H = 630, W = 1200;
  const mid = await sharp(buf).resize({ height: H }).toBuffer();
  const mw = (await sharp(mid).metadata()).width;
  if (mw >= W) return sharp(buf).resize(W, H, { fit: 'cover' }).toBuffer();
  const side = Math.ceil((W - mw) / 2);
  const strip = async (left) => sharp(await sharp(mid).extract({ left: left ? 0 : Math.max(0, mw - side), top: 0, width: Math.min(side, mw), height: H }).flop().resize(side, H, { fit: 'fill' }).toBuffer()).blur(18).modulate({ brightness: 0.72 }).toBuffer();
  return sharp({ create: { width: W, height: H, channels: 3, background: '#1e365c' } })
    .composite([{ input: await strip(true), left: 0, top: 0 }, { input: await strip(false), left: W - side, top: 0 }, { input: mid, left: Math.floor((W - mw) / 2), top: 0 }]).png().toBuffer();
}

async function prepare() {
  const due = await api('due');
  const auto = JSON.parse(fs.readFileSync(AUTO, 'utf8'));
  const done = [];
  for (const d of due.items) {
    try {
      const it = { ...d.item };
      if (auto.some((a) => a.slug === it.slug) || fs.existsSync(path.join(ROOT, 'news', it.slug))) throw new Error('Slug existiert schon auf der Website: ' + it.slug);
      const name = it.slug.replace(/^\d{4}-\d{2}-/, '');
      const r = await fetch(d.image, { headers: { 'X-LB-News': KEY } });
      if (!r.ok) throw new Error('Bild nicht abrufbar: ' + r.status);
      const src = Buffer.from(await r.arrayBuffer());
      const main = await sharp(src).resize({ width: 928 }).webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
      fs.writeFileSync(path.join(IMG_DIR, `${name}-2026.webp`), main.data);
      const og = await ogImage(src);
      await sharp(og).webp({ quality: 85 }).toFile(path.join(IMG_DIR, `${name}-og.webp`));
      await sharp(og).jpeg({ quality: 82 }).toFile(path.join(IMG_DIR, `${name}-og.jpg`));
      it.date = due.date;
      it.image = `/assets/images/news/${name}-og.webp`;
      it.body = `        <figure>
          <img src="/assets/images/news/${name}-2026.webp" alt="${esc(d.image_alt || it.title)}" width="${main.info.width}" height="${main.info.height}" loading="eager" fetchpriority="high" style="border-radius:12px;border:1px solid #1e2240">
          ${d.image_caption ? `<figcaption style="font-size:.8rem;color:#7c83aa;margin-top:.5rem">${esc(d.image_caption)}</figcaption>` : ''}
        </figure>
${it.body}`;
      auto.push(it);
      done.push({ id: d.id, slug: it.slug, item: it });
      console.log('vorbereitet:', it.slug);
    } catch (e) { await fail(d.id, `${d.slug}: ${e.message}`); }
  }
  /* Rückmeldungen aus dem Admin dauerhaft als Regel festhalten */
  const ruleIds = [];
  if (due.rules.length) {
    let md = fs.readFileSync(RULES, 'utf8');
    const head = '## Rückmeldungen aus der Freigabe';
    if (!md.includes(head)) md = md.trimEnd() + `\n\n${head}\n\nJede Rückmeldung über den Knopf „Ändern“ im Admin landet hier und gilt ab dann für alle Meldungen.\n`;
    for (const r of due.rules) { md = md.trimEnd() + `\n- ${new Date(r.ts).toISOString().slice(0, 10)}: ${String(r.text).replace(/\s+/g, ' ').trim()}\n`; ruleIds.push(r.id); }
    fs.writeFileSync(RULES, md);
  }
  if (done.length) {
    fs.writeFileSync(AUTO, JSON.stringify(auto, null, 1) + '\n');
    try { execSync('npm run news', { cwd: ROOT, stdio: 'inherit' }); }
    catch (e) {
      /* Generator bricht ab (z. B. verbotene Formulierung): nichts veröffentlichen, Stand zurücksetzen */
      execSync('git checkout -- . && git clean -fdq news assets/images/news', { cwd: ROOT });
      for (const d of done) await fail(d.id, `${d.slug}: Generator abgebrochen – nichts veröffentlicht`);
      done.length = 0; ruleIds.length = 0;
    }
  }
  fs.mkdirSync(path.dirname(STATE), { recursive: true });
  fs.writeFileSync(STATE, JSON.stringify({ done, ruleIds }));
  console.log(`fertig: ${done.length} Meldung(en), ${ruleIds.length} Regel(n)`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${done.length || ruleIds.length ? 'true' : 'false'}\ntitle=${done.map((d) => d.item.title).join(' / ').replace(/[\r\n"]/g, ' ') || 'Regeln aus der Freigabe'}\n`);
}

async function confirm() {
  if (!fs.existsSync(STATE)) return;
  const { done, ruleIds } = JSON.parse(fs.readFileSync(STATE, 'utf8'));
  if (ruleIds.length) await api('rules-synced', { ids: ruleIds });
  for (const d of done) {
    const url = `${SITE}/news/${d.slug}/`; let ok = false;
    for (let i = 0; i < 40 && !ok; i++) {
      await new Promise((r) => setTimeout(r, 15000));
      try { const r = await fetch(url + '?t=' + Date.now(), { redirect: 'manual' }); ok = r.status === 200 && (await r.text()).includes(`/news/${d.slug}/`); } catch {}
    }
    /* erst wenn die Seite wirklich erreichbar ist, darf der Admin die Beiträge in Metricool anlegen */
    if (ok) { await api('live', { id: d.id, url, item: d.item }); console.log('live:', url); }
    else await fail(d.id, `${d.slug}: Seite nach 10 Minuten nicht erreichbar (${url}) – keine Beiträge eingeplant`);
  }
}

const cmd = process.argv[2];
(cmd === 'prepare' ? prepare() : cmd === 'confirm' ? confirm() : Promise.reject(new Error('prepare oder confirm'))).catch(async (e) => { await fail(null, 'Veröffentlichung abgebrochen: ' + e.message); process.exit(1); });
