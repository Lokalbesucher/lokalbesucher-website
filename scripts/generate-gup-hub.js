/* Wissens-Hub "Google Unternehmensprofil": rendert die Leitseite
   /google-unternehmensprofil/ und alle Cluster-Artikel unter /ratgeber/.
   Aufruf: node scripts/generate-gup-hub.js
   Rahmen kommt aus generate-ratgeber.js (page()), Inhalte aus scripts/gup-articles/. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { page } from './generate-ratgeber.js';
import pillar from './gup-articles/pillar.js';

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

write('google-unternehmensprofil', page(pillar));
for (const a of articles) write(path.join('ratgeber', a.slug), page(a));

export const HUB = { pillar, articles };
