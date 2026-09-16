/* Wissens-Hub "Google Unternehmensprofil": rendert die Leitseite
   /google-unternehmensprofil/ und alle Cluster-Artikel unter /ratgeber/.
   Aufruf: node scripts/generate-gup-hub.js
   Rahmen kommt aus generate-ratgeber.js (page()), Inhalte aus scripts/gup-articles/. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { page } from './generate-ratgeber.js';
import pillar from './gup-articles/pillar.js';
import { hubRows, NEWS_LATEST } from './generate-news.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SETS_DIR = path.join(ROOT, 'scripts', 'gup-articles');

const sets = fs.readdirSync(SETS_DIR).filter(f => /^set-.*\.js$/.test(f)).sort();
const articles = [];
for (const f of sets) {
  const m = await import('./gup-articles/' + f);
  articles.push(...m.default);
}

function write(rel, html) {
  const dir = path.join(ROOT, rel);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log('OK', rel, Math.round(html.length / 1024) + ' KB');
}

/* Leitseite: Das Inline-Critical-CSS des Artikel-Rahmens deckt Navigation, Breadcrumb und
   Section-Klassen nicht ab; auf der langen Leitseite sprang deshalb beim asynchronen
   Nachladen von global.css alles (CLS 0.377). Render-blockend laden kostete LCP (2,16 s).
   Loesung: die betroffenen Regeln werden beim Bauen aus global.css extrahiert und als
   zweiter <style>-Block inline eingebettet; global.css bleibt asynchron. */
const CRITICAL_SEL = /\.(breadcrumb|breadcrumb-sep|grid-bg|section|section-label|skip-link|nav-links|nav-cta|nav-toggle|nav-drawer|nav-dropdown|nav-has-dropdown|dropdown-badge|drawer-sub-label|drawer-sub-link|whatsapp-float)(?![\w-])/;
function parseBlocks(css) {
  const out = []; let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i); if (open < 0) break;
    const sel = css.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (j < css.length && depth > 0) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
    out.push({ sel, body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}
function criticalExtra() {
  const css = fs.readFileSync(path.join(ROOT, 'assets/css/global.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const keep = [];
  for (const b of parseBlocks(css)) {
    if (b.sel.startsWith('@media')) {
      const inner = parseBlocks(b.body).filter(r => CRITICAL_SEL.test(r.sel));
      if (inner.length) keep.push(b.sel + '{' + inner.map(r => r.sel + '{' + r.body.trim() + '}').join('') + '}');
    } else if (!b.sel.startsWith('@') && CRITICAL_SEL.test(b.sel)) {
      keep.push(b.sel + '{' + b.body.trim() + '}');
    }
  }
  return keep.join('\n    ').replace(/\s*\n\s*/g, '\n    ');
}
function withCriticalExtra(html) {
  const extra = criticalExtra();
  if (extra.length < 500) throw new Error('Critical-CSS-Extraktion leer: ' + extra.length);
  const k = html.indexOf('</style>');
  if (k < 0) throw new Error('kein Inline-<style> gefunden');
  return html.slice(0, k) + '</style>\n  <style>\n    /* Critical-CSS Leitseite (aus global.css extrahiert, siehe generate-gup-hub.js) */\n    ' + extra + '\n  ' + html.slice(k);
}
/* Änderungs-Tabelle: Meldungen mit hub:true aus scripts/news/items.js, die jünger sind als der
   handgepflegte Tabellenstand (TABLE_UPTO), werden als Zeilen angehängt; „Stand" wird nachgezogen. */
const TABLE_UPTO = '2026-09-12';
function withNewsRows(html) {
  const rows = hubRows(TABLE_UPTO);
  const k = html.indexOf('id="neu"'); const t = html.indexOf('</tbody>', k);
  if (k < 0 || t < 0) throw new Error('Änderungs-Tabelle (id="neu") nicht gefunden');
  if (rows.length) html = html.slice(0, t) + rows.join('\n') + '\n          ' + html.slice(t);
  if (NEWS_LATEST > TABLE_UPTO) {
    const M = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
    const [y, m, d] = NEWS_LATEST.split('-');
    html = html.replace('Das ist der Stand vom 12. September 2026', 'Das ist der Stand vom ' + (+d) + '. ' + M[+m - 1] + ' ' + y);
  }
  return html;
}
write('google-unternehmensprofil', withCriticalExtra(withNewsRows(page(pillar))));
for (const a of articles) write(path.join('ratgeber', a.slug), page(a));

export const HUB = { pillar, articles };
