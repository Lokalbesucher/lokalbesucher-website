/**
 * POST /api/lead — serverseitiger Proxy fuer alle Lead-Formulare.
 *
 * Warum ueberhaupt ein Proxy?
 *  - services.leadconnectorhq.com und hooks.zapier.com stehen auf gaengigen
 *    Adblocker-/Trackingschutz-Listen. Der Browser-Request stirbt dann lokal,
 *    ohne dass wir davon je erfahren — der Lead ist weg. Same-Origin /api/lead
 *    wird nicht geblockt.
 *  - Serverseitig koennen wir sauber wiederholen und echte Statuscodes lesen
 *    (statt mode:"no-cors" mit undurchsichtiger Antwort).
 *
 * Antwort:
 *   200 {ok:true, via:"<ziel>"}       — zugestellt
 *   502 {ok:false, reason:"..."}      — nicht zugestellt; der Client faellt
 *                                       dann auf Direktversand bzw. Mailto zurueck
 */

/* Ziel je Formular-Quelle. Unbekannte Quellen laufen auf das Standard-
   GHL-Lead-Webhook — lieber ein Lead mit falschem Tag als gar kein Lead. */
const GHL_LEAD     = 'https://services.leadconnectorhq.com/hooks/Ok3thIff14hF3QHsquxH/webhook-trigger/d1f245e0-1d61-4177-af6c-a15378ba74d0';
const GHL_BERATUNG = 'https://services.leadconnectorhq.com/hooks/Ok3thIff14hF3QHsquxH/webhook-trigger/93baa80a-b89b-4fe7-853d-7b58b2ab79a1';
const GHL_SCHEMA   = 'https://services.leadconnectorhq.com/hooks/Ok3thIff14hF3QHsquxH/webhook-trigger/9fb77c47-19cd-454f-bf53-c3dccdaf05cd';
const ZAPIER_ROI   = 'https://hooks.zapier.com/hooks/catch/17928974/u0a57h7/';

const TARGETS = {
  'homepage':                              { url: GHL_LEAD,     form: false },
  'ki-check':                              { url: GHL_LEAD,     form: false },
  'meta-ads':                              { url: GHL_LEAD,     form: false },
  'google-ads':                            { url: GHL_LEAD,     form: false },
  'seo-agentur':                           { url: GHL_LEAD,     form: false },
  'social-media-agentur':                  { url: GHL_LEAD,     form: false },
  'google-business-agentur-bochum':        { url: GHL_LEAD,     form: false },
  'google-business-agentur-recklinghausen':{ url: GHL_LEAD,     form: false },
  'werbeagentur-recklinghausen':           { url: GHL_LEAD,     form: false },
  'bewertungsmanagement':                  { url: GHL_BERATUNG, form: false },
  'google-business-agentur':               { url: GHL_BERATUNG, form: false },
  'schema-beratung':                       { url: GHL_BERATUNG, form: false },
  'schema-generator':                      { url: GHL_SCHEMA,   form: true  },
  /* Zapier-Catch-Hook erwartet weiterhin form-encoded — der bestehende Zap ist
     darauf gebaut, deshalb hier nicht auf JSON umstellen. */
  'roi-kalkulator':                        { url: ZAPIER_ROI,   form: true  }
};
const DEFAULT_TARGET = { url: GHL_LEAD, form: false };

const MAX_BODY = 16 * 1024;
const ATTEMPTS = 3;

const json = (obj, status) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'Content-Type': 'application/json;charset=utf-8', 'Cache-Control': 'no-store' }
});

function encode(data, asForm) {
  if (!asForm) return { body: JSON.stringify(data), type: 'application/json' };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) p.append(k, v == null ? '' : String(v));
  return { body: p.toString(), type: 'application/x-www-form-urlencoded;charset=UTF-8' };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function onRequestPost({ request }) {
  let data;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return json({ ok: false, reason: 'payload-too-large' }, 413);
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, reason: 'bad-json' }, 400);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return json({ ok: false, reason: 'bad-payload' }, 400);
  }

  /* Historisch gewachsen: manche Formulare schicken "Google Business Agentur",
     andere "google-business-agentur". Beides muss dasselbe Ziel treffen. */
  const source = typeof data.source === 'string' ? data.source : '';
  const key = source.trim().toLowerCase().replace(/\s+/g, '-');
  const target = TARGETS[key] || DEFAULT_TARGET;

  /* Herkunft mitschicken, damit im CRM nachvollziehbar bleibt, ueber welchen
     Weg der Lead kam — und ob er ueber den Proxy oder direkt eingegangen ist. */
  const payload = {
    ...data,
    source: source || 'unbekannt',
    delivery: 'proxy',
    page: request.headers.get('Referer') || '',
    received_at: new Date().toISOString()
  };
  const { body, type } = encode(payload, target.form);

  let reason = 'unknown';
  for (let i = 0; i < ATTEMPTS; i++) {
    try {
      const res = await fetch(target.url, {
        method: 'POST',
        headers: { 'Content-Type': type },
        body
      });
      if (res.ok) return json({ ok: true, via: key || 'default' }, 200);
      reason = 'upstream-' + res.status;
      /* 4xx wiederholen bringt nichts — Webhook existiert nicht oder Payload passt nicht */
      if (res.status < 500) break;
    } catch (e) {
      reason = 'network';
    }
    if (i < ATTEMPTS - 1) await sleep(300 * (i + 1));
  }
  return json({ ok: false, reason }, 502);
}
