/* Repariert doppelt (oder mehrfach) kodiertes UTF-8 (Windows-1252-Mojibake) in Textdateien des Repos.
   Aufruf im Repo-/Worktree-Ordner: node fix-encoding.mjs */
import fs from 'fs';
import { execSync } from 'child_process';

const CP1252 = {
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
  0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91,
  0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02DC: 0x98,
  0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
};
function undo(str) {
  const b = [];
  for (const ch of str) {
    const c = ch.codePointAt(0);
    if (CP1252[c] !== undefined) b.push(CP1252[c]);
    else if (c < 256) b.push(c);
    else return null;
  }
  return Buffer.from(b).toString('utf8');
}
// Muster fuer Mojibake: "Ã" + Folgezeichen aus dem Bereich 0x80-0xBF, "â€" (Gedankenstrich/Anfuehrungszeichen), "Â·"
const bad = /Ã[-¿]|â€|Ãƒ|Â[ ·]/;

const files = execSync('git ls-files', { encoding: 'utf8' }).split('\n')
  .filter(f => /\.(html|xml|txt|js|css|json|md)$/.test(f) && !f.startsWith('node_modules'));
let fixed = 0;
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  if (!bad.test(s)) continue;
  let cur = s, n = 0;
  while (bad.test(cur) && n < 4) {
    const u = undo(cur);
    if (!u || u.includes('�')) break;
    cur = u; n++;
  }
  if (bad.test(cur)) { console.log('NICHT reparierbar:', f); continue; }
  fs.writeFileSync(f, cur, 'utf8');
  fixed++;
  console.log('repariert x' + n, f);
}
console.log('fixed', fixed);
