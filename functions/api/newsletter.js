/**
 * POST /api/newsletter — Anmeldung zum Newsletter, Schritt 1 des Double-Opt-in.
 * Speichert die Adresse als „offen“ und schickt die Bestätigungsmail. Erst der Klick auf „Anmeldung bestätigen“
 * (functions/newsletter/bestaetigen.js) macht daraus einen Empfänger.
 * Antwort ist gleich, egal ob die Adresse schon bekannt ist – so lässt sich nicht abfragen, wer angemeldet ist.
 * Schutz: Honeypot-Feld „website“, höchstens 5 Anmeldungen je IP und Stunde (KV), Bestätigungsmail höchstens alle 10 Minuten je Adresse.
 */
import { EINWILLIGUNG, MAIL_RE, SITE, esc, sendMail, token } from '../_lib/newsletter.js';

const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json;charset=utf-8', 'Cache-Control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && !/^https:\/\/(([a-z0-9-]+\.)?lokalbesucher-website\.pages\.dev|(www\.)?lokalbesucher\.de)$/.test(origin)) return json({ ok: false, reason: 'origin' }, 403);
  let d; try { d = await request.json(); } catch { return json({ ok: false, reason: 'bad-json' }, 400); }
  if (!d || typeof d !== 'object') return json({ ok: false, reason: 'bad-payload' }, 400);
  if (d.website) return json({ ok: true });
  const email = String(d.email || '').trim().toLowerCase().slice(0, 200);
  if (!MAIL_RE.test(email)) return json({ ok: false, reason: 'email' }, 400);
  if (!env.KI_DB) return json({ ok: false, reason: 'not-configured' }, 503);
  const ip = request.headers.get('CF-Connecting-IP') || '';

  if (env.AI_CHECK_KV && ip) {
    const k = 'nl:' + ip + ':' + new Date().toISOString().slice(0, 13);
    const n = +(await env.AI_CHECK_KV.get(k)) || 0;
    if (n >= 5) return json({ ok: false, reason: 'limit' }, 429);
    await env.AI_CHECK_KV.put(k, String(n + 1), { expirationTtl: 3700 });
  }

  /* Datenschutz §11: nicht bestätigte Anmeldungen nach 30 Tagen löschen */
  await env.KI_DB.prepare("DELETE FROM newsletter WHERE status = 'offen' AND created_at < ?").bind(new Date(Date.now() - 30 * 86400000).toISOString()).run().catch(() => {});
  const quelle = String(d.quelle || '').slice(0, 200);
  const alt = await env.KI_DB.prepare('SELECT * FROM newsletter WHERE email = ?').bind(email).first();
  if (alt && alt.status === 'bestaetigt') return json({ ok: true });
  if (alt && alt.status === 'offen' && alt.mail_at && Date.now() - Date.parse(alt.mail_at) < 10 * 60000) return json({ ok: true });
  const t = token(), jetzt = new Date().toISOString();
  if (alt) await env.KI_DB.prepare("UPDATE newsletter SET status = 'offen', token = ?, quelle = ?, einwilligung = ?, created_at = ?, created_ip = ?, mail_at = ?, confirmed_at = NULL, confirmed_ip = NULL, unsub_at = NULL WHERE id = ?").bind(t, quelle, EINWILLIGUNG, jetzt, ip, jetzt, alt.id).run();
  else await env.KI_DB.prepare("INSERT INTO newsletter (email, status, token, quelle, einwilligung, created_at, created_ip, mail_at) VALUES (?, 'offen', ?, ?, ?, ?, ?, ?)").bind(email, t, quelle, EINWILLIGUNG, jetzt, ip, jetzt).run();

  const link = `${SITE}/newsletter/bestaetigen?t=${t}`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#1b2030;max-width:560px">
<p style="font-size:20px;font-weight:bold;margin:0 0 14px">Ein Klick noch, dann bist du dabei.</p>
<p>Du hast dich gerade für die Lokalbesucher-News angemeldet. Bitte bestätige kurz, dass diese Adresse dir gehört:</p>
<p style="margin:22px 0"><a href="${esc(link)}" style="display:inline-block;background:#ffbd59;color:#0c0e1a;font-weight:bold;text-decoration:none;padding:14px 22px;border-radius:10px">Anmeldung bestätigen</a></p>
<p>Danach bekommst du jeden Freitag die wichtigsten Änderungen bei Google, KI-Suche, Meta und Co., eingeordnet für lokale Betriebe von Tobias Frank.</p>
<p style="color:#4f5967;font-size:14px">Du hast dich nicht angemeldet? Dann ignoriere diese Mail einfach. Ohne Bestätigung schicken wir dir nichts. Der Link gilt 7 Tage.</p>
<p style="color:#4f5967;font-size:13px;margin-top:24px">Lokalbesucher GmbH · Karl-Breuing-Str. 2 · 45770 Marl · <a href="${SITE}/datenschutz/#newsletter" style="color:#4f5967">Datenschutz</a> · <a href="${SITE}/impressum/" style="color:#4f5967">Impressum</a></p></div>`;
  const text = `Ein Klick noch, dann bist du dabei.\n\nDu hast dich gerade für die Lokalbesucher-News angemeldet. Bitte bestätige hier:\n${link}\n\nDu hast dich nicht angemeldet? Dann ignoriere diese Mail einfach. Der Link gilt 7 Tage.\n\nLokalbesucher GmbH, Karl-Breuing-Str. 2, 45770 Marl`;
  const r = await sendMail(env, { to: email, subject: 'Bitte bestätige deine Anmeldung zu den Lokalbesucher-News', html, text });
  if (!r.ok) { console.log('newsletter mail', r.why); return json({ ok: false, reason: 'mail' }, 502); }
  return json({ ok: true });
}
