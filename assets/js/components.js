/* components.js — Lokalbesucher */

/* ── Fade-up IntersectionObserver ──────────────────────────── */
(function () {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(function (el) {
    observer.observe(el);
  });
}());

/* ── Accordion ─────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var bodyId = this.getAttribute('aria-controls');
      var body = document.getElementById(bodyId);
      var icon = this.querySelector('.accordion-icon');

      this.setAttribute('aria-expanded', !expanded);
      if (body) body.hidden = expanded;
      if (icon) icon.style.transform = expanded ? '' : 'rotate(45deg)';
    });
  });
}());

/* ── Mobile Nav Drawer ─────────────────────────────────────── */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.getElementById('nav-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', function () {
    var open = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !open);
    drawer.classList.toggle('is-open', !open);
    document.body.style.overflow = open ? '' : 'hidden';
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}());

/* ── Desktop Nav Dropdown ──────────────────────────────────── */
(function () {
  document.querySelectorAll('.nav-has-dropdown').forEach(function (item) {
    var trigger = item.querySelector('a[aria-haspopup]');
    var dropdown = item.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;

    item.addEventListener('mouseenter', function () {
      trigger.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', function () {
      trigger.setAttribute('aria-expanded', 'false');
    });
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth >= 768) e.preventDefault();
    });
  });
}());
