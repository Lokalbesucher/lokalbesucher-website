/**
 * Platzhalter-Portrait fuer Teammitglieder ohne Foto — 400x520
 *
 * Nutzt die EXAKTE Pin-Silhouette der echten Teamfotos: die Alpha-Maske wird
 * aus einer vorhandenen Aufnahme uebernommen, nicht nachgebaut. Innen steht
 * statt eines Gesichts ein schlichtes Personen-Symbol auf demselben cremefarbenen
 * Grund wie bei den Fotos.
 *
 * Aufruf: node scripts/generate-platzhalter-portrait.js
 * Ausgabe: assets/images/lokalbesucher-team-platzhalter.webp
 *
 * Sobald ein echtes Foto vorliegt: Foto wie die uebrigen auf 400x520 zuschneiden
 * (fit cover, position top, WebP q85) und im HTML den Platzhalter ersetzen.
 */

import sharp from 'sharp';
import path from 'node:path';

const B = 400, H = 520;
const VORLAGE = path.join('assets', 'images', 'luca-domina-lokalbesucher-team.webp');
const ZIEL    = path.join('assets', 'images', 'lokalbesucher-team-platzhalter.webp');

/* Innenfarbe der echten Aufnahmen (gemessen): warmes Off-White */
const GRUND  = { r: 243, g: 241, b: 235 };
const SYMBOL = '#b4b0a6';   // gedaempftes Warmgrau, ruhig genug fuer die Rasteransicht

/* Personen-Symbol: Kopf + Schultern, mittig im breiten Teil des Pins.
   Der Pin ist bei y≈180–240 am breitesten (x 21–378), Mitte x=200.      */
const symbol = `<svg xmlns="http://www.w3.org/2000/svg" width="${B}" height="${H}">
  <circle cx="200" cy="166" r="56" fill="${SYMBOL}"/>
  <path d="M200 242c-61 0-110 43-110 96v182h220V338c0-53-49-96-110-96z" fill="${SYMBOL}"/>
</svg>`;

/* Alpha der Vorlage = die Pin-Silhouette, Pixel fuer Pixel uebernommen */
const maske = await sharp(VORLAGE).ensureAlpha().extractChannel('alpha').raw().toBuffer();

/* Cremefarbene Flaeche mit dem Personen-Symbol darauf */
const flaeche = await sharp({ create: { width: B, height: H, channels: 4, background: { ...GRUND, alpha: 1 } } })
  .composite([{ input: Buffer.from(symbol) }])
  .raw().toBuffer();

/* Silhouette als Alphakanal einsetzen */
for (let i = 0; i < B * H; i++) flaeche[i * 4 + 3] = maske[i];

await sharp(flaeche, { raw: { width: B, height: H, channels: 4 } })
  .webp({ quality: 85, alphaQuality: 100 })
  .toFile(ZIEL);

const m = await sharp(ZIEL).metadata();
console.log('✓', ZIEL, m.width + 'x' + m.height, 'Alpha:', m.hasAlpha);
