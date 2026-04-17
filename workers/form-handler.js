/**
 * Lokalbesucher Lead Form Handler
 * Cloudflare Worker — empfängt Formulardaten, sendet E-Mail via Resend
 *
 * Umgebungsvariablen (in Cloudflare Dashboard setzen):
 *   RESEND_API_KEY  — dein Resend API Key (re_...)
 *   TO_EMAIL        — info@lokalbesucher.de
 *   FROM_EMAIL      — leads@lokalbesucher.de (muss in Resend verifiziert sein)
 */

const ALLOWED_ORIGINS = [
  'https://lokalbesucher.de',
  'https://www.lokalbesucher.de',
  'https://lokalbesucher-website.pages.dev',
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    // CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response(JSON.stringify({ success: false, message: 'Ungültige Anfrage' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Honeypot check
    if (data.website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Pflichtfelder
    const name = (data.name || '').trim();
    const phone = (data.phone || '').trim();
    const source = (data.source || 'Unbekannt').trim();
    const message = (data.message || '').trim();

    if (!name || !phone) {
      return new Response(JSON.stringify({ success: false, message: 'Name und Telefon sind Pflichtfelder' }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;border-radius:8px">
  <div style="background:#0c0e1a;padding:20px;border-radius:8px 8px 0 0;text-align:center">
    <span style="color:#ffbd59;font-size:22px;font-weight:bold">Lokalbesucher</span>
    <p style="color:#6b7099;margin:4px 0 0;font-size:13px">Neue Lead-Anfrage</p>
  </div>
  <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px">
    <h2 style="color:#0c0e1a;margin:0 0 20px">Neue Anfrage über: ${source}</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0;font-weight:bold;color:#0c0e1a">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0;color:#666">Telefon</td><td style="padding:8px 0;font-weight:bold;color:#0c0e1a"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
      ${message ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Nachricht</td><td style="padding:8px 0;color:#0c0e1a">${escapeHtml(message).replace(/\n/g, '<br>')}</td></tr>` : ''}
    </table>
    <div style="margin-top:24px;padding:16px;background:#fff8e7;border-left:4px solid #ffbd59;border-radius:4px">
      <strong>WhatsApp:</strong> <a href="https://wa.me/4915122358883?text=Hallo%20${encodeURIComponent(name)}%2C%20ich%20melde%20mich%20wegen%20deiner%20Anfrage%20auf%20lokalbesucher.de">Direkt antworten</a>
    </div>
    <p style="margin-top:20px;color:#999;font-size:12px">Zeitstempel: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}</p>
  </div>
</div>`;

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Lokalbesucher Leads <${env.FROM_EMAIL}>`,
          to: [env.TO_EMAIL],
          reply_to: `${name} <noreply@lokalbesucher.de>`,
          subject: `Neue Anfrage: ${name} — ${source}`,
          html: emailHtml,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
        return new Response(JSON.stringify({ success: false, message: 'E-Mail konnte nicht gesendet werden' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ success: false, message: 'Serverfehler' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
