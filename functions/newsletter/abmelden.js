/**
 * /newsletter/abmelden?t=<token> — Abmeldung (Link in jeder Newsletter-Mail, auch als List-Unsubscribe-Header).
 * GET zeigt den Knopf (Mail-Scanner rufen Links vorab auf), POST meldet ab.
 * RFC 8058 (Ein-Klick-Abmeldung in Gmail/Outlook): POST mit ?t= in der URL meldet direkt ab.
 */
import { esc, seite } from '../_lib/newsletter.js';

async function laden(env, t) {
  if (!env.KI_DB || !/^[0-9a-f]{48}$/.test(t || '')) return null;
  return env.KI_DB.prepare('SELECT * FROM newsletter WHERE token = ?').bind(t).first();
}
const fertig = () => seite('Abgemeldet', '<h1>Du bist abgemeldet.</h1><p>Wir schicken dir keine News mehr per Mail. Falls das ein Versehen war, kannst du dich jederzeit wieder anmelden.</p><p><a class="btn" href="/newsletter/">Wieder anmelden</a></p>');
const ungueltig = () => seite('Link ungültig', '<h1>Dieser Link ist nicht gültig.</h1><p>Schreib uns kurz an <a href="mailto:info@lokalbesucher.de">info@lokalbesucher.de</a>, dann tragen wir dich von Hand aus.</p>', 400);

export async function onRequestGet({ request, env }) {
  const t = new URL(request.url).searchParams.get('t');
  const r = await laden(env, t);
  if (!r) return ungueltig();
  if (r.status === 'abgemeldet') return fertig();
  return seite('Abmelden', `<h1>Vom Newsletter abmelden</h1><p>Möchtest du <b>${esc(r.email)}</b> abmelden?</p>
<form method="post"><input type="hidden" name="t" value="${esc(t)}"><button class="btn" type="submit">Ja, abmelden</button></form>`);
}

export async function onRequestPost({ request, env }) {
  const f = await request.formData().catch(() => null);
  const t = new URL(request.url).searchParams.get('t') || (f ? String(f.get('t') || '') : '');
  const r = await laden(env, t);
  if (!r) return ungueltig();
  if (r.status !== 'abgemeldet') await env.KI_DB.prepare("UPDATE newsletter SET status = 'abgemeldet', unsub_at = ? WHERE id = ?").bind(new Date().toISOString(), r.id).run();
  return fertig();
}
