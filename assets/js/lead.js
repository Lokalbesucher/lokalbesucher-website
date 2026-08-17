/* lead.js — zentrale Lead-Zustellung fuer alle Formulare (Lokalbesucher)
   Kein Lead darf still verloren gehen. Zustellkette:

     1. POST /api/lead            same-origin Proxy (Cloudflare Pages Function).
                                  Wird nicht von Adblockern geblockt, wiederholt
                                  serverseitig und liefert einen echten Status.
     2. Direkt zum Webhook        Sicherheitsnetz, falls die Function fehlt oder
                                  ausfaellt — entspricht dem alten Verhalten.
     3. Warteschlange + Mailto    Schlaegt beides fehl, wird der Lead in
                                  localStorage geparkt (naechster Seitenaufruf
                                  versucht es erneut) UND dem Besucher ein
                                  vorausgefuellter Mail-Link an info@ angeboten.

   Aufruf:  var res = await lbSendLead({source:'homepage', name:'…', …});
            res.ok   -> zugestellt (res.via = 'proxy' | 'direct')
            !res.ok  -> res.mailto = fertiger mailto:-Link fuer den Besucher   */
(function () {
  'use strict';

  var PROXY = '/api/lead';
  var QUEUE_KEY = 'lb-lead-queue';
  var MAILBOX = 'info@lokalbesucher.de';
  var MAX_QUEUE = 20;

  var GHL_LEAD     = 'https://services.leadconnectorhq.com/hooks/Ok3thIff14hF3QHsquxH/webhook-trigger/d1f245e0-1d61-4177-af6c-a15378ba74d0';
  var GHL_BERATUNG = 'https://services.leadconnectorhq.com/hooks/Ok3thIff14hF3QHsquxH/webhook-trigger/93baa80a-b89b-4fe7-853d-7b58b2ab79a1';
  var GHL_SCHEMA   = 'https://services.leadconnectorhq.com/hooks/Ok3thIff14hF3QHsquxH/webhook-trigger/9fb77c47-19cd-454f-bf53-c3dccdaf05cd';
  var ZAPIER_ROI   = 'https://hooks.zapier.com/hooks/catch/17928974/u0a57h7/';

  /* Muss zu functions/api/lead.js passen — hier nur als Direkt-Fallback. */
  var DIRECT = {
    'homepage': GHL_LEAD,
    'ki-check': GHL_LEAD,
    'meta-ads': GHL_LEAD,
    'google-ads': GHL_LEAD,
    'seo-agentur': GHL_LEAD,
    'social-media-agentur': GHL_LEAD,
    'google-business-agentur-bochum': GHL_LEAD,
    'google-business-agentur-recklinghausen': GHL_LEAD,
    'werbeagentur-recklinghausen': GHL_LEAD,
    'bewertungsmanagement': GHL_BERATUNG,
    'google-business-agentur': GHL_BERATUNG,
    'schema-beratung': GHL_BERATUNG,
    'schema-generator': GHL_SCHEMA,
    'roi-kalkulator': ZAPIER_ROI
  };
  var FORM_ENCODED = { 'schema-generator': true, 'roi-kalkulator': true };

  function post(url, body, type) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': type },
      body: body,
      keepalive: true
    });
  }

  function readQueue() {
    try { var q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); return Array.isArray(q) ? q : []; }
    catch (e) { return []; }
  }
  function writeQueue(q) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAX_QUEUE))); } catch (e) {}
  }

  function mailtoLink(data) {
    var lines = [];
    for (var k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k) && data[k] !== '' && data[k] != null) {
        lines.push(k + ': ' + data[k]);
      }
    }
    return 'mailto:' + MAILBOX +
      '?subject=' + encodeURIComponent('Anfrage über lokalbesucher.de (' + (data.source || 'Website') + ')') +
      '&body=' + encodeURIComponent(
        'Hallo Lokalbesucher-Team,\n\nmeine Anfrage konnte technisch nicht übermittelt werden. Hier meine Daten:\n\n' +
        lines.join('\n') + '\n\nBitte meldet euch bei mir.\n');
  }

  /* Ein Zustellversuch ueber Proxy, dann direkt. Gibt 'proxy' | 'direct' | null zurueck. */
  async function deliver(data) {
    try {
      var res = await post(PROXY, JSON.stringify(data), 'application/json');
      if (res.ok) return 'proxy';
      /* 4xx = Payload-Problem, Direktversand wuerde genauso scheitern */
      if (res.status >= 400 && res.status < 500 && res.status !== 429) return null;
    } catch (e) { /* Function nicht deployed o.ae. → weiter mit Direktversand */ }

    var key = String(data.source || '').trim().toLowerCase().replace(/\s+/g, '-');
    var url = DIRECT[key];
    if (!url) return null;
    try {
      var body, type;
      if (FORM_ENCODED[key]) {
        var p = new URLSearchParams();
        for (var k in data) if (Object.prototype.hasOwnProperty.call(data, k)) p.append(k, data[k] == null ? '' : String(data[k]));
        body = p.toString(); type = 'application/x-www-form-urlencoded;charset=UTF-8';
      } else {
        body = JSON.stringify(data); type = 'application/json';
      }
      var res2 = await post(url, body, type);
      if (res2.ok) return 'direct';
    } catch (e) {}
    return null;
  }

  /* Geparkte Leads spaeter erneut zustellen (naechster Seitenaufruf). */
  async function flushQueue() {
    var q = readQueue();
    if (!q.length) return;
    var rest = [];
    for (var i = 0; i < q.length; i++) {
      var item = q[i];
      /* Nach 14 Tagen aufgeben, sonst haengt das ewig im Browser */
      if (Date.now() - (item.ts || 0) > 14 * 864e5) continue;
      var via = await deliver(item.data);
      if (!via) rest.push(item);
    }
    writeQueue(rest);
  }

  window.lbSendLead = async function (data) {
    var payload = {};
    for (var k in data) if (Object.prototype.hasOwnProperty.call(data, k)) payload[k] = data[k];
    if (!payload.timestamp) payload.timestamp = new Date().toISOString();

    var via = await deliver(payload);
    if (via) { flushQueue(); return { ok: true, via: via }; }

    var q = readQueue();
    q.push({ data: payload, ts: Date.now() });
    writeQueue(q);
    return { ok: false, mailto: mailtoLink(payload) };
  };

  /* Beim Laden einmal aufraeumen — ohne den Seitenaufbau zu bremsen. */
  if (readQueue().length) {
    if ('requestIdleCallback' in window) requestIdleCallback(function () { flushQueue(); }, { timeout: 5000 });
    else setTimeout(flushQueue, 2500);
  }
}());
