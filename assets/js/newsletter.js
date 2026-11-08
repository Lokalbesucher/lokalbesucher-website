/* Newsletter-Anmeldung (Double-Opt-in): schickt die Adresse an /api/newsletter, die Bestätigung läuft per Mail.
   Markup: form.nl-form mit input[name=email], Honeypot input[name=website], p.nl-msg. Siehe scripts/generate-news.js (nlBox). */
(function () {
  document.querySelectorAll('form.nl-form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var mail = f.elements.email, msg = f.querySelector('.nl-msg'), btn = f.querySelector('button');
      var say = function (t, ok) { msg.textContent = t; msg.className = 'nl-msg ' + (ok ? 'ok' : 'err'); };
      if (!mail.value || !mail.checkValidity()) { say('Bitte gib eine gültige E-Mail-Adresse ein.'); mail.focus(); return; }
      btn.disabled = true;
      fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mail.value, website: f.elements.website ? f.elements.website.value : '', quelle: location.pathname + (f.getAttribute('data-quelle') ? '#' + f.getAttribute('data-quelle') : '') }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); })
        .then(function (x) {
          if (x.j.ok) { say('Fast geschafft: Wir haben dir eine Mail geschickt. Bitte klicke dort auf „Anmeldung bestätigen“.', true); f.reset();
            if (window.gtag) window.gtag('event', 'newsletter_anmeldung', { quelle: location.pathname }); }
          else if (x.s === 429) say('Zu viele Versuche. Bitte probier es in einer Stunde noch einmal.');
          else if (x.j.reason === 'email') say('Bitte prüf die E-Mail-Adresse.');
          else say('Das hat gerade nicht geklappt. Schreib uns an info@lokalbesucher.de, dann tragen wir dich ein.');
        })
        .catch(function () { say('Keine Verbindung. Bitte versuch es gleich noch einmal.'); })
        .then(function () { btn.disabled = false; });
    });
  });
})();
