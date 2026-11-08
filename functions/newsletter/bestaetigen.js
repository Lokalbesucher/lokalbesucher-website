/**
 * /newsletter/bestaetigen?t=<token> — Schritt 2 des Double-Opt-in.
 * GET zeigt nur einen Knopf: Mail-Scanner rufen Links vorab auf (GET), das darf keine Anmeldung bestätigen.
 * Erst der POST des Knopfs setzt status = bestaetigt und speichert Zeitpunkt und IP als Nachweis.
 */
import { esc, seite } from '../_lib/newsletter.js';

const GUELTIG = 7 * 86400000;
async function laden(env, t) {
  if (!env.KI_DB || !/^[0-9a-f]{48}$/.test(t || '')) return null;
  return env.KI_DB.prepare('SELECT * FROM newsletter WHERE token = ?').bind(t).first();
}
const abgelaufen = (r) => r.status === 'offen' && Date.now() - Date.parse(r.mail_at || r.created_at) > GUELTIG;
const fehler = () => seite('Link ungültig', '<h1>Dieser Link ist nicht mehr gültig.</h1><p>Melde dich einfach noch einmal an, dann schicken wir dir einen neuen Link.</p><p><a class="btn" href="/newsletter/">Zur Anmeldung</a></p>', 400);
const fertig = () => seite('Anmeldung bestätigt', '<h1>Danke, du bist dabei.</h1><p>Ab jetzt bekommst du die Lokalbesucher-News per Mail. Abmelden kannst du dich jederzeit über den Link am Ende jeder Mail.</p><p><a class="btn" href="/news/">Zu den aktuellen News</a></p>');

export async function onRequestGet({ request, env }) {
  const t = new URL(request.url).searchParams.get('t');
  const r = await laden(env, t);
  if (!r || abgelaufen(r) || r.status === 'abgemeldet') return fehler();
  if (r.status === 'bestaetigt') return fertig();
  return seite('Anmeldung bestätigen', `<h1>Anmeldung bestätigen</h1><p>Ein Klick, und die Lokalbesucher-News kommen an <b>${esc(r.email)}</b>.</p>
<form method="post"><input type="hidden" name="t" value="${esc(t)}"><button class="btn" type="submit">Ja, Anmeldung bestätigen</button></form>`);
}

export async function onRequestPost({ request, env }) {
  const f = await request.formData().catch(() => null);
  const t = f ? String(f.get('t') || '') : '';
  const r = await laden(env, t);
  if (!r || abgelaufen(r) || r.status === 'abgemeldet') return fehler();
  if (r.status === 'offen') await env.KI_DB.prepare("UPDATE newsletter SET status = 'bestaetigt', confirmed_at = ?, confirmed_ip = ? WHERE id = ?").bind(new Date().toISOString(), request.headers.get('CF-Connecting-IP') || '', r.id).run();
  return fertig();
}
