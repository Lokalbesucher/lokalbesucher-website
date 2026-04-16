/**
 * download-images.js
 *
 * Crawlt die alte WordPress-Site (lokalbesucher.de), lädt alle Bilder herunter
 * und konvertiert sie zu optimierten WebP-Dateien für die neue statische Site.
 *
 * Verwendung:
 *   npm install
 *   node scripts/download-images.js
 *
 * Optionen (ENV):
 *   TARGET_URL   - Ziel-URL der alten Site (default: https://lokalbesucher.de)
 *   OUTPUT_DIR   - Ausgabeverzeichnis (default: assets/images)
 *   QUALITY      - WebP Qualität 1-100 (default: 85)
 *   MAX_WIDTH    - Max. Breite in px, größere werden skaliert (default: 1920)
 */

import { createWriteStream, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, basename, dirname, extname } from 'path';
import { URL } from 'url';
import { pipeline } from 'stream/promises';
import sharp from 'sharp';

// ─── Konfiguration ────────────────────────────────────────────────────────────

const TARGET_URL  = process.env.TARGET_URL  || 'https://lokalbesucher.de';
const OUTPUT_DIR  = process.env.OUTPUT_DIR  || 'assets/images';
const QUALITY     = parseInt(process.env.QUALITY   || '85', 10);
const MAX_WIDTH   = parseInt(process.env.MAX_WIDTH || '1920', 10);

// Seiten die gecrawlt werden (relativ zur TARGET_URL)
const PAGES_TO_CRAWL = [
  '/',
  '/google-business-agentur/',
  '/faq/',
  '/case-studies/',
  '/case-studies/battlekart/',
  '/case-studies/orthoclinic/',
  '/case-studies/janel-saal/',
  '/case-studies/schlosshotel-westerholt/',
  '/case-studies/stephan-schnieder/',
  '/impressum/',
  '/datenschutz/',
];

// Bild-Erweiterungen die verarbeitet werden
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);

// Erweiterungen die direkt kopiert werden (keine Konvertierung)
const PASSTHROUGH_EXTENSIONS = new Set(['.svg']);

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const log = {
  info:  (msg) => console.log(`  ℹ  ${msg}`),
  ok:    (msg) => console.log(`  ✓  ${msg}`),
  skip:  (msg) => console.log(`  ·  ${msg}`),
  warn:  (msg) => console.warn(`  ⚠  ${msg}`),
  error: (msg) => console.error(`  ✗  ${msg}`),
  head:  (msg) => console.log(`\n── ${msg} ──`),
};

/** Stellt sicher dass das Verzeichnis existiert */
function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/** Gibt den Ausgabepfad für eine Bild-URL zurück */
function getOutputPath(imageUrl) {
  const url      = new URL(imageUrl);
  const pathname = url.pathname;
  const ext      = extname(pathname).toLowerCase();

  // WordPress Upload-Pfad vereinfachen: /wp-content/uploads/YYYY/MM/file.jpg → file.jpg
  let filename = basename(pathname, ext);
  filename = filename.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();

  // Dimensionssuffix entfernen (z.B. image-800x600 → image)
  filename = filename.replace(/-\d+x\d+$/, '');

  if (PASSTHROUGH_EXTENSIONS.has(ext)) {
    return join(OUTPUT_DIR, `${filename}${ext}`);
  }
  return join(OUTPUT_DIR, `${filename}.webp`);
}

/** Fetch mit Timeout und Retry */
async function fetchWithRetry(url, retries = 3, timeoutMs = 15000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LokalbesucherImageBot/1.0)',
        },
      });
      clearTimeout(timer);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      log.warn(`Versuch ${attempt} fehlgeschlagen für ${url}: ${err.message} — retry...`);
      await sleep(1000 * attempt);
    }
  }
}

/** Crawlt eine Seite und gibt alle absoluten Bild-URLs zurück */
async function extractImageUrls(pageUrl) {
  let html;
  try {
    const res = await fetchWithRetry(pageUrl);
    html = await res.text();
  } catch (err) {
    log.error(`Seite nicht erreichbar: ${pageUrl} (${err.message})`);
    return new Set();
  }

  const found = new Set();
  const base  = new URL(pageUrl);

  // src / data-src / srcset aus <img>-Tags
  const imgPattern = /<img[^>]+>/gi;
  const srcPattern = /(?:src|data-src|data-lazy-src)=["']([^"']+)["']/gi;
  const srcsetPattern = /srcset=["']([^"']+)["']/gi;

  let imgMatch;
  while ((imgMatch = imgPattern.exec(html)) !== null) {
    const tag = imgMatch[0];

    let m;
    while ((m = srcPattern.exec(tag)) !== null) {
      try {
        const url = new URL(m[1], base);
        const ext = extname(url.pathname).toLowerCase();
        if (IMAGE_EXTENSIONS.has(ext)) found.add(url.href);
      } catch {}
    }

    srcPattern.lastIndex = 0;

    while ((m = srcsetPattern.exec(tag)) !== null) {
      const parts = m[1].split(',');
      for (const part of parts) {
        const src = part.trim().split(/\s+/)[0];
        if (!src) continue;
        try {
          const url = new URL(src, base);
          const ext = extname(url.pathname).toLowerCase();
          if (IMAGE_EXTENSIONS.has(ext)) found.add(url.href);
        } catch {}
      }
    }

    srcsetPattern.lastIndex = 0;
  }

  // CSS background-image URLs
  const bgPattern = /url\(["']?([^"')]+)["']?\)/gi;
  let bgMatch;
  while ((bgMatch = bgPattern.exec(html)) !== null) {
    try {
      const url = new URL(bgMatch[1], base);
      const ext = extname(url.pathname).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) found.add(url.href);
    } catch {}
  }

  // OG-Image
  const ogPattern = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi;
  let ogMatch;
  while ((ogMatch = ogPattern.exec(html)) !== null) {
    try {
      const url = new URL(ogMatch[1], base);
      const ext = extname(url.pathname).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext) || ogMatch[1].includes('wp-content')) {
        found.add(url.href);
      }
    } catch {}
  }

  return found;
}

/** Lädt ein Bild herunter und konvertiert es zu WebP */
async function downloadAndConvert(imageUrl, outputPath) {
  if (existsSync(outputPath)) {
    log.skip(`Bereits vorhanden: ${basename(outputPath)}`);
    return { status: 'skip' };
  }

  ensureDir(dirname(outputPath));

  const ext = extname(imageUrl).toLowerCase();

  try {
    const res = await fetchWithRetry(imageUrl);
    const buffer = Buffer.from(await res.arrayBuffer());

    // SVG direkt speichern
    if (PASSTHROUGH_EXTENSIONS.has(ext)) {
      import('fs').then(({ writeFileSync }) => writeFileSync(outputPath, buffer));
      log.ok(`SVG gespeichert: ${basename(outputPath)}`);
      return { status: 'ok', type: 'svg' };
    }

    // Mit Sharp zu WebP konvertieren
    const image = sharp(buffer);
    const meta  = await image.metadata();

    let pipeline = image;

    // Skalieren wenn zu groß
    if (meta.width && meta.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    const { size: inputSize } = { size: buffer.length };

    await pipeline
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(outputPath);

    log.ok(`Konvertiert: ${basename(imageUrl)} → ${basename(outputPath)}`);
    return { status: 'ok', type: 'webp' };

  } catch (err) {
    log.error(`Fehler bei ${imageUrl}: ${err.message}`);
    if (existsSync(outputPath)) unlinkSync(outputPath); // Kaputte Datei löschen
    return { status: 'error', error: err.message };
  }
}

// ─── Hauptprogramm ───────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  Lokalbesucher — WordPress Image Downloader   ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  log.info(`Quelle:     ${TARGET_URL}`);
  log.info(`Ausgabe:    ${OUTPUT_DIR}`);
  log.info(`Qualität:   ${QUALITY}% WebP`);
  log.info(`Max-Breite: ${MAX_WIDTH}px`);
  console.log('');

  ensureDir(OUTPUT_DIR);

  // ── Phase 1: Alle Bild-URLs sammeln ──────────────────────────────────────
  log.head('Phase 1: Seiten crawlen');

  const allImageUrls = new Set();

  for (const page of PAGES_TO_CRAWL) {
    const pageUrl = TARGET_URL + page;
    log.info(`Crawle: ${pageUrl}`);

    const urls = await extractImageUrls(pageUrl);
    log.ok(`  ${urls.size} Bilder gefunden`);
    urls.forEach(u => allImageUrls.add(u));

    await sleep(300); // Höfliche Pause zwischen Requests
  }

  log.head(`Phase 1 abgeschlossen`);
  log.ok(`Insgesamt ${allImageUrls.size} einzigartige Bild-URLs gefunden`);

  // ── Phase 2: Herunterladen & Konvertieren ─────────────────────────────────
  log.head('Phase 2: Download & WebP-Konvertierung');

  const stats = { ok: 0, skip: 0, error: 0 };
  const urls  = [...allImageUrls];

  for (let i = 0; i < urls.length; i++) {
    const url        = urls[i];
    const outputPath = getOutputPath(url);

    process.stdout.write(`  [${i + 1}/${urls.length}] `);

    const result = await downloadAndConvert(url, outputPath);
    stats[result.status]++;

    await sleep(100); // Kurze Pause
  }

  // ── Zusammenfassung ───────────────────────────────────────────────────────
  log.head('Fertig');
  console.log('');
  console.log(`  Erfolgreich konvertiert: ${stats.ok}`);
  console.log(`  Bereits vorhanden:       ${stats.skip}`);
  console.log(`  Fehler:                  ${stats.error}`);
  console.log('');

  if (stats.error > 0) {
    log.warn('Einige Bilder konnten nicht geladen werden. Prüfe die Ausgabe oben.');
  }

  log.ok(`Alle Bilder in: ./${OUTPUT_DIR}`);
  console.log('');
}

main().catch(err => {
  console.error('Fataler Fehler:', err);
  process.exit(1);
});
