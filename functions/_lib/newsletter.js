/**
 * Gemeinsames fuer den Newsletter (Double-Opt-in): Einwilligungstext, Mailversand per Resend, Seitenrahmen.
 * Anmeldung: functions/api/newsletter.js · Bestaetigen: functions/newsletter/bestaetigen.js · Abmelden: functions/newsletter/abmelden.js
 * Tabelle newsletter in KI_DB (migrations/0002_newsletter.sql). Secret RESEND_API_KEY, optional Var NEWSLETTER_FROM.
 */
export const SITE = 'https://lokalbesucher.de';
/* Derselbe Wortlaut steht unter jedem Anmeldeformular (newsletter/index.html, scripts/generate-news.js) – bei Änderung alle anpassen */
export const EINWILLIGUNG = 'Ja, ich möchte die Lokalbesucher-News per E-Mail erhalten: Änderungen bei Google, KI-Suche, Meta und Co. für lokale Betriebe, in der Regel einmal pro Woche. Abmeldung jederzeit über den Link in jeder Mail.';
export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const token = () => [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, '0')).join('');
export const MAIL_RE = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,180}\.[a-z]{2,24}$/i;

export async function sendMail(env, { to, subject, html, text, headers }) {
  if (!env.RESEND_API_KEY) return { ok: false, why: 'no-resend-key' };
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.NEWSLETTER_FROM || 'Lokalbesucher News <news@send.lokalbesucher.de>', reply_to: 'info@lokalbesucher.de', to: [to], subject, html, text, headers })
    });
    return r.ok ? { ok: true } : { ok: false, why: 'resend-' + r.status + ' ' + (await r.text()).slice(0, 200) };
  } catch (e) { return { ok: false, why: String((e && e.message) || e).slice(0, 200) }; }
}

/* schlichte, nicht indexierte Seite im Website-Design (Bestätigen, Abmelden) */
export function seite(titel, inhalt, status = 200) {
  return new Response(`<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titel)} | Lokalbesucher</title><meta name="robots" content="noindex, nofollow">
<style>
:root{--bg:#0c0e1a;--surface:#111328;--border:#1e2240;--yellow:#ffbd59;--text:#e8eaf6;--muted:#9aa0c3}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 Arial,Helvetica,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px}
.box{max-width:520px;width:100%;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:32px 28px}
h1{font:700 1.5rem/1.25 Arial,Helvetica,sans-serif;margin:0 0 12px}p{margin:0 0 14px}
.btn{display:inline-block;background:var(--yellow);color:#0c0e1a;font:700 1rem Arial,Helvetica,sans-serif;border:0;border-radius:10px;padding:14px 22px;cursor:pointer;text-decoration:none}
.btn:focus-visible,a:focus-visible{outline:3px solid #fff;outline-offset:3px}a{color:var(--yellow)}form{margin:18px 0 6px}
.logo{display:block;margin:0 0 22px;color:var(--text);text-decoration:none;font-weight:700;letter-spacing:.04em}
</style></head><body><main class="box"><a class="logo" href="/">LOKALBESUCHER</a>${inhalt}</main></body></html>`,
  { status, headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
}
