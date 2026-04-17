/* Cookie Consent — Lokalbesucher (self-hosted, DSGVO-konform) */
(function () {
  var KEY = 'lb-consent';
  var stored = localStorage.getItem(KEY);

  /* ── GA4 Consent updaten ───────────────────────────────────── */
  function applyConsent(granted) {
    if (typeof gtag !== 'function') return;
    gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied'
    });
  }

  function accept() {
    localStorage.setItem(KEY, 'granted');
    applyConsent(true);
    remove();
  }

  function decline() {
    localStorage.setItem(KEY, 'denied');
    applyConsent(false);
    remove();
  }

  function remove() {
    var el = document.getElementById('lb-cookie-banner');
    if (el) el.remove();
  }

  /* ── Banner HTML ───────────────────────────────────────────── */
  function createBanner() {
    var d = document.createElement('div');
    d.id = 'lb-cookie-banner';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Cookie-Einstellungen');
    d.innerHTML = [
      '<style>',
      '#lb-cookie-banner{position:fixed;bottom:1.25rem;left:50%;transform:translateX(-50%);',
      'width:calc(100% - 2rem);max-width:680px;',
      'background:#111328;border:1px solid #1e2240;border-radius:16px;',
      'padding:1.25rem 1.5rem;z-index:9999;',
      'box-shadow:0 8px 40px rgba(0,0,0,.5);',
      'display:flex;flex-direction:column;gap:1rem;}',
      '@media(min-width:640px){#lb-cookie-banner{flex-direction:row;align-items:center;gap:1.5rem;}}',
      '#lb-cookie-banner p{font-family:"DM Sans",system-ui,sans-serif;font-size:.875rem;',
      'color:#6b7099;line-height:1.6;margin:0;flex:1;}',
      '#lb-cookie-banner p a{color:#ffbd59;text-decoration:underline;}',
      '#lb-cookie-btns{display:flex;gap:.75rem;flex-shrink:0;flex-wrap:wrap;}',
      '#lb-btn-accept{font-family:"Syne",system-ui,sans-serif;font-weight:700;font-size:.875rem;',
      'padding:.6em 1.25em;background:#ffbd59;color:#0c0e1a;border:none;border-radius:10px;',
      'cursor:pointer;white-space:nowrap;}',
      '#lb-btn-accept:hover{background:#ffc96d;}',
      '#lb-btn-decline{font-family:"Syne",system-ui,sans-serif;font-weight:700;font-size:.875rem;',
      'padding:.6em 1.25em;background:transparent;color:#6b7099;',
      'border:1px solid #1e2240;border-radius:10px;cursor:pointer;white-space:nowrap;}',
      '#lb-btn-decline:hover{border-color:#6b7099;color:#e8eaf6;}',
      '</style>',
      '<p>Wir nutzen <strong style="color:#e8eaf6">Google Analytics</strong> zur anonymisierten Auswertung. Technisch notwendige Cookies sind immer aktiv. ',
      '<a href="/datenschutz/" rel="noopener">Datenschutzerklärung</a></p>',
      '<div id="lb-cookie-btns">',
      '<button id="lb-btn-accept">Alle akzeptieren</button>',
      '<button id="lb-btn-decline">Nur notwendige</button>',
      '</div>'
    ].join('');
    document.body.appendChild(d);
    document.getElementById('lb-btn-accept').addEventListener('click', accept);
    document.getElementById('lb-btn-decline').addEventListener('click', decline);
  }

  /* ── Conversion Tracking ──────────────────────────────────── */
  function trackEvent(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params);
  }

  function bindTracking() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (el) {
      el.addEventListener('click', function () {
        trackEvent('whatsapp_click', {
          event_category: 'contact',
          event_label: el.getAttribute('aria-label') || 'WhatsApp'
        });
      });
    });
    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        trackEvent('phone_click', {
          event_category: 'contact',
          event_label: el.href
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', bindTracking);

  /* ── Footer-Link öffnet Banner erneut ─────────────────────── */
  function bindSettingsLink() {
    var link = document.getElementById('cookie-settings-link');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (!document.getElementById('lb-cookie-banner')) createBanner();
    });
  }

  /* ── Init ──────────────────────────────────────────────────── */
  if (stored === 'granted') {
    applyConsent(true);
  } else if (!stored) {
    document.addEventListener('DOMContentLoaded', createBanner);
  }

  document.addEventListener('DOMContentLoaded', bindSettingsLink);
}());
