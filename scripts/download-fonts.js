/**
 * download-fonts.js
 *
 * Lädt Syne + DM Sans + DM Mono von Google Fonts herunter
 * und speichert sie selbst-gehostet in assets/fonts/.
 * Gibt am Ende den fertigen @font-face CSS-Block aus.
 *
 * Verwendung:
 *   node scripts/download-fonts.js
 */

import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = 'assets/fonts';

// ─── Schriften ────────────────────────────────────────────────────────────────
// Mont: FontShare (kostenlos, DSGVO-konform, self-hosted)
// DM Mono: Google Fonts (Body ist Arial — kein Hosting nötig)
// HINWEIS: Mont ist ein kommerzieller Font von Fontfabric (fontfabric.com).
// Als funktionierender Stand-in wird Montserrat heruntergeladen und als
// 'Mont' @font-face registriert — beide Fonts sind optisch sehr ähnlich.
// Für die echten Mont-Dateien:
//   1. WOFF2 von https://fontfabric.com/fonts/mont/ kaufen/herunterladen
//   2. Als assets/fonts/mont-700.woff2 + mont-800.woff2 ablegen
//   3. CSS ändert sich nicht — @font-face zeigt bereits auf diese Pfade
const FONT_REQUESTS = [
  {
    name:       'Mont',          // Wird als 'Mont' @font-face registriert
    familyUrl:  'Montserrat',    // Stand-in via Google Fonts (ersetzen mit echtem Mont)
    url:        'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap',
    source:     'google',
    outputName: 'mont',          // Dateiname: mont-700.woff2, mont-800.woff2
  },
  {
    name:       'DM Mono',
    familyUrl:  'DM Mono',
    url:        'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap',
    source:     'google',
    outputName: null,            // Standard-Namensgebung
  },
];

// Moderner Browser User-Agent → Google gibt WOFF2 zurück
const MODERN_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const log = {
  info:  (msg) => console.log(`  ℹ  ${msg}`),
  ok:    (msg) => console.log(`  ✓  ${msg}`),
  skip:  (msg) => console.log(`  ·  ${msg}`),
  error: (msg) => console.error(`  ✗  ${msg}`),
  head:  (msg) => console.log(`\n── ${msg} ──`),
};

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

/** Normalisiert Fontnamen zu Dateinamen: "DM Sans 300" → "dm-sans-300" */
function toFilename(family, style, weight) {
  const base = family.toLowerCase().replace(/\s+/g, '-');
  return style === 'italic'
    ? `${base}-${weight}-italic.woff2`
    : `${base}-${weight}.woff2`;
}

/** Holt den Fonts CSS-Text (Google oder FontShare) und extrahiert alle @font-face Blöcke */
async function fetchFontCSS(req) {
  const headers = req.source === 'google'
    ? { 'User-Agent': MODERN_UA }
    : {}; // FontShare liefert WOFF2 ohne spezifischen UA
  const res = await fetch(req.url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} für ${req.url}`);
  return res.text();
}

/** Parst @font-face Blöcke aus einem CSS-String */
function parseFontFaces(css) {
  const faces = [];
  const facePattern = /@font-face\s*\{([^}]+)\}/gi;
  let match;

  while ((match = facePattern.exec(css)) !== null) {
    const block = match[1];

    const family = (block.match(/font-family:\s*['"]?([^;'"]+)['"]?/) || [])[1]?.trim();
    const style  = (block.match(/font-style:\s*([^;]+)/)  || [])[1]?.trim() || 'normal';
    const weight = (block.match(/font-weight:\s*([^;]+)/) || [])[1]?.trim();
    const srcLine = (block.match(/src:[^;]+/)             || [])[0];

    // WOFF2-URL extrahieren
    const woff2Match = srcLine?.match(/url\(([^)]+)\)\s*format\(['"]woff2['"]\)/i);
    if (!woff2Match || !family || !weight) continue;

    const woff2Url = woff2Match[1].replace(/['"]/g, '');

    // Unicode-range
    const unicodeRange = (block.match(/unicode-range:\s*([^;]+)/) || [])[1]?.trim();

    faces.push({ family, style, weight, woff2Url, unicodeRange });
  }

  return faces;
}

/** Lädt eine WOFF2-Datei und speichert sie lokal */
async function downloadWoff2(url, outputPath) {
  if (existsSync(outputPath)) {
    log.skip(`Bereits vorhanden: ${outputPath}`);
    return;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buffer);
  log.ok(`Geladen: ${outputPath}`);
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  Lokalbesucher — Font Downloader (WOFF2)      ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');

  ensureDir(OUTPUT_DIR);

  const allFaces = [];

  for (const req of FONT_REQUESTS) {
    log.head(req.name);
    log.info(`CSS laden von Google Fonts...`);

    let css;
    try {
      css = await fetchFontCSS(req);
    } catch (err) {
      log.error(`Fehler: ${err.message}`);
      continue;
    }

    const faces = parseFontFaces(css);
    log.info(`${faces.length} @font-face Blöcke gefunden`);

    for (const face of faces) {
      // outputName erlaubt Umbenennung (z.B. Montserrat → mont)
      const registeredFamily = req.outputName
        ? req.name  // z.B. 'Mont' statt 'Montserrat'
        : face.family;
      const fileBaseName = req.outputName || face.family.toLowerCase().replace(/\s+/g, '-');
      const filename = face.style === 'italic'
        ? `${fileBaseName}-${face.weight}-italic.woff2`
        : `${fileBaseName}-${face.weight}.woff2`;
      const outputPath = join(OUTPUT_DIR, filename);

      try {
        await downloadWoff2(face.woff2Url, outputPath);
        allFaces.push({ ...face, family: registeredFamily, localFile: filename });
      } catch (err) {
        log.error(`Download fehlgeschlagen: ${face.woff2Url} — ${err.message}`);
      }
    }
  }

  // ── CSS-Output generieren ─────────────────────────────────────────────────
  log.head('Fertiger @font-face CSS-Block');
  console.log('');
  console.log('Füge diesen Block in assets/css/global.css ein:\n');
  console.log('/* ── Self-hosted Fonts ─────────────────────────────────────── */');

  // Deduplizieren: Gleiche family+weight+style nur einmal ausgeben (kein subset)
  const seen = new Set();

  // Sortieren: family → weight → style
  allFaces.sort((a, b) => {
    if (a.family !== b.family) return a.family.localeCompare(b.family);
    return parseInt(a.weight) - parseInt(b.weight);
  });

  for (const face of allFaces) {
    const key = `${face.family}|${face.weight}|${face.style}`;
    // Nur lateinisch (kein Griechisch/Kyrillisch etc.)
    if (face.unicodeRange && !face.unicodeRange.includes('U+0000')) {
      // Überspringe non-latin subsets wenn wir sie schon haben
      if (seen.has(key)) continue;
    }
    seen.add(key);

    const cssBlock = `
@font-face {
  font-family: '${face.family}';
  font-style:  ${face.style};
  font-weight: ${face.weight};
  font-display: swap;
  src: url('/assets/fonts/${face.localFile}') format('woff2');
}`;
    console.log(cssBlock);
  }

  console.log('');
  log.ok('Font-Download abgeschlossen.');
  log.ok(`Dateien in: ./${OUTPUT_DIR}`);
  console.log('');
}

main().catch(err => {
  console.error('Fataler Fehler:', err);
  process.exit(1);
});
