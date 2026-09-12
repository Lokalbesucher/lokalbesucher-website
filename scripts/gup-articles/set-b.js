/* Set B — Cluster-Artikel zum Google Unternehmensprofil (Hub: /google-unternehmensprofil/)
   Format identisch zu ARTICLES in scripts/generate-ratgeber.js */
const D = '2026-09-12', DN = '12. September 2026';

export default [

/* ── 5. KATEGORIEN ─────────────────────────────── */
{
  slug: 'google-unternehmensprofil-kategorien', date: D, dateNice: DN,
  tag: 'Ranking', crumb: 'Kategorien im Unternehmensprofil',
  title: 'Google Unternehmensprofil: Kategorie richtig wählen | Lokalbesucher',
  metaDesc: 'Die Hauptkategorie ist der stärkste Rankinghebel im Google Unternehmensprofil. So wählst du die richtige – und so viele Zusatzkategorien sind wirklich sinnvoll.',
  h1: 'Google Unternehmensprofil Kategorien:<br>So wählst du die richtige Hauptkategorie',
  heroSub: 'Eine falsche Hauptkategorie kostet dich mehr Sichtbarkeit als jeder andere Fehler im Profil. Hier steht, wie du sie richtig setzt – und wann Zusatzkategorien helfen oder schaden.',
  heroCta: 'Kostenlosen Kategorie-Check via WhatsApp',
  waText: 'Hallo%20Tobias%2C%20k%C3%B6nnt%20ihr%20pr%C3%BCfen%2C%20ob%20die%20Kategorien%20in%20meinem%20Google%20Unternehmensprofil%20richtig%20gesetzt%20sind%3F',
  capsule: 'Die <strong>Hauptkategorie</strong> entscheidet, für welche Suchanfragen dein Google Unternehmensprofil überhaupt infrage kommt. Wähle die spezifischste Kategorie, die dein Kerngeschäft beschreibt („Pizzeria" statt „Restaurant"). Ergänze <strong>2–5 Zusatzkategorien</strong> nur für Leistungen, die du wirklich anbietest. Google stellt rund <strong>4.000 Kategorien</strong> zur Auswahl – Fantasiebegriffe gibt es nicht, du wählst aus der Liste.',
  body: `        <h2 id="warum-hauptkategorie">Warum die Hauptkategorie der stärkste Rankinghebel ist</h2>
        <p>Google sortiert lokale Ergebnisse nach drei Faktoren: Relevanz, Entfernung und Bekanntheit. Die Kategorie ist das Herz der Relevanz. Sucht jemand „Zahnarzt in der Nähe", zeigt Google im Local Pack nur Profile, deren Kategorie zu dieser Suche passt. Steht bei dir „Arzt" statt „Zahnarzt", bist du für diese Suche schlicht nicht im Rennen – egal wie viele Bewertungen du hast.</p>
        <p>Die Hauptkategorie wiegt dabei deutlich schwerer als jede Zusatzkategorie. Sie bestimmt außerdem, welche Funktionen dein Profil bekommt: Restaurants können Speisekarten und Reservierungen einbinden, Hotels bekommen Ausstattungsmerkmale, Dienstleister können Leistungen mit Preisen anlegen. Mit der falschen Hauptkategorie fehlen dir diese Werkzeuge komplett.</p>
        <p>Aus der Praxis: Bei über 100 betreuten Unternehmen ist die Kategorie der häufigste Einzelfehler, den wir bei der Übernahme eines Profils korrigieren. Und es ist der Fehler mit dem schnellsten Effekt – eine korrigierte Hauptkategorie zeigt oft schon nach wenigen Tagen mehr Profilaufrufe.</p>

        <h2 id="richtige-kategorie-finden">Wie findest du die richtige Hauptkategorie?</h2>
        <p>Die Regel ist einfach: <strong>So spezifisch wie möglich, so allgemein wie nötig.</strong> Google selbst empfiehlt, die Kategorie zu wählen, die dein Kerngeschäft am genauesten beschreibt. Drei Fragen helfen bei der Entscheidung:</p>
        <ol>
          <li><strong>Womit verdienst du das meiste Geld?</strong> Nicht: Was bietest du alles an? Ein Betrieb, der zu 80 % Pizza verkauft und nebenbei Pasta, ist eine Pizzeria.</li>
          <li><strong>Wonach suchen deine besten Kunden?</strong> Wer „Kieferorthopäde" sucht, will keine Liste allgemeiner Zahnärzte. Wer „Fahrradwerkstatt" sucht, klickt nicht auf „Fahrradgeschäft".</li>
          <li><strong>Welche Kategorie nutzt der Wettbewerber, der im Local Pack ganz oben steht?</strong> Das ist der beste Realitätscheck, den du bekommen kannst.</li>
        </ol>
        <p>So prüfst du die Kategorie eines Wettbewerbers: Öffne sein Profil bei Google Maps. Direkt unter dem Namen steht die Hauptkategorie in grauer Schrift. Zusatzkategorien zeigt Google nicht direkt an – sie sind aber im Quelltext des Knowledge Panels sichtbar, und Browser-Erweiterungen wie „GMB Everywhere" oder „Pleper" blenden sie ein. Prüfe die drei Top-Profile deiner wichtigsten Suchanfrage und notiere, welche Hauptkategorie sie gemeinsam haben. In den meisten Branchen ist das eindeutig.</p>

        <h2 id="beispiele">Beispiele: Gut und schlecht gewählte Kategorien</h2>
        <div class="tablewrap"><table class="ptable">
          <tr><th>Betrieb</th><th>Zu allgemein</th><th>Richtig</th><th>Sinnvolle Zusatzkategorien</th></tr>
          <tr><td>Italiener mit Holzofen</td><td>Restaurant</td><td>Pizzeria</td><td>Italienisches Restaurant, Lieferservice</td></tr>
          <tr><td>Praxis für Zahnspangen</td><td>Zahnarzt</td><td>Kieferorthopäde</td><td>Zahnarzt (nur wenn du auch allgemeine Zahnmedizin anbietest)</td></tr>
          <tr><td>Heizungsbauer mit Notdienst</td><td>Handwerker</td><td>Heizungsinstallateur</td><td>Sanitärinstallateur, Klempner</td></tr>
          <tr><td>Kosmetikstudio mit Wimpernfokus</td><td>Schönheitssalon</td><td>Wimpernstudio</td><td>Kosmetikstudio, Nagelstudio</td></tr>
          <tr><td>Rechtsanwalt für Arbeitsrecht</td><td>Rechtsanwalt</td><td>Fachanwalt für Arbeitsrecht</td><td>Rechtsanwalt, Anwaltskanzlei</td></tr>
        </table></div>
        <p>Beachte: Bei manchen Berufen gibt es die spezifische Kategorie nicht. Dann nimmst du die nächstliegende allgemeine Kategorie und arbeitest die Spezialisierung über Leistungen, Beschreibung und Beiträge heraus. Erfundene Kategorien gibt es nicht – Google gibt die Liste vor, du wählst aus ihr aus.</p>

        <h2 id="zusatzkategorien">Wie viele Zusatzkategorien sind sinnvoll?</h2>
        <p>Google erlaubt bis zu <strong>9 Zusatzkategorien</strong>. Das heißt nicht, dass du sie ausschöpfen solltest. Jede Zusatzkategorie verwässert das Signal der Hauptkategorie ein wenig. Die Faustregel aus unserer Arbeit: <strong>2 bis 5 Zusatzkategorien</strong>, und jede einzelne muss zwei Bedingungen erfüllen:</p>
        <ul>
          <li><strong>Du bietest die Leistung tatsächlich an</strong> – nicht nur auf Nachfrage, sondern als festen Teil deines Angebots.</li>
          <li><strong>Kunden suchen danach getrennt.</strong> Eine Pizzeria, die auch liefert, gewinnt mit „Lieferservice" eine eigene Suchwelt. „Café" als Zusatz bringt ihr nichts, wenn niemand für einen Cappuccino kommt.</li>
        </ul>
        <p>Der klassische Fehler: Ein Autohaus trägt „Autowerkstatt", „Autohändler", „Gebrauchtwagenhändler", „Reifenhandel", „Autoglaserei", „Autowaschanlage" und „Abschleppdienst" ein – und rankt am Ende für nichts richtig gut. Besser: Hauptkategorie „Autohändler", Zusatz „Autowerkstatt" und „Gebrauchtwagenhändler". Fertig.</p>

        <h2 id="kategorie-vs-leistungen">Kategorie oder Leistung – was gehört wohin?</h2>
        <p>Neben den Kategorien kannst du im Profil <strong>Leistungen</strong> anlegen – frei benannt, mit Beschreibung und optional Preis. Das ist der richtige Ort für alles, was keine eigene Kategorie verdient. Der Heizungsbauer trägt „Wärmepumpe installieren", „Heizung warten" und „Gasthermenwechsel" als Leistungen ein, nicht als Kategorien. Google liest diese Leistungen mit und ordnet dein Profil auch dafür ein, wenn auch schwächer als über die Kategorie. Was in Leistungen, Beschreibung und Fotos noch drin steckt, steht im Artikel <a href="/ratgeber/google-unternehmensprofil-optimieren/">Google Unternehmensprofil optimieren</a>.</p>

        <h2 id="kategorie-wechseln">Was passiert, wenn du die Kategorie wechselst?</h2>
        <p>Ein Wechsel der Hauptkategorie ist jederzeit möglich: Profil bei Google öffnen, „Profil bearbeiten", Abschnitt „Unternehmenskategorie". Drei Dinge solltest du wissen, bevor du klickst:</p>
        <ol>
          <li><strong>Google kann eine erneute Bestätigung verlangen.</strong> Wechselst du in eine Kategorie, die stark von der bisherigen abweicht (aus „Blumenladen" wird „Steuerberater"), schaltet Google das Profil teilweise auf „Bestätigung erforderlich" – meist per Video. Wie das läuft, steht im Artikel <a href="/ratgeber/google-unternehmensprofil-verifizieren/">Google Unternehmensprofil verifizieren</a>.</li>
          <li><strong>Die Änderung wird geprüft.</strong> Google nimmt Kategorieänderungen nicht immer sofort an. Bis zu 3 Werktage sind normal; in dieser Zeit steht am Eintrag „wird überprüft".</li>
          <li><strong>Rankings verschieben sich.</strong> Du verlierst Sichtbarkeit für die alte Kategorie und gewinnst sie für die neue. Bei einer Korrektur zum Spezifischeren ist das gewollt – die Aufrufe steigen in der Regel, weil die Klickrate der passenderen Suchenden höher ist.</li>
        </ol>
        <p>Ein Wechsel aus Ranking-Gründen in eine Kategorie, die nicht zu deinem Geschäft passt, ist ein Richtlinienverstoß. Google prüft das über Website, Fotos und Nutzermeldungen. Wird es entdeckt, droht die Sperrung – und dann ist die gesamte Sichtbarkeit weg, nicht nur die der einen Kategorie. Was du dann tun kannst, steht im Artikel <a href="/ratgeber/google-unternehmensprofil-gesperrt/">Google Unternehmensprofil gesperrt</a>.</p>

        <h2 id="dienstleister-ohne-laden">Kategorien für Dienstleister ohne Ladenlokal</h2>
        <p>Handwerker, Pflegedienste, mobile Friseure, Gebäudereiniger: Betriebe, die zum Kunden fahren, tragen kein Ladengeschäft ein, sondern ein <strong>Einzugsgebiet</strong>. Die Kategorie funktioniert trotzdem genauso – nur konkurrierst du nicht mit den Betrieben in deiner Straße, sondern mit allen, die dasselbe Einzugsgebiet angeben. Umso wichtiger ist die Spezifik: „Elektriker" rankt für Notdienst-Suchen schlechter als „Elektro-Notdienst", wenn das dein Kerngeschäft ist. Beachte außerdem, dass Google bei Dienstleistern ohne Ladenlokal Kategorien ablehnt, die zwingend ein Geschäft voraussetzen – „Möbelgeschäft" für einen mobilen Küchenmonteur wird nicht akzeptiert.</p>

        <h2 id="schritt-fuer-schritt">Schritt für Schritt: Kategorie im Profil ändern</h2>
        <ol>
          <li>Bei Google mit dem Konto einloggen, das das Profil verwaltet, und nach deinem Firmennamen suchen.</li>
          <li>Im Profil auf <strong>„Profil bearbeiten"</strong> klicken, dann auf <strong>„Unternehmensinformationen"</strong>.</li>
          <li>Unter <strong>„Unternehmenskategorie"</strong> die Hauptkategorie anklicken. Tippe die ersten Buchstaben ein – Google schlägt passende Kategorien aus seiner Liste vor.</li>
          <li>Über <strong>„Weitere Kategorie hinzufügen"</strong> die Zusatzkategorien ergänzen. Die Reihenfolge spielt keine Rolle, nur die Hauptkategorie ist besonders.</li>
          <li>Speichern. Die Änderung steht danach auf „wird überprüft" – meist ist sie innerhalb von 3 Werktagen live.</li>
        </ol>
        <p>Google zeigt im Profil inzwischen auch Kategorie-Vorschläge („Vorgeschlagene Kategorien"). Sie basieren auf Nutzerverhalten und Wettbewerbern. Prüfe sie kritisch: Ein Vorschlag ist eine Idee, keine Empfehlung – übernimm ihn nur, wenn er die beiden Bedingungen von oben erfüllt.</p>

        <h2 id="haeufige-fehler">Die fünf häufigsten Kategorie-Fehler</h2>
        <ul>
          <li><strong>Die Oberkategorie als Hauptkategorie.</strong> „Restaurant", „Arzt", „Handwerker" – zu breit, zu viel Konkurrenz, zu wenig Relevanz für die konkrete Suche.</li>
          <li><strong>Alle neun Zusatzkategorien ausgeschöpft.</strong> Google versteht dann nicht mehr, wofür du stehst.</li>
          <li><strong>Kategorie nach Ranking statt nach Geschäft gewählt.</strong> Das ist ein Richtlinienverstoß und ein Sperrgrund.</li>
          <li><strong>Kategorie seit Jahren nicht geprüft.</strong> Google ergänzt die Liste laufend. Gab es früher nur „Fitnessstudio", gibt es heute auch „Personal Trainer", „EMS-Studio" und „Yogastudio". Einmal im Jahr prüfen, ob eine spezifischere Kategorie hinzugekommen ist.</li>
          <li><strong>Leistungen als Kategorien eingetragen.</strong> „Wärmepumpe" ist keine Kategorie, sondern eine Leistung – und gehört in den Bereich Leistungen.</li>
        </ul>

        <h2 id="kategorien-und-standorte">Sonderfall: Mehrere Geschäftsbereiche unter einem Dach</h2>
        <p>Ein Hotel mit Restaurant, ein Autohaus mit Werkstatt, eine Praxis mit zwei Fachrichtungen: Hier hilft manchmal ein <strong>zweites Profil</strong> mit eigener Hauptkategorie. Google erlaubt das, wenn der Bereich einen eigenen Namen, eigene Öffnungszeiten oder einen eigenen Eingang hat – klassisch das Hotelrestaurant, das auch externe Gäste bewirtet. Ist der zweite Bereich nur eine Abteilung ohne eigene Identität, bleibt es bei einem Profil mit Zusatzkategorie. Zwei Profile für einen einzigen Betrieb sind ein Duplikat und werden zusammengelegt oder entfernt.</p>

        <div class="statbox">
          <div><div class="n">~4.000</div><p>Kategorien stellt Google zur Auswahl – erfundene Begriffe gibt es nicht</p></div>
          <div><div class="n">1 + 9</div><p>Eine Hauptkategorie, maximal neun Zusatzkategorien</p></div>
          <div><div class="n">2–5</div><p>Zusatzkategorien sind in der Praxis der Sweet Spot</p></div>
        </div>
        <p>Die Kategorie ist der erste Schritt. Alle weiteren – von der Beschreibung über Fotos bis zu Bewertungen – findest du gebündelt in <a href="/google-unternehmensprofil/">Google Unternehmensprofil: der komplette Leitfaden</a>. Und wenn du das Thema lieber komplett abgeben willst: Die Kategorie-Analyse gegen deine Top-3-Wettbewerber ist der erste Punkt, den wir bei jeder <a href="/google-business-agentur/">Profil-Optimierung</a> erledigen.</p>`,
  faqTitle: 'Häufige Fragen zu Kategorien im Google Unternehmensprofil',
  faqs: [
    { id: 'faq-wie-viele-kategorien', q: 'Wie viele Kategorien darf ein Google Unternehmensprofil haben?', a: 'Eine Hauptkategorie plus bis zu neun Zusatzkategorien, insgesamt also zehn. Sinnvoll sind in der Praxis zwei bis fünf Zusatzkategorien – jede muss eine Leistung beschreiben, die du tatsächlich anbietest und nach der Kunden getrennt suchen.' },
    { id: 'faq-eigene-kategorie', q: 'Kann ich eine eigene Kategorie anlegen?', a: 'Nein. Google gibt eine feste Liste mit rund 4.000 Kategorien vor, aus der du auswählst. Gibt es deine exakte Spezialisierung nicht, nimmst du die nächstliegende allgemeine Kategorie und beschreibst die Spezialisierung über Leistungen, die Unternehmensbeschreibung und Beiträge.' },
    { id: 'faq-kategorie-wettbewerber', q: 'Wie sehe ich die Kategorie eines Wettbewerbers?', a: 'Öffne sein Profil bei Google Maps – die Hauptkategorie steht direkt unter dem Firmennamen. Zusatzkategorien zeigt Google nicht offen an; Browser-Erweiterungen wie GMB Everywhere oder Pleper blenden sie ein. Prüfe die drei Top-Profile deiner wichtigsten Suchanfrage und übernimm die Hauptkategorie, die sie gemeinsam haben.' },
    { id: 'faq-kategorie-aendern-folgen', q: 'Muss ich mein Profil nach einem Kategoriewechsel neu bestätigen?', a: 'Nicht immer. Bei kleinen Anpassungen („Restaurant" zu „Pizzeria") übernimmt Google die Änderung meist innerhalb von drei Werktagen. Bei einem Wechsel in eine völlig andere Branche verlangt Google häufig eine erneute Bestätigung, in der Regel per Video-Verifizierung.' },
    { id: 'faq-hauptkategorie-ranking', q: 'Wie stark beeinflusst die Hauptkategorie das Ranking?', a: 'Sie ist der stärkste einzelne Hebel innerhalb des Profils. Die Hauptkategorie entscheidet, ob dein Profil für eine Suchanfrage überhaupt in Betracht kommt. Bewertungen, Fotos und Beiträge entscheiden danach, ob du vor oder hinter deinen Wettbewerbern stehst.' },
    { id: 'faq-kategorie-falsch-gewaehlt', q: 'Was passiert, wenn ich eine Kategorie wähle, die nicht zu meinem Betrieb passt?', a: 'Das verstößt gegen die Google-Richtlinien. Google gleicht Kategorien mit Website, Fotos und Nutzermeldungen ab. Wird der Verstoß erkannt, kann das Profil gesperrt werden – und damit ist die gesamte lokale Sichtbarkeit weg, nicht nur die der falschen Kategorie.' }
  ],
  related: [
    { href: '/google-unternehmensprofil/', label: 'Google Unternehmensprofil: der komplette Leitfaden' },
    { href: '/ratgeber/google-unternehmensprofil-optimieren/', label: 'Google Unternehmensprofil optimieren' },
    { href: '/ratgeber/google-maps-top-3-ranking/', label: 'Top 3 bei Google Maps' }
  ],
  ctaLabel: 'Kategorie-Check gegen deine Wettbewerber',
  ctaTitle: 'Wir prüfen, ob dein Profil für die richtigen Suchen infrage kommt', ctaDesc: 'Wir vergleichen deine Kategorien mit den drei Top-Profilen deiner wichtigsten Suchanfrage und sagen dir ehrlich, was zu ändern ist. Kostenlos.',
  ctaBtn: 'Kategorie-Check via WhatsApp', ctaGhost: 'Zum kompletten Leitfaden →', ctaGhostHref: '/google-unternehmensprofil/'
},

/* ── 6. BEITRÄGE ───────────────────────────────── */
{
  slug: 'google-unternehmensprofil-beitraege', date: D, dateNice: DN,
  tag: 'Content', crumb: 'Beiträge im Unternehmensprofil',
  title: 'Beiträge im Google Unternehmensprofil richtig nutzen | Lokalbesucher',
  metaDesc: 'Beiträge im Google Unternehmensprofil bringen Klicks und zeigen, dass dein Profil lebt. Alle Typen, Bildmaße, Laufzeiten, Redaktionsplan und 6 häufige Fehler.',
  h1: 'Beiträge im Google Unternehmensprofil:<br>Was sie bringen und wie du sie richtig nutzt',
  heroSub: 'Drei Beitragstypen, ein paar Regeln, ein einfacher Plan – und dein Profil sieht für Google und für Kunden nie wieder verwaist aus.',
  heroCta: 'Kostenlosen Profil-Check via WhatsApp',
  waText: 'Hallo%20Tobias%2C%20lohnen%20sich%20Beitr%C3%A4ge%20im%20Google%20Unternehmensprofil%20f%C3%BCr%20meinen%20Betrieb%3F',
  capsule: 'Beiträge sind kurze Meldungen mit Bild, die direkt in deinem Google Unternehmensprofil erscheinen. Es gibt drei Typen: <strong>Neuigkeiten, Angebote und Veranstaltungen</strong>. Sie bringen zusätzliche Klicks, Anrufe und Anfragen und signalisieren Google, dass dein Profil aktiv gepflegt wird. Empfohlener Rhythmus: <strong>mindestens 1 Beitrag pro Woche</strong>, Bild im Format 1200×900 Pixel, Text unter 300 Zeichen.',
  body: `        <h2 id="was-sind-beitraege">Was sind Beiträge im Google Unternehmensprofil?</h2>
        <p>Beiträge (englisch „Posts") sind kleine Meldungen, die du direkt über dein Google Unternehmensprofil veröffentlichst. Sie erscheinen im Knowledge Panel in der Google Suche und in deinem Eintrag bei Google Maps – dort, wo potenzielle Kunden gerade entscheiden, ob sie anrufen oder weiterscrollen. Ein Beitrag besteht aus einem Bild oder Video, bis zu 1.500 Zeichen Text und optional einem Button wie „Mehr erfahren", „Anrufen" oder „Jetzt buchen".</p>
        <p>Beiträge sind kostenlos, brauchen keine Werbeanzeige und keine Freigabe durch eine Agentur. Trotzdem nutzt sie nur ein kleiner Teil der Betriebe regelmäßig. Genau das ist die Chance: Ein Profil mit frischen Beiträgen wirkt neben fünf verwaisten Wettbewerbern wie das einzige Geschäft, das gerade geöffnet hat.</p>

        <h2 id="beitragstypen">Welche Beitragstypen gibt es?</h2>
        <div class="tablewrap"><table class="ptable">
          <tr><th>Typ</th><th>Wofür</th><th>Besonderheit</th><th>Sichtbar</th></tr>
          <tr><td><strong>Neuigkeiten</strong></td><td>Alles Aktuelle: neues Produkt, neuer Mitarbeiter, Tipp aus dem Alltag, Blick hinter die Kulissen</td><td>Freier Text, Bild, Button optional</td><td>Kein festes Ablaufdatum; die neuesten Beiträge stehen vorn</td></tr>
          <tr><td><strong>Angebote</strong></td><td>Rabatte, Aktionen, Gutscheine, Saisonpreise</td><td>Titel, Start- und Enddatum, optional Gutscheincode, Link und Bedingungen</td><td>Bis zum Enddatum, mit Angebotssymbol hervorgehoben</td></tr>
          <tr><td><strong>Veranstaltungen</strong></td><td>Tag der offenen Tür, Workshop, Live-Musik, Sonderöffnung</td><td>Titel, Datum mit Uhrzeit, Beschreibung, Button</td><td>Bis zum Veranstaltungsende</td></tr>
        </table></div>
        <p>Frühere Typen wie „Produkt-Beiträge" und „COVID-19-Updates" hat Google eingestellt. Produkte pflegst du heute über den eigenen Bereich „Produkte" im Profil, nicht über Beiträge.</p>

        <h2 id="formate">Formate, Bildmaße und Längen</h2>
        <ul>
          <li><strong>Bild:</strong> JPG oder PNG, empfohlen <strong>1200 × 900 Pixel</strong> (Seitenverhältnis 4:3). Mindestens 480 × 270 Pixel, maximal 5 MB. Google schneidet auf die Vorschaugröße zu – wichtige Bildinhalte gehören in die Mitte.</li>
          <li><strong>Video:</strong> maximal 30 Sekunden, bis 75 MB, mindestens 720p. In der Praxis performen kurze Clips von 10 bis 15 Sekunden am besten.</li>
          <li><strong>Text:</strong> bis zu 1.500 Zeichen möglich. In der Vorschau zeigt Google nur die ersten <strong>etwa 80 bis 100 Zeichen</strong> – die Botschaft muss im ersten Satz stehen.</li>
          <li><strong>Button:</strong> „Jetzt buchen", „Online bestellen", „Kaufen", „Mehr erfahren", „Registrieren", „Anrufen". Ein Button pro Beitrag.</li>
          <li><strong>Sichtbarkeit:</strong> Google zeigt in der Suche standardmäßig die neuesten Beiträge; ältere bleiben über „Alle ansehen" erreichbar. Nach etwa 6 Monaten werden Neuigkeiten in der Regel archiviert.</li>
        </ul>

        <h2 id="bringen-beitraege-ranking">Bringen Beiträge etwas fürs Ranking?</h2>
        <p>Die ehrliche Antwort: <strong>Indirekt ja, direkt nur wenig.</strong> Google hat Beiträge nie als eigenen Rankingfaktor bestätigt. Was sie messbar bewirken, ist etwas anderes: Sie erhöhen die Interaktion mit deinem Profil – Klicks auf Buttons, Website-Besuche, Anrufe. Und ein Profil, das regelmäßig aktualisiert wird, sendet Frischesignale, die Google im Faktor „Bekanntheit" berücksichtigt. Dazu kommen die Wörter in deinen Beiträgen: Wer wöchentlich über „Wärmepumpen-Installation" schreibt, wird eher für diese Suche relevant als der Wettbewerber, dessen Profil seit 2022 schweigt.</p>
        <p>Deshalb sind Beiträge für uns kein Extra, sondern Grundausstattung: Im <a href="/google-business-agentur/">Ultimate Paket</a> liefern wir 4 Beiträge pro Monat auf 9 Plattformen und insgesamt über 600 Profil-Updates pro Jahr. Der Effekt zeigt sich bei über 100 betreuten Unternehmen in Summe in 3,9 Millionen Profilaufrufen und 780.000 ausgelösten Aktionen – Anrufe, Routen, Klicks.</p>

        <h2 id="redaktionsplan">Ein einfacher Redaktionsplan, der durchhält</h2>
        <p>Die meisten Betriebe scheitern nicht an Ideen, sondern an Kontinuität. Ein Plan mit vier festen Rubriken löst das Problem, weil du nie wieder bei null anfängst:</p>
        <ol>
          <li><strong>Woche 1 – Leistung erklären.</strong> Ein Produkt oder eine Dienstleistung, ein Foto davon, ein Satz Nutzen, Button „Anrufen" oder „Mehr erfahren".</li>
          <li><strong>Woche 2 – Beweis zeigen.</strong> Ein fertiges Projekt, ein zufriedener Kunde (mit Einwilligung), ein Vorher-Nachher-Bild.</li>
          <li><strong>Woche 3 – Angebot oder Anlass.</strong> Saisonale Aktion, Frühbucher-Rabatt, Veranstaltung. Hier passt der Beitragstyp „Angebot" oder „Veranstaltung".</li>
          <li><strong>Woche 4 – Menschen und Alltag.</strong> Team, Werkstatt, ein Tipp aus deiner Erfahrung. Das baut Vertrauen auf, bevor der Kunde anruft.</li>
        </ol>
        <p>Vier Beiträge pro Monat, jeder in 15 Minuten geschrieben. Wer Fotos sowieso fürs Social Media macht, hat das Bildmaterial schon – nur das Format (4:3 statt quadratisch) muss angepasst werden. Was gute Fotos im Profil ausmacht, steht im Artikel <a href="/ratgeber/google-unternehmensprofil-fotos/">Fotos im Google Unternehmensprofil</a>.</p>

        <h2 id="gute-beispiele">Drei Beispiele für Beiträge, die funktionieren</h2>
        <ul>
          <li><strong>Heizungsbauer, Neuigkeit:</strong> „Wärmepumpe in 3 Tagen eingebaut – so lief es bei Familie K. in Musterhausen." Foto der Außeneinheit, Button „Anrufen". Der Beitrag beantwortet die zwei Fragen jedes Interessenten: Wie lange dauert es, und macht ihr das wirklich?</li>
          <li><strong>Restaurant, Angebot:</strong> „Mittagstisch 9,90 € – Mo bis Fr, 12 bis 14 Uhr." Bild des Gerichts, Laufzeit 4 Wochen, Button „Speisekarte". Angebote mit konkretem Preis werden deutlich häufiger geklickt als „Jetzt neu bei uns".</li>
          <li><strong>Physiotherapie, Veranstaltung:</strong> „Rückenschule für Einsteiger – Samstag, 10 Uhr, 5 Plätze frei." Datum, Uhrzeit, Button „Registrieren" auf ein Buchungsformular.</li>
        </ul>

        <h2 id="haeufige-fehler">Die sechs häufigsten Fehler bei Beiträgen</h2>
        <ol>
          <li><strong>Telefonnummer im Text.</strong> Google filtert Beiträge mit Telefonnummern häufig heraus. Nutze stattdessen den Button „Anrufen".</li>
          <li><strong>Text auf dem Bild.</strong> Bilder mit viel Schrift werden abgeschnitten und wirken wie Werbung. Ein echtes Foto schlägt jede Grafik.</li>
          <li><strong>Die Botschaft im dritten Satz.</strong> In der Vorschau sind nur die ersten 80 bis 100 Zeichen sichtbar. Was danach kommt, liest kaum jemand.</li>
          <li><strong>Einmal fünf Beiträge, dann drei Monate nichts.</strong> Google und Kunden sehen das Datum. Lieber einer pro Woche als fünf an einem Tag.</li>
          <li><strong>Kein Button.</strong> Ein Beitrag ohne Handlungsaufforderung ist ein Bild mit Bildunterschrift. Jeder Beitrag braucht einen nächsten Schritt.</li>
          <li><strong>Richtlinienverstöße.</strong> Alkohol, Tabak, Glücksspiel, medizinische Heilversprechen und irreführende Aussagen lehnt Google ab – der Beitrag erscheint dann nicht oder wird nachträglich entfernt.</li>
        </ol>

        <h2 id="beitraege-messen">Wie misst du, ob Beiträge wirken?</h2>
        <p>Im Profil unter <strong>„Statistiken"</strong> (Google nennt den Bereich auch „Leistung") siehst du Aufrufe, Anrufe, Website-Klicks und Routenanfragen im Zeitverlauf. Beiträge tauchen dort nicht als eigene Kennzahl auf – der Effekt zeigt sich indirekt: Vergleiche die Wochen mit und ohne Beitrag. Bei den meisten Betrieben, die wir betreuen, steigen Website-Klicks und Anrufe in Wochen mit einem Angebots-Beitrag sichtbar an. Zusätzlich hilft ein einfacher Trick: Verlinke im Beitrag auf eine Seite mit einem Parameter wie <strong>?quelle=gbp-beitrag</strong>. Dann siehst du in deiner Website-Statistik genau, wie viele Besucher aus Beiträgen kamen.</p>
        <p>Drei Kennzahlen reichen für die Bewertung: Aufrufe des Profils, Klicks auf Buttons und Anfragen, die du im Betrieb zählst („Woher kennen Sie uns?"). Rankings allein zahlen keine Rechnung – Anrufe schon.</p>

        <h2 id="beitraege-vs-social-media">Beiträge oder Social Media – oder beides?</h2>
        <p>Beiträge im Unternehmensprofil erreichen Menschen, die <strong>gerade jetzt</strong> nach deiner Leistung suchen. Social Media erreicht Menschen, die dir folgen, unabhängig von einem Bedarf. Das ist ein grundlegender Unterschied: Ein Beitrag mit „Mittagstisch 9,90 €" trifft bei Google auf jemanden, der um 11:45 Uhr „Mittagstisch in der Nähe" sucht. Auf Instagram trifft derselbe Beitrag auf jemanden, der abends auf dem Sofa scrollt.</p>
        <p>Deshalb lohnt sich beides, aber mit unterschiedlicher Priorität: Wer nur Zeit für einen Kanal hat und lokale Kunden will, nimmt das Unternehmensprofil. Wer sowieso für Social Media produziert, verwendet dasselbe Material im Profil weiter – das ist der Grund, warum wir im Ultimate Paket dieselben 4 Beiträge auf 9 Plattformen ausspielen. Ein Foto, ein Text, neunmal Reichweite.</p>

        <h2 id="mehrere-standorte">Beiträge für mehrere Standorte</h2>
        <p>Betriebe mit mehreren Filialen können Beiträge im Business Profile Manager für mehrere Standorte gleichzeitig veröffentlichen. Sinnvoll ist das für überregionale Angebote und Neuigkeiten. Standortspezifische Inhalte – ein neuer Mitarbeiter in Filiale Nord, eine Veranstaltung in Filiale Süd – gehören nur in das jeweilige Profil. Google bevorzugt Profile, die sich unterscheiden; neun identische Filialprofile mit identischen Beiträgen sehen für Google wie eine Kopie aus.</p>

        <h2 id="wo-erstellen">Wo erstellst du Beiträge?</h2>
        <p>Seit Google die eigene App eingestellt hat, verwaltest du das Profil direkt in der Google Suche oder bei Google Maps: Bei Google nach deinem Firmennamen suchen, im Profil-Menü „Beitrag hinzufügen" wählen, Typ auswählen, Bild und Text einfügen, veröffentlichen. Der Beitrag ist in der Regel innerhalb weniger Minuten sichtbar. Wie das Profil insgesamt aufgebaut ist und welche Bereiche du sonst noch pflegen solltest, steht gebündelt in <a href="/google-unternehmensprofil/">Google Unternehmensprofil: der komplette Leitfaden</a>. Wenn du noch am Anfang stehst: Beiträge setzen ein bestätigtes Profil voraus – siehe <a href="/ratgeber/google-unternehmensprofil-erstellen/">Google Unternehmensprofil erstellen</a>.</p>`,
  faqTitle: 'Häufige Fragen zu Beiträgen im Google Unternehmensprofil',
  faqs: [
    { id: 'faq-wie-oft-beitraege', q: 'Wie oft sollte ich Beiträge im Google Unternehmensprofil veröffentlichen?', a: 'Mindestens einmal pro Woche. Google zeigt in der Suche die neuesten Beiträge zuerst; ein Profil, dessen letzter Beitrag Monate alt ist, wirkt auf Kunden verwaist. Vier Beiträge pro Monat in festen Rubriken sind ein Rhythmus, der sich durchhalten lässt.' },
    { id: 'faq-beitraege-ranking', q: 'Verbessern Beiträge mein Ranking bei Google Maps?', a: 'Nicht als direkter Rankingfaktor, aber indirekt: Beiträge erhöhen Klicks, Anrufe und Interaktionen mit dem Profil, liefern Frischesignale und bringen relevante Begriffe ins Profil. Alle drei Effekte zahlen auf die Faktoren Relevanz und Bekanntheit ein.' },
    { id: 'faq-beitrag-bildgroesse', q: 'Welche Bildgröße brauchen Beiträge?', a: 'Empfohlen sind 1200 × 900 Pixel im Seitenverhältnis 4:3, als JPG oder PNG mit maximal 5 MB. Mindestgröße ist 480 × 270 Pixel. Wichtige Bildinhalte gehören in die Mitte, weil Google die Vorschau beschneidet.' },
    { id: 'faq-beitrag-laufzeit', q: 'Wie lange bleibt ein Beitrag sichtbar?', a: 'Neuigkeiten haben kein festes Ablaufdatum; neuere Beiträge rücken sie nach hinten, nach etwa sechs Monaten werden sie archiviert. Angebote laufen bis zum eingetragenen Enddatum, Veranstaltungen bis zum Veranstaltungsende.' },
    { id: 'faq-beitrag-abgelehnt', q: 'Warum wurde mein Beitrag abgelehnt?', a: 'Häufigste Gründe: Telefonnummer im Text, Inhalte zu Alkohol, Tabak oder Glücksspiel, medizinische Heilversprechen, irreführende Aussagen oder Bilder mit minderer Qualität. Entferne den Auslöser und veröffentliche den Beitrag erneut.' },
    { id: 'faq-beitraege-agentur', q: 'Übernimmt Lokalbesucher die Beiträge für mich?', a: 'Ja. Im Ultimate Paket sind 4 Beiträge pro Monat auf 9 Plattformen enthalten, insgesamt über 600 Profil-Updates pro Jahr. Du lieferst Fotos und Anlässe aus dem Alltag, wir übernehmen Planung, Texte, Formate und Veröffentlichung.' }
  ],
  related: [
    { href: '/google-unternehmensprofil/', label: 'Google Unternehmensprofil: der komplette Leitfaden' },
    { href: '/ratgeber/google-unternehmensprofil-fotos/', label: 'Fotos im Google Unternehmensprofil' },
    { href: '/ratgeber/google-unternehmensprofil-optimieren/', label: 'Google Unternehmensprofil optimieren' }
  ],
  ctaLabel: 'Keine Zeit für wöchentliche Beiträge?',
  ctaTitle: 'Wir halten dein Profil lebendig – 4 Beiträge pro Monat auf 9 Plattformen', ctaDesc: 'Du lieferst Fotos und Anlässe, wir machen Planung, Texte und Veröffentlichung. Über 600 Profil-Updates pro Jahr, alles im Ultimate Paket.',
  ctaBtn: 'Beratung via WhatsApp', ctaGhost: 'Zum kompletten Leitfaden →', ctaGhostHref: '/google-unternehmensprofil/'
},

/* ── 7. FOTOS ──────────────────────────────────── */
{
  slug: 'google-unternehmensprofil-fotos', date: D, dateNice: DN,
  tag: 'Content', crumb: 'Fotos im Unternehmensprofil',
  title: 'Fotos im Google Unternehmensprofil: Formate & Regeln | Lokalbesucher',
  metaDesc: 'Fotos entscheiden, ob Kunden anrufen. Alle Formate und Größen für Logo, Titelbild und Galerie im Google Unternehmensprofil – und welche Fotos Google entfernt.',
  h1: 'Fotos im Google Unternehmensprofil:<br>Formate, Größen und was wirklich wirkt',
  heroSub: 'Logo, Titelbild, Innen, Außen, Team, Arbeit – welche Fotos dein Profil braucht, in welchen Maßen, und warum Geo-Tags dir nichts bringen.',
  heroCta: 'Kostenlosen Foto-Check via WhatsApp',
  waText: 'Hallo%20Tobias%2C%20k%C3%B6nnt%20ihr%20die%20Fotos%20in%20meinem%20Google%20Unternehmensprofil%20mal%20anschauen%3F',
  capsule: 'Fotos im Google Unternehmensprofil müssen als <strong>JPG oder PNG</strong> vorliegen, zwischen <strong>10 KB und 5 MB</strong> groß sein und mindestens <strong>720 × 720 Pixel</strong> haben. Ein vollständiges Profil braucht Logo, Titelbild und Fotos von Außenansicht, Innenräumen, Team und deiner Arbeit. Ziel: mindestens 10 eigene Fotos zum Start und danach 2 bis 4 neue Fotos pro Monat.',
  body: `        <h2 id="warum-fotos">Warum Fotos über Anrufe entscheiden</h2>
        <p>Bevor ein Kunde anruft, schaut er. Bei Google Maps sind Fotos das Erste, was neben dem Namen sichtbar ist – noch vor Bewertungen und Öffnungszeiten. Ein Profil ohne eigene Fotos zeigt entweder ein Street-View-Bild deiner Fassade oder das Foto, das irgendein Kunde hochgeladen hat. Beides hast du nicht in der Hand.</p>
        <p>Google selbst nennt Fotos als eines der Elemente, mit denen Nutzer die Qualität eines Eintrags einschätzen. Für das Ranking zählen Fotos zum Faktor Bekanntheit: Ein vollständig gepflegtes Profil mit aktuellen Bildern signalisiert einen aktiven Betrieb. In unserer Arbeit mit über 100 Unternehmen gehört ein Fototermin deshalb zur Einrichtung jedes Profils dazu – die Aufrufe steigen fast immer schon in den ersten Wochen nach dem Upload.</p>

        <h2 id="formate-groessen">Formate und Größen: Was Google verlangt</h2>
        <div class="tablewrap"><table class="ptable">
          <tr><th>Bildtyp</th><th>Empfohlene Größe</th><th>Format</th><th>Hinweis</th></tr>
          <tr><td><strong>Logo</strong></td><td>720 × 720 Pixel (quadratisch)</td><td>JPG oder PNG</td><td>Wird rund oder quadratisch beschnitten – Logo mittig, ausreichend Rand</td></tr>
          <tr><td><strong>Titelbild</strong></td><td>1024 × 576 Pixel (16:9)</td><td>JPG oder PNG</td><td>Nur ein Vorschlag an Google – Google wählt das angezeigte Hauptbild selbst</td></tr>
          <tr><td><strong>Fotos</strong></td><td>mindestens 720 × 720 Pixel</td><td>JPG oder PNG, 10 KB bis 5 MB</td><td>Scharf, gut belichtet, keine Filter, keine Textüberlagerungen</td></tr>
          <tr><td><strong>Videos</strong></td><td>mindestens 720p</td><td>bis 30 Sekunden, maximal 75 MB</td><td>Kurz und ruhig gefilmt; Querformat wird sauberer dargestellt</td></tr>
        </table></div>
        <p>Der wichtigste Punkt beim Titelbild: Es ist ein Wunsch, kein Befehl. Google entscheidet anhand von Nutzerverhalten selbst, welches Foto als Hauptbild erscheint. Wer sein Titelbild „nicht angezeigt" sieht, hat keinen Fehler gemacht – Google findet ein anderes Foto passender. Der Hebel dagegen: viele gute eigene Fotos, damit Google aus deinem Material auswählt und nicht aus fremdem.</p>

        <h2 id="welche-fotos">Welche Fotos braucht ein vollständiges Profil?</h2>
        <p>Google gruppiert Fotos in Kategorien. Ein Profil, das jede dieser Gruppen abdeckt, wirkt vollständig – für Kunden und für Google:</p>
        <ul>
          <li><strong>Außenansicht (3 Fotos):</strong> Fassade bei Tag, Eingang, Parkplatz oder Umgebung. Der Kunde muss dich auf der Straße wiedererkennen.</li>
          <li><strong>Innenräume (3 Fotos):</strong> Empfang, Gastraum, Behandlungsraum, Verkaufsfläche. Zeig die Atmosphäre, in die der Kunde gleich kommt.</li>
          <li><strong>Team (2 Fotos):</strong> Inhaber und Mitarbeiter, freundlich, bei der Arbeit oder vor dem Geschäft. Gesichter bauen mehr Vertrauen auf als jede Grafik.</li>
          <li><strong>Bei der Arbeit (3 Fotos):</strong> Handwerker auf der Baustelle, Friseur am Kunden, Koch am Herd. Diese Fotos beantworten die Frage „Können die das?".</li>
          <li><strong>Produkte und Ergebnisse (3 bis 5 Fotos):</strong> Gerichte, fertige Projekte, Vorher-Nachher, Sortiment.</li>
        </ul>
        <p>Das ergibt rund 15 Fotos zum Start. Wichtig ist nicht die Perfektion, sondern die Echtheit: Ein scharfes Smartphone-Foto deines echten Gastraums schlägt jedes Stockfoto. Stockfotos verstoßen zudem gegen die Richtlinien und werden entfernt, sobald jemand sie meldet.</p>

        <h2 id="wie-oft">Wie oft solltest du neue Fotos hochladen?</h2>
        <p>Nach der Erstausstattung reichen <strong>2 bis 4 neue Fotos pro Monat</strong>. Das hält das Profil frisch und gibt Google regelmäßig neues Material für die Auswahl des Hauptbilds. Sinnvoll ist die Kopplung an <a href="/ratgeber/google-unternehmensprofil-beitraege/">Beiträge</a>: Jedes Foto, das du für einen Beitrag machst, lädst du zusätzlich in die Fotogalerie hoch. So entstehen aus 4 Beiträgen pro Monat automatisch 4 neue Galeriefotos, ohne Mehrarbeit.</p>
        <p>Saisonale Fotos lohnen sich extra: Weihnachtsdekoration im Dezember, Terrasse im Sommer, Winterreifen im Oktober. Sie zeigen, dass das Profil aktuell gepflegt wird – und sie passen zu den Suchanfragen der jeweiligen Jahreszeit.</p>

        <h2 id="kundenfotos">Kundenfotos: Was du kontrollieren kannst – und was nicht</h2>
        <p>Jeder Google-Nutzer kann Fotos zu deinem Profil hochladen. Du kannst sie nicht löschen, aber du kannst sie <strong>melden</strong>, wenn sie gegen die Richtlinien verstoßen: unscharf, falscher Ort, beleidigend, Privatsphäre verletzt, Werbung eines Wettbewerbers. Google prüft die Meldung und entfernt das Foto bei einem Verstoß. Ein Kundenfoto, das einfach nur unvorteilhaft ist, bleibt – dagegen hilft nur eines: mehr und bessere eigene Fotos, damit dein Material die Galerie dominiert.</p>
        <p>Prüfe die Galerie mindestens einmal im Monat. Bei Betrieben mit vielen Besuchern – Restaurants, Freizeitanlagen, Hotels – kommen wöchentlich fremde Fotos hinzu. Bei BattleKart Bochum, das mit unserem TapTag-System über 800 Bewertungen in 9 Monaten aufgebaut hat, wächst auch die Fotogalerie entsprechend – und genau dort lohnt sich die regelmäßige Moderation.</p>

        <h2 id="geo-tags">Geo-Tags in Fotos: Ein Mythos, der sich hält</h2>
        <p>Immer wieder wird empfohlen, Fotos vor dem Upload mit GPS-Koordinaten zu versehen, um das lokale Ranking zu verbessern. Das bringt nichts. Google entfernt die EXIF-Daten beim Upload und hat mehrfach bestätigt, dass Standortdaten in Bilddateien keinen Einfluss auf das Ranking haben. Dasselbe gilt für Keywords im Dateinamen: „bester-zahnarzt-berlin.jpg" liest niemand. Was Google tatsächlich auswertet, ist der Bildinhalt selbst – seine Bilderkennung sieht, ob auf dem Foto eine Pizza, ein Zahnarztstuhl oder eine Heizungsanlage ist. Deshalb zählt das Motiv, nicht die Metadaten.</p>

        <h2 id="was-google-entfernt">Welche Fotos entfernt Google?</h2>
        <ol>
          <li><strong>Stockfotos und fremde Bilder</strong> – alles, was nicht deinen Betrieb zeigt.</li>
          <li><strong>Bilder mit Textüberlagerungen, Logos oder Werbebotschaften</strong> als Hauptmotiv. Ein kleines Logo auf der Firmenkleidung ist in Ordnung, ein Werbebanner nicht.</li>
          <li><strong>Collagen, Screenshots, stark bearbeitete oder gefilterte Bilder.</strong></li>
          <li><strong>Fotos, die den Betrieb falsch darstellen</strong> – ein Showroom, den es nicht gibt, oder ein Foto der Konkurrenz.</li>
          <li><strong>Inhalte, die gegen die allgemeinen Richtlinien verstoßen:</strong> anstößige Bilder, Verletzung der Privatsphäre Dritter, urheberrechtlich geschütztes Material.</li>
        </ol>
        <p>Wiederholte Verstöße können bis zur Sperrung des Profils führen. Was dann zu tun ist, steht im Artikel <a href="/ratgeber/google-unternehmensprofil-gesperrt/">Google Unternehmensprofil gesperrt</a>.</p>

        <h2 id="fotos-je-branche">Welche Motive je Branche am besten funktionieren</h2>
        <div class="tablewrap"><table class="ptable">
          <tr><th>Branche</th><th>Motive, die Anrufe bringen</th><th>Was du weglassen kannst</th></tr>
          <tr><td>Restaurant, Café</td><td>Gerichte im Tageslicht, gedeckter Tisch, Terrasse, Küche mit Koch</td><td>Leere Räume, Speisekarte als Foto</td></tr>
          <tr><td>Handwerk</td><td>Fertige Projekte, Mitarbeiter bei der Arbeit, Firmenfahrzeug vor der Baustelle, Vorher-Nachher</td><td>Materiallager, Büro</td></tr>
          <tr><td>Arztpraxis, Physiotherapie</td><td>Empfang, heller Behandlungsraum, Team in Berufskleidung, Wartebereich</td><td>Geräte-Nahaufnahmen ohne Kontext</td></tr>
          <tr><td>Friseur, Kosmetik</td><td>Ergebnisse an echten Kunden (mit Einwilligung), Arbeitsplatz, Team</td><td>Produktregale</td></tr>
          <tr><td>Einzelhandel</td><td>Schaufenster, Verkaufsfläche mit Ware, Beratungssituation, saisonale Auslagen</td><td>Kassenbereich, Lager</td></tr>
          <tr><td>Freizeit, Sport</td><td>Menschen in Aktion, Anlage bei Betrieb, Gruppen mit sichtbarem Spaß</td><td>Menschenleere Anlage</td></tr>
        </table></div>
        <p>Der rote Faden: Fotos, auf denen etwas passiert, schlagen Fotos von Räumen. Und Fotos mit Menschen schlagen Fotos ohne. Achte bei Kunden und Mitarbeitern auf eine schriftliche Einwilligung – ein Satz per E-Mail reicht, aber er muss vorliegen.</p>

        <h2 id="videos">Videos im Profil: Kurz, ruhig, echt</h2>
        <p>Videos werden in der Galerie neben den Fotos angezeigt und sind seltener als Fotos – deshalb fallen sie auf. Was funktioniert: ein 15-Sekunden-Rundgang durch den Gastraum, ein Handwerker, der ein Ergebnis zeigt, ein Blick in die Werkstatt. Was nicht funktioniert: Imagefilme mit Musik und Schnitt, die wie Werbung wirken, und verwackelte Hochkant-Clips. Halte das Smartphone quer, bewege dich langsam, sprich nicht – der Ton wird bei Google Maps standardmäßig stumm abgespielt. Maximal 30 Sekunden, mindestens 720p, bis 75 MB.</p>

        <h2 id="fotos-messen">Fotoaufrufe messen</h2>
        <p>Früher zeigte Google im Dashboard, wie oft deine Fotos angesehen wurden – und verglich das mit ähnlichen Betrieben. Diese Kennzahl gibt es seit der Umstellung auf das Google Unternehmensprofil nicht mehr. Was du heute messen kannst: die Gesamtaufrufe und Interaktionen deines Profils im Bereich „Statistiken". Lade neue Fotos hoch und beobachte die Aufrufe in den zwei Wochen danach. Bei den meisten Profilen, die wir übernehmen, ist der Sprung nach der ersten vollständigen Fotoausstattung der deutlichste im gesamten ersten Monat. Was sich sonst noch am Namen und an der Verwaltung geändert hat, steht im Artikel <a href="/ratgeber/google-my-business-vs-google-unternehmensprofil/">Google My Business vs. Google Unternehmensprofil</a>.</p>

        <h2 id="foto-checkliste">Checkliste: Fotos in 60 Minuten fertig</h2>
        <ul>
          <li>Smartphone reicht – Querformat, Blitz aus, Tageslicht, Objektiv abwischen.</li>
          <li>Je 3 Fotos: Außen, Innen, Arbeit. Je 2: Team, Produkte. Mit dem Logo sind das rund 15 Bilder.</li>
          <li>Keine Filter, kein Text im Bild, keine Collagen.</li>
          <li>Upload direkt im Profil unter „Fotos hinzufügen" – Google verwaltet das Profil heute in der Suche und bei Maps, nicht mehr in einer eigenen App.</li>
          <li>Kalendereintrag: einmal im Monat 3 neue Fotos hochladen und die Galerie auf fremde Bilder prüfen.</li>
        </ul>
        <p>Fotos sind ein Baustein von vielen. Wie Kategorien, Beschreibung, Leistungen, Bewertungen und Beiträge zusammenspielen, steht in <a href="/google-unternehmensprofil/">Google Unternehmensprofil: der komplette Leitfaden</a>. Und wer die laufende Pflege abgeben will: Fotoplanung und -upload sind Teil unserer <a href="/google-business-agentur/">Profil-Optimierung</a> – mit über 600 Profil-Updates pro Jahr.</p>`,
  faqTitle: 'Häufige Fragen zu Fotos im Google Unternehmensprofil',
  faqs: [
    { id: 'faq-foto-groesse', q: 'Welche Größe müssen Fotos im Google Unternehmensprofil haben?', a: 'Mindestens 720 × 720 Pixel, als JPG oder PNG, zwischen 10 KB und 5 MB. Für das Logo empfiehlt sich ein quadratisches Bild mit 720 × 720 Pixeln, für das Titelbild 1024 × 576 Pixel im Format 16:9.' },
    { id: 'faq-titelbild-nicht-angezeigt', q: 'Warum zeigt Google nicht mein Titelbild als Hauptfoto?', a: 'Das Titelbild ist nur ein Vorschlag. Google wählt das angezeigte Hauptfoto anhand von Nutzerverhalten und Bildqualität selbst aus. Der einzige Hebel: viele gute eigene Fotos hochladen, damit Google aus deinem Material auswählt statt aus Kundenfotos.' },
    { id: 'faq-kundenfoto-loeschen', q: 'Kann ich ein Kundenfoto aus meinem Profil löschen?', a: 'Nicht direkt. Du kannst es bei Google melden, wenn es gegen die Richtlinien verstößt – etwa unscharf, am falschen Ort, beleidigend oder Werbung eines Wettbewerbers. Google prüft und entfernt das Foto bei einem Verstoß. Ein lediglich unvorteilhaftes Foto bleibt in der Regel bestehen.' },
    { id: 'faq-wie-viele-fotos', q: 'Wie viele Fotos sollte mein Profil haben?', a: 'Rund 15 eigene Fotos zum Start: je drei von Außenansicht, Innenräumen und deiner Arbeit, je zwei bis fünf von Team und Produkten, dazu das Logo. Danach 2 bis 4 neue Fotos pro Monat, damit das Profil aktuell bleibt.' },
    { id: 'faq-geotag-fotos', q: 'Helfen Geo-Tags in Fotos beim Ranking?', a: 'Nein. Google entfernt EXIF- und GPS-Daten beim Upload und hat bestätigt, dass sie das Ranking nicht beeinflussen. Auch Keywords im Dateinamen bringen nichts. Google wertet den sichtbaren Bildinhalt aus – deshalb zählt das Motiv, nicht die Metadaten.' },
    { id: 'faq-stockfotos-erlaubt', q: 'Darf ich Stockfotos im Google Unternehmensprofil verwenden?', a: 'Nein. Fotos müssen deinen tatsächlichen Betrieb zeigen. Stockfotos, fremde Bilder und Grafiken mit Werbetext verstoßen gegen die Richtlinien und werden entfernt, sobald sie gemeldet werden. Wiederholte Verstöße können zur Sperrung des Profils führen.' }
  ],
  related: [
    { href: '/google-unternehmensprofil/', label: 'Google Unternehmensprofil: der komplette Leitfaden' },
    { href: '/ratgeber/google-unternehmensprofil-beitraege/', label: 'Beiträge im Google Unternehmensprofil' },
    { href: '/ratgeber/google-unternehmensprofil-optimieren/', label: 'Google Unternehmensprofil optimieren' }
  ],
  ctaLabel: 'Wie wirkt dein Profil auf den ersten Blick?',
  ctaTitle: 'Wir schauen auf deine Fotos – so wie deine Kunden es tun', ctaDesc: 'Fehlende Kategorien, schwache Motive, fremde Bilder in der Galerie: Wir sagen dir in 15 Minuten, was dein Profil optisch braucht. Kostenlos.',
  ctaBtn: 'Foto-Check via WhatsApp', ctaGhost: 'Zum kompletten Leitfaden →', ctaGhostHref: '/google-unternehmensprofil/'
},

/* ── 8. GOOGLE MY BUSINESS VS. UNTERNEHMENSPROFIL ── */
{
  slug: 'google-my-business-vs-google-unternehmensprofil', date: D, dateNice: DN,
  tag: 'Grundlagen', crumb: 'Google My Business vs. Unternehmensprofil',
  title: 'Google My Business vs. Google Unternehmensprofil | Lokalbesucher',
  metaDesc: 'Google My Business ist seit November 2021 das Google Unternehmensprofil. Was sich geändert hat, wo du das Profil heute verwaltest – plus Glossar aller Begriffe.',
  h1: 'Google My Business vs. Google Unternehmensprofil:<br>Was sich geändert hat – und was nicht',
  heroSub: 'Neuer Name, App eingestellt, Website-Builder weg, Verwaltung direkt in der Suche: Die komplette Übersicht für alle, die noch „GMB" sagen.',
  heroCta: 'Kostenlosen Profil-Check via WhatsApp',
  waText: 'Hallo%20Tobias%2C%20ich%20habe%20noch%20ein%20altes%20Google%20My%20Business%20Konto%20%E2%80%93%20k%C3%B6nnt%20ihr%20mir%20helfen%3F',
  capsule: '<strong>Google My Business</strong> wurde im <strong>November 2021</strong> in <strong>Google Unternehmensprofil</strong> (englisch: Google Business Profile) umbenannt. Das Profil selbst, dein Eintrag und deine Bewertungen sind unverändert. Geändert hat sich die Verwaltung: Die eigene App wurde 2022 eingestellt, du pflegst dein Profil heute direkt in der Google Suche und bei Google Maps. Der kostenlose Website-Builder wurde im März 2024 abgeschaltet.',
  body: `        <h2 id="umbenennung">Warum heißt Google My Business jetzt Google Unternehmensprofil?</h2>
        <p>Im November 2021 hat Google seinen Dienst für lokale Unternehmenseinträge umbenannt: Aus „Google My Business" wurde „Google Business Profile", auf Deutsch „Google Unternehmensprofil". Hintergrund war Googles Ziel, die Profilverwaltung dorthin zu verlegen, wo Unternehmer ohnehin sind – in die Google Suche und in Google Maps – statt in ein separates Werkzeug mit eigenem Namen.</p>
        <p>Vorher hieß der Dienst übrigens auch schon anders: Google Places (2010), Google+ Local (2012), Google My Business (2014). Der Name hat sich viermal geändert, das Prinzip nie: ein kostenloser Eintrag, mit dem dein Betrieb bei Google Maps und in der lokalen Suche erscheint. Viele Unternehmer und auch viele Agenturen sagen bis heute „GMB" – gemeint ist immer dasselbe.</p>

        <h2 id="was-gleich-blieb">Was ist gleich geblieben?</h2>
        <ul>
          <li><strong>Dein Eintrag.</strong> Name, Adresse, Öffnungszeiten, Kategorie, Fotos – alles blieb beim Namenswechsel erhalten. Niemand musste ein neues Profil anlegen.</li>
          <li><strong>Deine Bewertungen.</strong> Alle Rezensionen, Sterne und Antworten wurden übernommen.</li>
          <li><strong>Dein Google-Konto.</strong> Der Zugang läuft weiter über das Google-Konto, mit dem das Profil angelegt oder übernommen wurde.</li>
          <li><strong>Die Kostenfreiheit.</strong> Das Profil war kostenlos und ist es. Wer dir am Telefon erzählt, dein Eintrag werde gelöscht, wenn du nicht zahlst, ist ein Betrüger – Google ruft nicht an.</li>
          <li><strong>Die Rankingfaktoren.</strong> Relevanz, Entfernung und Bekanntheit entscheiden weiterhin, wer im Local Pack steht. Mehr dazu im Artikel <a href="/ratgeber/google-maps-top-3-ranking/">Top 3 bei Google Maps</a>.</li>
        </ul>

        <h2 id="was-sich-aenderte">Was hat sich geändert?</h2>
        <div class="tablewrap"><table class="ptable">
          <tr><th>Bereich</th><th>Früher (Google My Business)</th><th>Heute (Google Unternehmensprofil)</th></tr>
          <tr><td><strong>Verwaltung</strong></td><td>Eigenes Dashboard unter business.google.com und eine eigene App</td><td>Direkt in der Google Suche (nach dem Firmennamen suchen) und in Google Maps; business.google.com leitet bei einem Standort dorthin weiter</td></tr>
          <tr><td><strong>App</strong></td><td>„Google My Business"-App für iOS und Android</td><td>2022 eingestellt. Auf dem Smartphone nutzt du die Google-App oder die Google-Maps-App</td></tr>
          <tr><td><strong>Website-Builder</strong></td><td>Kostenlose Ein-Seiten-Website aus dem Profil heraus</td><td>Im März 2024 abgeschaltet. Bestehende Seiten leiten seit Juni 2024 nicht mehr weiter</td></tr>
          <tr><td><strong>Mehrere Standorte</strong></td><td>Dashboard mit Standortliste</td><td>Unverändert über den Business Profile Manager (business.google.com) für Ketten und Agenturen</td></tr>
          <tr><td><strong>Nachrichten</strong></td><td>Chat über die App</td><td>Chat-Funktion im Profil wurde im Juli 2024 eingestellt; Kontakt läuft über Anruf, Website und Buchungslinks</td></tr>
          <tr><td><strong>Beiträge, Fotos, Leistungen</strong></td><td>Im Dashboard</td><td>Alle Funktionen erhalten, nur der Ort der Bearbeitung hat sich verschoben</td></tr>
        </table></div>
        <p>Der Website-Builder ist der Punkt, der die meisten Betriebe kalt erwischt hat. Wer seine „Website" ausschließlich aus dem Google-Profil generiert hatte, steht seit 2024 ohne eigene Seite da. Wenn das dich betrifft: Ein Profil funktioniert auch ohne Website, aber eine eigene Seite stärkt Relevanz und fängt die Klicks aus dem Profil auf.</p>

        <h2 id="wo-verwalten">Wo verwaltest du dein Profil heute?</h2>
        <ol>
          <li><strong>In der Google Suche:</strong> Bei Google einloggen, nach deinem Firmennamen suchen. Oben erscheint dein Profil mit den Schaltflächen „Profil bearbeiten", „Bewertungen lesen", „Beitrag hinzufügen", „Fotos hinzufügen", „Statistiken".</li>
          <li><strong>In Google Maps:</strong> In der Maps-App auf dein Profilbild tippen, „Dein Unternehmensprofil" wählen.</li>
          <li><strong>Über business.google.com:</strong> Für Betriebe mit einem Standort leitet die Adresse direkt in die Suche; bei mehreren Standorten öffnet sich der Business Profile Manager mit der Standortliste.</li>
        </ol>
        <p>Suchst du deinen Firmennamen und siehst keine Schaltflächen? Dann bist du entweder mit dem falschen Google-Konto eingeloggt, oder das Profil gehört noch niemandem. Im zweiten Fall beanspruchst du es über „Inhaber dieses Unternehmens?" – wie das geht, steht im Artikel <a href="/ratgeber/google-unternehmensprofil-erstellen/">Google Unternehmensprofil erstellen</a>. Danach folgt in der Regel die Bestätigung, meist per Video: <a href="/ratgeber/google-unternehmensprofil-verifizieren/">Google Unternehmensprofil verifizieren</a>.</p>

        <h2 id="glossar">Glossar: Die Begriffe rund um das Unternehmensprofil</h2>
        <p>Rund um das Profil kursieren Begriffe, die oft durcheinander gehen. Die wichtigsten in Kurzform:</p>
        <ul>
          <li><strong>Google Unternehmensprofil / Google Business Profile (GBP):</strong> Der aktuelle Name des kostenlosen Eintrags. „GBP" ist die englische Abkürzung.</li>
          <li><strong>Google My Business (GMB):</strong> Der Name bis November 2021. Wird weiter umgangssprachlich verwendet, meint dasselbe.</li>
          <li><strong>Business Profile Manager:</strong> Die Verwaltungsoberfläche unter business.google.com für Unternehmen mit mehreren Standorten und für Agenturen, die viele Profile betreuen.</li>
          <li><strong>Knowledge Panel:</strong> Die Infobox rechts (Desktop) oder oben (Smartphone) in der Google Suche, die dein Profil anzeigt, wenn jemand nach deinem Firmennamen sucht.</li>
          <li><strong>Local Pack / 3-Pack:</strong> Der Kartenblock mit drei Unternehmen, den Google bei lokalen Suchen wie „Friseur in der Nähe" über den normalen Ergebnissen zeigt. Hier zu stehen ist das Ziel jeder Profil-Optimierung.</li>
          <li><strong>Maps-Eintrag:</strong> Dein Profil, so wie es in Google Maps erscheint – dieselben Daten wie im Knowledge Panel, andere Darstellung.</li>
          <li><strong>Local Finder:</strong> Die erweiterte Liste, die sich öffnet, wenn jemand im Local Pack auf „Weitere Unternehmen" klickt.</li>
          <li><strong>NAP:</strong> Name, Adresse, Telefonnummer. Diese drei Angaben müssen auf Profil, Website und in allen Verzeichnissen identisch sein – Abweichungen kosten Vertrauen bei Google.</li>
          <li><strong>Verifizierung / Bestätigung:</strong> Der Nachweis, dass du der rechtmäßige Inhaber bist – heute meist per Video, seltener per Postkarte, Telefon oder E-Mail.</li>
          <li><strong>Local SEO:</strong> Der Oberbegriff für alle Maßnahmen, die lokale Sichtbarkeit verbessern – das Unternehmensprofil ist ihr wichtigster Baustein.</li>
        </ul>

        <h2 id="zeitleiste">Zeitleiste: Vom Google-Places-Eintrag zum Unternehmensprofil</h2>
        <div class="tablewrap"><table class="ptable">
          <tr><th>Jahr</th><th>Was passierte</th></tr>
          <tr><td>2010</td><td>Google Places: erster kostenloser Unternehmenseintrag mit Verwaltung durch den Inhaber</td></tr>
          <tr><td>2012</td><td>Umbenennung in Google+ Local, Verknüpfung mit dem sozialen Netzwerk Google+</td></tr>
          <tr><td>2014</td><td>Start von Google My Business mit eigenem Dashboard und App</td></tr>
          <tr><td>2017</td><td>Beiträge (Posts) und Fragen und Antworten kommen ins Profil</td></tr>
          <tr><td>2019</td><td>Google beginnt, Bearbeitungsfunktionen direkt in die Google Suche zu verlagern</td></tr>
          <tr><td>November 2021</td><td>Umbenennung in Google Unternehmensprofil (Google Business Profile)</td></tr>
          <tr><td>2022</td><td>Google-My-Business-App wird eingestellt; Verwaltung nur noch in Suche, Maps und Business Profile Manager</td></tr>
          <tr><td>März 2024</td><td>Kostenloser Website-Builder abgeschaltet</td></tr>
          <tr><td>Juli 2024</td><td>Chat-Funktion im Profil eingestellt</td></tr>
          <tr><td>Anfang 2025</td><td>Neue Kontaktoption per SMS und WhatsApp für geeignete Profile, auch in Deutschland</td></tr>
          <tr><td>März 2025</td><td>KI-Übersichten (AI Overviews) starten in der deutschen Google-Suche, im Oktober 2025 folgt der KI-Modus</td></tr>
          <tr><td>Dezember 2025</td><td>Öffentliche Fragen und Antworten werden aus den Profilen entfernt, die Schnittstelle dafür schon im November</td></tr>
          <tr><td>April 2026</td><td>Verschärfte Bewertungsrichtlinie: Mitarbeiter-Quoten, Bewertungs-Tablets im Laden, Anreize und Aufforderungen zur Namensnennung ausdrücklich verboten</td></tr>
          <tr><td>Juni 2026</td><td>Gemini-Verknüpfung mit dem Profil startet, im EWR und damit in Deutschland nicht verfügbar</td></tr>
          <tr><td>Juli 2026</td><td>Einspruch bei Sperrungen: Nachweise werden direkt im Formular hochgeladen</td></tr>
          <tr><td>September 2026</td><td>Foto-Verifizierung als neue Bestätigungsmethode im Test</td></tr>
        </table></div>

        <h2 id="was-agenturen-anders-machen">Was sich für die Zusammenarbeit mit einer Agentur geändert hat</h2>
        <p>Für die Betreuung durch Dritte hat sich mit der Umstellung ein Detail verschoben, das oft für Verwirrung sorgt: Zugriffsrechte werden im Profil unter <strong>„Nutzer und Zugriff"</strong> vergeben, nicht mehr im alten Dashboard. Eine seriöse Agentur bittet dich, sie als <strong>Administrator</strong> hinzuzufügen – die Inhaberschaft bleibt bei dir. Das ist der wichtigste Schutz überhaupt: Wer einer Agentur die primäre Inhaberschaft überträgt, verliert im Streitfall das eigene Profil. Wir arbeiten ausnahmslos als hinzugefügter Administrator; das Profil gehört immer dem Betrieb. Wer trotzdem gefragt wird, ein Passwort oder die Inhaberschaft herauszugeben, sollte das als Warnsignal lesen.</p>
        <p>Zweiter Unterschied: Die Leistungsdaten heißen heute „Statistiken" beziehungsweise „Leistung" und zeigen Aufrufe, Anrufe, Website-Klicks und Routenanfragen. Genau diese vier Zahlen stehen auch in unserem monatlichen Reporting – ohne umgerechnete „Sichtbarkeits-Scores", die niemand nachvollziehen kann.</p>

        <h2 id="checkliste-aktuell">Checkliste: Ist dein Profil auf dem aktuellen Stand?</h2>
        <ul>
          <li>Du findest dein Profil, wenn du eingeloggt bei Google nach deinem Firmennamen suchst, und siehst die Schaltfläche „Profil bearbeiten".</li>
          <li>Das Profil ist bestätigt – kein Hinweis „Bestätigung erforderlich" oder „Ausstehend".</li>
          <li>Die Website-Adresse im Profil führt auf eine erreichbare Seite, nicht auf eine abgeschaltete Google-Website mit der Endung business.site.</li>
          <li>Unter „Nutzer und Zugriff" stehen nur Personen, die du kennst. Ehemalige Mitarbeiter und alte Agenturen sind entfernt.</li>
          <li>Kategorien, Öffnungszeiten und Telefonnummer wurden in den letzten 12 Monaten geprüft.</li>
          <li>Es gibt genau ein Profil für deinen Betrieb – kein Duplikat aus GMB-Zeiten.</li>
        </ul>

        <h2 id="alte-anleitungen">Vorsicht bei alten Anleitungen</h2>
        <p>Viele Ratgeber im Netz stammen noch aus der GMB-Zeit und beschreiben Menüs, die es nicht mehr gibt: „Öffne die App", „Klicke im Dashboard auf Info", „Erstelle deine Website". Ein sicheres Erkennungszeichen für veraltete Inhalte ist der Hinweis auf die App oder den Website-Builder. Alles, was in diesem Artikel steht, entspricht dem Stand von September 2026 – und wird von uns täglich in über 100 betreuten Profilen angewendet, mit zusammen 3,9 Millionen Profilaufrufen und 780.000 ausgelösten Aktionen.</p>
        <p>Den vollständigen, aktuellen Überblick über alle Bereiche des Profils – Einrichten, Bestätigen, Kategorien, Fotos, Beiträge, Bewertungen, Statistiken – findest du in <a href="/google-unternehmensprofil/">Google Unternehmensprofil: der komplette Leitfaden</a>. Und wenn du dein altes GMB-Profil lieber in professionelle Hände gibst: Die Übernahme und Bereinigung bestehender Profile ist der erste Schritt in jeder <a href="/google-business-agentur/">Zusammenarbeit mit uns</a>.</p>`,
  faqTitle: 'Häufige Fragen zur Umbenennung von Google My Business',
  faqs: [
    { id: 'faq-gmb-gibt-es-noch', q: 'Gibt es Google My Business noch?', a: 'Ja, unter neuem Namen. Google My Business wurde im November 2021 in Google Unternehmensprofil (Google Business Profile) umbenannt. Der Eintrag, die Bewertungen und der Zugang über dein Google-Konto sind unverändert – nur die Verwaltung läuft heute direkt in der Google Suche und bei Google Maps.' },
    { id: 'faq-gmb-app', q: 'Wo ist die Google My Business App?', a: 'Google hat die eigene App 2022 eingestellt. Auf dem Smartphone verwaltest du dein Profil über die Google-App oder die Google-Maps-App: einloggen, nach deinem Firmennamen suchen oder in Maps auf dein Profilbild tippen und „Dein Unternehmensprofil" wählen.' },
    { id: 'faq-unterschied-gmb-gbp', q: 'Was ist der Unterschied zwischen Google My Business und Google Unternehmensprofil?', a: 'Inhaltlich keiner – es ist derselbe kostenlose Eintrag bei Google Maps und in der lokalen Suche. Geändert haben sich der Name, die Verwaltungsoberfläche (Suche und Maps statt eigenem Dashboard) und einige Funktionen: App, Website-Builder und Chat wurden eingestellt.' },
    { id: 'faq-gmb-website-weg', q: 'Was ist mit meiner Google-My-Business-Website passiert?', a: 'Google hat den kostenlosen Website-Builder im März 2024 abgeschaltet. Die damit erstellten Seiten wurden zunächst auf das Profil weitergeleitet, seit Juni 2024 sind sie nicht mehr erreichbar. Wer sie als einzige Website genutzt hat, braucht eine eigene Seite – das Profil funktioniert aber auch ohne.' },
    { id: 'faq-business-google-com', q: 'Wofür ist business.google.com heute noch da?', a: 'Für Unternehmen mit mehreren Standorten und für Agenturen: Dort öffnet sich der Business Profile Manager mit der Standortliste. Betriebe mit einem einzigen Standort werden von business.google.com automatisch in die Profilverwaltung in der Google Suche weitergeleitet.' },
    { id: 'faq-neues-profil-noetig', q: 'Muss ich nach der Umbenennung ein neues Profil anlegen?', a: 'Nein. Alle bestehenden Google-My-Business-Profile wurden automatisch übernommen, inklusive Bewertungen, Fotos und Statistiken. Lege niemals ein zweites Profil für denselben Betrieb an – Duplikate werden von Google zusammengeführt oder entfernt und können die Sichtbarkeit beschädigen.' }
  ],
  related: [
    { href: '/google-unternehmensprofil/', label: 'Google Unternehmensprofil: der komplette Leitfaden' },
    { href: '/ratgeber/google-unternehmensprofil-erstellen/', label: 'Google Unternehmensprofil erstellen' },
    { href: '/ratgeber/google-unternehmensprofil-verifizieren/', label: 'Google Unternehmensprofil verifizieren' }
  ],
  ctaLabel: 'Altes GMB-Profil, unklarer Zugang?',
  ctaTitle: 'Wir bringen dein Profil auf den Stand von heute', ctaDesc: 'Zugang klären, Duplikate bereinigen, Kategorien, Fotos und Beiträge auf aktuellen Stand – wir sagen dir in 15 Minuten, was dein Profil braucht.',
  ctaBtn: 'Profil-Check via WhatsApp', ctaGhost: 'Zum kompletten Leitfaden →', ctaGhostHref: '/google-unternehmensprofil/'
}

];
