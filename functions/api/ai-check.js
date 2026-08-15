/**
 * POST /api/ai-check — öffentlicher KI-Sichtbarkeits-Check (Lead-Tool).
 *
 * Engines: ChatGPT (gpt-4o-mini + Websuche), Claude (Haiku 4.5 + Websuche),
 * Gemini (2.5 Flash-Lite + Google-Suche). Jede Engine beantwortet genau EINE
 * Frage -> alle 3 Plattformen abgedeckt, Kosten pro Check hart begrenzt:
 *
 *   ChatGPT  1x Websuche + ~400 Tokens   ~2,5-3 ct
 *   Claude   max 2 Suchen + 500 Tokens   ~1-2 ct
 *   Gemini   1x Grounding + 400 Tokens   ~0-3,5 ct (Free-Kontingent deckt meist)
 *   ------------------------------------------------
 *   Summe pro Check                      ~4-8 ct  (Ziel: < 10 ct)  ✔
 *
 * Abuse-Schutz (fail-closed): Turnstile-Pflicht, 3 Checks/IP/Tag,
 * globaler Tages-Deckel, 7-Tage-Cache pro Firma+Stadt (Wiederholung = 0 ct).
 *
 * Cloudflare-Pages-Konfiguration:
 *   - KV-Binding AI_CHECK_KV (via wrangler.toml)
 *   - Secrets: TURNSTILE_SECRET + OPENAI_API_KEY / ANTHROPIC_API_KEY /
 *     GEMINI_API_KEY (fehlt einer, wird die Engine übersprungen;
 *     mindestens eine Engine muss konfiguriert sein)
 *
 * Hinweis Modellwahl: bewusst kleinste Modelle (Haiku 4.5 / 4o-mini /
 * Flash-Lite) — Vorgabe ist das 10-ct-Kostenlimit pro Check.
 * Raw fetch statt SDKs: Pages Functions laufen ohne Build-Schritt in der
 * Workers-Runtime; keine Bundling-Abhängigkeiten = kein Deploy-Risiko.
 */

const LIMITS = {
  perIpPerDay: 3,
  globalPerDay: 200,      // harte Tagesbremse (Worst Case ~200 x 8 ct = ~16 EUR)
  cacheTtlSeconds: 7 * 86400,
  counterTtlSeconds: 90000,
};

const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'Content-Type': 'application/json;charset=utf-8', 'Cache-Control': 'no-store' },
});

const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 80);

/* ── Engine 1: ChatGPT — Kategorie-Frage ("wer wird empfohlen?") ── */
async function askChatGPT(env, q) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      tools: [{ type: 'web_search' }],
      max_output_tokens: 450,
      input: q + ' Antworte knapp auf Deutsch.',
    }),
  });
  if (!res.ok) throw new Error('openai-' + res.status);
  const j = await res.json();
  let text = '', urls = [];
  for (const item of j.output || []) {
    if (item.type !== 'message') continue;
    for (const c of item.content || []) {
      if (c.type === 'output_text') {
        text += c.text + '\n';
        for (const a of c.annotations || []) if (a.url) urls.push(a.url);
      }
    }
  }
  return { text, urls };
}

/* ── Engine 2: Claude — Brand-Frage ("was weißt du über X?") ── */
async function askClaude(env, q) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 500,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 2 }],
      messages: [{ role: 'user', content: q + ' Antworte knapp auf Deutsch.' }],
    }),
  });
  if (!res.ok) throw new Error('anthropic-' + res.status);
  const j = await res.json();
  if (j.stop_reason === 'refusal') return { text: '', urls: [] };
  let text = '', urls = [];
  for (const block of j.content || []) {
    if (block.type === 'text') {
      text += block.text + '\n';
      for (const cit of block.citations || []) if (cit.url) urls.push(cit.url);
    }
    if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
      for (const r of block.content) if (r.url) urls.push(r.url);
    }
  }
  return { text, urls };
}

/* ── Engine 3: Gemini — Ruf-Frage ("Bewertungen/Ruf?") ── */
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
  if (!res.ok) throw new Error('gemini-' + res.status);
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
  const domain = website ? norm(website).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] : '';
  const hosts = [...new Set(urls.map(u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } }).filter(Boolean))];
  return {
    mentioned: lower.includes(norm(company)),
    cited: !!domain && (urlStr.includes(domain) || lower.includes(domain)),
    sources: hosts.slice(0, 5),
  };
}

export async function onRequestPost({ request, env }) {
  const engines = [
    { name: 'chatgpt', key: env.OPENAI_API_KEY,    ask: askChatGPT, promptId: 'kategorie' },
    { name: 'claude',  key: env.ANTHROPIC_API_KEY, ask: askClaude,  promptId: 'brand' },
    { name: 'gemini',  key: env.GEMINI_API_KEY,    ask: askGemini,  promptId: 'ruf' },
  ].filter(e => e.key);

  /* Fail-closed: ohne Turnstile/KV/mind. eine Engine kein einziger API-Call */
  if (!env.AI_CHECK_KV || !env.TURNSTILE_SECRET || !engines.length) {
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

  /* 1. Turnstile serverseitig verifizieren */
  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const tv = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: String(body.turnstile || ''), remoteip: ip }),
  }).then(r => r.json()).catch(() => ({ success: false }));
  if (!tv.success) return json({ ok: false, reason: 'turnstile' }, 403);

  /* 2. Cache zuerst (kostet nichts, zählt nicht gegen Limits) */
  const cacheKey = `res:${company}|${city}`;
  const cachedRaw = await env.AI_CHECK_KV.get(cacheKey);
  if (cachedRaw) {
    try { return json({ ok: true, cached: true, ...JSON.parse(cachedRaw) }); } catch {}
  }

  /* 3. Limits: pro IP + globale Kostenbremse */
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

  /* 4. Genau EINE Frage pro Engine (Kostendeckel) */
  const co = body.company.trim().slice(0, 80);
  const ci = body.city.trim().slice(0, 60);
  const branche = industry || 'Unternehmen dieser Art';
  const PROMPTS = {
    kategorie: `Empfiehl mir ${branche} in ${ci}. Nenne konkrete Anbieter mit kurzer Begründung.`,
    brand: `Was weißt du über "${co}" in ${ci}? Nenne Quellen.`,
    ruf: `Wie sind die Bewertungen und der Ruf von "${co}" in ${ci}?`,
  };

  const results = await Promise.all(engines.map(async (e) => {
    try {
      const { text, urls } = await e.ask(env, PROMPTS[e.promptId]);
      return { engine: e.name, prompt: e.promptId, ...analyze(company, website, text, urls) };
    } catch (err) {
      return { engine: e.name, prompt: e.promptId, error: true };
    }
  }));

  const valid = results.filter(r => !r.error);
  if (!valid.length) return json({ ok: false, reason: 'engines-down' }, 502);

  /* 5. Score: zitiert = 2 Punkte, erwähnt = 1 */
  const points = valid.reduce((s, e) => s + (e.cited ? 2 : e.mentioned ? 1 : 0), 0);
  const score = Math.round((points / (valid.length * 2)) * 100);
  const domain = website ? norm(website).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] : '';
  const competitorSources = [...new Set(valid.flatMap(e => e.sources || []))]
    .filter(h => !domain || !h.includes(domain))
    .slice(0, 6);

  const payload = { score, engines: valid.map(({ sources, ...e }) => e), competitorSources, checkedAt: day };
  await env.AI_CHECK_KV.put(cacheKey, JSON.stringify(payload), { expirationTtl: LIMITS.cacheTtlSeconds });
  return json({ ok: true, cached: false, ...payload });
}
