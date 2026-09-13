/**
 * GET /ki-sichtbarkeits-check/admin — interne Uebersicht (Tobias).
 *
 * Zeigt, was der oeffentliche KI-Check und alle Website-Formulare wirklich
 * erzeugt haben: Kennzahlen, die letzten 200 Checks, die letzten 200 Anfragen,
 * CSV-Export. Daten kommen aus D1 (Binding KI_DB), gefuellt von
 * functions/api/ai-check.js und functions/api/lead.js.
 *
 * Zugang: HTTP Basic Auth. Nutzername beliebig, Passwort = Secret
 * KI_ADMIN_PASSWORD (Pages → Einstellungen → Variablen und Geheimnisse).
 * Ohne gesetztes Secret bleibt die Seite geschlossen (fail-closed).
 *
 *   ?tab=checks | leads        Ansicht (Standard: leads)
 *   ?export=checks | leads     CSV-Download (alle Zeilen, neueste zuerst)
 */

const MAX_ROWS = 200;

const esc = (v) => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function deny() {
  return new Response('Zugang nur mit Passwort.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Lokalbesucher KI-Check", charset="UTF-8"',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

/* Vergleich in konstanter Zeit — kein Timing-Leak auf das Passwort. */
function safeEqual(a, b) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function authorized(request, env) {
  if (!env.KI_ADMIN_PASSWORD) return false;
  const h = request.headers.get('Authorization') || '';
  if (!h.startsWith('Basic ')) return false;
  let decoded = '';
  try { decoded = atob(h.slice(6)); } catch { return false; }
  const idx = decoded.indexOf(':');
  const pw = idx >= 0 ? decoded.slice(idx + 1) : decoded;
  return safeEqual(pw, env.KI_ADMIN_PASSWORD);
}

/* Berliner Zeit, kurz: 12.09.26 18:42 */
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso.endsWith('Z') ? iso : iso + 'Z');
  if (isNaN(d)) return esc(iso);
  return d.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function csv(rows, columns) {
  const cell = (v) => {
    const s = String(v == null ? '' : v);
    return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [columns.join(';')];
  for (const r of rows) lines.push(columns.map(c => cell(r[c])).join(';'));
  /* BOM, damit Excel Umlaute richtig liest; Semikolon = deutsches Excel */
  return '﻿' + lines.join('\r\n');
}

const CHECK_COLS = ['id', 'created_at', 'status', 'cached', 'company', 'city', 'industry', 'website', 'score',
  'chatgpt', 'claude', 'gemini', 'competitor_sources', 'engine_errors', 'country', 'referer'];
const LEAD_COLS = ['id', 'created_at', 'source', 'name', 'phone', 'email', 'company', 'website', 'branche',
  'ki_score', 'delivered', 'delivery_target', 'delivery_reason', 'page', 'country'];

async function stats(db) {
  const q = (sql) => db.prepare(sql).first();
  const [c, l] = await Promise.all([
    q(`SELECT
         COUNT(*)                                                        AS total,
         SUM(status = 'ok')                                              AS ok,
         SUM(status = 'ok' AND cached = 0)                               AS paid,
         SUM(status = 'ok' AND created_at >= datetime('now','-7 days'))  AS ok7,
         SUM(status = 'ok' AND created_at >= datetime('now','-30 days')) AS ok30,
         SUM(status IN ('ip-limit','daily-budget'))                      AS limited,
         SUM(status = 'turnstile')                                       AS bots,
         ROUND(AVG(CASE WHEN status = 'ok' THEN score END))              AS avg_score,
         MIN(created_at)                                                 AS first
       FROM checks`),
    q(`SELECT
         COUNT(*)                                                    AS total,
         SUM(source = 'ki-check')                                    AS ki,
         SUM(created_at >= datetime('now','-7 days'))                AS d7,
         SUM(created_at >= datetime('now','-30 days'))               AS d30,
         SUM(delivered = 0)                                          AS undelivered,
         MIN(created_at)                                             AS first
       FROM leads`),
  ]);
  return { c: c || {}, l: l || {} };
}

function page({ tab, s, rows, bySource }) {
  const n = (v) => (v == null ? 0 : v);
  const tile = (label, value, hint) =>
    `<div class="tile"><div class="v">${esc(value)}</div><div class="l">${esc(label)}</div>${hint ? `<div class="h">${esc(hint)}</div>` : ''}</div>`;

  const checkRows = rows.map(r => `<tr>
    <td>${fmtDate(r.created_at)}</td>
    <td><span class="tag t-${esc(r.status)}">${esc(r.status)}${r.cached ? ' · cache' : ''}</span></td>
    <td>${esc(r.company)}</td><td>${esc(r.city)}</td><td>${esc(r.industry)}</td>
    <td>${r.website ? `<a href="https://${esc(r.website.replace(/^https?:\/\//, ''))}" target="_blank" rel="noopener noreferrer">${esc(r.website)}</a>` : ''}</td>
    <td class="num">${r.score == null ? '–' : esc(r.score)}</td>
    <td>${esc(r.chatgpt || '')}</td><td>${esc(r.claude || '')}</td><td>${esc(r.gemini || '')}</td>
    <td class="small">${esc((() => { try { return (JSON.parse(r.competitor_sources || '[]')).join(', '); } catch { return ''; } })())}</td>
    <td>${esc(r.country || '')}</td>
  </tr>`).join('');

  const leadRows = rows.map(r => `<tr>
    <td>${fmtDate(r.created_at)}</td>
    <td><span class="tag">${esc(r.source)}</span></td>
    <td>${esc(r.name)}</td>
    <td>${r.phone ? `<a href="tel:${esc(String(r.phone).replace(/\s/g, ''))}">${esc(r.phone)}</a>` : ''}</td>
    <td>${r.email ? `<a href="mailto:${esc(r.email)}">${esc(r.email)}</a>` : ''}</td>
    <td>${esc(r.company)}</td>
    <td class="num">${r.ki_score == null ? '' : esc(r.ki_score)}</td>
    <td>${r.delivered ? '<span class="ok">✓ CRM</span>' : `<span class="bad">✗ ${esc(r.delivery_reason || 'offen')}</span>`}</td>
    <td class="small">${esc((r.page || '').replace('https://lokalbesucher.de', ''))}</td>
  </tr>`).join('');

  const empty = `<tr><td colspan="12" class="empty">Noch keine Einträge. Sobald jemand den Check nutzt oder ein Formular absendet, steht es hier.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>KI-Check Protokoll | Lokalbesucher intern</title>
<style>
  :root{--bg:#0c0e1a;--surface:#111328;--surface2:#181b35;--border:#1e2240;--yellow:#ffbd59;--green:#3ecf8e;--red:#ff5c5c;--text:#e8eaf6;--muted:#6b7099}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 Arial,Helvetica,sans-serif;padding:24px 16px}
  h1{font-size:1.4rem;margin:0 0 4px}
  .sub{color:var(--muted);font-size:.9rem;margin-bottom:20px}
  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:24px}
  .tile{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 16px}
  .tile .v{font-size:1.7rem;font-weight:bold;color:var(--yellow)}
  .tile .l{font-size:.85rem;color:var(--text)}
  .tile .h{font-size:.75rem;color:var(--muted)}
  .bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px}
  .btn{display:inline-block;padding:8px 14px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text);text-decoration:none;font-weight:bold;font-size:.9rem}
  .btn.active{background:var(--yellow);color:#0c0e1a;border-color:var(--yellow)}
  .btn.export{margin-left:auto}
  .wrap{overflow-x:auto;background:var(--surface);border:1px solid var(--border);border-radius:16px}
  table{border-collapse:collapse;width:100%;min-width:900px;font-size:.85rem}
  th,td{padding:8px 10px;text-align:left;border-bottom:1px solid var(--border);vertical-align:top}
  th{color:var(--muted);font-weight:normal;white-space:nowrap;position:sticky;top:0;background:var(--surface)}
  td.num{text-align:right;font-variant-numeric:tabular-nums}
  td.small{font-size:.78rem;color:var(--muted);max-width:260px;word-break:break-all}
  td.empty{text-align:center;color:var(--muted);padding:32px}
  a{color:var(--yellow)}
  .tag{display:inline-block;padding:2px 8px;border-radius:999px;background:var(--surface2);border:1px solid var(--border);font-size:.78rem;white-space:nowrap}
  .t-ok{border-color:var(--green);color:var(--green)}
  .t-turnstile,.t-engines-down{border-color:var(--red);color:var(--red)}
  .t-ip-limit,.t-daily-budget{border-color:var(--yellow);color:var(--yellow)}
  .ok{color:var(--green)} .bad{color:var(--red)}
  .src{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 20px;padding:0;list-style:none;font-size:.85rem}
  .src li{background:var(--surface2);border:1px solid var(--border);border-radius:999px;padding:3px 10px}
  .src b{color:var(--yellow)}
  .foot{color:var(--muted);font-size:.8rem;margin-top:20px}
</style>
</head>
<body>
<h1>KI-Check &amp; Anfragen — Protokoll</h1>
<div class="sub">Interne Übersicht · Zeiten in Berliner Zeit · Quelle: Cloudflare D1 „lokalbesucher-ki-check"${s.c.first ? ` · Aufzeichnung seit ${fmtDate(s.c.first < (s.l.first || '9') ? s.c.first : s.l.first)}` : ''}</div>

<div class="tiles">
  ${tile('Checks gesamt', n(s.c.ok), `${n(s.c.paid)} davon mit API-Kosten, ${n(s.c.ok) - n(s.c.paid)} aus Cache`)}
  ${tile('Checks letzte 7 Tage', n(s.c.ok7), `${n(s.c.ok30)} in 30 Tagen`)}
  ${tile('Ø Score', s.c.avg_score == null ? '–' : s.c.avg_score, 'von 100, nur erfolgreiche Checks')}
  ${tile('Abgewiesen', n(s.c.limited) + n(s.c.bots), `${n(s.c.limited)} Limit · ${n(s.c.bots)} Turnstile`)}
  ${tile('Anfragen gesamt', n(s.l.total), `${n(s.l.ki)} aus dem KI-Check`)}
  ${tile('Anfragen letzte 7 Tage', n(s.l.d7), `${n(s.l.d30)} in 30 Tagen`)}
  ${tile('Nicht im CRM angekommen', n(s.l.undelivered), n(s.l.undelivered) ? 'bitte manuell nachfassen' : 'alles zugestellt')}
</div>

${bySource.length ? `<ul class="src">${bySource.map(r => `<li>${esc(r.source)}: <b>${esc(r.n)}</b></li>`).join('')}</ul>` : ''}

<div class="bar">
  <a class="btn ${tab === 'leads' ? 'active' : ''}" href="?tab=leads">Anfragen</a>
  <a class="btn ${tab === 'checks' ? 'active' : ''}" href="?tab=checks">Checks</a>
  <a class="btn export" href="?export=${tab}">CSV herunterladen (${tab === 'leads' ? 'Anfragen' : 'Checks'})</a>
</div>

<div class="wrap">
${tab === 'checks' ? `
<table>
  <thead><tr><th>Zeit</th><th>Status</th><th>Unternehmen</th><th>Stadt</th><th>Branche</th><th>Website</th><th>Score</th><th>ChatGPT</th><th>Claude</th><th>Gemini</th><th>Wettbewerber-Quellen</th><th>Land</th></tr></thead>
  <tbody>${checkRows || empty}</tbody>
</table>` : `
<table>
  <thead><tr><th>Zeit</th><th>Quelle</th><th>Name</th><th>Telefon</th><th>E-Mail</th><th>Unternehmen</th><th>KI-Score</th><th>Zustellung</th><th>Seite</th></tr></thead>
  <tbody>${leadRows || empty}</tbody>
</table>`}
</div>

<div class="foot">Es werden die neuesten ${MAX_ROWS} Zeilen angezeigt; der CSV-Export enthält alles. „cache" = Ergebnis kam aus dem 7-Tage-Cache und hat nichts gekostet. Zustellung „✗" = der CRM-Webhook (GoHighLevel/Zapier) hat nicht mit 2xx geantwortet — die Anfrage ist trotzdem hier gesichert.</div>
</body>
</html>`;
}

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) return deny();
  if (!env.KI_DB) {
    return new Response('KI_DB-Binding fehlt (wrangler.toml).', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
  const url = new URL(request.url);
  const exp = url.searchParams.get('export');
  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };

  try {
    if (exp === 'checks' || exp === 'leads') {
      const cols = exp === 'checks' ? CHECK_COLS : LEAD_COLS;
      const { results } = await env.KI_DB.prepare(`SELECT ${cols.join(', ')} FROM ${exp} ORDER BY id DESC`).all();
      const stamp = new Date().toISOString().slice(0, 10);
      return new Response(csv(results || [], cols), {
        headers: { ...headers, 'Content-Type': 'text/csv;charset=utf-8', 'Content-Disposition': `attachment; filename="lokalbesucher-${exp}-${stamp}.csv"` },
      });
    }

    const tab = url.searchParams.get('tab') === 'checks' ? 'checks' : 'leads';
    const [s, list, src] = await Promise.all([
      stats(env.KI_DB),
      env.KI_DB.prepare(`SELECT ${(tab === 'checks' ? CHECK_COLS : LEAD_COLS).join(', ')} FROM ${tab} ORDER BY id DESC LIMIT ${MAX_ROWS}`).all(),
      env.KI_DB.prepare('SELECT source, COUNT(*) AS n FROM leads GROUP BY source ORDER BY n DESC').all(),
    ]);
    return new Response(page({ tab, s, rows: list.results || [], bySource: src.results || [] }), {
      headers: { ...headers, 'Content-Type': 'text/html;charset=utf-8' },
    });
  } catch (e) {
    /* Typischer Fall: Migration noch nicht ausgefuehrt → Tabellen fehlen */
    return new Response('Datenbankfehler: ' + esc(e && e.message) +
      '\n\nMigration ausfuehren: npx wrangler d1 execute lokalbesucher-ki-check --remote --file=migrations/0001_ki_check_log.sql',
      { status: 500, headers: { ...headers, 'Content-Type': 'text/plain;charset=utf-8' } });
  }
}
