/* Social-Vorschaubild je Seite: /assets/images/og/<slug>.jpg (1200×630, erzeugt von scripts/generate-og.mjs).
   Die Generatoren (Ratgeber, News, Cases) fragen hier, ob es für eine URL ein eigenes Bild gibt.
   ?v= ist ein Inhalts-Hash, damit WhatsApp & Co. ein neues Bild holen, sobald es sich ändert. */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://lokalbesucher.de';

export const ogSlug = rel => rel.replace(/^\/+|\/+$/g, '').replace(/\/index\.html$|^index\.html$/, '').replace(/\//g, '-') || 'startseite';
export const ogDatei = slug => path.join(ROOT, 'assets/images/og', slug + '.jpg');

/** URL oder Pfad der Seite → absolute Bild-URL mit ?v=Hash, oder null wenn es (noch) kein Bild gibt */
export function ogBild(seite) {
  const datei = ogDatei(ogSlug(seite.replace(SITE, '')));
  if (!fs.existsSync(datei)) return null;
  const v = crypto.createHash('md5').update(fs.readFileSync(datei)).digest('hex').slice(0, 8);
  return `${SITE}/assets/images/og/${path.basename(datei)}?v=${v}`;
}
