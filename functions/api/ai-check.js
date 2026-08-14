/**
 * POST /api/ai-check — öffentlicher KI-Sichtbarkeits-Check (Lead-Tool).
 *
 * Prüft, ob ein Unternehmen in KI-Antworten (Perplexity, optional Gemini)
 * auftaucht. Auf Cents pro Anfrage getrimmt und gegen Abuse gehärtet:
 *
 *   1. Turnstile-Token PFLICHT (serverseitig verifiziert, fail-closed)
 *   2. IP-Limit + globaler Tages-Deckel (harte Kostenbremse) via KV
 *   3. 7-Tage-Cache pro Firma+Stadt — Wiederholungen kosten 0
 *   4. Nur 3 Abfragen, kleinstes Suchkontext-/Token-Budget (~1,5-2 ct/Check)
 *   5. API-Keys nur serverseitig (Pages-Env-Vars), nie im Client
 *
 * Benötigte Cloudflare-Pages-Konfiguration (Dashboard):
 *   - KV-Binding:  AI_CHECK_KV  (Workers KV Namespace)
 *   - Env-Vars:    TURNSTILE_SECRET, PERPLEXITY_API_KEY, optional GEMINI_API_KEY
 *   - Frontend braucht den Turnstile SITE-Key (public, im Widget-Markup)
 */

const LIMITS = {
  perIpPerDay: 3,        // Checks pro IP und Tag
  globalPerDay: 200,     // harte Kostenbremse: max Checks/Tag sitewide
  cacheTtlSeconds: 7 * 86400,
  counterTtlSeconds: 90000, // Tageszähler ~25h halten
};

const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'Content-Type': 'application/json;charset=utf-8', 'Cache-Control': 'no-store' },
});

const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 80);

function buildPrompts(company, city, industry) {
  const branche = industry ? industry : 'Unternehmen dieser Art';
  return [
    { id: 'brand',     q: `Was weißt du über "${company}" in ${city}? Antworte kurz und nenne Quellen.` },
    { id: 'kategorie', q: `Empfiehl mir ${branche} in ${city}. Nenne konkrete Anbieter mit kurzer Begründung.` },
    { id: 'bewertung', q: `Wie sind die Bewertungen und der Ruf von "${company}" in ${city}? Kurz bitte.` },
  ];
}

/* ── Engine: Perplexity sonar (billigste Suche mit Zitaten) ── */
async function askPerplexity(env, q) {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.PERPLEXITY_API_KEY}` },
    body: JSON.stringify({
      model: 'sonar',
      max_tokens: 400,
      web_search_options: { search_context_size: 'low' },
      messages: [
        { role: 'system', content: 'Antworte knapp auf Deutsch. Keine langen Listen.' },
        { role: 'user', content: q },
      ],
    }),
  });
  if (!res.ok) throw new Error('engine-' + res.status);
  const j = await res.json();
  return {
    text: j.choices?.[0]?.message?.content || '',
    urls: (j.search_results || []).map(r => r.url).concat(j.citations || []).filter(Boolean),
  };
}

/* ── Optionale Zweit-Engine: Gemini Flash-Lite mit Suche ───── */
async function askGemini(env, q) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: q + ' Antworte knapp auf Deutsch.' }] }],
        tools: [{ google_search: {} }],
        generationConfig: { maxOutputTokens: 400 },
      }),
    },
  );
  if (!res.ok) throw new Error('engine-' + res.status);
  const j = await res.json();
  const cand = j.candidates?.[0];
  return {
    text: (cand?.content?.parts || []).map(p => p.text || '').join('\n'),
    urls: (cand?.groundingMetadata?.groundingChunks || []).map(c => c.web?.uri).filter(Boolean),
  };
}

function analyze(company, website, text, urls) {
  const lower = (text || '').toLowerCase();
  const urlStr = urls.join(' ').toLowerCase();
  const nameHit = lower.includes(norm(company));
  const domain = website ? norm(website).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] : '';
  const cited = !!domain && (urlStr.includes(domain) || lower.includes(domain));
  // Wer besetzt die Sichtbarkeit stattdessen? (Top-Quellen-Hosts)
  const hosts = [...new Set(urls.map(u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } }).filter(Boolean))];
  return { mentioned: nameHit, cited, sources: hosts.slice(0, 5) };
}

export async function onRequestPost({ request, env }) {
  /* Fail-closed: ohne vollständige Konfiguration kein einziger API-Call */
  if (!env.AI_CHECK_KV || !env.TURNSTILE_SECRET || !env.PERPLEXITY_API_KEY) {
    return json({ ok: false, reason: 'not-configured' }, 503);
  }

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad-json' }, 400); }
  const company = norm(body.company);
  const city = norm(body.city);
  const industry = norm(body.industry).slice(0, 60);
  const website = norm(body.website).slice(0, 100);
  if (!company || company.length < 2 || !city || city.length < 2) {
    return json({ ok: false, reason: 'missing-fields' }, 400);
  }

  /* ── 1. Turnstile verifizieren ── */
  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const tv = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: String(body.turnstile || ''), remoteip: ip }),
  }).then(r => r.json()).catch(() => ({ success: false }));
  if (!tv.success) return json({ ok: false, reason: 'turnstile' }, 403);

  /* ── 2. Cache zuerst (kostet nichts, zählt nicht gegen Limits) ── */
  const cacheKey = `res:${company}|${city}`;
  const cachedRaw = await env.AI_CHECK_KV.get(cacheKey);
  if (cachedRaw) {
    try { return json({ ok: true, cached: true, ...JSON.parse(cachedRaw) }); } catch {}
  }

  /* ── 3. Limits (IP + globale Kostenbremse) ── */
  const day = new Date().toISOString().slice(0, 10);
  const ipKey = `ip:${ip}:${day}`;
  const globalKey = `global:${day}`;
  const [ipCount, globalCount] = await Promise.all([
    env.AI_CHECK_KV.get(ipKey).then(v => parseInt(v || '0', 10)),
    env.AI_CHECK_KV.get(globalKey).then(v => parseInt(v || '0', 10)),
  ]);
  if (ipCount >= LIMITS.perIpPerDay) return json({ ok: false, reason: 'ip-limit' }, 429);
  if (globalCount >= LIMITS.globalPerDay) return json({ ok: false, reason: 'daily-budget' }, 429);
  await Promise.all([
    env.AI_CHECK_KV.put(ipKey, String(ipCount + 1), { expirationTtl: LIMITS.counterTtlSeconds }),
    env.AI_CHECK_KV.put(globalKey, String(globalCount + 1), { expirationTtl: LIMITS.counterTtlSeconds }),
  ]);

  /* ── 4. Abfragen (3x Perplexity, optional 1x Gemini fuer den Brand-Check) ── */
  const prompts = buildPrompts(body.company.trim().slice(0, 80), body.city.trim().slice(0, 60), industry);
  const engines = [];
  const results = await Promise.all(prompts.map(async (p) => {
    try {
      const { text, urls } = await askPerplexity(env, p.q);
      return { engine: 'perplexity', prompt: p.id, ...analyze(company, website, text, urls) };
    } catch (e) {
      return { engine: 'perplexity', prompt: p.id, error: true };
    }
  }));
  engines.push(...results);

  if (env.GEMINI_API_KEY) {
    try {
      const { text, urls } = await askGemini(env, prompts[0].q);
      engines.push({ engine: 'gemini', prompt: 'brand', ...analyze(company, website, text, urls) });
    } catch { engines.push({ engine: 'gemini', prompt: 'brand', error: true }); }
  }

  const valid = engines.filter(e => !e.error);
  if (!valid.length) return json({ ok: false, reason: 'engines-down' }, 502);

  /* ── 5. Score: zitiert = 2 Punkte, erwähnt = 1 ── */
  const points = valid.reduce((s, e) => s + (e.cited ? 2 : e.mentioned ? 1 : 0), 0);
  const score = Math.round((points / (valid.length * 2)) * 100);
  const competitorSources = [...new Set(valid.flatMap(e => e.sources || []))]
    .filter(h => !website || !h.includes(norm(website).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]))
    .slice(0, 6);

  const payload = { score, engines: valid.map(({ sources, ...e }) => e), competitorSources, checkedAt: day };
  await env.AI_CHECK_KV.put(cacheKey, JSON.stringify(payload), { expirationTtl: LIMITS.cacheTtlSeconds });
  return json({ ok: true, cached: false, ...payload });
}
