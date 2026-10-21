/**
 * POST /api/weihnachtsservice — Anfrage aus dem Weihnachts-Konfigurator (/weihnachtsservice/).
 * Kein CRM: die ausgefüllte Konfiguration geht als Mail per Resend an MAIL_TO,
 * Antwort-Adresse ist der Kunde. Vorher landet die Anfrage im D1-Protokoll (leads),
 * damit auch bei Mail-Ausfall nichts verloren geht.
 *
 * Secret: RESEND_API_KEY (Pages → Einstellungen → Variablen und Geheimnisse, setzt nur Tobias).
 * Vars:   MAIL_FROM, MAIL_TO (wrangler.toml).
 *
 * Antwort: 200 {ok:true} | 4xx/502 {ok:false, reason} — die Seite bietet dann einen Mail-Link an.
 */
import { logLead, markLeadDelivery } from '../_lib/kilog.js';

const MAX_BODY = 32 * 1024;
const json = (obj, status) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json;charset=utf-8', 'Cache-Control': 'no-store' }
});
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  let d;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return json({ ok: false, reason: 'payload-too-large' }, 413);
    d = JSON.parse(raw);
  } catch { return json({ ok: false, reason: 'bad-json' }, 400); }
  if (!d || typeof d !== 'object') return json({ ok: false, reason: 'bad-payload' }, 400);

  /* Honeypot: Bots füllen das versteckte Feld aus */
  if (d.website) return json({ ok: true }, 200);

  const c = {
    firma: str(d.firma, 120), name: str(d.name, 120), mail: str(d.mail, 160),
    tel: str(d.tel, 40), msg: str(d.msg, 1000), total: Number(d.total) || 0
  };
  if (!c.firma || !c.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.mail)) return json({ ok: false, reason: 'fields' }, 400);
  const parts = (Array.isArray(d.parts) ? d.parts : []).slice(0, 5).map(p => ({
    t: str(p && p.t, 80),
    r: (Array.isArray(p && p.r) ? p.r : []).slice(0, 20).map(x => str(x, 700)).filter(Boolean)
  })).filter(p => p.t);
  if (!parts.length) return json({ ok: false, reason: 'empty' }, 400);

  const text = parts.map(p => p.t.toUpperCase() + '\n' + p.r.map(r => '- ' + r).join('\n')).join('\n\n');
  const leadId = await logLead(env, request, {
    source: 'weihnachtsservice', name: c.name, companyName: c.firma, email: c.mail, phone: c.tel, message: text
  }, 'weihnachtsservice');
  const mark = (ok, why) => { const p = markLeadDelivery(env, leadId, ok, why); if (ctx.waitUntil) ctx.waitUntil(p); };

  if (!env.RESEND_API_KEY) { mark(false, 'no-resend-key'); return json({ ok: false, reason: 'not-configured' }, 502); }

  const eur = n => n.toLocaleString('de-DE') + ' €';
  const row = (k, v) => v ? `<tr><td style="padding:5px 12px 5px 0;color:#4f5967;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:5px 0">${v}</td></tr>` : '';
  const telLink = c.tel ? `<a href="tel:${esc(c.tel.replace(/[^\d+]/g, ''))}">${esc(c.tel)}</a>` : '';
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1b2030;max-width:640px">
<p style="font-size:17px;margin:0 0 4px"><b>Neue Anfrage Weihnachtsservice</b></p>
<p style="color:#4f5967;margin:0 0 16px">${esc(new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }))} · Antworten geht direkt an den Kunden.</p>
<table style="border-collapse:collapse;margin-bottom:18px">
${row('Firma', '<b>' + esc(c.firma) + '</b>')}${row('Name', esc(c.name))}${row('E-Mail', `<a href="mailto:${esc(c.mail)}">${esc(c.mail)}</a>`)}${row('Telefon', telLink)}
${c.total ? row('Warenbudget', '<b>ca. ' + esc(eur(c.total)) + '</b>') : ''}
</table>
${parts.map(p => `<p style="margin:18px 0 6px;font-weight:bold;color:#0c0e1a;border-bottom:2px solid #ffbd59;padding-bottom:4px">${esc(p.t)}</p>
<ul style="margin:0;padding-left:18px">${p.r.map(r => `<li style="margin:3px 0">${/über 50-€-Grenze/.test(r) ? '<b style="color:#c0392b">' + esc(r) + '</b>' : esc(r)}</li>`).join('')}</ul>`).join('')}
${c.msg ? `<p style="margin:18px 0 6px;font-weight:bold">Nachricht</p><p style="margin:0;white-space:pre-wrap">${esc(c.msg)}</p>` : ''}
</div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.MAIL_FROM || 'Lokalbesucher <bestellung@lokalisto.de>',
        to: [env.MAIL_TO || 'info@lokalbesucher.de'],
        reply_to: c.mail,
        subject: `Weihnachtsservice: ${c.firma}${c.total ? ' · ca. ' + eur(c.total) : ''}`,
        html,
        text: `Neue Anfrage Weihnachtsservice\n\n${c.firma}\n${c.name}\n${c.mail}\n${c.tel}\n\n${text}${c.total ? '\n\nWarenbudget: ca. ' + eur(c.total) : ''}${c.msg ? '\n\nNachricht:\n' + c.msg : ''}`
      })
    });
    if (!r.ok) { const t = await r.text(); console.log('resend', r.status, t.slice(0, 200)); mark(false, 'resend-' + r.status); return json({ ok: false, reason: 'mail' }, 502); }
  } catch (e) { mark(false, 'network'); return json({ ok: false, reason: 'network' }, 502); }
  mark(true);
  return json({ ok: true }, 200);
}
