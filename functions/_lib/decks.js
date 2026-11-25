/**
 * Persönliche Präsentationen unter /p/<slug>/ – gemeinsame Bausteine.
 * Router: functions/p/[[path]].js · Übersicht: functions/ki-sichtbarkeits-check/admin/decks.js · Doku: CLAUDE.md §22.
 *
 * Inhalte: Jede Präsentation liegt VERSCHLÜSSELT unter /p-daten/<slug>/ in diesem (öffentlichen) Repo.
 * Entschlüsseln kann nur diese Function: Ihr privater Schlüssel liegt in KV (AI_CHECK_KV, Eintrag „deck:serverkey“),
 * der öffentliche unter /p/_schluessel. Verschlüsselt wird mit lokalbesucher-tools/decks/veroeffentlichen.mjs.
 * Protokoll: D1 KI_DB, Tabellen deck_* (migrations/0003_praesentationen.sql, werden bei Bedarf selbst angelegt).
 */
import { esc, token, sendMail as nlMail } from './newsletter.js';
export { esc, token };
export { MAIL_RE } from './newsletter.js';

export const SITE = 'https://lokalbesucher.de';
export const COOKIE = 'lb_deck';
const TAGE = 86400;
const te = new TextEncoder(), td = new TextDecoder();
const unb64 = (t) => Uint8Array.from(atob(t), (c) => c.charCodeAt(0));

export const kopf = (extra = {}) => ({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', ...extra });
export async function hash(s) {
  const b = await crypto.subtle.digest('SHA-256', te.encode(String(s)));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
export const jetzt = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
export const spaeter = (sek) => new Date(Date.now() + sek * 1000).toISOString().slice(0, 19).replace('T', ' ');
export const slugOk = (s) => /^[a-z0-9][a-z0-9-]{1,60}$/.test(s || '');

/* ── Datenbank ── */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS deck_einladungen (token TEXT PRIMARY KEY, slug TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', firma TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, expires_at TEXT NOT NULL, geraete INTEGER NOT NULL DEFAULT 0, gemailt INTEGER NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS deck_logins (token_hash TEXT PRIMARY KEY, slug TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, ip TEXT, created_at TEXT NOT NULL, expires_at TEXT NOT NULL, used_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS deck_sessions (id_hash TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, quelle TEXT NOT NULL, einladung TEXT, created_at TEXT NOT NULL, expires_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS deck_besuche (id TEXT PRIMARY KEY, slug TEXT NOT NULL, titel TEXT NOT NULL DEFAULT '', session TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, quelle TEXT NOT NULL, started_at TEXT NOT NULL, last_at TEXT NOT NULL, sekunden REAL NOT NULL DEFAULT 0, max_slide INTEGER NOT NULL DEFAULT 0, slides_total INTEGER NOT NULL DEFAULT 0, geraet TEXT, land TEXT, stadt TEXT, signal INTEGER NOT NULL DEFAULT 0)`,
  `CREATE INDEX IF NOT EXISTS deck_besuche_slug ON deck_besuche (slug, started_at)`,
  `CREATE TABLE IF NOT EXISTS deck_slidezeit (besuch TEXT NOT NULL, slide INTEGER NOT NULL, titel TEXT NOT NULL DEFAULT '', preis INTEGER NOT NULL DEFAULT 0, sekunden REAL NOT NULL DEFAULT 0, PRIMARY KEY (besuch, slide))`,
];
let schemaDa = false;
export async function db(env) {
  if (!env.KI_DB) throw new Error('KI_DB-Binding fehlt');
  if (!schemaDa) { await env.KI_DB.batch(SCHEMA.map((s) => env.KI_DB.prepare(s))); schemaDa = true; }
  return env.KI_DB;
}

/* ── Schlüssel der Function (ECDH P-256), einmal erzeugt, in KV ── */
let keyCache = null;
async function serverKey(env, anlegen) {
  if (keyCache) return keyCache;
  let jwk = await env.AI_CHECK_KV.get('deck:serverkey', 'json');
  if (!jwk) {
    if (!anlegen) return null;
    const p = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
    jwk = { priv: await crypto.subtle.exportKey('jwk', p.privateKey), pub: await crypto.subtle.exportKey('jwk', p.publicKey) };
    await env.AI_CHECK_KV.put('deck:serverkey', JSON.stringify(jwk));
  }
  keyCache = jwk;
  return jwk;
}
export async function oeffentlicherSchluessel(env) {
  const k = await serverKey(env, true);
  const { kty, crv, x, y } = k.pub;
  return { kty, crv, x, y, id: (await hash(x + y)).slice(0, 16) };
}

/* ── Verschlüsselte Präsentation laden ── */
const deckCache = new Map(); /* slug -> { bis, K, meta } */
async function gcm(key, buf) {
  const u = new Uint8Array(buf);
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(0, 12) }, key, u.slice(12));
}
export async function deck(env, request, slug) {
  const c = deckCache.get(slug);
  if (c && c.bis > Date.now()) return c;
  const r = await env.ASSETS.fetch(new URL(`/p-daten/${slug}/m.json`, request.url));
  if (!r.ok) return null;
  const sk = await serverKey(env, false);
  if (!sk) return null;
  try {
    const m = await r.json();
    const priv = await crypto.subtle.importKey('jwk', sk.priv, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits']);
    const epk = await crypto.subtle.importKey('jwk', m.epk, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
    const geheim = await crypto.subtle.deriveBits({ name: 'ECDH', public: epk }, priv, 256);
    const hk = await crypto.subtle.importKey('raw', geheim, 'HKDF', false, ['deriveKey']);
    const kw = await crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: te.encode('lokalbesucher-deck'), info: te.encode(slug) }, hk, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const K = await crypto.subtle.importKey('raw', await gcm(kw, unb64(m.wrap)), 'AES-GCM', false, ['decrypt']);
    const meta = JSON.parse(td.decode(await gcm(K, unb64(m.meta))));
    const e = { bis: Date.now() + 60000, K, meta };
    deckCache.set(slug, e);
    return e;
  } catch { return null; }
}
export async function datei(env, request, slug, d, pfad) {
  const f = d.meta.files[pfad];
  if (!f) return null;
  const r = await env.ASSETS.fetch(new URL(`/p-daten/${slug}/${f.f}.bin`, request.url));
  if (!r.ok) return null;
  return { ct: f.ct, body: await gcm(d.K, await r.arrayBuffer()) };
}

/* ── Sitzung ── */
export async function sitzung(env, request) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([a-f0-9]{48})'));
  if (!m) return null;
  const d = await db(env);
  const id = await hash(m[1]);
  const s = await d.prepare('SELECT id_hash, name, email, quelle FROM deck_sessions WHERE id_hash = ? AND expires_at > ?').bind(id, jetzt()).first();
  return s || null;
}
export async function sitzungAnlegen(env, { name, email, quelle, einladung }) {
  const d = await db(env);
  const roh = token();
  await d.prepare('INSERT INTO deck_sessions (id_hash, name, email, quelle, einladung, created_at, expires_at) VALUES (?,?,?,?,?,?,?)')
    .bind(await hash(roh), name, email, quelle, einladung || null, jetzt(), spaeter(30 * TAGE)).run();
  return `${COOKIE}=${roh}; Path=/p; Max-Age=${30 * TAGE}; HttpOnly; Secure; SameSite=Lax`;
}

/* ── Mail ── */
export function mail(env, { to, subject, html, text, replyTo }) {
  return nlMail({ ...env, NEWSLETTER_FROM: env.DECK_FROM || 'Lokalbesucher <praesentation@send.lokalbesucher.de>' }, { to, subject, html, text, headers: replyTo ? { 'Reply-To': replyTo } : undefined });
}
export const INTERN = (env) => env.DECK_MAIL_TO || env.MAIL_TO || 'info@lokalbesucher.de';
export function mailRahmen(inhalt) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#2a2f38;max-width:560px">${inhalt}<p style="margin:28px 0 0;font-size:13px;color:#8a93a3">Lokalbesucher GmbH · Karl-Breuing-Str. 2 · 45770 Marl</p></div>`;
}
export const knopf = (url, text) => `<p style="margin:24px 0"><a href="${esc(url)}" style="display:inline-block;background:#ffbd59;color:#142744;font-weight:bold;text-decoration:none;padding:14px 24px;border-radius:10px">${esc(text)}</a></p>`;

/* ── Seiten (Tür) ── */
/* Original-Pin aus der CI-Vorlage (nicht nachbauen). Lockup: Pin = 2 × Schriftgröße der Wortmarke, Claim = 0,5721 × Wortmarke. */
const PIN = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="600 140 2800 3640"><path fill="currentColor" d="M2000,151.71c-764.84,0-1384.87,620.03-1384.87,1384.87c0,20.56,0.48,41,1.36,61.34c-0.01,0-0.02-0.01-0.02-0.01s8.48,301.23,93.38,509.32c0,0.01,0.01,0.01,0.01,0.02c106.75,305.22,384.79,852.17,1108.82,1648.96c98.79,108.72,269.3,110.13,369.77,2.96c335.02-357.35,1013.67-1159.89,1168.33-1943.67c4.92-24.05,9.19-48.34,12.85-72.82c0.08-0.5,0.16-1.01,0.24-1.51c2.26-14.65,4.13-28.94,5.66-42.94c6.16-53.03,9.35-106.96,9.35-161.64C3384.87,771.74,2764.84,151.71,2000,151.71z M1350.69,1341.24c0-83.42,67.63-151.05,151.05-151.05c83.42,0,151.05,67.63,151.05,151.05s-67.63,151.05-151.05,151.05C1418.31,1492.29,1350.69,1424.66,1350.69,1341.24z M1948.89,2619.5c-188.88,0-362.58-64.97-499.99-173.77l57.86-82.84c120.14,85.96,267.31,136.56,426.31,136.56c269.03,0,504.22-144.85,631.85-360.81v0l95.13,54.61C2524.27,2446.93,2256.74,2619.5,1948.89,2619.5z M2746.89,1354.39c-190.8-102.85-318.99,0-318.99,0l-34.28-38.76c5.96-22.36,54.49-76.85,190.14-82.81c153.2-0.31,200.4,75.86,200.4,75.86L2746.89,1354.39z"/></svg>`;
const HINWEIS = `Diese Präsentation ist persönlich. Wir sehen, welche Seiten wie lange angesehen werden, um im Gespräch besser darauf einzugehen. Mehr dazu in der <a href="/datenschutz/#praesentationen">Datenschutzerklärung</a>.`;
export function tuer(inhalt, { status = 200, cookie } = {}) {
  const h = kopf({ 'Content-Type': 'text/html;charset=utf-8' });
  if (cookie) h['Set-Cookie'] = cookie;
  return new Response(`<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Persönliche Präsentation | Lokalbesucher</title><meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="Persönliche Präsentation"><meta property="og:site_name" content="Lokalbesucher">
<style>
*{box-sizing:border-box}html,body{margin:0}
body{background:#142744;color:#fff;font:17px/1.55 Arial,Helvetica,sans-serif;min-height:100vh;min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:28px 18px;border-top:5px solid #ffbd59}
main{width:100%;max-width:460px}
.lg{display:flex;align-items:center;gap:9px;margin:0 0 36px;color:#fff}.lg svg{height:44px;width:auto;flex:none}.lg .wm{display:block;font-weight:bold;font-size:22px;line-height:1;white-space:nowrap;color:#fff}.lg .cl{display:block;font-weight:bold;font-size:12.586px;line-height:1;color:#ffbd59;margin-top:3px;white-space:nowrap}
.kk{font-size:.78rem;letter-spacing:.2em;text-transform:uppercase;color:#ffbd59;font-weight:bold;margin:0 0 10px}
h1{font-size:2rem;line-height:1.12;margin:0 0 14px}
p{margin:0 0 16px;color:#d6deeb}
label{display:block;font-size:.9rem;font-weight:bold;margin:16px 0 6px;color:#fff}
input{width:100%;font:inherit;padding:14px 14px;border-radius:10px;border:1.5px solid #3b5380;background:#1e365c;color:#fff}
input:focus-visible{outline:3px solid #ffbd59;outline-offset:2px}
button,.btn{display:block;width:100%;margin:22px 0 0;background:#ffbd59;color:#142744;font:bold 1.05rem Arial,Helvetica,sans-serif;border:0;border-radius:10px;padding:16px 22px;cursor:pointer;text-align:center;text-decoration:none}
button:focus-visible,.btn:focus-visible,a:focus-visible{outline:3px solid #fff;outline-offset:3px}
.klein{font-size:.82rem;line-height:1.5;color:#aebbd2;margin:22px 0 0}.klein a{color:#ffbd59}
.fehler{background:#3a1f2a;border:1.5px solid #ff8f8f;color:#ffd9d9;border-radius:10px;padding:12px 14px;margin:0 0 6px;font-size:.95rem}
</style></head><body><main><div class="lg" role="img" aria-label="Lokalbesucher – einfach. lokal. erfolgreich.">${PIN}<div><span class="wm">Lokalbesucher</span><span class="cl">einfach. lokal. erfolgreich.</span></div></div>${inhalt}<p class="klein">${HINWEIS}</p></main></body></html>`, { status, headers: h });
}
export function formular(slug, { fehler = '', name = '', email = '' } = {}) {
  return `<p class="kk">Persönliche Präsentation</p><h1>Einmal kurz anmelden.</h1>
<p>Name und E-Mail eintragen. Der Link zur Präsentation kommt sofort per Mail, ein Passwort gibt es nicht.</p>
${fehler ? `<p class="fehler" role="alert">${esc(fehler)}</p>` : ''}
<form method="post" action="/p/_anmelden"><input type="hidden" name="slug" value="${esc(slug)}">
<label for="n">Name</label><input id="n" name="name" autocomplete="name" required maxlength="80" value="${esc(name)}">
<label for="e">E-Mail</label><input id="e" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="200" value="${esc(email)}">
<button type="submit">Link schicken</button></form>`;
}
/* Zwischenseite: Mail-Scanner rufen Links vorab auf – erst der POST löst den Link ein. */
export function einloesen(aktion, tok, text, knopfText) {
  return `<p class="kk">Persönliche Präsentation</p><h1>${text}</h1>
<form method="post" action="${esc(aktion)}" id="f"><input type="hidden" name="t" value="${esc(tok)}"><button type="submit">${esc(knopfText)}</button></form>
<script>document.getElementById('f').submit()</script>`;
}

export function geraet(ua) {
  ua = ua || '';
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'unbekannt';
  const art = /iPhone|Android.*Mobile/.test(ua) ? 'Handy' : /iPad|Android/.test(ua) ? 'Tablet' : 'Rechner';
  return `${art} (${os})`;
}

/* ── Messung: wird in jede Präsentation eingehängt, die Präsentation selbst muss nichts können ── */
export function messung(besuch) {
  return `<script>(function(){var B=${JSON.stringify(besuch)},S=[],akt=-1,seit=0,puf={},max=0,wahl=['[data-slide]','.sl','.slide','section'];
for(var i=0;i<wahl.length&&S.length<2;i++)S=[].slice.call(document.querySelectorAll(wahl[i]));
if(S.length<2)S=[document.body];
function titel(e){var a=e.getAttribute('data-titel');if(a)return a;var h=e.querySelector('h1,h2,h3')||e;return(h.innerText||h.textContent||'').replace(/\\s+/g,' ').trim().slice(0,90)}
function buchen(){if(akt<0||!seit)return;var s=(Date.now()-seit)/1000;seit=Date.now();if(s<=0)return;var p=puf[akt]||(puf[akt]={s:0,t:titel(S[akt]),p:S[akt].hasAttribute('data-preis')?1:0});p.s+=Math.min(s,120)}
function zeige(i){buchen();akt=i;seit=document.hidden?0:Date.now();if(i+1>max)max=i+1}
function senden(){buchen();var k=Object.keys(puf);if(!k.length)return;var d=JSON.stringify({b:B,n:S.length,m:max,s:puf});puf={};
try{if(!(navigator.sendBeacon&&navigator.sendBeacon('/p/_t',new Blob([d],{type:'text/plain'}))))fetch('/p/_t',{method:'POST',body:d,keepalive:true,credentials:'same-origin'})}catch(e){}}
if('IntersectionObserver' in window&&S.length>1){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.intersectionRatio>=.5)zeige(S.indexOf(e.target))})},{threshold:[.5]});S.forEach(function(e){io.observe(e)})}else zeige(0);
document.addEventListener('visibilitychange',function(){if(document.hidden){senden();seit=0}else seit=Date.now()});
addEventListener('pagehide',senden);setInterval(senden,8000)})()</script>`;
}
