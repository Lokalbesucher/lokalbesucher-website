/**
 * Protokoll-Helfer fuer D1 (Binding KI_DB, siehe wrangler.toml).
 *
 * Grundsatz: Das Protokoll darf NIE den eigentlichen Vorgang kaputt machen.
 * Fehlt das Binding oder schlaegt ein INSERT fehl, wird still weitergemacht —
 * ein verlorener Log-Eintrag ist billiger als ein verlorener Lead.
 */

/* Gekuerzter Hash aus IP + Tag: reicht, um Mehrfach-Checks derselben Person
   am selben Tag zu erkennen, laesst sich aber nicht zur IP zurueckrechnen. */
export async function ipHash(ip, day) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}|${day}|lb-kilog`));
    return [...new Uint8Array(buf)].slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch { return null; }
}

function cf(request) {
  const c = request.cf || {};
  return { country: c.country || null, referer: request.headers.get('Referer') || null };
}

/* Ein durchgefuehrter (oder abgelehnter) Check. Rueckgabe: Promise, nie rejecting. */
export async function logCheck(env, request, row) {
  if (!env.KI_DB) return;
  try {
    const { country, referer } = cf(request);
    const day = new Date().toISOString().slice(0, 10);
    const ip = request.headers.get('CF-Connecting-IP') || '';
    await env.KI_DB.prepare(
      `INSERT INTO checks (status, cached, company, city, industry, website, score,
         chatgpt, claude, gemini, competitor_sources, engine_errors, ip_hash, country, referer)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)`
    ).bind(
      row.status,
      row.cached ? 1 : 0,
      row.company || '',
      row.city || '',
      row.industry || null,
      row.website || null,
      Number.isFinite(row.score) ? row.score : null,
      row.chatgpt || null,
      row.claude || null,
      row.gemini || null,
      row.competitorSources ? JSON.stringify(row.competitorSources) : null,
      row.engineErrors && row.engineErrors.length ? JSON.stringify(row.engineErrors) : null,
      ip ? await ipHash(ip, day) : null,
      country,
      referer
    ).run();
  } catch (e) {
    console.warn('kilog: check nicht protokolliert:', e && e.message);
  }
}

/* Ergebnis-Text je Engine fuer die Tabelle: zitiert > erwaehnt > nicht. */
export function engineLabel(e) {
  if (!e) return null;
  if (e.error) return 'fehler';
  if (e.cited) return 'zitiert';
  if (e.mentioned) return 'erwaehnt';
  return 'nicht';
}

/* Lead VOR der Weiterleitung sichern. Rueckgabe: id (oder null). */
export async function logLead(env, request, data, targetKey) {
  if (!env.KI_DB) return null;
  try {
    const { country } = cf(request);
    const day = new Date().toISOString().slice(0, 10);
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const s = v => (v == null ? null : String(v).slice(0, 300));
    const score = parseInt(data.kiScore, 10);
    const res = await env.KI_DB.prepare(
      `INSERT INTO leads (source, name, phone, email, company, website, branche, ki_score,
         page, payload, delivery_target, ip_hash, country)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)`
    ).bind(
      s(data.source) || 'unbekannt',
      s(data.name),
      s(data.phone || data.telefon),
      s(data.email),
      s(data.companyName || data.company || data.firma),
      s(data.website),
      s(data.branche || data.industry),
      Number.isFinite(score) ? score : null,
      s(request.headers.get('Referer')),
      JSON.stringify(data).slice(0, 8000),
      s(targetKey),
      ip ? await ipHash(ip, day) : null,
      country
    ).run();
    return res && res.meta ? res.meta.last_row_id : null;
  } catch (e) {
    console.warn('kilog: lead nicht protokolliert:', e && e.message);
    return null;
  }
}

/* Zustellstatus nachtragen (laeuft im Hintergrund via waitUntil). */
export async function markLeadDelivery(env, id, delivered, reason) {
  if (!env.KI_DB || !id) return;
  try {
    await env.KI_DB.prepare('UPDATE leads SET delivered = ?1, delivery_reason = ?2 WHERE id = ?3')
      .bind(delivered ? 1 : 0, delivered ? null : String(reason || 'unknown').slice(0, 100), id).run();
  } catch (e) {
    console.warn('kilog: zustellstatus nicht gesetzt:', e && e.message);
  }
}
