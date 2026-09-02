# CLAUDE.md — lokalbesucher-website

> Dieses Dokument ist das vollständige Briefing für Claude Code.
> Es wird bei jeder Session automatisch eingelesen.
> Niemals gegen diese Maximen handeln — auch nicht wenn der Nutzer es kurzfristig anders formuliert.

---

## 1. PROJEKT-ÜBERSICHT

Wir bauen lokalbesucher.de komplett neu als statische HTML/CSS/JS Site auf Cloudflare Pages.
Migration von WordPress (TheGem/Elementor) zu purem HTML — kein Framework, kein Build-Tool.

- **Repo:** github.com/Lokalbesucher/lokalbesucher-website
- **Live-Domain:** lokalbesucher.de — **DNS-Umzug ERFOLGT, Site ist LIVE** auf Cloudflare Pages (Stand 2026-06). Achtung: jeder Push auf main geht direkt live!
- **Preview:** lokalbesucher-website.pages.dev
- **Hosting:** Cloudflare Pages (Free Plan)
- **Deployment:** Automatisch bei jedem Push auf main (~30 Sek.)

---

## 2. AUFTRAGGEBER

**Tobias Frank** — Inhaber Lokalbesucher GmbH
- Google Business Agentur aus dem **Kreis Recklinghausen**, NRW (Büro in Marl)
- Team: ~12 Mitarbeiter — **NIE öffentlich die Mitarbeiterzahl nennen** (Tobias findet „11/12 Leute" prahlerisch; `numberOfEmployees` aus Schema raus, Fließtext zahllos)
- Adresse: Karl-Breuing-Str. 2, 45770 Marl (offiziell, HRB 19857)
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

### 4.3 Cookie Consent — UMGESETZT (live)
**Strategie: Privacy by Design**
- Technisch notwendige Cookies (Cloudflare): kein Consent nötig
- Google Analytics 4 + Google Ads: nur nach Consent — GA4 Consent Mode v2
- Implementierung: **eigenes, self-hosted `assets/js/cookie-consent.js`** (DSGVO-konform, KEIN Klaro / kein 3rd-Party-Tool). localStorage-Key `lb-consent`, auf ALLEN Seiten eingebunden. (Hinweis: ältere CLAUDE-Versionen nannten Klaro.js — das wurde bewusst durch die eigene Lösung ersetzt.)
- "Nur notwendige" möglich — Marketing NIE vorausgewählt
- Consent widerrufbar jederzeit (Link "Cookie-Einstellungen" im Footer)

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
- **Headlines:** DM Sans 700/800
- **Body:** DM Sans 300/400/500
- **Mono:** DM Mono 400/500
- font-display: swap auf allen @font-face

> **Syne ist raus und kommt nicht zurück.** Tobias wollte diese Schrift nie;
> sie stand hier trotzdem jahrelang als Headline-Font und wurde dadurch immer
> wieder eingebaut (zuletzt über `scripts/generate-ratgeber.js`). Headlines
> laufen auf **DM Sans**, dieselbe Familie wie der Fließtext, nur fetter.
>
> **DM Sans ist ein Variable Font** (Achse `wght` 100–1000): `@font-face` braucht
> deshalb eine Gewichts-**Range** (`font-weight: 100 1000`), keinen festen Wert.
> Mit einem festen `font-weight: 700` meldet die Datei ihr Standardgewicht 400
> und der Browser rendert Überschriften dünn statt fett — genau dieser Fehler
> war monatelang live. Gilt für jede künftige Variable-Font-Einbindung.

### Design
- Dark Theme durchgängig
- Karten: surface-Hintergrund + border + border-radius: 16px
- Buttons: #ffbd59, dunkler Text, border-radius: 10px, DM Sans Bold
- Animationen: CSS-only, max 0.3s, ease-out
- Subtle Grid-Background Pattern
- Radiale Gelb-Gradient-Akzente in Hero-Bereichen

---

## 6. SEITENSTRUKTUR (URLs 1:1 für SEO!)

> **Stand 2026-06: Site ist live, alle folgenden Seiten existieren.** (Quelle der Wahrheit = Ordnerstruktur im Repo + `sitemap.xml`.)

**Kern / SEO**
| URL | Seite |
|-----|-------|
| `/` | Homepage (editorial Glow-up Design, live) |
| `/google-business-agentur/` | Pillar Page |
| `/bewertungsmanagement/` | Leistung Reputationsmanagement |
| `/faq/` | FAQ |
| `/google-business-optimierung-nr-1-fuer-lokale-sichtbarkeit-lokalbesucher/` | ROI Kalkulator |
| `/schema-org-generator/` | Tool (zieht Traffic) |
| `/ki-sichtbarkeits-check/` | Tool — fragt ChatGPT/Claude/Gemini live ab; Backend `functions/api/ai-check.js`, KV `AI_CHECK_KV`, Turnstile-geschützt, 3 Checks/IP/Tag |
| `/ratgeber/` | Ratgeber-Hub + Artikel auf Money-Keywords |

**Service-Landingpages** (conversion-optimiert, On-Page-Lead-Formular → geteilter GHL-Webhook, unterschieden per `source`)
| URL | `source` |
|-----|----------|
| `/meta-ads/` | `meta-ads` |
| `/google-ads/` | `google-ads` |
| `/seo-agentur/` | `seo-agentur` |
| `/social-media-agentur/` | `social-media-agentur` |

**Lokale Seiten** (Stadt-/Regio, kein Doorway — je eigener lokaler Content)
| URL | Notiz |
|-----|-------|
| `/werbeagentur-recklinghausen/` | Begriff „Werbeagentur", breiter Fokus |
| `/google-business-agentur-recklinghausen/` | Stadt-Seite Heimatmarkt, `source` = gleich URL |
| `/google-business-agentur-bochum/` | Stadt-Seite, Proof BattleKart + anon. Küchenstudio |

**Unternehmen**
| URL | Seite |
|-----|-------|
| `/unser-team/` | Team |
| `/jobs/` | Karriere |

**Case Studies** (9 Stück, mit Tobias abgestimmt & live)
`/case-studies/` (Übersicht) · `battlekart` · `ristorante-peperoncino` · `viabeauty` · `orthoclinic-hamburg` · `muhis-restaurant` · `solar-richter` · `elithera-physio` · `praxis-theres` · `sanitaer-susak`

**Rechtlich (Pflicht):** `/impressum/` · `/datenschutz/` · `/agb/`

**Mittelfristig geplant:** weitere NRW-Stadt-Seiten (z. B. Datteln) NUR mit echtem lokalem Beleg; ab ~4–5 Städten eine „Einzugsgebiet"/Standorte-Hub-Seite. Verlinkung der Städte aktuell über Footer-Block „Standorte" + Pillar/Home, nicht über Top-Nav.

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

### Assets: Version bei JEDER Änderung hochzählen
CSS und JS unter `/assets/` haben keine Fingerprints im Dateinamen. Alle
Verweise tragen deshalb `?v=JJJJMMTT` (Stand: `?v=2026090201`). **Wer
`global.css`, `lead.js`, `cookie-consent.js` oder `third-party.js` ändert, muss
diese Version auf allen Seiten hochzählen** — sonst sehen wiederkehrende
Besucher die Änderung bis zu 4 Stunden nicht. Früher stand `/assets/*` auf
`immutable` mit einem Jahr Haltbarkeit; Änderungen kamen dadurch praktisch nie
an. `_headers` liefert css/js jetzt mit `max-age=3600, stale-while-revalidate`,
Bilder und Fonts bleiben `immutable`.

Achtung: Cloudflare Pages **führt passende `_headers`-Regeln zusammen**, statt
sie zu ersetzen. Eine Sammelregel `/assets/*` vererbt ihr `immutable` an
`/assets/css/*` weiter — deshalb darf sie dort nicht stehen.

### CSS-Fallstrick: sticky Header
`overflow` auf einem **Vorfahren** des Headers (html, body) zerstört dessen
`position: sticky` — nachgemessen. Wenn dekorative Elemente seitlich
herausragen, wird deshalb `main { overflow-x: clip }` geklippt, niemals
html oder body.

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

**Ultimate: 279€/Monat** *(zzgl. 19% MwSt., Einrichtung: 379€, Laufzeit: 12 Monate)*
- 50+ Branchenverzeichnisse
- KI-Bewertungsantworten in unter 60 Min.
- 4 Posts/Monat auf 9 Plattformen
- Monatliches Reporting
- 600+ Profil-Updates/Jahr
- TapTag — WELTWEIT EINZIGARTIGES Produkt von Lokalbesucher:
  - Schlüsselanhänger (kein NFC-Chip!) mit individuellem QR-Code pro Mitarbeiter
  - Kunden scannen den QR-Code des jeweiligen Mitarbeiters → direkt zur Bewertung
  - Echtzeit-Dashboard: Bewertungen pro Mitarbeiter einsehbar
  - Monatliche Sachpreis-Verlosung unter allen Anhängern (bezahlt & versteuert von Lokalbesucher!)
  - Bisherige Preise: iPad, 4K TV, SmartWatch, Sony Noise Cancelling Kopfhörer
  - NIEMALS als "NFC-Chip" oder "NFC-System" bezeichnen — es ist ein Schlüsselanhänger mit QR-Code!
- 1 Bewertungslöschantrag/Woche

**NIEMALS schreiben:** "keine Mindestlaufzeit" — das ist FALSCH. Laufzeit ist 12 Monate.
**Kein Professional Paket — nirgendwo erwähnen!**

---

## 9. KEY FACTS

- 100+ betreute Unternehmen
- 3,9 Mio. Profilaufrufe generiert
- 780.000 Aktionen (Anrufe, Routen, Klicks)
- **Offizieller Google Partner** — echtes Original-Badge (`assets/images/google-partner-badge.svg`), verlinkt auf die Status-Seite `https://www.google.com/partners/agency?id=9897265706`. Wording: „Offizieller Google Partner" — **NIE** „zertifiziert"/„certified" (wir sind Partner, nicht zertifiziert) und NIE eigenen Text dazu erfinden.
- BattleKart Bochum (EVA-Erlebniscenter): 800+ Bewertungen in 9 Monaten — erster Standort, der TapTag testete; danach rollout auf weitere Standorte. Aktuell nur Bochum erwähnen.
- Peperoncino: +158% Aufrufe
- Schlosshotel NRW (ANONYM — nie namentlich nennen!): ROAS 40x organisch
- NIEMALS "Orthoclinic dauerhaft Top 3" schreiben — diese Aussage ist FALSCH
- **TapTag/Bewertungen-Wording:** Reputations**management** / -schutz, NIE „Bewertungen löschen" als Werbeversprechen (nur 1 Löschantrag/Woche bei rechtswidrigen Bewertungen ist Fakt, aber nicht als „wir löschen schlechte Bewertungen" framen).

---

## 10. KONTAKT

- WhatsApp: https://wa.me/4915122358883
- E-Mail: info@lokalbesucher.de
- Tel: +49 151 22358883
- Adresse: Karl-Breuing-Str. 2, 45770 Marl

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
cd "C:\lokalbesucher - webseite"
git add .
git commit -m "beschreibung auf deutsch"
git push origin main
# Cloudflare deployed automatisch in ~30 Sekunden
```

---

## 13. ARBEITSUMGEBUNG — KRITISCH

> Stand 2026-08: Entwicklung läuft auf **macOS**, nicht mehr auf Windows.

- **Arbeitsverzeichnis:** `~/Desktop/lokalbesucher-website` — IMMER, AUSNAHMSLOS
- Alle Dateien immer relativ zum Arbeitsverzeichnis anlegen
- In Node.js Scripts: `path.join(__dirname, ...)` nutzen statt absolute Pfade
- Temporäres nach `tmp/` im Projekt (steht in .gitignore), nicht nach `/tmp`
- Bei Fehler "ENOENT: no such file or directory": immer erst Ordner anlegen, dann Datei schreiben

**macOS-Fallstrick:** Der Schreibtisch-Ordner ist bei macOS gesondert geschützt.
Schlagen plötzlich alle Datei-Zugriffe mit `Operation not permitted` fehl (auch
`git status`), liegt es an der TCC-Berechtigung — **nicht** am Festplatten-
vollzugriff. Ein Befehl behebt es sofort, ohne Neustart und ohne Klick:
```
tccutil reset SystemPolicyDesktopFolder com.apple.Terminal
```

**Zwei weitere Repos gehören zum Gesamtbild** (eigene Codebases, eigener Deploy):
`Lokalbesucher/Reporting` (`~/Desktop/Reporting_Tool`, Worker unter
`/reporting/*`) und `Lokalbesucher/lokalisto` (`~/Desktop/lokalisto`, enthält
das Akquise-Check-Tool unter `/check/*`). Beide werden **manuell** deployed
(`npm run deploy`) — anders als diese Website, die bei jedem Push live geht.

---

## 14. ANALYTICS & TRACKING

### Google Analytics 4 + Google Ads
- GA4 Measurement ID: `G-KRKS5RL7MP`
- Google Ads: `AW-11287998127` — hängt als **eine Zeile** an derselben
  gtag-config, KEIN zweites `<script src=googletagmanager…>`. Die Bibliothek
  wird von `third-party.js` ohnehin geladen; ein zweiter Tag kostet PageSpeed.
- Das Ads-Konto zieht eine **zweite GA4-Property** (`G-D0NGSXYXNL`) mit — von
  Tobias so gewollt, in der Datenschutzerklärung §6 dokumentiert.
- Einbindung: via gtag.js, geladen erst nach `load` + idle durch `third-party.js`
- GA4 Consent Mode v2: `analytics_storage` und `ad_storage` default auf `denied`
- Nach Consent: beide auf `granted` setzen
- Tag in `<head>` aller Seiten einbauen — aber erst aktiv wenn Consent gegeben

### Google Search Console
- Verification: TXT-Record ist bereits in Cloudflare DNS vorhanden (`HXLOQvZw5-ZnBE_rEjG4SHi-wwMuk6irAUiaqGNIpOo`)
- Kein neuer Verification-Tag nötig — Search Console bleibt verbunden
- Nach DNS-Umzug: in Search Console neue Sitemap einreichen (`https://lokalbesucher.de/sitemap.xml`)
- Wichtig: nach Go-Live alle alten WordPress-URLs als "entfernt" markieren falls sie 404 werden

### Bing Webmaster Tools
- MS-Verification TXT-Record ist bereits vorhanden (`ms45748817`)
- Nach Go-Live ebenfalls Sitemap einreichen

---

## 15. SEO & GEO PLAYBOOK — JEDE SEITE

### 15.1 Entity-First Prinzip
Google 2026 rankt Business Entities, nicht Seiten. "Lokalbesucher GmbH" muss als Entität
mit konsistenten Attributen überall identisch auftreten: Website, GBP, Verzeichnisse, LinkedIn.

**Schema.org Stack — Pflicht auf jeder Seite:**
- `Organization` + `LocalBusiness` + `ProfessionalService` kombiniert (Homepage)
- `sameAs` verlinkt auf: GBP-URL, LinkedIn, ProvenExpert, Trustindex, Facebook
- `Person` für Tobias Frank als Experte/Autor mit E-E-A-T-Signalen
- `WebSite` mit `SearchAction` (Homepage)
- `Service` für jede einzelne Leistung (eigene Sections)
- `FAQPage` auf: Homepage, Pillar Page, FAQ-Seite
- `BreadcrumbList` auf allen Unterseiten
- `AggregateRating` — nur wenn echte sichtbare Bewertungen auf der Seite
- `GeoCoordinates` mit exakten Koordinaten Marl (51.6391° N, 7.1041° E)
- `areaServed` auf alle NRW-Städte + Deutschland

### 15.2 GEO — AI-Zitierbarkeit
50% der von AI zitierten Inhalte sind unter 13 Wochen alt — Frische ist kritisch.

**Jede Seite braucht:**
- **Answer Capsules:** Für jede Hauptfrage einen 50-60 Wort Absatz der direkt antwortet
  (kein Einleiten, keine Umschreibung — direkt die Antwort)
- **Fakten-Dichte:** Mindestens eine konkrete Zahl/Statistik alle 150-200 Wörter
  ("800+ Bewertungen", "+158% Aufrufe", "3,9 Mio. Profilaufrufe")
- **FAQ-Block** mit id-Anchors: `<div id="faq-was-kostet">` damit AI präzise zitieren kann
- **Datum der letzten Aktualisierung** sichtbar auf der Seite
- **Klare H2/H3-Struktur** die Fragen als Überschriften formuliert
  (z.B. "Was kostet eine Google Business Agentur?" statt "Preise")

### 15.3 E-E-A-T — Tobias Frank als Experte
- Autorenbox auf allen inhaltlichen Seiten: Foto, Name, Titel, 20 Jahre Erfahrung
- `Person` Schema mit `jobTitle`, `worksFor`, `sameAs` → LinkedIn
- Frühere Stationen nennen: Salesforce, Amazon, StepStone (Expertise-Beweis)
- Case Studies mit echten, verifizierbaren Zahlen
- Externe Verlinkungen zu Quellen stärken E-E-A-T

### 15.4 Lokale NRW-Signale
- "Recklinghausen", "NRW", "Ruhrgebiet", "Nordrhein-Westfalen" natürlich in Texte einbauen
- NAP in Footer: Karl-Breuing-Str. 2, 45770 Marl — identisch auf JEDER Seite
- Städte-Landingpages: **Bochum + Recklinghausen LIVE** (Gold-Standard-Blaupause). Weitere (Dortmund, Essen, Gelsenkirchen, Herne, Datteln …) NUR mit echtem lokalem Beleg pro Stadt — Inhalt je Stadt substanziell eigen, kein Name-Swap (Doorway-Risiko!). Verlinkung über Footer-Block „Standorte".
- Google Maps Einbettung auf Kontakt/Impressum-Seite

### 15.5 Content-Checkliste vor jedem Commit
Bevor eine Seite committed wird, prüfen:
- [ ] Title Tag: "[Hauptkeyword] | Lokalbesucher" (50-60 Zeichen)
- [ ] Meta Description: Call-to-Action + Keyword + USP (150-160 Zeichen)
- [ ] H1: exakt einmal, enthält Hauptkeyword + Ortsangabe
- [ ] Schema.org: validiert mit schema.org/validator Gedankengang
- [ ] Answer Capsule: erste Frage direkt in 50-60 Wörtern beantwortet
- [ ] Mindestens 3 konkrete Zahlen/Stats auf der Seite
- [ ] FAQ-Section mit FAQPage-Schema
- [ ] Canonical Tag korrekt
- [ ] OG-Tags vollständig
- [ ] WhatsApp-CTA above the fold

---

## 16. BUGS DER ALTEN SITE (beheben!)

- `info@domain.tld` → `info@lokalbesucher.de`
- Inkonsistente Navigation → eine einheitliche Nav
- Professional Paket auf Homepage → raus
- `/home/faq/` Redirect-Loop → fixen
- Social Icons als Plaintext → echte SVG Icons
- DNS erst umzeigen wenn neue Site komplett fertig!

---

## 17. BILDER — SEO-OPTIMIERT

Beim ersten Start dieses Projekts: Python-Script ausführen um alle Bilder von der
aktuellen WordPress-Site zu laden, in WebP zu konvertieren und SEO-konform zu benennen.

Script liegt unter: `scripts/download-images.py`
Ausführen mit: `python scripts/download-images.py`

### Bild-Mapping (WordPress-Original → SEO-Dateiname → Alt-Text)

| Original | Neuer Name | Alt-Text |
|----------|------------|----------|
| logo_708e...png | lokalbesucher-logo.webp | Lokalbesucher Logo — Google Business Agentur Recklinghausen |
| logo_453...png | lokalbesucher-logo-dark.webp | Lokalbesucher Logo dunkel |
| Lokalbesucher-Invers.png | lokalbesucher-logo-invers.webp | Lokalbesucher Logo weiß |
| HeroNew.png | lokalbesucher-google-business-agentur-hero.webp | Inhaberin lächelt — dank Lokalbesucher bei Google sichtbar in Recklinghausen |
| circle-home-3.webp | lokalbesucher-google-business-optimierung-nrw.webp | Google Business Optimierung NRW — Lokalbesucher Recklinghausen |
| About-2.png | lokalbesucher-team-google-business-experten.webp | Lokalbesucher Team — Google Business Experten aus Recklinghausen NRW |
| creative-agency-dark-01.webp | lokalbesucher-lokales-marketing-agentur.webp | Lokales Marketing für KMU — Lokalbesucher Agentur Recklinghausen |
| output-onlinepngtools-3.png | lokalbesucher-local-seo-nrw-google.webp | Local SEO NRW — Google Business Optimierung Lokalbesucher |
| wave-a.png | preisplan-welle-design-a.webp | Dekoratives Element Preisplan |
| wave-b.png | preisplan-welle-design-b.webp | Dekoratives Element Preisplan Ultimate |

### Regeln für alle Bilder
- Format: WebP (Qualität 85%)
- Dateinamen: lowercase, nur Bindestriche, keyword-reich, Ort/Region wenn sinnvoll
- Alt-Texte: beschreibend + keyword, max 125 Zeichen, kein "Bild von..."
- Dekorative Bilder: alt="" (leer)
- Logos: alt="Lokalbesucher Logo — Google Business Agentur Recklinghausen"
- Immer width + height Attribute angeben
- Lazy loading auf allem außer above-the-fold (loading="eager" für Hero)
- Neue Bilder die Tobias liefert: gleiches Schema anwenden

---

## 18. UMSETZUNGSREIHENFOLGE

**Phase 1 — Go-Live (alles ✅ ERLEDIGT):**
1. ✅ Adresse Karl-Breuing-Str. 2, 45770 Marl (GBP offiziell in Marl, NAP sitewide synchron)
2. ✅ `_headers`, `_redirects`, `robots.txt`
3. ✅ `sitemap.xml`
4. ✅ Cookie Consent — eigenes `cookie-consent.js` (nicht Klaro), Consent Mode v2
5. ✅ ROI Kalkulator + Schema Generator
6. ✅ Case Studies (9 Stück, mit Tobias abgestimmt) — live
7. ✅ DNS umgezogen — Site ist LIVE

**Phase 2 — laufend (aktueller Fokus):**
- Conversion-Service-LPs (meta/google/seo/social) — live, feeden geteilten GHL-Webhook
- Lokale Stadt-Seiten — Bochum + Recklinghausen live; weitere nur mit echtem Beleg
- **OFFEN (Tobias / per Browser-Prompt):** GHL-Workflow je `source` taggen (siehe Memory `project_tracking`)
- Design-Politur, GEO-/SEO-Feinschliff, weitere echte Bilder von Tobias einpflegen
