/* third-party.js — zentrale Steuerung aller Drittanbieter-Skripte (Lokalbesucher)
   Ladestrategie:
   - Google (GA4 + Ads gtag.js): erst nach window.load + requestIdleCallback → blockiert LCP/TBT nicht.
     Die gtag('config',…)-Aufrufe bleiben inline im <head> (Stub-Queue), Consent Mode v2 unverändert.
   - Leadinfo (inkl. Leadbot-Chat-Widget): erst bei erster Nutzerinteraktion (Scroll/Klick/Taste/Touch).
     Vor dem Laden wird CSS injiziert, das das Widget von Anfang an position:fixed mit fester
     Mindestgröße hält → kein Layout-Shift beim Einblenden. */
(function () {
  'use strict';

  var CFG = {
    google: true,
    googleSrc: 'https://www.googletagmanager.com/gtag/js?id=G-KRKS5RL7MP',
    leadinfo: true, /* ← auf false setzen = Leadinfo KOMPLETT aus (Tracking + Chat-Widget, sitewide) */
    leadinfoId: 'LI-69EB16FC309C3',
    leadinfoSrc: 'https://cdn.leadinfo.eu/ping.js'
  };

  function addScript(src) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    document.head.appendChild(s);
  }

  /* ── Google gtag.js — nach load + idle ─────────────────────── */
  function initGoogle() {
    if (!CFG.google) return;
    addScript(CFG.googleSrc);
  }

  function whenIdle(fn) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: 3500 });
    } else {
      setTimeout(fn, 1500);
    }
  }

  if (document.readyState === 'complete') {
    whenIdle(initGoogle);
  } else {
    window.addEventListener('load', function () { whenIdle(initGoogle); });
  }

  /* ── Leadinfo — erst bei Nutzerinteraktion ─────────────────── */
  var liLoaded = false;
  var EVENTS = ['scroll', 'pointerdown', 'keydown', 'touchstart'];

  function reserveWidgetSpace() {
    var st = document.createElement('style');
    st.textContent =
      /* Leadbot von der ersten Millisekunde an fixed + feste Button-Maße → kein CLS */
      'div.widget.bot{position:fixed!important;margin:0!important;contain:layout;z-index:9998}' +
      'div.widget.bot.bot-right{right:16px;bottom:16px;min-width:64px;min-height:64px}' +
      'div.widget.bot.bot-left{left:16px;bottom:16px;min-width:64px;min-height:64px}';
    document.head.appendChild(st);
  }

  /* Von Leadinfo injizierte iframes ohne title bekommen einen (A11y) */
  function titleThirdPartyIframes() {
    var fix = function () {
      document.querySelectorAll('iframe:not([title])').forEach(function (f) {
        f.setAttribute('title', 'Leadinfo Chat-Widget');
      });
    };
    var mo = new MutationObserver(fix);
    mo.observe(document.body, { childList: true, subtree: true });
    fix();
    setTimeout(function () { mo.disconnect(); }, 20000);
  }

  function initLeadinfo() {
    if (liLoaded) return;
    liLoaded = true;
    EVENTS.forEach(function (t) { window.removeEventListener(t, initLeadinfo); });
    if (!CFG.leadinfo) return;
    reserveWidgetSpace();
    window.GlobalLeadinfoNamespace = window.GlobalLeadinfoNamespace || [];
    window.GlobalLeadinfoNamespace.push('leadinfo');
    if (!window.leadinfo) {
      window.leadinfo = function () {
        (window.leadinfo.q = window.leadinfo.q || []).push(arguments);
      };
    }
    window.leadinfo.t = window.leadinfo.t || CFG.leadinfoId;
    window.leadinfo.q = window.leadinfo.q || [];
    addScript(CFG.leadinfoSrc);
    titleThirdPartyIframes();
  }

  EVENTS.forEach(function (t) {
    window.addEventListener(t, initLeadinfo, { passive: true, once: false });
  });
}());
