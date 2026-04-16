# CLAUDE.md — lokalbesucher-website

> Dieses Dokument ist das vollständige Briefing für Claude Code.
> Es wird bei jeder Session automatisch eingelesen.
> Niemals gegen diese Maximen handeln — auch nicht wenn der Nutzer es kurzfristig anders formuliert.

---

## 1. PROJEKT-ÜBERSICHT

Wir bauen lokalbesucher.de komplett neu als statische HTML/CSS/JS Site auf Cloudflare Pages.
Migration von WordPress (TheGem/Elementor) zu purem HTML — kein Framework, kein Build-Tool.

- **Repo:** github.com/Lokalbesucher/lokalbesucher-website
- **Live-Preview:** lokalbesucher-website.pages.dev
- **Ziel-Domain:** lokalbesucher.de (wird umgezogen wenn Site fertig und getestet ist)
- **Hosting:** Cloudflare Pages (Free Plan)
- **Deployment:** Automatisch bei jedem Push auf main

---

## 2. AUFTRAGGEBER

**Tobias Frank** — Inhaber Lokalbesucher GmbH
- Google Business Agentur, Recklinghausen, NRW
- Team: ~11 Mitarbeiter
- Adresse: Münsterstr. 13-15, 45657 Recklinghausen
- Zielgruppe: KMU in Deutschland die lokal bei Google gefunden werden wollen
- Erfahrung: ~20 Jahre Sales & Marketing (Salesforce, Amazon, StepStone)

---

## 3. UNSERE MAXIME — NICHT VERHANDELBAR

### 3.1 Extreme Performance
- Core Web Vitals Ziel: **100/100** auf PageSpeed Insights (Mobile + Desktop)
- LCP: unter 1 Sekunde
- CLS: 0
- FID/INP: unter 50ms
- Keine externen Fonts die blockieren — Fonts self-hosted, font-display: swap
- Kein jQuery, kein Bootstrap, kein unnötiges JS
- Bilder: WebP, korrekte Dimensionen, lazy loading, width/height immer angegeben
- CSS inline für above-the-fold, Rest async
- Kein render-blocking JavaScript

### 3.2 Unvergleichliches Nutzererlebnis
- Jede Seite hat einen klaren CTA above the fold — immer
- Mobile first — alles wird zuerst für Mobile gebaut
- Smooth Scrolling, subtile CSS-Animationen
- Kein Clutter, keine ablenkenden Elemente
- Formulare: so wenig Felder wie möglich

### 3.3 Maximale SEO & GEO-Performance
- Ziel: Seite 1 bei Google für "Google Business Agentur NRW"
- Ziel: Top-Erwähnungen in ChatGPT, Perplexity, Claude, Gemini
- Jede Seite: eindeutiger Title Tag, Meta Description, H1 (nur einmal), logische H2/H3-Struktur
- Schema.org JSON-LD auf jeder Seite — mindestens: Organization, WebSite, BreadcrumbList
- NAP konsistent auf jeder Seite im Footer
- Canonical Tags, Open Graph, Twitter Cards auf jeder Seite
- GEO-Optimierung: faktendichte, präzise Texte die LLMs direkt als Quelle nutzen

### 3.4 Conversion First
- Primäres Ziel jeder Seite: WhatsApp-Kontakt oder Formular-Anfrage
- WhatsApp immer: https://wa.me/4915122358883
- CTA-Farbe immer #ffbd59 — nie eine andere Farbe für primäre CTAs
- Social Proof auf jeder relevanten Seite

---

## 4. RECHTLICHE ANFORDERUNGEN — DEUTSCHES RECHT

### 4.1 Impressum (§5 TMG) — PFLICHT
- Vollständiges Impressum auf `/impressum/`
- Link im Footer auf JEDER Seite
- Innerhalb von 2 Klicks von jeder Seite erreichbar

### 4.2 Datenschutzerklärung (DSGVO) — PFLICHT
- Vollständige Datenschutzerklärung auf `/datenschutz/`
- Abdecken: Verantwortlicher, Cookies, GA4, Kontaktformular, Hosting (Cloudflare), externe Dienste, Betroffenenrechte
- Link im Footer auf JEDER Seite
- Datum der letzten Aktualisierung angeben

### 4.3 Cookie Consent — PFLICHT VOR GO-LIVE
**Strategie: Privacy by Design**
- Technisch notwendige Cookies (Cloudflare): kein Consent nötig
- Google Analytics 4: nur nach Consent — GA4 Consent Mode v2
- Implementierung: **Klaro.js** (Open Source, kostenlos, DSGVO-konform)
- "Nur notwendige" als vorausgewählte Option — Marketing NIE vorausgewählt
- Consent in localStorage, widerrufbar jederzeit
- Link "Cookie-Einstellungen" im Footer

### 4.4 Barrierefreiheit (WCAG 2.1 AA)
- Alle Bilder: aussagekräftige alt-Texte, dekorative Bilder: alt=""
- Kontrastverhältnis: min. 4.5:1 für normalen Text
- Keyboard-Navigation: alle interaktiven Elemente per Tab erreichbar
- Sichtbarer Focus-Ring — nie outline: none ohne Alternative
- Semantisches HTML: header, nav, main, footer, article, section korrekt
- Überschriften-Hierarchie: H1 → H2 → H3, keine Sprünge
- Formulare: jedes input hat ein verbundenes label
- Skip-Link: "Zum Hauptinhalt springen" als erstes Element
- Keine reinen Farb-Informationen

### 4.5 Sonstige Pflichten
- Preise immer: netto + "zzgl. 19% MwSt."
- Externe Links: rel="noopener noreferrer"
- E-Mail: info@lokalbesucher.de (nie info@domain.tld — das ist ein Bug!)
- Nur lizenzierte oder selbst erstellte Bilder verwenden

---

## 5. CI / DESIGN-SYSTEM

### Farben
```css
--bg:       #0c0e1a;
--surface:  #111328;
--surface2: #181b35;
--border:   #1e2240;
--yellow:   #ffbd59;  /* PRIMARY CTA */
--blue:     #4f82ff;
--green:    #3ecf8e;
--red:      #ff5c5c;
--text:     #e8eaf6;
--muted:    #6b7099;
```

### Typografie (self-hosted — DSGVO!)
- **Headlines:** Syne 700/800
- **Body:** DM Sans 300/400/500
- **Mono:** DM Mono 400/500
- font-display: swap auf allen @font-face

### Design
- Dark Theme durchgängig
- Karten: surface-Hintergrund + border + border-radius: 16px
- Buttons: #ffbd59, dunkler Text, border-radius: 10px, Syne Bold
- Animationen: CSS-only, max 0.3s, ease-out
- Subtle Grid-Background Pattern
- Radiale Gelb-Gradient-Akzente in Hero-Bereichen

---

## 6. SEITENSTRUKTUR (URLs 1:1 für SEO!)

| URL | Seite | Prio |
|-----|-------|------|
| `/` | Homepage | P1 |
| `/google-business-agentur/` | Pillar Page | P1 |
| `/faq/` | FAQ | P1 |
| `/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/` | ROI Kalkulator | P2 |
| `/schema-org-generator/` | Tool | P2 |
| `/case-studies/` | Übersicht | P2 |
| `/case-studies/battlekart/` | Case Study | P2 |
| `/case-studies/orthoclinic/` | Case Study | P2 |
| `/case-studies/janel-saal/` | Case Study | P2 |
| `/case-studies/schlosshotel-westerholt/` | Case Study | P2 |
| `/case-studies/stephan-schnieder/` | Case Study | P2 |
| `/impressum/` | Impressum | Pflicht |
| `/datenschutz/` | Datenschutz | Pflicht |

---

## 7. TECHNISCHE STANDARDS

### Dateistruktur
```
/
├── index.html
├── google-business-agentur/index.html
├── faq/index.html
├── impressum/index.html
├── datenschutz/index.html
├── case-studies/index.html
├── case-studies/battlekart/index.html
├── assets/
│   ├── css/global.css
│   ├── js/components.js
│   ├── fonts/          (self-hosted)
│   └── images/         (WebP, optimiert)
├── _redirects
├── _headers
├── sitemap.xml
└── robots.txt
```

### Pflicht-Tags jede Seite
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[Titel] | Lokalbesucher</title>
<meta name="description" content="[150-160 Zeichen]">
<link rel="canonical" href="https://lokalbesucher.de/[pfad]/">
<meta property="og:title">
<meta property="og:description">
<meta property="og:image">
<meta property="og:url">
<script type="application/ld+json">/* Schema.org */</script>
```

### _headers
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### _redirects
- `/home/faq/` → `/faq/` 301 (Redirect-Loop-Bug fixen)
- Alle alten WordPress-URLs → neue URLs 301

---

## 8. PRODUKT — NUR ULTIMATE PAKET!

**Ultimate: 279€/Monat** *(zzgl. 19% MwSt., Einrichtung: 379€)*
- 50+ Branchenverzeichnisse
- KI-Bewertungsantworten in unter 60 Min.
- 4 Posts/Monat auf 9 Plattformen
- Monatliches Reporting
- 600+ Profil-Updates/Jahr
- TapTag NFC-Bewertungssystem
- 1 Bewertungslöschantrag/Woche

**Kein Professional Paket — nirgendwo erwähnen!**

---

## 9. KEY FACTS

- 100+ betreute Unternehmen
- 3,9 Mio. Profilaufrufe generiert
- 780.000 Aktionen (Anrufe, Routen, Klicks)
- BattleKart: 800+ Bewertungen in 9 Monaten
- Peperoncino: +158% Aufrufe
- Schlosshotel: ROAS 40x
- Orthoclinic: dauerhaft Top 3

---

## 10. KONTAKT

- WhatsApp: https://wa.me/4915122358883
- E-Mail: info@lokalbesucher.de
- Tel: +49 151 22358883
- Adresse: Münsterstr. 13-15, 45657 Recklinghausen

---

## 11. TONE OF VOICE

- **Du-Ansprache** — nie "Sie"
- Direkt, modern, faktenbezogen
- Kurze Sätze, Zahlen bevorzugen
- Kein "Sehr geehrte", kein Behörden-Deutsch
- Aktiv statt passiv

---

## 12. GIT WORKFLOW

```powershell
cd C:\Users\Admin\Documents\lokalbesucher-website
git add .
git commit -m "beschreibung"
git push origin main
# Cloudflare deployed automatisch in ~30 Sekunden
```

---

## 13. BUGS DER ALTEN SITE (beheben!)

- `info@domain.tld` → `info@lokalbesucher.de`
- Inkonsistente Navigation → eine einheitliche Nav
- Professional Paket auf Homepage → raus
- `/home/faq/` Redirect-Loop → fixen
- Social Icons als Plaintext → echte SVG Icons
- DNS erst umzeigen wenn neue Site komplett fertig!

---

## 14. UMSETZUNGSREIHENFOLGE

1. `global.css`, `_headers`, `_redirects`, `robots.txt`, Fonts
2. Homepage (`/`) — P1
3. Pillar Page (`/google-business-agentur/`) — P1
4. FAQ (`/faq/`) — P1
5. Impressum + Datenschutz — Pflicht
6. Cookie Consent (Klaro) — Pflicht vor Go-Live
7. Case Studies — P2
8. ROI Kalkulator + Schema Generator — P2
9. sitemap.xml — vor Go-Live
10. DNS umzeigen — erst wenn alles fertig!
