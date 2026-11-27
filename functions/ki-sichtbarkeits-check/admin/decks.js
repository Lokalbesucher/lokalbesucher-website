/**
 * /ki-sichtbarkeits-check/admin/decks — interne Auswertung der persönlichen Präsentationen (/p/<slug>/).
 * Zugang: Menüpunkt „Pitch-Decks“ im zentralen Admin (SSO-Ziel „decks“, eigenes Cookie lb_deck_sso, 24 h) oder Basic Auth
 * mit KI_ADMIN_PASSWORD. Das Cookie der Protokollseite (Ziel „ki“) reicht hier bewusst nicht: Die Auswertung ist Chefsache,
 * wer sie sieht, regelt das Recht „Pitch-Decks“ im Admin.
 *
 *   GET  ?deck=<slug>            Besuche einer Präsentation      ?besuch=<id>  Sekunden je Seite
 *   POST (Formular)              persönlichen Link anlegen, auf Wunsch gleich per Mail verschicken
 * Liste der Präsentationen: /p-daten/liste.json (schreibt lokalbesucher-tools/decks/veroeffentlichen.mjs).
 */
import { deny, authorized, ssoVerify, ssoSign } from '../admin.js';
import { SITE, MAIL_RE, esc, token, jetzt, spaeter, slugOk, db, deck, mail, mailRahmen, knopf, einladungenUebernehmen } from '../../_lib/decks.js';

const kopf = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Content-Type': 'text/html;charset=utf-8' };
const text = (s, n) => String(s == null ? '' : s).trim().slice(0, n);
const zeit = (iso) => { if (!iso) return ''; const d = new Date(iso.replace(' ', 'T') + 'Z'); return isNaN(d) ? esc(iso) : d.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }); };
const dauer = (s) => { s = Math.round(s || 0); return s >= 60 ? `${Math.floor(s / 60)} Min ${String(s % 60).padStart(2, '0')} Sek` : `${s} Sek`; };

async function zugang(request, env) {
  if (env.SSO_SECRET) {
    const url = new URL(request.url), t = url.searchParams.get('sso');
    if (t) {
      const d = await ssoVerify(env.SSO_SECRET, t);
      if (d && d.aud === 'decks') {
        const v = await ssoSign(env.SSO_SECRET, { aud: 'decks', email: d.email, exp: Date.now() + 24 * 3600 * 1000 });
        url.searchParams.delete('sso');
        return new Response(null, { status: 302, headers: { Location: url.pathname + url.search, 'Set-Cookie': `lb_deck_sso=${v}; Path=/ki-sichtbarkeits-check/admin/decks; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`, 'Cache-Control': 'no-store' } });
      }
    } else {
      const m = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)lb_deck_sso=([^;]+)/);
      const d = m ? await ssoVerify(env.SSO_SECRET, decodeURIComponent(m[1])) : null;
      if (d && d.aud === 'decks') return null;
    }
  }
  return authorized(request, env) ? null : deny();
}

async function liste(env, request) {
  const r = await env.ASSETS.fetch(new URL('/p-daten/liste.json', request.url)).catch(() => null);
  let slugs = []; try { slugs = r && r.ok ? await r.json() : []; } catch { slugs = []; }
  const aus = [];
  for (const slug of slugs.filter(slugOk)) { const d = await deck(env, request, slug); if (d) aus.push({ slug, titel: d.meta.titel || slug, kunde: d.meta.kunde || '' }); }
  return aus;
}

function rahmen(inhalt) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow">
<title>Präsentationen | Lokalbesucher intern</title><style>
:root{--bg:#0c0e1a;--surface:#111328;--surface2:#181b35;--border:#1e2240;--yellow:#ffbd59;--green:#3ecf8e;--text:#e8eaf6;--muted:#8d93b8}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 Arial,Helvetica,sans-serif;padding:24px 16px;max-width:1180px;margin:0 auto}
h1{font-size:1.4rem;margin:0 0 4px}h2{font-size:1.05rem;margin:28px 0 10px}.sub{color:var(--muted);font-size:.9rem;margin-bottom:20px}a{color:var(--yellow)}
.bar{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 20px}.btn{display:inline-block;padding:9px 14px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text);text-decoration:none;font-weight:bold;font-size:.9rem;cursor:pointer;font-family:inherit}
.btn.active,.btn.gelb{background:var(--yellow);color:#0c0e1a;border-color:var(--yellow)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:8px}.tile{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 16px}.tile .v{font-size:1.7rem;font-weight:bold;color:var(--yellow)}.tile .l{font-size:.85rem}
.wrap{overflow-x:auto;background:var(--surface);border:1px solid var(--border);border-radius:16px}table{border-collapse:collapse;width:100%;font-size:.88rem}th,td{padding:9px 11px;text-align:left;border-bottom:1px solid var(--border);vertical-align:top}th{color:var(--muted);font-weight:normal;white-space:nowrap}tr:last-child td{border-bottom:0}
td.leer{text-align:center;color:var(--muted);padding:28px}.tag{display:inline-block;padding:2px 8px;border-radius:999px;background:var(--surface2);border:1px solid var(--border);font-size:.78rem;white-space:nowrap}.tag.g{border-color:var(--green);color:var(--green)}
.balken{height:10px;border-radius:5px;background:var(--yellow);min-width:2px}.preis td{background:rgba(255,189,89,.08)}
form.neu{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:18px;display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}form.neu label{display:block;font-size:.82rem;color:var(--muted);margin-bottom:4px}
form.neu input[type=text],form.neu input[type=email],form.neu textarea{width:100%;font:inherit;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text)}form.neu textarea{min-height:110px}form.neu .breit{grid-column:1/-1}
input:focus-visible,textarea:focus-visible,.btn:focus-visible,a:focus-visible{outline:3px solid #fff;outline-offset:2px}
.link{font-family:monospace;font-size:.78rem;word-break:break-all;color:var(--muted)}.ok{background:rgba(62,207,142,.12);border:1px solid var(--green);border-radius:12px;padding:12px 14px;margin:0 0 16px}.bad{background:rgba(255,92,92,.12);border:1px solid #ff5c5c;border-radius:12px;padding:12px 14px;margin:0 0 16px}
</style></head><body><h1>Präsentationen</h1><div class="sub">Wer hat welche Präsentation geöffnet, wie lange, bis wohin · Zeiten in Berliner Zeit · <a href="/admin/">zurück ins Admin</a></div>${inhalt}
<script>document.addEventListener('click',function(e){var b=e.target.closest('[data-kopie]');if(!b)return;navigator.clipboard.writeText(b.getAttribute('data-kopie')).then(function(){b.textContent='Kopiert';setTimeout(function(){b.textContent='Link kopieren'},1500)})})</script></body></html>`;
}

async function ansicht(env, request, url, meldung = '') {
  const d = await db(env);
  /* Aufräumen: Besuche 12 Monate nach dem Besuch löschen (so steht es in der Datenschutzerklärung), Abgelaufenes nach 30 Tagen */
  await d.batch([
    d.prepare("DELETE FROM deck_slidezeit WHERE besuch IN (SELECT id FROM deck_besuche WHERE started_at < datetime('now','-12 months'))"),
    d.prepare("DELETE FROM deck_besuche WHERE started_at < datetime('now','-12 months')"),
    d.prepare("DELETE FROM deck_sessions WHERE expires_at < datetime('now','-30 days')"),
    d.prepare("DELETE FROM deck_logins WHERE expires_at < datetime('now','-30 days')"),
    d.prepare("DELETE FROM deck_einladungen WHERE expires_at < datetime('now','-12 months')"),
  ]);
  const decks = await liste(env, request);
  if (!decks.length) return rahmen(`${meldung}<div class="wrap"><table><tr><td class="leer">Noch keine Präsentation veröffentlicht.</td></tr></table></div>`);
  const slug = decks.some((x) => x.slug === url.searchParams.get('deck')) ? url.searchParams.get('deck') : decks[0].slug;
  const akt = decks.find((x) => x.slug === slug);
  await einladungenUebernehmen(env, slug, await deck(env, request, slug));
  const nav = `<div class="bar">${decks.map((x) => `<a class="btn ${x.slug === slug ? 'active' : ''}" href="?deck=${esc(x.slug)}">${esc(x.titel)}</a>`).join('')}</div>`;

  const bid = url.searchParams.get('besuch');
  if (bid) {
    const b = await d.prepare('SELECT * FROM deck_besuche WHERE id = ? AND slug = ?').bind(bid, slug).first();
    if (b) {
      const { results: sl } = await d.prepare('SELECT slide, titel, preis, sekunden FROM deck_slidezeit WHERE besuch = ? ORDER BY slide').bind(bid).all();
      const mx = Math.max(1, ...sl.map((x) => x.sekunden));
      return rahmen(`${nav}<p><a href="?deck=${esc(slug)}">← alle Besuche</a></p><h2>${esc(b.name)} · ${zeit(b.started_at)}</h2>
<div class="sub">${[b.email, b.geraet, b.stadt].filter(Boolean).map(esc).join(' · ')} · gesamt ${dauer(b.sekunden)} · bis Seite ${b.max_slide} von ${b.slides_total || '?'}</div>
<div class="wrap"><table><thead><tr><th>Seite</th><th>Inhalt</th><th>Zeit</th><th style="width:40%"></th></tr></thead><tbody>${sl.map((x) => `<tr class="${x.preis ? 'preis' : ''}"><td>${x.slide}</td><td>${esc(x.titel)}${x.preis ? ' <span class="tag">Preis</span>' : ''}</td><td style="white-space:nowrap">${dauer(x.sekunden)}</td><td><div class="balken" style="width:${Math.round(x.sekunden / mx * 100)}%"></div></td></tr>`).join('') || '<tr><td class="leer" colspan="4">Noch keine Zeiten übermittelt.</td></tr>'}</tbody></table></div>`);
    }
  }

  const [k, bes, einl, top] = await Promise.all([
    d.prepare('SELECT COUNT(*) AS besuche, COUNT(DISTINCT email) AS personen, SUM(sekunden) AS sek, MAX(started_at) AS zuletzt FROM deck_besuche WHERE slug = ?').bind(slug).first(),
    d.prepare('SELECT id, name, email, quelle, started_at, sekunden, max_slide, slides_total, geraet, stadt FROM deck_besuche WHERE slug = ? ORDER BY started_at DESC LIMIT 200').bind(slug).all(),
    d.prepare('SELECT token, name, email, firma, created_at, expires_at, geraete, gemailt FROM deck_einladungen WHERE slug = ? ORDER BY created_at DESC LIMIT 200').bind(slug).all(),
    d.prepare('SELECT z.slide, MAX(z.titel) AS titel, MAX(z.preis) AS preis, SUM(z.sekunden) AS sek, COUNT(DISTINCT b.email) AS personen FROM deck_slidezeit z JOIN deck_besuche b ON b.id = z.besuch WHERE b.slug = ? GROUP BY z.slide ORDER BY sek DESC LIMIT 5').bind(slug).all(),
  ]);
  const tile = (l, v) => `<div class="tile"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`;
  return rahmen(`${meldung}${nav}
<div class="tiles">${tile('Personen', k.personen || 0)}${tile('Besuche', k.besuche || 0)}${tile('Lesezeit gesamt', dauer(k.sek))}${tile('Zuletzt geöffnet', k.zuletzt ? zeit(k.zuletzt) : '–')}</div>
${top.results.length ? `<h2>Hier bleiben die Leute am längsten</h2><div class="wrap"><table><tbody>${top.results.map((x) => `<tr class="${x.preis ? 'preis' : ''}"><td>Seite ${x.slide}</td><td>${esc(x.titel)}</td><td style="white-space:nowrap">${dauer(x.sek)}</td><td>${x.personen} ${x.personen === 1 ? 'Person' : 'Personen'}</td></tr>`).join('')}</tbody></table></div>` : ''}
<h2>Besuche</h2><div class="wrap"><table><thead><tr><th>Wann</th><th>Wer</th><th>Zugang</th><th>Dauer</th><th>Bis Seite</th><th>Gerät</th><th>Ort</th><th></th></tr></thead><tbody>
${bes.results.map((b) => `<tr><td style="white-space:nowrap">${zeit(b.started_at)}</td><td><strong>${esc(b.name)}</strong><br>${b.email === 'passwort' ? '' : `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>`}</td><td><span class="tag ${b.quelle === 'einladung' ? 'g' : ''}">${b.quelle === 'einladung' ? 'persönlicher Link' : String(b.quelle).startsWith('passwort') ? 'Passwort' : 'Formular'}</span></td><td style="white-space:nowrap">${dauer(b.sekunden)}</td><td>${b.max_slide || '–'}${b.slides_total ? ' von ' + b.slides_total : ''}</td><td>${esc(b.geraet || '')}</td><td>${esc(b.stadt || '')}</td><td><a href="?deck=${esc(slug)}&amp;besuch=${esc(b.id)}">Seiten</a></td></tr>`).join('') || '<tr><td class="leer" colspan="8">Noch niemand hat diese Präsentation geöffnet.</td></tr>'}
</tbody></table></div>
<h2>Persönlichen Link anlegen</h2>
<form class="neu" method="post" action="?deck=${esc(slug)}"><input type="hidden" name="slug" value="${esc(slug)}">
<div><label for="n">Name</label><input id="n" type="text" name="name" required maxlength="80"></div>
<div><label for="f">Firma</label><input id="f" type="text" name="firma" maxlength="80" value="${esc(akt.kunde)}"></div>
<div><label for="e">E-Mail</label><input id="e" type="email" name="email" maxlength="200"></div>
<div class="breit"><label for="b">Betreff der Mail</label><input id="b" type="text" name="betreff" maxlength="120" value="${esc(akt.titel)}"></div>
<div class="breit"><label for="t">Text der Mail (der Knopf zur Präsentation kommt automatisch darunter)</label><textarea id="t" name="nachricht" maxlength="2000">Hallo,

wie besprochen: Hier ist die Präsentation. Der Link ist persönlich und öffnet sofort.

Viele Grüße
Tobias Frank</textarea></div>
<div class="breit bar" style="margin:0"><button class="btn" name="art" value="link">Nur Link anlegen</button><button class="btn gelb" name="art" value="mail">Link anlegen und per Mail schicken</button></div></form>
<h2>Persönliche Links</h2><div class="wrap"><table><thead><tr><th>Angelegt</th><th>Für</th><th>Gültig bis</th><th>Geöffnet auf</th><th>Link</th></tr></thead><tbody>
${einl.results.map((e) => { const l = `${SITE}/p/${slug}/?k=${e.token}`; return `<tr><td style="white-space:nowrap">${zeit(e.created_at)}${e.gemailt ? '<br><span class="tag g">gemailt</span>' : ''}</td><td><strong>${esc(e.name)}</strong>${e.firma ? ' · ' + esc(e.firma) : ''}<br>${esc(e.email)}</td><td style="white-space:nowrap">${zeit(e.expires_at)}</td><td>${e.geraete} ${e.geraete === 1 ? 'Gerät' : 'Geräten'}</td><td><button class="btn" type="button" data-kopie="${esc(l)}">Link kopieren</button><div class="link">${esc(l)}</div></td></tr>`; }).join('') || '<tr><td class="leer" colspan="5">Noch kein persönlicher Link angelegt.</td></tr>'}
</tbody></table></div>`);
}

export async function onRequestGet({ request, env }) {
  const z = await zugang(request, env); if (z) return z;
  try { return new Response(await ansicht(env, request, new URL(request.url)), { headers: kopf }); }
  catch (e) { return new Response('Fehler: ' + ((e && e.message) || e), { status: 500, headers: { ...kopf, 'Content-Type': 'text/plain;charset=utf-8' } }); }
}

export async function onRequestPost({ request, env }) {
  const z = await zugang(request, env); if (z) return z;
  const url = new URL(request.url);
  const o = request.headers.get('Origin');
  if (o && o !== url.origin) return new Response('Nicht erlaubt.', { status: 403, headers: kopf });
  try {
    const f = await request.formData();
    const slug = text(f.get('slug'), 80), name = text(f.get('name'), 80), firma = text(f.get('firma'), 80), email = text(f.get('email'), 200).toLowerCase();
    const perMail = f.get('art') === 'mail';
    const dk = slugOk(slug) ? await deck(env, request, slug) : null;
    let meldung;
    if (!dk || name.length < 2) meldung = '<p class="bad">Bitte einen Namen eintragen.</p>';
    else if (perMail && !MAIL_RE.test(email)) meldung = '<p class="bad">Zum Verschicken fehlt eine gültige E-Mail-Adresse. Es wurde nichts angelegt.</p>';
    else {
      const d = await db(env), tok = token(), link = `${SITE}/p/${slug}/?k=${tok}`;
      let gemailt = 0, hinweis = '';
      if (perMail) {
        const nachricht = text(f.get('nachricht'), 2000) || 'Hier ist die Präsentation.';
        const r = await mail(env, {
          to: email, subject: text(f.get('betreff'), 120) || dk.meta.titel || 'Präsentation',
          html: mailRahmen(nachricht.split(/\n{2,}/).map((a) => `<p>${esc(a).replace(/\n/g, '<br>')}</p>`).join('') + knopf(link, 'Präsentation öffnen')),
          text: `${nachricht}\n\nPräsentation öffnen: ${link}\n\nLokalbesucher GmbH · Karl-Breuing-Str. 2 · 45770 Marl`,
        });
        gemailt = r.ok ? 1 : 0;
        hinweis = r.ok ? ` und an ${esc(email)} geschickt` : `, aber die Mail ging nicht raus (${esc(r.why)}). Schick den Link bitte selbst`;
      }
      await d.prepare('INSERT INTO deck_einladungen (token, slug, name, email, firma, created_at, expires_at, gemailt) VALUES (?,?,?,?,?,?,?,?)')
        .bind(tok, slug, name, email, firma, jetzt(), spaeter(60 * 86400), gemailt).run();
      meldung = `<div class="ok">Link für <strong>${esc(name)}</strong> angelegt${hinweis}.<div class="link">${esc(link)}</div><p style="margin:8px 0 0"><button class="btn" type="button" data-kopie="${esc(link)}">Link kopieren</button></p></div>`;
    }
    return new Response(await ansicht(env, request, url, meldung), { headers: kopf });
  } catch (e) { return new Response('Fehler: ' + ((e && e.message) || e), { status: 500, headers: { ...kopf, 'Content-Type': 'text/plain;charset=utf-8' } }); }
}
