# Case Studies für lokalbesucher.de – Bauarbeiter-Briefing

> **Zweck dieses Ordners:** 9 ausformulierte Case Studies, bereit zum Einbau in die Routen `/case-studies/{slug}/` der neuen lokalbesucher.de-Site.

---

## Dateien in diesem Ordner

| Datei | Kunde | Kennzahl | Branche |
|---|---|---|---|
| `01-battlekart.md` | BattleKart | 800+ Bewertungen in 9 Monaten | Freizeit & Entertainment |
| `02-ristorante-peperoncino.md` | Ristorante Peperoncino | +158% Aufrufe (8.309 → 21.410) | Gastronomie |
| `03-viabeauty.md` | Viabeauty | +388% Aufrufe | Beauty & Kosmetik |
| `04-orthoclinic-hamburg.md` | Orthoclinic Hamburg | +82% und Top 3 dauerhaft | Medizin & Gesundheit |
| `05-muhis-restaurant.md` | MUHIS Restaurant | +151% seit Profilstart | Gastronomie |
| `06-solar-richter.md` | Solar Richter | 0 → 16.000 Aufrufe/Monat | Handwerk & Energie |
| `07-elithera-physio.md` | Elithera Physio | +95% Suchanfragen in 3 Monaten | Medizin & Gesundheit |
| `08-praxis-theres.md` | Praxis Theres | +138% Aufrufe | Medizin & Ästhetik |
| `09-sanitaer-susak.md` | Sanitär Susak (Datteln) | +62,1%, Top für "heizung sanitär datteln" | Handwerk |

---

## Aufbau jeder Case-Study-Datei

Jede `.md`-Datei folgt dem exakt gleichen Schema:

### 1. Frontmatter (YAML)
```yaml
case_id: "01"
slug: "battlekart"
route: "/case-studies/battlekart/"
meta_title: "..."
meta_description: "..."
og_image: "..."
category: "..."
branche: "..."
region: "..."
zeitraum: "..."
headline_kennzahl: "..."
headline_label: "..."
headline_context: "..."
```
→ Das sind **alle Meta- und Hero-Daten** für die HTML-Seite. Direkt ins `<head>` und Hero-Block der Seite übernehmen.

### 2. Hero-Block
Inklusive Oberzeile, Headline, Subline, 3 Kennzahl-Tiles. → 1:1 in den Hero der Seite übernehmen.

### 3. Die Ausgangslage
2–3 Absätze Situationsbeschreibung. → Als ersten Content-Block einbauen.

### 4. Was wir gemacht haben
Mehrere fett-hervorgehobene Maßnahmen mit Erklärung. → Als Accordion oder Bulletpoint-Liste darstellen.

### 5. Das Ergebnis
Fazit mit Zahlen und Einordnung. → Als letzter Content-Block mit visueller Hervorhebung der Kernzahl.

### 6. Zitat-Platzhalter
Kursiver Placeholder für später einzuholendes Kundenzitat. → Als `<blockquote>` mit Edit-Hinweis (nicht live zeigen, bis Zitat da ist).

### 7. CTA-Block
Einheitlich: Headline, Subline, WhatsApp- und Erstgespräch-Button.

### 8. Related Cases
2 verwandte Cases für interne Verlinkung.

---

## Technische Einbau-Anweisungen

### Routen-Struktur
Jede Case Study bekommt eine eigene statische HTML-Datei unter:
```
/case-studies/battlekart/index.html
/case-studies/ristorante-peperoncino/index.html
...
```
Plus eine Übersichtsseite unter `/case-studies/index.html` mit Grid aller 9 Cases.

### Wiederverwendbares Template
Baue **eine** Template-Datei `case-study-template.html` und verwende sie für alle 9 Cases. Alle Unterschiede stecken in der Markdown-Datei und werden beim Rendern eingesetzt. Das macht spätere Design-Änderungen einfach (einmal ändern, für alle Cases wirksam).

### Schema.org Markup
Auf jeder Case-Study-Seite `Article`-Schema einbauen + `BreadcrumbList`:
```
Home > Case Studies > [Kundenname]
```

### SEO-Basics pro Seite
- `<title>` aus `meta_title`
- `<meta name="description">` aus `meta_description`
- Open Graph Tags aus `og_image`, `meta_title`, `meta_description`
- Canonical URL auf `route`
- `<link rel="next">` / `<link rel="prev">` zwischen Cases

### Übersichtsseite `/case-studies/`
- Grid mit Kacheln pro Case
- Jede Kachel: Headline-Kennzahl (z.B. "+388%"), Label, Kundenname, Branche, CTA "Case ansehen"
- Filterbar nach Branche (Medizin / Gastro / Handwerk / Beauty / Freizeit)

### Sprache & Tone
- **Du-Ansprache** in CTAs und Überleitungen
- Keine Floskeln, keine "wir freuen uns"-Phrasen
- Zahlen immer hervorgehoben (Zahl + farblicher Akzent)
- Fachbegriffe erklären, wenn nötig (nicht für Fachleute, sondern für mögliche Kunden)

### CI-Farben
- Navy `#1e365c` = Primär (Headlines, CTAs)
- Amber `#ffbd59` = Akzent (Kennzahlen, Highlights)

### CTAs
- WhatsApp-Link: `https://wa.me/4915122358883`
- Erstgespräch: Link zum GHL-Kalender (URL liefert Tobias)

---

## Wichtige Hinweise zur Datenethik

- **Alle Zahlen sind echt.** Nichts erfunden, nichts geschönt. Sollte eine Zahl nicht mehr aktuell sein, bitte Rücksprache vor Live-Gang.
- **Zitat-Platzhalter** sind mit `*[...]*` markiert. Diese Blöcke **nicht live schalten**, solange kein echtes Kundenzitat eingeholt wurde. Bis dahin: Zitat-Bereich komplett ausblenden oder als "Zitat folgt"-Hinweis im Dev-Modus lassen.
- **Keine KI-Zitate erfinden.** Nicht "ausdenken, wie der Kunde gesprochen haben könnte". Entweder echt oder weglassen.

---

## Reihenfolge der Umsetzung (Empfehlung)

1. **Template bauen** (`case-study-template.html`) – einmalige Vorarbeit
2. **Case 01 BattleKart einbauen** – als Pilotseite, vollständig durchtesten
3. **Feedback von Tobias** vor dem Rollout auf die anderen 8 einholen
4. **Cases 02–09 einbauen** – mit Copy-Paste des Templates
5. **Übersichtsseite `/case-studies/`** bauen
6. **Interne Verlinkung** von Homepage, Pillar-Pages und untereinander
7. **sitemap.xml** updaten
8. **Testing**: Mobile, Desktop, Schema-Markup-Validator, Lighthouse

---

**Erstellt am:** 24. April 2026
**Erstellt von:** Claude (Opus 4.7) für Tobias Frank / Lokalbesucher GmbH
**Quelldaten:** Aus den Chat-Aufzeichnungen bestehender Lokalbesucher-Kunden (2024–2026)
