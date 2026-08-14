/**
 * AI-Visibility-Monitor — misst, ob lokalbesucher.de in den Antworten von
 * ChatGPT, Perplexity, Claude und Gemini auftaucht (GEO/AEO-Monitoring).
 *
 * Selbstgebaut statt AEO-Tool (Peec/Otterly ~90-120 EUR/Monat): ein Lauf mit
 * 12 Prompts x 4 Plattformen kostet grob 0,50-1 EUR.
 *
 * Setup:  API-Keys in eine Datei `.env` im Repo-Root (gitignored, wird NIE deployt):
 *   OPENAI_API_KEY=sk-...        -> platform.openai.com/api-keys
 *   ANTHROPIC_API_KEY=sk-ant-... -> console.anthropic.com
 *   PERPLEXITY_API_KEY=pplx-...  -> perplexity.ai/settings/api
 *   GEMINI_API_KEY=AI...         -> aistudio.google.com/apikey
 *   (fehlende Keys => Plattform wird uebersprungen)
 *
 * Lauf:   npm run ai-check
 * Output: tmp/ai-visibility/YYYY-MM-DD.md (Bericht) + .json (Rohdaten/Historie)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'tmp', 'ai-visibility');

/* ── .env laden (ohne dotenv-Abhaengigkeit) ─────────────────── */
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

/* ── Konfiguration ──────────────────────────────────────────── */
const BRAND = ['lokalbesucher'];
const COMPETITORS = [
  'saphirsolution', 'digital-lokal', 'suchmeisterei', 'dotflow',
  'goldenwebage', 'seo-agentur.media', 'unitedads', 'langguth',
  'lenner-marketing', 'reputativ', 'revieweraser', 'smarketer',
];

const PROMPTS = [
  { id: 'nrw',            q: 'Was ist die beste Google Business Agentur in NRW? Nenne konkrete Anbieter.' },
  { id: 'ruhrgebiet',     q: 'Welche Agentur optimiert Google Unternehmensprofile im Ruhrgebiet? Konkrete Empfehlungen bitte.' },
  { id: 'recklinghausen', q: 'Ich suche eine Google Business Agentur im Kreis Recklinghausen. Wen empfiehlst du?' },
  { id: 'bochum',         q: 'Google Business Agentur in Bochum gesucht — welche Anbieter kommen infrage?' },
  { id: 'kosten',         q: 'Was kostet eine Google Business Agentur in Deutschland monatlich? Nenne Anbieter mit Preisen.' },
  { id: 'maps-kmu',       q: 'Welche Agentur hilft kleinen Unternehmen in Deutschland, bei Google Maps besser gefunden zu werden?' },
  { id: 'bewertungen',    q: 'Beste Agentur für Google-Bewertungsmanagement in Deutschland — wen gibt es?' },
  { id: 'qr-bewertung',   q: 'Gibt es Anbieter mit QR-Code-Schlüsselanhängern für Mitarbeiter, um mehr Google-Bewertungen zu bekommen?' },
  { id: 'handwerker',     q: 'Lokale SEO Agentur für Handwerksbetriebe in NRW gesucht — wer ist gut?' },
  { id: 'google-partner', q: 'Welche offiziellen Google Partner Agenturen gibt es im Kreis Recklinghausen oder in Marl?' },
  { id: 'brand',          q: 'Was ist Lokalbesucher (lokalbesucher.de) und was bietet die Firma an?' },
  { id: 'brand-serioes',  q: 'Ist die Lokalbesucher GmbH aus Marl seriös? Was weißt du über sie?' },
];

/* ── Provider-Adapter: jeweils { text, urls } zurueckgeben ──── */

async function askOpenAI(q) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', tools: [{ type: 'web_search' }], input: q }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 200)}`);
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

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

async function askClaude(q) {
  const msg = await anthropic.beta.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-opus-5',
    max_tokens: 2048,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 3 }],
    messages: [{ role: 'user', content: q }],
  });
  if (msg.stop_reason === 'refusal') return { text: '[refusal]', urls: [] };
  let text = '', urls = [];
  for (const block of msg.content) {
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

async function askPerplexity(q) {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}` },
    body: JSON.stringify({ model: 'sonar', messages: [{ role: 'user', content: q }] }),
  });
  if (!res.ok) throw new Error(`Perplexity ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  const urls = (j.search_results || []).map(r => r.url).concat(j.citations || []);
  return { text: j.choices?.[0]?.message?.content || '', urls };
}

async function askGemini(q) {
  const model = 'gemini-2.5-flash';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: q }] }], tools: [{ google_search: {} }] }),
    },
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  const cand = j.candidates?.[0];
  const text = (cand?.content?.parts || []).map(p => p.text || '').join('\n');
  const urls = (cand?.groundingMetadata?.groundingChunks || []).map(c => c.web?.uri).filter(Boolean);
  return { text, urls };
}

const PROVIDERS = [
  { name: 'chatgpt',    key: 'OPENAI_API_KEY',     ask: askOpenAI },
  { name: 'claude',     key: 'ANTHROPIC_API_KEY',  ask: askClaude },
  { name: 'perplexity', key: 'PERPLEXITY_API_KEY', ask: askPerplexity },
  { name: 'gemini',     key: 'GEMINI_API_KEY',     ask: askGemini },
];

/* ── Auswertung ─────────────────────────────────────────────── */
function analyze(text, urls) {
  const lower = (text || '').toLowerCase();
  const urlStr = urls.join(' ').toLowerCase();
  return {
    mentioned: BRAND.some(b => lower.includes(b)),
    cited: urlStr.includes('lokalbesucher.de'),
    competitors: COMPETITORS.filter(c => lower.includes(c) || urlStr.includes(c)),
  };
}

/* ── Hauptlauf ──────────────────────────────────────────────── */
const active = PROVIDERS.filter(p => process.env[p.key]);
const skipped = PROVIDERS.filter(p => !process.env[p.key]).map(p => p.name);
if (!active.length) {
  console.error('Keine API-Keys gefunden. Bitte .env im Repo-Root anlegen (siehe Kopf dieser Datei).');
  process.exit(1);
}
if (skipped.length) console.log('Übersprungen (kein Key):', skipped.join(', '));

fs.mkdirSync(OUT_DIR, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const results = [];

for (const prompt of PROMPTS) {
  process.stdout.write(`[${prompt.id}] `);
  const perProvider = await Promise.all(active.map(async (p) => {
    try {
      const { text, urls } = await p.ask(prompt.q);
      const a = analyze(text, urls);
      process.stdout.write(`${p.name}:${a.cited ? 'ZITIERT' : a.mentioned ? 'erwähnt' : '—'} `);
      return { provider: p.name, ...a, urls: urls.slice(0, 10), answer: text.slice(0, 2000) };
    } catch (e) {
      process.stdout.write(`${p.name}:FEHLER `);
      return { provider: p.name, error: String(e.message || e).slice(0, 200) };
    }
  }));
  results.push({ prompt: prompt.id, question: prompt.q, providers: perProvider });
  console.log('');
}

/* ── Bericht schreiben ──────────────────────────────────────── */
const jsonPath = path.join(OUT_DIR, `${today}.json`);
fs.writeFileSync(jsonPath, JSON.stringify({ date: today, results }, null, 2));

const mark = r => r?.error ? '⚠️' : r?.cited ? '✅ zitiert' : r?.mentioned ? '🟡 erwähnt' : '—';
const names = active.map(p => p.name);
let md = `# AI-Sichtbarkeit lokalbesucher.de — ${today}\n\n`;
md += `| Prompt | ${names.join(' | ')} |\n|---|${names.map(() => '---').join('|')}|\n`;
for (const r of results) {
  md += `| ${r.prompt} | ${names.map(n => mark(r.providers.find(p => p.provider === n))).join(' | ')} |\n`;
}
const flat = results.flatMap(r => r.providers).filter(p => !p.error);
const cited = flat.filter(p => p.cited).length;
const mentioned = flat.filter(p => p.mentioned).length;
md += `\n**Score:** ${cited}/${flat.length} Antworten zitieren lokalbesucher.de, ${mentioned}/${flat.length} erwähnen die Marke.\n`;
const compCount = {};
for (const p of flat) for (const c of p.competitors || []) compCount[c] = (compCount[c] || 0) + 1;
const topComp = Object.entries(compCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
if (topComp.length) {
  md += `\n**Meistgenannte Wettbewerber:** ${topComp.map(([c, n]) => `${c} (${n}×)`).join(', ')}\n`;
}
md += `\nRohdaten mit Antworttexten: \`${path.relative(ROOT, jsonPath).replace(/\\/g, '/')}\`\n`;

const mdPath = path.join(OUT_DIR, `${today}.md`);
fs.writeFileSync(mdPath, md);
console.log(`\n${md}\nBericht: ${mdPath}`);
