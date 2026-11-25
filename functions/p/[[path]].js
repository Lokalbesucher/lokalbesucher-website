/**
 * /p/* – persönliche Präsentationen hinter einer Tür (Doku: CLAUDE.md §22, Bausteine: functions/_lib/decks.js).
 *
 *   GET  /p/<slug>/            Präsentation (mit Sitzung) oder Anmeldeformular (ohne)
 *   GET  /p/<slug>/?k=<Token>  persönlicher Link aus einer Einladung → Zwischenseite → POST /p/_k
 *   POST /p/_anmelden          Name + E-Mail → Login-Link per Mail (kein Passwort)
 *   GET  /p/_a?t=<Token>       Login-Link aus der Mail → Zwischenseite → POST /p/_a
 *   POST /p/_t                 Messung (Sekunden je Seite), nur mit Sitzung
 *   GET  /p/_schluessel        öffentlicher Schlüssel, mit dem Präsentationen verschlüsselt werden
 */
import {
  SITE, MAIL_RE, esc, token, hash, jetzt, spaeter, slugOk, kopf, db, deck, datei, sitzung, sitzungAnlegen,
  mail, mailRahmen, knopf, INTERN, tuer, formular, einloesen, geraet, messung, oeffentlicherSchluessel,
} from '../_lib/decks.js';

const MAX_GERAETE = 5;          /* so viele Browser darf ein persönlicher Link freischalten, danach gilt das Formular */
const SIGNAL_SEKUNDEN = 40;     /* so lange auf der Preisseite → Hinweis an uns */
const text = (s, n) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n);
const weiter = (ort, cookie) => new Response(null, { status: 303, headers: kopf(cookie ? { Location: ort, 'Set-Cookie': cookie } : { Location: ort }) });
const fehlt = () => tuer(`<p class="kk">Persönliche Präsentation</p><h1>Diese Seite gibt es nicht.</h1><p>Der Link ist unvollständig oder nicht mehr gültig. Schreib uns kurz, dann schicken wir dir einen neuen: <a style="color:#ffbd59" href="mailto:info@lokalbesucher.de">info@lokalbesucher.de</a></p>`, { status: 404 });
const intern = (email) => /@lokalbesucher\.de$/i.test(email || '');

async function anmelden(request, env, ctx) {
  const f = await request.formData().catch(() => null);
  if (!f) return fehlt();
  const slug = text(f.get('slug'), 80), name = text(f.get('name'), 80), email = text(f.get('email'), 200).toLowerCase();
  if (!slugOk(slug) || !(await deck(env, request, slug))) return fehlt();
  if (name.length < 2 || !MAIL_RE.test(email)) return tuer(formular(slug, { fehler: 'Bitte Name und eine gültige E-Mail-Adresse eintragen.', name, email }), { status: 400 });
  const d = await db(env);
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const seit = spaeter(-3600);
  const z = await d.prepare('SELECT SUM(email = ?) AS m, SUM(ip = ?) AS i FROM deck_logins WHERE created_at > ?').bind(email, ip, seit).first();
  if ((z && z.m >= 5) || (z && ip && z.i >= 20)) return tuer(formular(slug, { fehler: 'Zu viele Versuche. Bitte in einer Stunde noch einmal probieren.', name, email }), { status: 429 });
  const roh = token();
  await d.prepare('INSERT INTO deck_logins (token_hash, slug, name, email, ip, created_at, expires_at) VALUES (?,?,?,?,?,?,?)')
    .bind(await hash(roh), slug, name, email, ip, jetzt(), spaeter(3600)).run();
  const link = `${SITE}/p/_a?t=${roh}`;
  const r = await mail(env, {
    to: email, subject: 'Dein Link zur Präsentation',
    html: mailRahmen(`<p>Hallo ${esc(name)},</p><p>hier ist dein Link zur Präsentation. Er gilt eine Stunde und funktioniert einmal.</p>${knopf(link, 'Präsentation öffnen')}<p style="font-size:14px;color:#55606f">Du hast den Link nicht angefordert? Dann kannst du diese Mail einfach löschen.</p>`),
    text: `Hallo ${name},\n\nhier ist dein Link zur Präsentation. Er gilt eine Stunde und funktioniert einmal:\n${link}\n\nDu hast den Link nicht angefordert? Dann kannst du diese Mail einfach löschen.\n\nLokalbesucher GmbH · Karl-Breuing-Str. 2 · 45770 Marl`,
  });
  if (!r.ok) {
    console.log('deck-mail', r.why);
    return tuer(formular(slug, { fehler: 'Die Mail konnte gerade nicht verschickt werden. Bitte gleich noch einmal probieren.', name, email }), { status: 502 });
  }
  return tuer(`<p class="kk">Persönliche Präsentation</p><h1>Schau in dein Postfach.</h1><p>Der Link ist unterwegs an <strong>${esc(email)}</strong>. Er gilt eine Stunde.</p><p>Nichts angekommen? Wirf einen Blick in den Spam-Ordner.</p>`);
}

async function loginEinloesen(request, env) {
  const f = await request.formData().catch(() => null);
  const roh = f ? text(f.get('t'), 64) : '';
  if (!/^[a-f0-9]{48}$/.test(roh)) return fehlt();
  const d = await db(env);
  const h = await hash(roh);
  const l = await d.prepare('SELECT slug, name, email FROM deck_logins WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?').bind(h, jetzt()).first();
  if (!l) return tuer(`<p class="kk">Persönliche Präsentation</p><h1>Dieser Link ist abgelaufen.</h1><p>Login-Links gelten eine Stunde und funktionieren einmal. Fordere einfach einen neuen an.</p>`, { status: 410 });
  await d.prepare('UPDATE deck_logins SET used_at = ? WHERE token_hash = ?').bind(jetzt(), h).run();
  return weiter(`/p/${l.slug}/`, await sitzungAnlegen(env, { name: l.name, email: l.email, quelle: 'login' }));
}

async function einladungEinloesen(request, env) {
  const f = await request.formData().catch(() => null);
  const tok = f ? text(f.get('t'), 64) : '';
  if (!/^[a-f0-9]{48}$/.test(tok)) return fehlt();
  const d = await db(env);
  const e = await d.prepare('SELECT token, slug, name, email, geraete FROM deck_einladungen WHERE token = ? AND expires_at > ?').bind(tok, jetzt()).first();
  if (!e) return fehlt();
  if (e.geraete >= MAX_GERAETE) return weiter(`/p/${e.slug}/`);
  await d.prepare('UPDATE deck_einladungen SET geraete = geraete + 1 WHERE token = ?').bind(tok).run();
  return weiter(`/p/${e.slug}/`, await sitzungAnlegen(env, { name: e.name, email: e.email, quelle: 'einladung', einladung: tok }));
}

async function messen(request, env, ctx) {
  const leer = () => new Response(null, { status: 204, headers: kopf() });
  const s = await sitzung(env, request);
  if (!s) return leer();
  let j; try { j = JSON.parse((await request.text()).slice(0, 20000)); } catch { return leer(); }
  if (!j || typeof j.b !== 'string' || !j.s || typeof j.s !== 'object') return leer();
  const d = await db(env);
  const b = await d.prepare('SELECT id, slug, titel, name, email, signal FROM deck_besuche WHERE id = ? AND session = ?').bind(j.b, s.id_hash).first();
  if (!b) return leer();
  const st = []; let summe = 0;
  for (const [k, v] of Object.entries(j.s).slice(0, 200)) {
    const i = parseInt(k, 10), sek = Math.min(Math.max(Number(v && v.s) || 0, 0), 120);
    if (!(i >= 0 && i < 500) || !sek) continue;
    summe += sek;
    st.push(d.prepare('INSERT INTO deck_slidezeit (besuch, slide, titel, preis, sekunden) VALUES (?,?,?,?,?) ON CONFLICT (besuch, slide) DO UPDATE SET sekunden = sekunden + excluded.sekunden')
      .bind(b.id, i + 1, text(v.t, 90), v.p ? 1 : 0, sek));
  }
  if (!st.length) return leer();
  st.push(d.prepare('UPDATE deck_besuche SET last_at = ?, sekunden = sekunden + ?, max_slide = MAX(max_slide, ?), slides_total = ? WHERE id = ?')
    .bind(jetzt(), summe, Math.min(parseInt(j.m, 10) || 0, 500), Math.min(parseInt(j.n, 10) || 0, 500), b.id));
  await d.batch(st);
  if (!b.signal && !intern(b.email)) {
    const p = await d.prepare("SELECT slide, titel, sekunden FROM deck_slidezeit WHERE besuch = ? AND sekunden >= ? AND (preis = 1 OR titel LIKE '%Investition%' OR titel LIKE '%Preis%') ORDER BY sekunden DESC LIMIT 1").bind(b.id, SIGNAL_SEKUNDEN).first();
    if (p) {
      await d.prepare('UPDATE deck_besuche SET signal = 1 WHERE id = ?').bind(b.id).run();
      ctx.waitUntil(mail(env, {
        to: INTERN(env), subject: `Preisseite: ${b.name} liest gerade genau – ${b.titel || b.slug}`,
        html: mailRahmen(`<p><strong>${esc(b.name)}</strong> (${esc(b.email)}) ist seit ${Math.round(p.sekunden)} Sekunden auf der Preisseite von „${esc(b.titel || b.slug)}“ (Seite ${p.slide}).</p><p>Guter Moment für einen Anruf.</p>${knopf(`${SITE}/ki-sichtbarkeits-check/admin/decks?deck=${b.slug}`, 'Auswertung öffnen')}`),
        text: `${b.name} (${b.email}) ist seit ${Math.round(p.sekunden)} Sekunden auf der Preisseite von „${b.titel || b.slug}“ (Seite ${p.slide}).\n${SITE}/ki-sichtbarkeits-check/admin/decks?deck=${b.slug}`,
      }));
    }
  }
  return leer();
}

async function zeigen(request, env, ctx, url, slug, pfad) {
  const d0 = await deck(env, request, slug);
  if (!d0) return fehlt();
  const s = await sitzung(env, request);
  const start = pfad === '' || pfad === 'index.html';
  const k = url.searchParams.get('k');
  if (start && k && /^[a-f0-9]{48}$/.test(k)) {
    if (s) return weiter(`/p/${slug}/`);
    const d = await db(env);
    const e = await d.prepare('SELECT name, geraete FROM deck_einladungen WHERE token = ? AND slug = ? AND expires_at > ?').bind(k, slug, jetzt()).first();
    if (e && e.geraete < MAX_GERAETE) return tuer(einloesen('/p/_k', k, `${esc(d0.meta.titel || 'Deine Präsentation')}`, 'Präsentation öffnen'));
  }
  if (!s) return start ? tuer(formular(slug)) : new Response('Bitte zuerst anmelden.', { status: 403, headers: kopf({ 'Content-Type': 'text/plain;charset=utf-8' }) });
  const f = await datei(env, request, slug, d0, start ? 'index.html' : pfad);
  if (!f) return fehlt();
  if (!start) return new Response(f.body, { headers: kopf({ 'Content-Type': f.ct, 'Cache-Control': 'private, max-age=86400' }) });

  const d = await db(env);
  const id = token(), cf = request.cf || {}, titel = d0.meta.titel || slug;
  const vorher = await d.prepare('SELECT COUNT(*) AS n FROM deck_besuche WHERE slug = ? AND email = ?').bind(slug, s.email).first();
  await d.prepare('INSERT INTO deck_besuche (id, slug, titel, session, name, email, quelle, started_at, last_at, geraet, land, stadt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(id, slug, titel, s.id_hash, s.name, s.email, s.quelle, jetzt(), jetzt(), geraet(request.headers.get('User-Agent')), cf.country || '', cf.city || '').run();
  if (!(vorher && vorher.n) && !intern(s.email)) {
    ctx.waitUntil(mail(env, {
      to: INTERN(env), subject: `Präsentation geöffnet: ${s.name} – ${titel}`,
      html: mailRahmen(`<p><strong>${esc(s.name)}</strong> (${esc(s.email)}) hat gerade „${esc(titel)}“ zum ersten Mal geöffnet.</p><p>${esc(geraet(request.headers.get('User-Agent')))}${cf.city ? ' · ' + esc(cf.city) : ''} · ${s.quelle === 'einladung' ? 'über den persönlichen Link' : 'über das Anmeldeformular (Link wurde weitergegeben oder selbst aufgerufen)'}</p>${knopf(`${SITE}/ki-sichtbarkeits-check/admin/decks?deck=${slug}`, 'Auswertung öffnen')}`),
      text: `${s.name} (${s.email}) hat gerade „${titel}“ zum ersten Mal geöffnet.\n${SITE}/ki-sichtbarkeits-check/admin/decks?deck=${slug}`,
    }));
  }
  let html = new TextDecoder().decode(f.body);
  const m = messung(id);
  html = /<\/body>/i.test(html) ? html.replace(/<\/body>(?![\s\S]*<\/body>)/i, m + '</body>') : html + m;
  return new Response(html, { headers: kopf({ 'Content-Type': 'text/html;charset=utf-8' }) });
}

export async function onRequest({ request, env, waitUntil }) {
  const ctx = { waitUntil };
  const url = new URL(request.url);
  const teile = url.pathname.replace(/^\/p\/?/, '').split('/');
  const erst = teile[0] || '';
  try {
    if (request.method === 'POST') {
      if (erst === '_anmelden') return await anmelden(request, env, ctx);
      if (erst === '_a') return await loginEinloesen(request, env);
      if (erst === '_k') return await einladungEinloesen(request, env);
      if (erst === '_t') return await messen(request, env, ctx);
      return fehlt();
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405, headers: kopf({ Allow: 'GET, POST' }) });
    if (erst === '_schluessel') return new Response(JSON.stringify(await oeffentlicherSchluessel(env)), { headers: kopf({ 'Content-Type': 'application/json' }) });
    if (erst === '_a') {
      const t = url.searchParams.get('t') || '';
      return /^[a-f0-9]{48}$/.test(t) ? tuer(einloesen('/p/_a', t, 'Deine Präsentation ist bereit.', 'Präsentation öffnen')) : fehlt();
    }
    if (!slugOk(erst)) return fehlt();
    if (teile.length === 1) return new Response(null, { status: 301, headers: kopf({ Location: `/p/${erst}/${url.search}` }) });
    let pfad; try { pfad = decodeURIComponent(teile.slice(1).join('/')); } catch { return fehlt(); }
    return await zeigen(request, env, ctx, url, erst, pfad);
  } catch (e) {
    console.log('deck-fehler', (e && e.stack) || e);
    return tuer(`<p class="kk">Persönliche Präsentation</p><h1>Das hat gerade nicht geklappt.</h1><p>Bitte lade die Seite in einem Moment neu.</p>`, { status: 500 });
  }
}
