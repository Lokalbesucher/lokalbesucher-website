/* News-Meldungen: Quelle der Wahrheit für /news/.
   Neue Meldung = neues Objekt in NEWS, dann `node scripts/generate-news.js`
   (rendert Übersicht, Kategorie-Seiten, Meldungen, RSS und Sitemap-Block).

   Zwei feste Achsen, jede Meldung hat GENAU eine Plattform und GENAU ein Thema.
   Kategorie-Seiten entstehen nur, wenn mindestens eine Meldung existiert
   (keine leeren Seiten im Index). Neue Achsen-Werte: Zeile hier ergänzen.

   Regeln je Meldung:
   - slug beginnt mit JJJJ-MM- (Chronik, keine Kollision mit Kategorie-Slugs)
   - date = Datum der Meldung (ISO), erscheint als „Stand“ und im Schema
   - summary = 50–60 Wörter, beantwortet direkt „Was ist passiert, was heißt das“
   - body = Fragen als H2, kurze Absätze, nur belegte Fakten, Quelle verlinkt
   - impact = ein Satz „Was das für dich heißt“ (wird in der Leitseiten-Tabelle genutzt)
   - hub: true → Zeile in der Änderungs-Tabelle auf /google-unternehmensprofil/
     (nur für Google + unternehmensprofile/bewertungen sinnvoll)
   - NIE: „NFC“, „keine Mindestlaufzeit“, „Bewertungen löschen“ als Versprechen,
     Fragen & Antworten als aktive Funktion, Gemini-Verknüpfung als in DE verfügbar */

export const PLATFORMS = {
  'google':      { name: 'Google',      desc: 'Google Unternehmensprofil, Google Maps, Google Suche und Google Ads.' },
  'meta':        { name: 'Meta',        desc: 'Facebook, Instagram, WhatsApp Business und Meta Ads.' },
  'apple-maps':  { name: 'Apple Maps',  desc: 'Apple Business Connect und Einträge in Apple Maps.' },
  'bing-places': { name: 'Bing Places', desc: 'Bing Places for Business und die Bing-Suche.' },
  'ki-suche':    { name: 'KI-Suche',    desc: 'ChatGPT, Perplexity, Gemini, Claude und KI-Übersichten in der Suche.' }
};

export const TOPICS = {
  'unternehmensprofile':   { name: 'Unternehmensprofile',   desc: 'Einträge, Verifizierung, Richtlinien, neue Funktionen.' },
  'bewertungen':           { name: 'Bewertungen',           desc: 'Bewertungsrichtlinien, Antworten, Reputationsschutz.' },
  'werbeanzeigen':         { name: 'Werbeanzeigen',         desc: 'Google Ads, Meta Ads, Local Services Ads.' },
  'social-media':          { name: 'Social Media',          desc: 'Beiträge, Reichweite, Formate für lokale Betriebe.' },
  'conversion-optimierung':{ name: 'Conversion-Optimierung',desc: 'Aus Sichtbarkeit Anrufe, Anfragen und Kunden machen.' },
  'local-seo':             { name: 'Local SEO',             desc: 'Lokales Ranking, Studien, Suchverhalten.' }
};

/* Gemeinsame Ratgeber-Ziele */
const R = {
  hub:        { href: '/google-unternehmensprofil/', label: 'Google Unternehmensprofil: Der komplette Leitfaden' },
  verify:     { href: '/ratgeber/google-unternehmensprofil-verifizieren/', label: 'Google Unternehmensprofil verifizieren' },
  gesperrt:   { href: '/ratgeber/google-unternehmensprofil-gesperrt/', label: 'Google Unternehmensprofil gesperrt: Hilfe' },
  beitraege:  { href: '/ratgeber/google-unternehmensprofil-beitraege/', label: 'Beiträge im Google Unternehmensprofil richtig nutzen' },
  optimieren: { href: '/ratgeber/google-unternehmensprofil-optimieren/', label: 'Google Unternehmensprofil optimieren' },
  mehrBew:    { href: '/ratgeber/mehr-google-bewertungen-bekommen/', label: 'Mehr Google-Bewertungen bekommen: 7 erlaubte Wege' },
  loeschen:   { href: '/ratgeber/google-bewertung-loeschen-lassen/', label: 'Google-Bewertung löschen lassen: Was wirklich geht' },
  ki:         { href: '/ratgeber/ki-sichtbarkeit-lokale-unternehmen/', label: 'KI-Sichtbarkeit für lokale Unternehmen' },
  top3:       { href: '/ratgeber/google-maps-top-3-ranking/', label: 'Top 3 bei Google Maps: So funktioniert das Ranking' },
  bewMgmt:    { href: '/bewertungsmanagement/', label: 'Bewertungsmanagement von Lokalbesucher' },
  kiCheck:    { href: '/ki-sichtbarkeits-check/', label: 'KI-Sichtbarkeits-Check (kostenlos)' },
  ads:        { href: '/google-ads/', label: 'Google Ads für lokale Unternehmen' }
};

export const NEWS = [

{
  slug: '2026-09-uwg-umweltwerbung-abmahnfalle', date: '2026-09-23',
  platform: 'google', topic: 'unternehmensprofile', hub: false,
  image: '/assets/images/news/nachhaltig-abmahnfalle-uwg-og.webp',
  title: '„Nachhaltig“ ohne Beleg: Ab Samstag drohen 50.000 Euro',
  metaDesc: 'Ab 27. September 2026 verbietet das UWG pauschale Umweltwerbung per se. Was „grün“, „klimaneutral“ und „nachhaltig“ jetzt kosten und wie du deine Texte rettest.',
  teaser: 'Vier Tage, dann wird „nachhaltig“ zur Abmahnfalle. Ab Samstag kostet ein Wort auf der Website bis zu 50.000 Euro. Und es trifft genau die Betriebe, die es gut meinen.',
  summary: 'Am <strong>27. September 2026</strong> treten sechs neue Verbote im Anhang zu § 3 Abs. 3 UWG in Kraft. Pauschale Umweltwerbung ohne Beleg ist dann per se unzulässig, ohne Prüfung im Einzelfall und ohne Übergangsfrist. Betroffen sind „umweltfreundlich“, „grün“, „öko“, kompensationsbasierte Klimaneutralität und selbst gestaltete Nachhaltigkeitssiegel. Der Bußgeldrahmen liegt bei 50.000 Euro, abmahnen darf jeder Wettbewerber.',
  body: `        <figure>
          <img src="/assets/images/news/nachhaltig-abmahnfalle-uwg-2026.webp" alt="Illustration: Ein Ladeninhaber streicht auf einer Leiter ein grünes Blatt an sein Schaufenster, während ein Anwalt mit einer versiegelten Abmahnung danebensteht und der Kalender den 27. September zeigt" width="896" height="1120" loading="eager" fetchpriority="high" style="border-radius:12px;border:1px solid #1e2240">
          <figcaption style="font-size:.8rem;color:#7c83aa;margin-top:.5rem">Am 27. September ist das grüne Blatt ohne Beleg kein Marketing mehr, sondern ein Fall.</figcaption>
        </figure>
        <p>Wie oft lest ihr das an einem Tag? „Grün“ auf dem Firmenwagen. „Klimaneutral“ im Google-Beitrag. „Umweltfreundlich“ im Schaufenster. „Nachhaltige Küche“ auf der Speisekarte. Am Samstag, dem 27. September, wird jedes dieser Wörter ohne Beleg verboten. Nicht abmahnfähig nach Prüfung im Einzelfall, sondern per se. Ohne Übergangsfrist.</p>

        <h2 id="was-passiert-ist">Was ist passiert?</h2>
        <p>Der Bundestag hat das Gesetz gegen den unlauteren Wettbewerb geändert. Das Dritte Gesetz zur Änderung des UWG vom 12. Februar 2026 wurde am 19. Februar im Bundesgesetzblatt verkündet (BGBl. 2026 I Nr. 43) und setzt die EU-Richtlinie 2024/825 um. Ab dem 27. September 2026 stehen sechs neue Verbote im Anhang zu § 3 Abs. 3 UWG, der sogenannten schwarzen Liste. Sie wächst damit von 32 auf 38 Einträge. Per se verboten heißt: keine Interessenabwägung, keine Spürbarkeitsschwelle, keine Prüfung im Einzelfall.</p>
        <p>Die drei Verbote, die jeden lokalen Betrieb treffen:</p>
        <ul>
          <li><strong>Allgemeine Umweltaussagen</strong> ohne nachweisbar hervorragende Umweltleistung — „umweltfreundlich“, „grün“, „öko“.</li>
          <li><strong>„Klimaneutral“ auf Basis von Kompensation</strong> — also das Zertifikat, das viele Betriebe für ein paar Hundert Euro im Jahr kaufen.</li>
          <li><strong>Nachhaltigkeitssiegel ohne Zertifizierungssystem</strong> — das selbst gestaltete Blatt-Logo auf der Website.</li>
        </ul>
        <p>Dazu kommen: Aussagen über den ganzen Betrieb, wenn nur ein Teil zutrifft. Gesetzliche Pflichten, die als Besonderheit beworben werden. Und Umweltversprechen für die Zukunft ohne überprüfbaren Umsetzungsplan.</p>
        <div class="statbox">
          <div><div class="n">27.09.2026</div><p>Stichtag. Übergangs- und Abverkaufsfristen sind ausdrücklich nicht vorgesehen</p></div>
          <div><div class="n">32 → 38</div><p>So viele Einträge hat die schwarze Liste im Anhang zu § 3 Abs. 3 UWG ab Samstag</p></div>
          <div><div class="n">50.000 €</div><p>Bußgeldrahmen; ab 1,25 Mio. € Jahresumsatz bis zu 4 % bei weitverbreiteten Verstößen</p></div>
        </div>

        <h2 id="was-es-kostet">Was kostet ein Verstoß?</h2>
        <p>Der Bußgeldrahmen liegt bei 50.000 Euro. Unternehmen mit mehr als 1,25 Millionen Euro Jahresumsatz können bei weitverbreiteten Verstößen mit EU-Bezug bis zu 4 Prozent ihres Jahresumsatzes treffen. Das ist die staatliche Seite.</p>
        <p>Die schnellere ist eine andere: Jeder Wettbewerber und jeder Verband darf nach § 8 UWG abmahnen. Unterlassungserklärung, Vertragsstrafe, Anwaltskosten. Dafür braucht niemand eine Behörde, und eine Übergangsfrist gibt es nicht.</p>
        <p>Ein Detail, das in der Aufregung untergeht: Das ausdrückliche Verbot der Kompensationswerbung zielt auf produktbezogene Aussagen. Wer den ganzen Betrieb als klimaneutral bewirbt, fällt nicht automatisch darunter, wird aber weiterhin am allgemeinen Irreführungsmaßstab gemessen. Angreifbar ist damit beides.</p>

        <h2 id="wer-gewinnt">Wer gewinnt?</h2>
        <p>Die Abmahnindustrie. Sie braucht keine Ermittlungen, sondern eine Google-Suche: „klimaneutral“ plus Branche plus Stadt. Jede Trefferseite ist ab Samstag ein Fall.</p>

        <h2 id="wer-verliert">Wer ist der größte Verlierer?</h2>
        <p>Der lokale Betrieb, der es gut meint. Der Handwerker, der seit 2024 Ökostrom bezieht und deshalb „klimaneutral“ auf den Transporter geschrieben hat. Das Restaurant mit „nachhaltiger Küche“, weil das Gemüse vom Hof nebenan kommt. Beide haben recht — und beide sind ab Samstag angreifbar, weil das Wort größer ist als der Beleg.</p>
        <p>Die Konzerne haben ihre Rechtsabteilungen seit Monaten daran sitzen. Der Betrieb um die Ecke erfährt es aus der Abmahnung.</p>

        <h2 id="was-tun">Wie können lokale Unternehmen reagieren?</h2>
        <p>Die Regel ist einfach: Erlaubt bleibt, was konkret und belegbar ist. Verboten wird, was pauschal klingt.</p>
        <ul>
          <li><strong>Bis Freitag alle Texte durchsuchen.</strong> Website, Google-Unternehmensprofil samt Beschreibung und Beiträgen, Social Media, Anzeigen, Fahrzeugbeschriftung. Jedes „grün“, „nachhaltig“, „öko“, „klimaneutral“, „umweltfreundlich“ markieren.</li>
          <li><strong>Pauschal durch konkret ersetzen.</strong> Aus „klimaneutral“ wird „Ökostrom-Tarif seit 2024“. Aus „nachhaltige Küche“ wird „Gemüse von drei Höfen im Umkreis von zehn Kilometern“. Aus „umweltfreundlich“ wird „Verpackung aus 80 Prozent Recyclingpapier“. Zahlen, Jahre, Namen — das ist ab Samstag die einzige sichere Sprache.</li>
          <li><strong>Siegel prüfen.</strong> Blauer Engel, EU-Ecolabel und das staatliche Bio-Siegel bleiben erlaubt, ebenso extern zertifizierte Systeme. Ein eigenes Blatt-Symbol ohne Zertifizierung muss weg.</li>
          <li><strong>Was nicht belegbar ist, fliegt raus.</strong> Kein Wort ist so viel wert wie eine Abmahnung.</li>
        </ul>
        <p>Die Wahrheit war schon immer das bessere Marketing. Ab Samstag ist sie auch das einzige erlaubte.</p>`,
  fazit: 'Pauschale Umweltwerbung ist ab Samstag kein Risiko mehr, sondern ein Verstoß. Wer bis Freitag jedes unbelegte „grün“ durch eine Zahl, ein Jahr oder einen Namen ersetzt, ist raus aus der Schusslinie.',
  impact: 'Bis 26. September Website, Google-Profil, Beiträge und Fahrzeuge nach „grün“, „öko“, „nachhaltig“ und „klimaneutral“ durchsuchen und jede pauschale Aussage durch einen konkreten Beleg ersetzen.',
  sources: [
    { label: 'Bundesgesetzblatt 2026 I Nr. 43 vom 19.02.2026: Drittes Gesetz zur Änderung des UWG', url: 'https://dip.bundestag.de/vorgang/drittes-gesetz-zur-%C3%A4nderung-des-gesetzes-gegen-den-unlauteren-wettbewerb/325533' },
    { label: 'Richtlinie (EU) 2024/825 (EmpCo-Richtlinie)', url: 'https://eur-lex.europa.eu/eli/dir/2024/825/oj' },
    { label: 'IHK Schwerin: Ab 27.09.2026 neue Regelungen im UWG', url: 'https://www.ihk.de/schwerin/recht/wirtschaftsrecht/wettbewerbsrecht/greenwashing-6984696' },
    { label: 'Osborne Clarke: Greenwashing-Verbot und die UWG-Reform', url: 'https://www.osborneclarke.com/de/insights/greenwashing-verbot-was-die-uwg-reform-fuer-umweltbezogene-werbeaussagen-bedeutet' },
    { label: 'IHK Berlin: Nachhaltigkeitssiegel und Werbung mit Umweltaussagen', url: 'https://www.ihk.de/berlin/service-und-beratung/recht-und-steuern/neuer-inhalt2026-rechtsaenderung-uwg-6826260' }
  ],
  keywords: ['UWG', 'Greenwashing', 'Umweltwerbung', 'klimaneutral', 'nachhaltig', 'Abmahnung', 'EmpCo-Richtlinie', '27. September 2026'],
  related: [R.optimieren, R.beitraege, R.hub]
},

{
  slug: '2026-09-google-anruf-assistent-erfasste-informationen', date: '2026-09-21',
  platform: 'google', topic: 'unternehmensprofile', hub: true,
  hubWhat: 'Neuer Tab „Erfasste Informationen“: zeigt, was Googles automatisierter Assistent per Anruf, SMS oder WhatsApp gesammelt hat, einzeln löschbar',
  image: '/assets/images/news/google-anruf-assistent-erfasste-informationen-og.webp',
  title: 'Google ruft an: Neuer Tab zeigt, was der Assistent gesammelt hat',
  metaDesc: 'Neuer Tab „Erfasste Informationen“ im Google Unternehmensprofil: Was Googles Anruf-Assistent über deinen Betrieb sammelt, wie du es prüfst und löschst.',
  teaser: 'Google ruft an, und das ist kein Fake. Was der automatisierte Assistent am Telefon über einen Betrieb erfährt, entscheidet mit, wofür er gefunden wird. Seit dem 14. September lässt sich das erstmals einsehen.',
  summary: 'Seit dem 14. September 2026 zeigt das Google Unternehmensprofil den neuen Tab <strong>„Erfasste Informationen“</strong>. Dort steht, was Googles automatisierter Assistent per Anruf, SMS oder WhatsApp über einen Betrieb gesammelt hat, mit Quelle und Datum. Jeder Eintrag lässt sich einzeln löschen. Google nutzt die Angaben, um Betriebe passenden Suchanfragen zuzuordnen. Der Tab wird schrittweise ausgerollt.',
  body: `        <figure>
          <img src="/assets/images/news/google-anruf-assistent-erfasste-informationen-2026.webp" alt="Illustration: Googles automatisierter Assistent ruft in einem Laden an und notiert die Antworten des Mitarbeiters zu Öffnungszeiten und Leistungen" width="896" height="1120" loading="eager" fetchpriority="high" style="border-radius:12px;border:1px solid #1e2240">
          <figcaption style="font-size:.8rem;color:#7c83aa;margin-top:.5rem">Google fragt nach Öffnungszeiten und Leistungen. Und notiert die Antwort.</figcaption>
        </figure>
        <p>Das Telefon klingelt im Betrieb. Eine freundliche, etwas zu gleichmäßige Stimme fragt, ob samstags noch bis 14 Uhr geöffnet ist und ob man auch Reparaturen macht. Der Mitarbeiter sagt „Ja, glaube ich“, legt auf und vergisst es. Google nicht.</p>
        <p>Seit dem 14. September ist es offiziell: Das Google Unternehmensprofil zeigt einen neuen Tab „Erfasste Informationen“. Darin steht, was Googles automatisierter Assistent per Anruf, SMS oder WhatsApp über ein Unternehmen zusammengetragen hat, mit Quelle und Erfassungsdatum. Google auf X, übersetzt: „Ihr könnt jetzt direkt im Dashboard prüfen, welche Details Googles automatisierter Assistent verifiziert hat, und veraltete Angaben löschen."</p>

        <h2 id="was-passiert-ist">Was ist passiert?</h2>
        <p>Google kontaktiert Unternehmen seit Jahren automatisiert an der bestätigten Telefonnummer, um Profildaten zu prüfen. Seit Juli hatte Google getestet, ob Unternehmen diese Daten einsehen und löschen können. Jetzt ist die Funktion live: Unter „Profil bearbeiten“ → „Erfasste Informationen“ sind die gesammelten Angaben einzeln einsehbar und einzeln löschbar. Zweimal „Löschen“, und der Eintrag verschwindet aus Googles Datensätzen. Andere Angaben im Profil ändert das nicht. Laut Google-Hilfe gilt die Funktion für „ausgewählte Regionen, Sprachen und Unternehmenskategorien“. Die deutsche Hilfeseite existiert bereits.</p>
        <p>Was Google nicht an die große Glocke hängt: Die Anrufe lassen sich abstellen. In den Profileinstellungen steht unter „Erweiterte Einstellungen“ der Schalter „Automatisierte Anrufe und SMS von Google“, und am Telefon genügt der Satz „Bitte rufen Sie mein Unternehmen nicht mehr an“. Wer abschaltet, verzichtet allerdings auch auf Buchungs- und Verfügbarkeitsanfragen, die Google im Namen von Kunden stellt.</p>
        <div class="statbox">
          <div><div class="n">14.09.2026</div><p>Google bestätigt den Tab „Erfasste Informationen“ offiziell, nach Tests seit Juli</p></div>
          <div><div class="n">3 Kanäle</div><p>Anruf, SMS und WhatsApp: Darüber sammelt Googles Assistent Angaben zum Betrieb</p></div>
          <div><div class="n">42 %</div><p>aller lokalen Suchen enden mit einem Klick auf den Kartenausschnitt, laut Backlinko</p></div>
        </div>

        <h2 id="entscheidender-satz">Wofür nutzt Google die gesammelten Daten?</h2>
        <p>Im neuen Tab steht es, übersetzt aus dem englischen Original: „Diese Informationen wurden in Telefon- oder Chat-Gesprächen mit Ihrem Unternehmen erfasst. Sie werden verwendet, um Ihr Unternehmen mit Kunden zusammenzubringen, die nach Leistungen wie Ihren suchen."</p>
        <p>Das ist keine Profilpflege. Das ist Relevanz. Was der Mitarbeiter am Telefon sagt, fließt in die Entscheidung ein, für welche Suchanfragen ein Betrieb erscheint. In jenem Kartenausschnitt, auf den bei <strong>42 Prozent aller lokalen Suchen</strong> der Klick fällt, so eine Backlinko-Analyse von 306.000 lokalen Suchanfragen.</p>

        <h2 id="wer-gewinnt">Wer gewinnt?</h2>
        <p>Google. Vollständigere Profile bedeuten bessere Antworten in Suche, Maps und Gemini, ohne dass der Betrieb selbst tätig werden muss. Der Anrufroboter ist der günstigste Datenlieferant, den Google hat. Betriebe, die den Tab nutzen, gewinnen ebenfalls: Erstmals lässt sich sehen und korrigieren, was Google im Hintergrund über sie annimmt.</p>

        <h2 id="wer-verliert">Wer ist der größte Verlierer?</h2>
        <p>Der Betrieb, der nicht hinschaut. Ein falsch verstandener Feiertag, eine Leistung, die es nicht mehr gibt, ein „Ja, glaube ich“ am Telefon. Der Kunde steht vor verschlossener Tür und schreibt die Bewertung, die bleibt. Oder der Betrieb erscheint für eine Leistung, die er gar nicht anbietet, und für die, die er anbietet, nicht. Die Quelle des Fehlers, ein Telefonat von vor sechs Wochen, kennt im Betrieb niemand.</p>

        <h2 id="was-tun">Wie können lokale Unternehmen reagieren?</h2>
        <p>Der neue Tab ist keine Bedrohung, sondern ein Kontrollinstrument. Drei Punkte entscheiden, ob er nützt oder schadet.</p>
        <ul>
          <li><strong>Der Tab gehört in den monatlichen Profil-Check.</strong> Wer „Erfasste Informationen“ regelmäßig prüft, sieht, was Google zu wissen glaubt, bevor es über die Sichtbarkeit entscheidet.</li>
          <li><strong>Google-Anrufe brauchen einen Ansprechpartner.</strong> Wer im Betrieb ans Telefon geht, sollte wissen: Ein Anruf von Google ist kein Betrug, aber auch keine beiläufige Auskunft. Die saubere Regel lautet, an den Profilverantwortlichen weiterzuleiten.</li>
          <li><strong>Die Sichtbarkeit je Profil ist zu prüfen.</strong> Google rollt den Tab schrittweise aus. Ob er in einem Profil bereits erscheint, zeigt nur der Blick ins Dashboard.</li>
        </ul>`,
  fazit: 'Google hat den Betrieben einen Blick in seine Notizen erlaubt. Wer ihn nicht nutzt, überlässt die Entscheidung, wofür er gefunden wird, einem Roboter.',
  impact: 'Tab „Erfasste Informationen“ monatlich prüfen, falsche Einträge löschen und im Betrieb festlegen, wer Google-Anrufe beantwortet.',
  sources: [
    { label: 'Search Engine Land: Google Business Profiles rolls out Collected Info (14.09.2026)', url: 'https://searchengineland.com/google-business-profiles-rolls-out-collected-info-488387' },
    { label: 'Google (@GoogleMyBiz) auf X, 14.09.2026', url: 'https://x.com/GoogleMyBiz/status/2099489719440621982' },
    { label: 'Google-Hilfe: Unternehmensprofil bearbeiten, Abschnitt „Erfasste Informationen“', url: 'https://support.google.com/business/answer/3039617?hl=de' },
    { label: 'Google-Hilfe: Automatisierte Anrufe und SMS von Google', url: 'https://support.google.com/business/answer/7690269?hl=de' },
    { label: 'Google-Hilfe: Erweiterte Profileinstellungen verwalten', url: 'https://support.google.com/business/answer/10737668?hl=de' },
    { label: 'Search Engine Roundtable: Collected Info im Test (13.07.2026)', url: 'https://www.seroundtable.com/google-business-profiles-new-collected-info-41672.html' },
    { label: 'Backlinko: Local-Search-Studie', url: 'https://backlinko.com/local-seo-stats' }
  ],
  keywords: ['Google Unternehmensprofil', 'Erfasste Informationen', 'Collected Info', 'automatisierter Assistent', 'Google Anruf', 'Profildaten'],
  related: [R.optimieren, R.hub, R.top3]
},

{
  slug: '2026-09-google-dma-buchungsportale-vor-hotels-local-pack', date: '2026-09-16',
  platform: 'google', topic: 'local-seo', hub: true,
  hubWhat: 'DMA-Umbau der Suche: Bei Hotels, Flügen und Restaurants stehen Buchungsportale über Googles eigenen Ergebnissen',
  image: '/assets/images/news/google-dma-portale-statt-local-pack-og.webp',
  title: '890 Millionen Euro Strafe für Google: Die Buchungsportale gewinnen',
  metaDesc: 'Seit 8. September 2026 liefern Booking und Co. bei Hotelsuchen die Top-3 statt Google. Was die 890-Millionen-Strafe der EU für Hotels und lokale Betriebe heißt.',
  teaser: 'Wir suchen lokal auf Google. Bei „hotel berlin“ liefert seit dem 8. September nicht mehr Google die drei Treffer, sondern Booking.com. Was das für Hotels, Restaurants und bald vielleicht jeden lokalen Betrieb heißt.',
  summary: 'Die EU-Kommission hat Google am 23. Juli 2026 zu <strong>890 Millionen Euro Strafe</strong> verurteilt, 460 Millionen davon für die Bevorzugung eigener Dienste in der Suche. Seit dem 8. September zeigt Google bei Hotels, Flügen und Restaurants ein neues Layout: Ein Buchungsportal steht oben, Googles eigene Liste ist eingeklappt, Direktanbieter folgen ohne Preise. Jede Buchung über das Portal kostet den Betrieb Provision.',
  body: `        <figure>
          <img src="/assets/images/news/google-dma-portale-statt-local-pack-hotel-berlin-2026.webp" alt="Google-Suche „hotel berlin“ am 16. September 2026: Booking.com liefert Karte und drei Hotels mit Preisen, Googles eigene Hotelliste ist eingeklappt" width="1600" height="2000" loading="eager" fetchpriority="high" style="border-radius:12px;border:1px solid #1e2240">
          <figcaption style="font-size:.8rem;color:#7c83aa;margin-top:.5rem">Echte Google-Suche „hotel berlin“, Deutschland, 16. September 2026: Das Portal steht über Google.</figcaption>
        </figure>
        <p>Wir suchen lokal auf Google. Es kommt der Kartenausschnitt mit drei Unternehmen. Das ist gelernt, und wer im sogenannten Local Pack landet, gewinnt Kunden: <strong>42 Prozent aller lokalen Suchen</strong> enden mit einem Klick auf genau diese drei Einträge, so eine Backlinko-Analyse von 306.000 lokalen Suchanfragen.</p>
        <p>Doch das Spiel hat sich am 8. September geändert. Und Google bezahlt.</p>
        <p>Leicht zu übersehen: Bei „hotel berlin“ stammt das Local Pack nicht mehr von Google. Booking.com, BluePillow und weitere Portale liefern jetzt die Top-3-Ergebnisse, mit Karte, Preisen, Bewertungen und dem Button „Mehr auf Booking.com ansehen“. Googles eigene Hotelliste? Eine eingeklappte Zeile darunter, gleichrangig mit Odigeo und Trip.com. Google selbst nennt den Umbau „die größte Qualitätsminderung in 29 Jahren Suche“.</p>

        <h2 id="was-passiert-ist">Was ist passiert?</h2>
        <p>Am 23. Juli 2026 hat die EU-Kommission Google zu 890 Millionen Euro Strafe verurteilt. 460 Millionen davon für die Bevorzugung eigener Dienste in der Suche, 430 Millionen für den Play Store. Grundlage ist der Digital Markets Act, das EU-Gesetz gegen die Marktmacht der großen Plattformen. Google hatte 60 Tage. Am 8. September war die Frist um.</p>
        <p>Seitdem gilt bei Hotels, Flügen und Restaurants ein neues Layout: Ein Portal steht prominent oben. Zwei weitere Portale folgen eingeklappt. Erst darunter kommt ein Karussell mit den Direktanbietern, ohne Live-Preise, ohne Datumsfilter, ohne Ausstattungs-Tags. Die Einheit für Ferienwohnungen hat Google komplett gestrichen.</p>
        <div class="statbox">
          <div><div class="n">890 Mio. €</div><p>DMA-Strafe der EU-Kommission vom 23. Juli 2026, davon 460 Mio. € für die Suche</p></div>
          <div><div class="n">60 Tage</div><p>Umsetzungsfrist, seit 8. September 2026 ist das neue Layout in Kraft</p></div>
          <div><div class="n">−30 %</div><p>Direktbuchungsklicks für Hotels nach den ersten DMA-Änderungen, laut Google im November 2024</p></div>
        </div>

        <h2 id="wer-gewinnt">Wer gewinnt?</h2>
        <p>Booking, Expedia, HRS, Trivago, BluePillow. Die Portale bekommen den Platz, den Google jahrelang für sich reserviert hatte. Und jede Buchung, die dort landet, kostet den Betrieb Provision.</p>
        <p>Die EU wollte Wettbewerb. Bekommen hat sie einen Platztausch: Ein Gatekeeper gibt ab, drei andere nehmen.</p>

        <h2 id="wer-verliert">Wer ist der größte Verlierer?</h2>
        <p>Nicht Google. Google verliert Klicks, der Betrieb verliert Gäste. Schon nach den ersten DMA-Anpassungen meldete Google im November 2024 einen Rückgang der Direktbuchungsklicks für Hotels um bis zu 30 Prozent. Das war die kleine Änderung. Jetzt kommt die große. Jede Buchung, die statt beim Hotel beim Portal landet, ist dieselbe Übernachtung, nur mit Provision.</p>

        <h2 id="nicht-nur-hotels">Warum hört das nicht bei Hotels auf?</h2>
        <p>Die Kommission rügt in ihrer Entscheidung die Bevorzugung eigener Google-Dienste bei Shopping, Hotels, Verkehr und Sport. Das Local Pack, die Karte mit den drei lokalen Ergebnissen, ist technisch dieselbe Art von Google-Einheit. Was heute die Hotelbox trifft, kann morgen die Karte treffen, auf die jeder Handwerker, jede Praxis und jedes Restaurant angewiesen ist.</p>

        <h2 id="was-tun">Wie können lokale Unternehmen reagieren?</h2>
        <p>Der Kunde kommt weiterhin über Google. Entscheidend ist, ob er beim Betrieb landet oder beim Vermittler. Drei Hebel bleiben in der Hand der Unternehmen.</p>
        <ul>
          <li><strong>Das Google-Unternehmensprofil wird zur Verkaufsfläche.</strong> Website, Telefonnummer und Reservierungslink sind die drei Felder, die Google weiterhin prominent ausspielt. Führen sie zu einem Portal statt zum eigenen Buchungsweg, ist der Direktkanal verloren, bevor der Gast ihn gesehen hat.</li>
          <li><strong>Die eigene Marke muss abgesichert werden.</strong> Wer nach einem Hotel- oder Restaurantnamen sucht, soll den Betrieb finden, nicht Booking oder Lieferando. Eine Suchanzeige auf den eigenen Namen kostet wenig und schließt genau diese Lücke.</li>
          <li><strong>Bewertungen, Fotos und Öffnungszeiten entscheiden.</strong> Ohne Preise und Filter bleibt dem Gast in Googles Einheit nur der Vergleich über Sterne und Bilder. Ein Betrieb mit 4,2 Sternen und 80 Bewertungen verliert gegen einen mit 4,7 und 600.</li>
        </ul>`,
  fazit: 'Die Portale haben den besten Platz im Regal bekommen. Der Direktkanal ist der einzige, den einem Unternehmen niemand wegnehmen kann, sofern es ihn besetzt. Wer Profil, Markenschutz und Bewertungen jetzt in Ordnung bringt, verliert an die Portale weniger als die Konkurrenz.',
  impact: 'Website, Telefon und Reservierungslink im Profil auf den eigenen Buchungsweg zeigen lassen, den Firmennamen mit einer Suchanzeige absichern, Bewertungen und Fotos auf Vergleichsniveau bringen.',
  sources: [
    { label: 'EU-Kommission: 890 Mio. € Strafe für Google (23.07.2026)', url: 'https://digital-markets-act.ec.europa.eu/commission-fines-google-eur890-million-breaches-digital-markets-act-2026-07-23_en' },
    { label: 'Skift: Google streicht Reise-Suchfunktionen in der EU (08.09.2026)', url: 'https://skift.com/2026/09/08/google-update-europe-travel-search-results-dma/' },
    { label: 'Search Engine Roundtable: „Größte Qualitätsminderung“ laut Google', url: 'https://www.seroundtable.com/google-eu-dma-largest-reduction-quality-42042.html' },
    { label: 'Google-Blog: DMA-Update, Direktbuchungsklicks −30 % (26.11.2024)', url: 'https://blog.google/company-news/inside-google/around-the-globe/google-europe/dma-compliance-update/' },
    { label: 'Backlinko: Local-Search-Studie', url: 'https://backlinko.com/local-seo-stats' },
    { label: 'Eigener Test: google.de, „hotel berlin“, 16.09.2026', url: 'https://www.google.de/search?q=hotel+berlin' }
  ],
  keywords: ['Digital Markets Act', 'DMA', 'Google Strafe', 'Local Pack', 'Booking.com', 'Hotels', 'Restaurants', 'Direktbuchung'],
  related: [R.top3, R.optimieren, R.ads]
},

{
  slug: '2026-09-google-foto-verifizierung-test', date: '2026-09-04',
  platform: 'google', topic: 'unternehmensprofile', hub: false,
  title: 'Google testet Foto-Verifizierung fürs Unternehmensprofil',
  metaDesc: 'Seit 4. September 2026 zeigt Google bei einzelnen Profilen eine Foto-Verifizierung als Bestätigungsmethode. Was bekannt ist und welche Fotos du jetzt bereitlegst.',
  teaser: 'Neben Video, Postkarte, Telefon und E-Mail taucht bei einzelnen Profilen eine sechste Methode auf. Ein Test, noch nicht flächendeckend.',
  summary: 'Seit dem 4. September 2026 wird bei einzelnen Google Unternehmensprofilen eine <strong>Foto-Verifizierung</strong> als Bestätigungsmethode angezeigt. Google hat die Methode nicht offiziell angekündigt, die Hilfeseite nennt weiterhin fünf Wege. Es handelt sich um einen Test. Welche Methode du bekommst, entscheidet Google automatisch. Halte Außenfoto, Schild und Innenansicht in guter Qualität bereit.',
  body: `        <h2 id="was-ist-neu">Was ist neu?</h2>
        <p>Bei einzelnen Profilen erscheint seit dem 4. September 2026 im Verifizierungsdialog die Option, statt eines Videos mehrere Fotos hochzuladen: Außenansicht mit Firmenschild, Innenraum, Arbeitsmittel oder Fahrzeugbeschriftung. Die offizielle Google-Hilfe listet weiterhin nur fünf Methoden: Telefon oder SMS, E-Mail, Live-Videoanruf, Postkarte und Videoaufnahme.</p>
        <h2 id="fuer-wen">Für wen gilt das?</h2>
        <p>Für niemanden verlässlich. Google ermittelt die möglichen Bestätigungsmethoden automatisch, du kannst sie nicht auswählen. Wer die Foto-Option sieht, sollte sie nutzen, weil sie schneller ist als ein Video. Wer sie nicht sieht, muss weiter mit Video rechnen, das laut Experten-Konsens seit 2025 die häufigste Methode ist.</p>
        <h2 id="was-tun">Was solltest du jetzt tun?</h2>
        <ul>
          <li>Fotos vorab machen: Ladenfront mit Schild, Eingang, Innenraum, bei Handwerkern das beschriftete Fahrzeug.</li>
          <li>Name und Adresse müssen exakt so auf den Fotos zu sehen sein wie im Profil. Abweichungen sind der häufigste Ablehnungsgrund, auch beim Video.</li>
          <li>Keine KI-generierten oder Stock-Fotos hochladen. Das gilt als Verstoß und kann das Profil sperren.</li>
        </ul>
        <p>Die Prüfung dauert laut Google bis zu fünf Arbeitstage. Wenn Google dich mehrfach zur Verifizierung auffordert, ist das normal und kein Zeichen für ein Problem.</p>`,
  impact: 'Fotos von Schild, Eingang und Innenraum vorab bereitlegen, Name und Adresse müssen mit dem Profil übereinstimmen.',
  sources: [
    { label: 'Google-Hilfe: Unternehmensprofil bestätigen', url: 'https://support.google.com/business/answer/7107242?hl=de' }
  ],
  keywords: ['Google Unternehmensprofil', 'Verifizierung', 'Foto-Verifizierung', 'Bestätigungsmethode'],
  related: [R.verify, R.gesperrt, R.hub]
},

{
  slug: '2026-09-google-tell-maps-beitragsfunktion', date: '2026-09-02',
  platform: 'google', topic: 'unternehmensprofile', hub: true,
  hubWhat: '„Tell Maps“: Nutzer schlagen Änderungen an deinem Profil per Foto oder Chat vor',
  title: '„Tell Maps“: Nutzer ändern dein Profil jetzt per Chat',
  metaDesc: 'Google startet „Tell Maps“: Nutzer schlagen Profiländerungen per Chat oder Foto vor, etwa neue Öffnungszeiten. Warum du Vorschläge jetzt wöchentlich prüfen musst.',
  teaser: 'Ein Foto vom Schild reicht, und Google schlägt neue Öffnungszeiten für dein Profil vor. Gut für die Datenqualität, riskant für unbeaufsichtigte Profile.',
  summary: 'Am 2. September 2026 hat Google „Tell Maps“ vorgestellt: Nutzer können Änderungen an Unternehmensprofilen <strong>konversationell vorschlagen</strong>, zum Beispiel neue Öffnungszeiten per Foto des Türschilds. Die KI liest die Daten aus und legt einen Änderungsvorschlag an. Für Inhaber heißt das: Vorschläge landen häufiger im Profil und können ohne Reaktion übernommen werden. Wöchentliche Kontrolle wird Pflicht.',
  body: `        <h2 id="was-ist-neu">Was ist neu?</h2>
        <p>Bisher mussten Nutzer Änderungen an einem Profil über das Formular „Änderung vorschlagen“ eingeben. Mit „Tell Maps“ reicht ein Satz oder ein Foto: „Der Laden hat jetzt bis 20 Uhr auf“ plus Foto vom Schild, und Google erstellt daraus einen strukturierten Vorschlag. Die Funktion nutzt Gemini und ist Teil des KI-Umbaus von Google Maps, zu dem auch „Ask Maps“ gehört, das seit März 2026 in den USA und Indien läuft.</p>
        <h2 id="warum-relevant">Warum ist das für lokale Betriebe relevant?</h2>
        <p>Google übernimmt Nutzervorschläge schon heute teilweise ohne Bestätigung des Inhabers, wenn das Profil nicht aktiv gepflegt wird. Mit einer niedrigeren Hürde für Vorschläge steigt die Zahl der Änderungen. Falsche Öffnungszeiten sind dabei der häufigste Fehler und kosten direkt Kunden: „geöffnet zur Suchzeit“ ist laut den Local Search Ranking Factors 2026 ein Top-5-Rankingfaktor.</p>
        <h2 id="was-tun">Was solltest du jetzt tun?</h2>
        <ul>
          <li>Im Profil-Dashboard mindestens einmal pro Woche auf „Vorgeschlagene Änderungen“ prüfen und ablehnen, was falsch ist.</li>
          <li>Öffnungszeiten inklusive Feiertage selbst aktuell halten. Wo du korrekt bist, gibt es nichts vorzuschlagen.</li>
          <li>Das Türschild mit den Zeiten im Profil abgleichen. Genau dieses Schild wird künftig fotografiert.</li>
        </ul>
        <p>Ein Starttermin für Deutschland ist nicht genannt. Der Ausbau von Ask Maps und Tell Maps läuft laut Google „in den kommenden Monaten“.</p>`,
  impact: 'Vorgeschlagene Änderungen wöchentlich prüfen, Öffnungszeiten und Türschild abgleichen.',
  sources: [
    { label: 'Search Engine Roundtable: Google Tell Maps', url: 'https://www.seroundtable.com/google-tell-maps-42001.html' },
    { label: 'Google-Blog: Ask Maps und Immersive Navigation', url: 'https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/' }
  ],
  keywords: ['Tell Maps', 'Google Maps', 'Öffnungszeiten', 'Änderungsvorschläge', 'Gemini'],
  related: [R.optimieren, R.hub, R.top3]
},

{
  slug: '2026-08-google-beitrags-statistiken-zurueck', date: '2026-08-20',
  platform: 'google', topic: 'unternehmensprofile', hub: false,
  title: 'Beitrags-Statistiken im Unternehmensprofil sind zurück',
  metaDesc: 'Seit 20. August 2026 zeigt Google wieder Aufrufe und Klicks pro Beitrag im Unternehmensprofil. So liest du die Zahlen und findest die Beiträge, die sich lohnen.',
  teaser: 'Monatelang gab es keine Zahlen zu Beiträgen. Jetzt siehst du wieder Aufrufe und Klicks pro Beitrag.',
  summary: 'Seit dem 20. August 2026 zeigt das Google Unternehmensprofil wieder <strong>Aufrufe und Klicks pro Beitrag</strong>. Die Statistiken waren über Monate verschwunden, nachdem Google den Bereich „Updates“ in „Beiträge“ umbenannt und in einen zentralen Veröffentlichungen-Hub verschoben hatte. Jetzt kannst du wieder messen, welche Beitragstypen Reaktionen auslösen und den Redaktionsplan danach ausrichten.',
  body: `        <h2 id="was-ist-neu">Was ist neu?</h2>
        <p>Im Profil-Dashboard stehen unter jedem Beitrag wieder zwei Zahlen: wie oft er angezeigt und wie oft der Button geklickt wurde. Die Daten fehlten seit dem Umbau der Beitragsfunktion. Im April 2025 waren Beiträge zeitweise sogar komplett aus den Profilen verschwunden, damals ein Fehler bei Google.</p>
        <h2 id="wie-nutzen">Wie nutzt du die Zahlen?</h2>
        <p>Beiträge sind laut Ranking-Studien nur ein schwacher Rankingfaktor, aber ein sichtbares Lebenszeichen und ein Klickmagnet. Mit den Statistiken siehst du, welche Formate funktionieren:</p>
        <ul>
          <li>Angebote mit klarem Preis und Enddatum erzielen in unseren Kundenprofilen die höchste Klickrate.</li>
          <li>Reine Bild-Updates ohne Button bekommen Aufrufe, aber kaum Klicks.</li>
          <li>Beiträge, die nach 7 Tagen keine Aufrufe zeigen, wurden oft von Google abgelehnt. Im Dashboard prüfen.</li>
        </ul>
        <h2 id="was-tun">Was solltest du jetzt tun?</h2>
        <p>Vier Beiträge pro Monat sind ein realistischer Rhythmus. Vergleiche nach vier Wochen die Klicks je Typ und streiche, was nicht läuft. Welche Beitragstypen es gibt, welche Bildmaße gelten und wie lange Beiträge sichtbar bleiben, steht im Ratgeber zu Beiträgen.</p>`,
  impact: 'Klicks pro Beitrag auswerten und den Redaktionsplan an den erfolgreichen Formaten ausrichten.',
  sources: [
    { label: 'Sterling Sky: Timeline der Google-Local-Änderungen', url: 'https://www.sterlingsky.ca/google-local-changes/' },
    { label: 'Search Engine Roundtable: Updates werden zu Beiträgen', url: 'https://www.seroundtable.com/google-business-profiles-changes-add-updates-to-posts-39582.html' }
  ],
  keywords: ['Google Beiträge', 'Beitrags-Statistiken', 'Google Unternehmensprofil', 'Aufrufe', 'Klicks'],
  related: [R.beitraege, R.optimieren, R.hub]
},

{
  slug: '2026-08-google-inhaberantwort-melden', date: '2026-08-14',
  platform: 'google', topic: 'bewertungen', hub: true,
  hubWhat: 'Neue Meldeoption „Inhaberantwort melden“: Kunden können deine Antworten auf Bewertungen melden',
  title: 'Neu bei Google: Kunden können Inhaberantworten melden',
  metaDesc: 'Seit 14. August 2026 können Kunden Inhaberantworten auf Google-Bewertungen melden. Welche Antworten jetzt riskant sind und wie du auf Kritik richtig reagierst.',
  teaser: 'Bisher konnten nur Bewertungen gemeldet werden. Jetzt auch deine Antwort darauf. Wer auf Kritik ausfällig reagiert, riskiert die Entfernung der Antwort.',
  summary: 'Seit dem 14. August 2026 gibt es in Google-Bewertungen die Option <strong>„Inhaberantwort melden“</strong>. Nutzer können damit Antworten von Unternehmen als beleidigend, werblich oder datenschutzwidrig markieren. Google prüft und entfernt gemeldete Antworten. Für Inhaber heißt das: sachlich bleiben, keine Kundendaten in der Antwort nennen, keine Drohungen. Jede Antwort ist öffentlich und wird jetzt auch geprüft.',
  body: `        <h2 id="was-ist-neu">Was ist neu?</h2>
        <p>Neben jeder Inhaberantwort erscheint im Menü der Punkt „Inhaberantwort melden“. Die Meldegründe entsprechen denen für Bewertungen: Beleidigung, Belästigung, persönliche Daten, Werbung, Themenfremdes. Google entfernt die Antwort bei Verstoß, die Bewertung bleibt stehen.</p>
        <h2 id="welche-antworten-riskant">Welche Antworten sind jetzt riskant?</h2>
        <ul>
          <li>Antworten, die den Kunden namentlich nennen, seine Bestellung, Behandlung oder Rechnung offenlegen. Das verstößt gegen die Datenschutzregeln und bei Ärzten zusätzlich gegen die Schweigepflicht.</li>
          <li>Antworten, die dem Bewerter Lügen oder Konkurrenz-Auftrag unterstellen, ohne Beleg.</li>
          <li>Antworten mit Rabattcodes oder Werbung für andere Leistungen.</li>
        </ul>
        <h2 id="wie-antworten">Wie antwortest du richtig auf Kritik?</h2>
        <p>Danken, Bedauern in einem Satz, Lösung anbieten, ins Private verlagern: „Ruf uns bitte unter … an, wir klären das.“ Maximal vier Sätze. Wer die Antwort in unter 60 Minuten liefert, zeigt späteren Lesern, dass hier jemand hinschaut, das wirkt stärker als die Kritik selbst. Bei rechtswidrigen Bewertungen bleibt der Meldeweg über das Reviews Management Tool; wir stellen pro Kunde einen Löschantrag pro Woche.</p>`,
  impact: 'Antworten auf Bewertungen sachlich halten, keine Kundendaten nennen, keine Unterstellungen.',
  sources: [
    { label: 'Sterling Sky: Timeline der Google-Local-Änderungen', url: 'https://www.sterlingsky.ca/google-local-changes/' }
  ],
  keywords: ['Google Bewertungen', 'Inhaberantwort', 'Bewertung melden', 'Reputationsmanagement'],
  related: [R.loeschen, R.mehrBew, R.bewMgmt]
},

{
  slug: '2026-08-ki-uebersichten-lokale-listicles', date: '2026-08-12',
  platform: 'ki-suche', topic: 'local-seo', hub: false,
  title: 'KI-Übersichten zitieren bei lokalen Suchen vor allem Listicles',
  metaDesc: 'KI-Übersichten zitieren bei lokalen Suchen vor allem „Die besten 10“-Listen, oft selbstwerbend. Was das für dein Ranking heißt und wie du in solche Listen kommst.',
  teaser: 'Wer bei „bester Zahnarzt in Bochum“ in der KI-Übersicht auftaucht, steht meist in einer Top-10-Liste. Nicht in den Top 3 von Maps.',
  summary: 'Eine Auswertung vom 12. August 2026 zeigt: Googles <strong>KI-Übersichten zitieren bei lokalen Suchanfragen überwiegend Listicles</strong>, also „Die 10 besten …“-Artikel, darunter viele minderwertige und selbstwerbende Seiten. Das Google-Maps-Ranking und die Profildaten spielen für die Zitate eine kleinere Rolle als erwartet. Für lokale Betriebe wird die Erwähnung in solchen Listen zum eigenen Sichtbarkeitsfaktor.',
  body: `        <h2 id="was-wurde-beobachtet">Was wurde beobachtet?</h2>
        <p>Bei Suchen wie „bestes italienisches Restaurant in [Stadt]“ zeigt die KI-Übersicht eine Auswahl an Betrieben und verlinkt als Quellen fast ausschließlich Ranglisten-Artikel von Blogs, Portalen und Agenturen. Teilweise stammen die Listen von Anbietern, die sich selbst auf Platz 1 setzen. Das deckt sich mit einer Ahrefs-Auswertung vom März 2026, nach der nur noch 37,9 Prozent der Zitate in KI-Übersichten aus den Top 10 der klassischen Suche kommen, vorher waren es 76 Prozent.</p>
        <h2 id="was-heisst-das">Was heißt das für lokale Betriebe?</h2>
        <p>Das Google Unternehmensprofil bleibt die Datenbasis für Sterne, Öffnungszeiten und Adresse in der KI-Antwort. Ob du aber überhaupt genannt wirst, hängt zunehmend davon ab, ob dich Dritte im Web empfehlen. Eine Ahrefs-Studie über 75.000 Marken vom Mai 2026 fand die stärkste Korrelation zur KI-Sichtbarkeit bei YouTube-Erwähnungen und Web-Erwähnungen, Backlinks spielen kaum eine Rolle.</p>
        <h2 id="was-tun">Was solltest du jetzt tun?</h2>
        <ul>
          <li>Prüfe, in welchen Listen und Portalen deine Branche in deiner Stadt genannt wird, und bewirb dich um Aufnahme, wo es redaktionell ist.</li>
          <li>Teste mit dem kostenlosen KI-Sichtbarkeits-Check, ob ChatGPT, Claude und Gemini dich bereits empfehlen.</li>
          <li>Halte Profil, Verzeichnisse und Website widerspruchsfrei. KIs streichen Betriebe mit widersprüchlichen Daten.</li>
        </ul>`,
  impact: 'Erwähnungen in lokalen Ranglisten und Portalen aktiv aufbauen, KI-Sichtbarkeit regelmäßig testen.',
  sources: [
    { label: 'Search Engine Roundtable: AI Overviews und lokale Listicles', url: 'https://www.seroundtable.com/google-ai-overview-local-results-listicles-41854.html' },
    { label: 'Ahrefs: Zitate in AI Overviews', url: 'https://ahrefs.com/blog/ai-overview-citations-top-10' },
    { label: 'Ahrefs: Was mit KI-Sichtbarkeit korreliert', url: 'https://ahrefs.com/blog/ai-overview-brand-correlation/' }
  ],
  keywords: ['KI-Übersichten', 'AI Overviews', 'lokale Suche', 'KI-Sichtbarkeit', 'Listicles'],
  related: [R.ki, R.kiCheck, R.top3]
},

{
  slug: '2026-08-google-zweisprachige-firmennamen-verboten', date: '2026-08-10',
  platform: 'google', topic: 'unternehmensprofile', hub: false,
  title: 'Google verbietet doppelte Firmennamen in zwei Sprachen',
  metaDesc: 'Seit 10. August 2026 verbietet Google zweisprachig wiederholte Firmennamen, auch wenn sie so am Schild stehen. Was erlaubt bleibt und wie du den Namen anpasst.',
  teaser: 'Ein Name, eine Sprache. Wer den Firmennamen zweisprachig wiederholt, riskiert eine Sperre, selbst wenn das Schild genauso aussieht.',
  summary: 'Google hat am 10. August 2026 die Namensrichtlinie erweitert: <strong>Wiederholte zweisprachige Namen und Transliterationen sind verboten</strong>, zum Beispiel „Restaurant Athen Εστιατόριο Αθήνα“. Das gilt auch, wenn der Name so am Ladenschild steht. Erlaubt bleibt ein Name in einer Sprache oder ein echter Eigenname, der Wörter aus zwei Sprachen enthält. Betroffene Profile sollten den Namen jetzt selbst korrigieren, bevor Google sperrt.',
  body: `        <h2 id="was-ist-neu">Was ist neu?</h2>
        <p>Die Richtlinie zum Firmennamen verlangte schon immer den „echten Namen, wie er in der realen Welt verwendet wird“, ohne Zusätze wie Ort, Leistung oder Slogan. Neu ist der ausdrückliche Passus gegen Wiederholungen des Namens in einer zweiten Sprache oder Schrift. Google begründet das mit der Lesbarkeit in Maps und mit Missbrauch: Der doppelte Name wurde oft genutzt, um zusätzliche Keywords unterzubringen.</p>
        <h2 id="was-bleibt-erlaubt">Was bleibt erlaubt?</h2>
        <ul>
          <li>Ein Name in einer Sprache, auch in nicht-lateinischer Schrift.</li>
          <li>Ein Eigenname, der von Natur aus zwei Sprachen mischt, etwa „Café Istanbul“.</li>
          <li>Die zweite Sprachfassung in der Beschreibung oder als Leistung, nicht im Namen.</li>
        </ul>
        <h2 id="was-tun">Was solltest du jetzt tun?</h2>
        <p>Namen im Profil prüfen und die Wiederholung streichen. Eine Namensänderung kann eine erneute Verifizierung auslösen, das ist normal. Wer wartet, bis Google eingreift, riskiert eine Sperre mit Einspruchsverfahren, das bis zu zwei Wochen dauert. In unseren Kundenprofilen betrifft das vor allem Gastronomie und Lebensmittelhandel mit türkischen, griechischen und arabischen Namen.</p>`,
  impact: 'Firmennamen auf eine Sprachfassung reduzieren, sonst droht eine Sperre.',
  sources: [
    { label: 'Search Engine Roundtable: Bilingual Names nicht mehr erlaubt', url: 'https://www.seroundtable.com/google-business-profiles-disallows-repeated-bilingual-names-41839.html' },
    { label: 'Google-Hilfe: Richtlinien für Unternehmensprofile', url: 'https://support.google.com/business/answer/3038177?hl=de' }
  ],
  keywords: ['Firmenname', 'Google Unternehmensprofil', 'Namensrichtlinie', 'zweisprachig', 'Sperre'],
  related: [R.gesperrt, R.optimieren, R.hub]
},

{
  slug: '2026-08-google-local-services-ads-migration', date: '2026-08-01',
  platform: 'google', topic: 'werbeanzeigen', hub: false,
  title: 'Local Services Ads wandern in Google Ads',
  metaDesc: 'Google überführt Local Services Ads in Google Ads: Pay-per-Lead über Performance Max, USA ab August 2026, andere Länder 2027. Was Betriebe in Deutschland jetzt tun.',
  teaser: 'Die Anzeigen mit Google-Garantie-Siegel bekommen ein neues Zuhause. Für Deutschland ist 2027 relevant, vorbereiten kannst du dich jetzt.',
  summary: 'Google migriert die <strong>Local Services Ads (LSA) in Google Ads</strong>: Die Kampagnen laufen künftig als Pay-per-Lead-Variante von Performance Max. In den USA startet die Umstellung im August 2026, Konten außerhalb der USA folgen 2027. Gleichzeitig wächst die Zahl der Buchungspartner von rund 20 auf über 500, und Anzeigen können schon vor der Vergabe des Garantie-Siegels laufen.',
  body: `        <h2 id="was-ist-neu">Was ist neu?</h2>
        <p>Local Services Ads waren bisher ein eigenes Produkt mit eigenem Dashboard und Abrechnung pro Lead. Google führt sie jetzt in die Google-Ads-Oberfläche über. Die Abrechnung bleibt pro Lead, die Steuerung übernimmt Performance Max. Neu sind Anzeigen ohne Siegel („Pre-Badge“), mehr Buchungspartner und die Verbindung mit den übrigen Kampagnen im selben Konto.</p>
        <h2 id="deutschland">Was heißt das für Deutschland?</h2>
        <p>In Deutschland sind Local Services Ads bisher nur in wenigen Branchen verfügbar. Die Migration für Nicht-US-Konten ist für 2027 angekündigt. Wer die Anzeigen heute schon nutzt, muss nichts tun. Wer sie nicht nutzt, sollte sich auf das Modell vorbereiten: Lead-Anzeigen gewinnen an Gewicht. Sterling Sky maß im Juni 2026, dass LSA in den USA bereits bei 31 Prozent der lokalen Suchanfragen erscheinen, im Vorjahr waren es 11 Prozent.</p>
        <h2 id="was-tun">Was solltest du jetzt tun?</h2>
        <ul>
          <li>Google-Ads-Konto und Unternehmensprofil verknüpfen, das ist die Grundlage für alle lokalen Anzeigenformate.</li>
          <li>Bewertungsstand pflegen. Bei Lead-Anzeigen entscheidet die Sternebewertung sichtbar über den Klick.</li>
          <li>Anruf- und Formular-Tracking sauber aufsetzen, sonst kannst du Leads später nicht bewerten.</li>
        </ul>`,
  impact: 'Google Ads und Unternehmensprofil verknüpfen, Lead-Tracking aufsetzen, Migration in Deutschland ab 2027.',
  sources: [
    { label: 'Google Ads-Hilfe: Local Services Ads in Google Ads', url: 'https://support.google.com/google-ads/answer/17213585' },
    { label: 'Search Engine Journal: Google bringt LSA in Google Ads', url: 'https://www.searchenginejournal.com/google-is-bringing-local-services-ads-into-google-ads/582816/' },
    { label: 'Sterling Sky: State of Local SEO 2026', url: 'https://www.sterlingsky.ca/the-state-of-local-seo-in-2026/' }
  ],
  keywords: ['Local Services Ads', 'Google Ads', 'Performance Max', 'Pay-per-Lead', 'lokale Anzeigen'],
  related: [R.ads, R.hub, R.top3]
},

{
  slug: '2026-07-google-einspruch-nachweise-im-formular', date: '2026-07-08',
  platform: 'google', topic: 'unternehmensprofile', hub: true,
  hubWhat: 'Einspruch bei Sperrungen: Nachweise werden direkt im Formular hochgeladen',
  title: 'Profil gesperrt: Nachweise jetzt direkt im Einspruch hochladen',
  metaDesc: 'Seit 8. Juli 2026 lädst du Nachweise für gesperrte Profile direkt im Einspruchsformular hoch, das 60-Minuten-Fenster ist weg. Welche Dokumente Google akzeptiert.',
  teaser: 'Das Nachreichen von Belegen innerhalb von 60 Minuten hat viele Einsprüche scheitern lassen. Das ist vorbei.',
  summary: 'Seit dem 8. Juli 2026 lassen sich <strong>Nachweise direkt im Einspruchsformular</strong> für gesperrte Google Unternehmensprofile hochladen. Vorher schickte Google nach dem Einspruch ein separates Formular, das nur 60 Minuten offen blieb. Akzeptiert werden Gewerbeanmeldung, Handelsregisterauszug, Mietvertrag oder Rechnung mit Adresse sowie Fotos von Schild und Ladenfront. Die Bearbeitung dauert bis zu fünf Werktage.',
  body: `        <h2 id="was-ist-neu">Was ist neu?</h2>
        <p>Der Einspruch bei einer Sperrung läuft weiter über das Google-Formular „Einspruch einlegen“. Neu ist der Upload-Schritt direkt darin. Das alte Verfahren mit dem zeitlich befristeten Nachreichen war der häufigste Grund, warum Einsprüche ohne Prüfung abgelehnt wurden: Wer die E-Mail zu spät sah, hatte verloren.</p>
        <h2 id="welche-nachweise">Welche Nachweise akzeptiert Google?</h2>
        <ul>
          <li>Gewerbeanmeldung oder Handelsregisterauszug mit der Profiladresse.</li>
          <li>Mietvertrag, Strom- oder Telefonrechnung auf Firmenname und Adresse, nicht älter als drei Monate.</li>
          <li>Fotos von Außenschild, Ladenfront und Innenraum, bei Einzugsgebiets-Betrieben das beschriftete Fahrzeug.</li>
        </ul>
        <p>Wichtig: Name und Adresse auf den Dokumenten müssen exakt mit dem Profil übereinstimmen. Es gibt nur einen Einspruch. Wird er abgelehnt, folgt eine „zusätzliche Prüfung“ mit neuen Nachweisen, die ein bis zwei Wochen dauert.</p>
        <h2 id="haeufigste-gruende">Was sind die häufigsten Sperrgründe 2026?</h2>
        <p>Laut der Whitespark-Risikoanalyse 2026 führen vor allem eine angezeigte Adresse bei reinen Einzugsgebiets-Betrieben, überlappende Einzugsgebiete mehrerer Profile, Einzugsgebiete mit über zwei Stunden Fahrzeit, KI-generierte Fotos und Keyword-Stuffing in der Beschreibung zur Sperre. Wer eine Sperre vermeiden will, prüft diese fünf Punkte zuerst.</p>`,
  impact: 'Gewerbeanmeldung, Außenfoto und Rechnung vorab bereitlegen, es gibt nur einen Einspruch.',
  sources: [
    { label: 'Google-Hilfe: Einspruch bei Sperrung', url: 'https://support.google.com/business/answer/4569145?hl=de' },
    { label: 'Digital Applied: Evidence Uploads im Einspruch 2026', url: 'https://www.digitalapplied.com/blog/google-business-profile-appeal-evidence-uploads-2026' }
  ],
  keywords: ['Google Unternehmensprofil gesperrt', 'Einspruch', 'Nachweise', 'Sperrung', 'Wiederherstellung'],
  related: [R.gesperrt, R.verify, R.hub]
},

{
  slug: '2026-06-state-of-local-seo-ki-local-packs', date: '2026-06-26',
  platform: 'ki-suche', topic: 'local-seo', hub: false,
  title: 'Studie: KI-Local-Packs zeigen nur ein Drittel der Betriebe',
  metaDesc: 'Sterling Sky „State of Local SEO 2026“: KI-Local-Packs bei 7 % der Suchen, nur 32 % so viele Betriebe sichtbar, Local-Pack-Anzeigen von 1 auf 22 %.',
  teaser: 'Weniger Plätze, mehr Anzeigen: Die wichtigste Local-SEO-Studie des Jahres zeigt, wie eng es im lokalen Ergebnis geworden ist.',
  summary: 'Die Studie „State of Local SEO 2026“ von Sterling Sky vom 26. Juni 2026 zeigt: <strong>KI-gestützte Local Packs erscheinen bei rund 7 Prozent der lokalen Suchen</strong> (USA, mobil) und zeigen nur 32 Prozent so viele Unternehmen wie das klassische Local Pack. In 88 Prozent von 322 untersuchten Märkten sind weniger Betriebe sichtbar. Anzeigen im Local Pack stiegen von 1 auf 22 Prozent der Suchanfragen.',
  body: `        <h2 id="die-zahlen">Was sind die wichtigsten Zahlen?</h2>
        <div class="statbox">
          <div><div class="n">7&nbsp;%</div><p>der lokalen Suchen (USA, mobil) zeigen ein KI-Local-Pack statt des klassischen Dreierpacks</p></div>
          <div><div class="n">32&nbsp;%</div><p>so viele Unternehmen sind im KI-Local-Pack sichtbar wie im klassischen</p></div>
          <div><div class="n">22&nbsp;%</div><p>der Suchen zeigen Anzeigen im Local Pack, ein Jahr zuvor 1 Prozent</p></div>
          <div><div class="n">31&nbsp;%</div><p>der Suchen zeigen Local Services Ads, ein Jahr zuvor 11 Prozent</p></div>
        </div>
        <h2 id="was-heisst-das">Was heißt das für lokale Betriebe in Deutschland?</h2>
        <p>Die Daten stammen aus den USA, wo Google neue Formate zuerst ausrollt. Der KI-Modus ist seit Oktober 2025 auch in Deutschland aktiv, KI-Übersichten seit März 2025. Die Richtung ist damit klar: Weniger organische Plätze, mehr bezahlte. Wer heute in den Top 3 steht, hat keine Garantie, im KI-Pack aufzutauchen. Die dort gezeigten Betriebe haben laut einer SOCi-Auswertung über 350.000 Standorte im Schnitt 4,3 Sterne.</p>
        <h2 id="was-tun">Was solltest du jetzt tun?</h2>
        <ul>
          <li>Bewertungsschnitt über 4,3 halten und Bewertungen laufend frisch nachziehen. Das ist der sichtbarste Filter für die KI-Auswahl.</li>
          <li>Profil vollständig ausfüllen, besonders Leistungen und Attribute. KI-Antworten greifen genau darauf zu.</li>
          <li>Ein Budget für Local-Pack-Anzeigen einplanen, wenn organisch die Plätze knapp werden.</li>
        </ul>`,
  impact: 'Bewertungsschnitt über 4,3 halten, Profil komplett ausfüllen, Anzeigenbudget fürs Local Pack einplanen.',
  sources: [
    { label: 'Sterling Sky: The State of Local SEO in 2026', url: 'https://www.sterlingsky.ca/the-state-of-local-seo-in-2026/' },
    { label: 'Search Engine Land: SOCi AI Local Visibility Report 2026', url: 'https://searchengineland.com/ai-local-visibility-report-2026-468085' }
  ],
  keywords: ['Local SEO', 'KI-Modus', 'Local Pack', 'Studie 2026', 'lokale Sichtbarkeit'],
  related: [R.top3, R.ki, R.kiCheck]
},

{
  slug: '2026-06-google-gemini-verknuepfung-nicht-in-deutschland', date: '2026-06-11',
  platform: 'google', topic: 'unternehmensprofile', hub: false,
  title: 'Gemini im Unternehmensprofil: In Deutschland nicht verfügbar',
  metaDesc: 'Google verknüpft seit 11. Juni 2026 Gemini mit dem Unternehmensprofil: Bewertungen beantworten, Daten ändern. In Deutschland ist die Funktion gesperrt.',
  teaser: 'Gemini beantwortet Bewertungen und ändert Öffnungszeiten per Chat. Klingt gut, gilt aber nicht für Betriebe im Europäischen Wirtschaftsraum.',
  summary: 'Seit dem 11. Juni 2026 können Inhaber ihr Google Unternehmensprofil mit der Gemini-App verknüpfen und per Chat Bewertungen beantworten, Daten ändern und Leistungskennzahlen abfragen. Laut Google-Hilfe ist die Funktion <strong>„weltweit verfügbar, außer im EWR und in Großbritannien“</strong>. Für deutsche Betriebe gibt es den KI-Assistenten im Profil damit vorerst nicht, auch wenn Deutsch als Sprache unterstützt wird.',
  body: `        <h2 id="was-ist-neu">Was kann die Verknüpfung?</h2>
        <p>Wer sein Profil mit Gemini verbindet, kann im Chat sagen: „Antworte auf die neue 3-Sterne-Bewertung freundlich und biete ein Gespräch an“ oder „Wie viele Anrufe hatte ich im Mai?“. Gemini greift dafür auf die Profildaten zu. Einschränkungen laut Google: nur ein Profil pro Konto, nur mit privatem Google-Konto, nur im Web.</p>
        <h2 id="warum-nicht-deutschland">Warum nicht in Deutschland?</h2>
        <p>Google nennt keinen Grund. Die Sperre für den Europäischen Wirtschaftsraum und Großbritannien deckt sich mit anderen KI-Funktionen, die Google in Europa verzögert oder nicht startet, meist wegen DSGVO, KI-Verordnung und Digital Markets Act. Ein Termin für den EWR ist nicht angekündigt. Viele deutsche Ratgeber beschreiben die Funktion trotzdem als verfügbar, das ist falsch.</p>
        <h2 id="was-geht">Welche KI-Funktionen gibt es im deutschen Profil?</h2>
        <ul>
          <li>„Beschreibung vorschlagen“: Google generiert einen Textvorschlag für die Profilbeschreibung.</li>
          <li>Bewertungszusammenfassungen: Google fasst den Tenor deiner Bewertungen mit Gemini zusammen, sichtbar für Kunden.</li>
          <li>Externe Werkzeuge: Bewertungsantworten per KI sind auch ohne die Google-Verknüpfung möglich, wir liefern sie in unter 60 Minuten.</li>
        </ul>`,
  impact: 'Kein KI-Assistent im Profil für deutsche Betriebe, Bewertungsantworten laufen über externe Werkzeuge.',
  sources: [
    { label: 'Google-Hilfe: Unternehmensprofil mit Gemini verknüpfen', url: 'https://support.google.com/business/answer/17142585?hl=de' },
    { label: 'Google-Blog: Gemini-Funktionen für Unternehmen', url: 'https://blog.google/innovation-and-ai/products/gemini-app/gemini-features-for-businesses/' }
  ],
  keywords: ['Gemini', 'Google Unternehmensprofil', 'KI-Assistent', 'EWR', 'nicht verfügbar'],
  related: [R.hub, R.bewMgmt, R.ki]
},

{
  slug: '2026-05-ahrefs-studie-erwaehnungen-ki-sichtbarkeit', date: '2026-05-26',
  platform: 'ki-suche', topic: 'local-seo', hub: false,
  title: 'Ahrefs-Studie: Erwähnungen schlagen Backlinks bei KI-Sichtbarkeit',
  metaDesc: 'Ahrefs-Studie über 75.000 Marken: YouTube-Erwähnungen (0,737) und Web-Erwähnungen (0,664) korrelieren am stärksten mit KI-Sichtbarkeit, Backlinks nur mit 0,218.',
  teaser: 'Zwanzig Jahre lang zählten Links. Für ChatGPT, Gemini und KI-Übersichten zählt, wer über dich spricht.',
  summary: 'Ahrefs hat am 26. Mai 2026 die Sichtbarkeit von 75.000 Marken in KI-Antworten untersucht. <strong>YouTube-Erwähnungen korrelieren mit 0,737 am stärksten</strong> mit KI-Sichtbarkeit, Web-Erwähnungen mit 0,664, Backlinks nur mit 0,218. Für lokale Betriebe heißt das: Videos, Presse, Portale und Verzeichnisse mit Namensnennung wirken stärker als klassischer Linkaufbau. Widerspruchsfreie Daten in allen Quellen sind Voraussetzung.',
  body: `        <h2 id="die-zahlen">Was hat Ahrefs gemessen?</h2>
        <div class="statbox">
          <div><div class="n">0,737</div><p>Korrelation zwischen YouTube-Erwähnungen und Sichtbarkeit in KI-Antworten</p></div>
          <div><div class="n">0,664</div><p>Korrelation für Erwähnungen auf Websites, auch ohne Link</p></div>
          <div><div class="n">0,218</div><p>Korrelation für klassische Backlinks</p></div>
        </div>
        <p>Untersucht wurden 75.000 Marken über KI-Übersichten, KI-Modus und Chat-Assistenten. Korrelation ist kein Beweis für Ursache, aber die Rangfolge ist eindeutig und deckt sich mit dem, was wir in Kundenprofilen sehen: Betriebe, die in Portalen, lokalen Medien und Videos genannt werden, tauchen in KI-Empfehlungen auf, auch ohne starke Website.</p>
        <h2 id="was-heisst-das">Was heißt das für lokale Betriebe?</h2>
        <p>Die klassische Local-SEO-Arbeit bleibt Grundlage, weil KIs die Profildaten als Fakten nutzen. Für die Frage „Wen empfiehlt die KI?“ entscheidet aber die Zahl und Konsistenz der Erwähnungen. Ein Betrieb mit 50 Verzeichniseinträgen, einheitlichen Daten und drei lokalen Presseartikeln ist für ChatGPT „bekannt“. Ein Betrieb mit tollem Google-Profil und sonst nichts ist es nicht.</p>
        <h2 id="was-tun">Was solltest du jetzt tun?</h2>
        <ul>
          <li>In alle relevanten Branchenverzeichnisse mit identischen Daten eintragen. Wir pflegen für Kunden über 50 Verzeichnisse.</li>
          <li>Ein kurzes YouTube-Video mit Firmennamen, Ort und Leistung veröffentlichen. Es muss nicht aufwendig sein.</li>
          <li>Lokale Presse, Vereine, Stadtportale: jede Namensnennung zählt, auch ohne Link.</li>
        </ul>`,
  impact: 'Verzeichnisse, Presse und ein YouTube-Video mit Firmennamen bringen mehr KI-Sichtbarkeit als Linkaufbau.',
  sources: [
    { label: 'Ahrefs: AI Overview Brand Correlation Study', url: 'https://ahrefs.com/blog/ai-overview-brand-correlation/' },
    { label: 'BusinessWire: Ahrefs-Studie über 75.000 Marken', url: 'https://www.businesswire.com/news/home/20260526119691/en/' }
  ],
  keywords: ['KI-Sichtbarkeit', 'Ahrefs', 'Erwähnungen', 'Backlinks', 'ChatGPT', 'Studie'],
  related: [R.ki, R.kiCheck, R.hub]
},

{
  slug: '2026-04-google-bewertungsrichtlinie-verschaerft', date: '2026-04-17',
  platform: 'google', topic: 'bewertungen', hub: false,
  title: 'Google verschärft Bewertungsrichtlinie: Quoten und Tablets verboten',
  metaDesc: 'Seit 17. April 2026 verbietet Google Bewertungsquoten, Tablets im Laden, Anreize und Namensvorgaben. Was erlaubt bleibt und wie du regelkonform sammelst.',
  teaser: 'Das Tablet an der Kasse ist verboten, die Prämie für 20 Bewertungen auch. Was Google jetzt als Manipulation wertet und was weiter erlaubt ist.',
  summary: 'Google hat am 16. und 17. April 2026 die Richtlinie gegen <strong>„Rating Manipulation“</strong> verschärft. Ausdrücklich verboten sind Bewertungsquoten für Mitarbeiter, Bewertungs-Kioske oder Firmen-Tablets im Geschäft, das Filtern unzufriedener Kunden vor der Bewertung, Anreize jeder Art und die Aufforderung, Mitarbeiternamen oder Keywords zu nennen. Bei Verstößen entfernt Google ganze Bewertungsblöcke und kann das Profil einschränken.',
  body: `        <h2 id="was-ist-verboten">Was ist jetzt ausdrücklich verboten?</h2>
        <ul>
          <li><strong>Quoten:</strong> Mitarbeitern eine Zahl von Bewertungen vorgeben, die sie pro Woche einsammeln müssen.</li>
          <li><strong>Kioske und Tablets:</strong> Geräte im Geschäft, auf denen Kunden vor Ort bewerten.</li>
          <li><strong>Gating:</strong> Erst nach Zufriedenheit fragen und nur zufriedene Kunden zur Bewertung leiten.</li>
          <li><strong>Anreize:</strong> Rabatte, Gutscheine, Verlosungen oder Geschenke als Gegenleistung für eine Bewertung.</li>
          <li><strong>Vorgaben zum Inhalt:</strong> Kunden bitten, den Mitarbeiter, den Ort oder bestimmte Keywords zu nennen.</li>
        </ul>
        <h2 id="was-bleibt-erlaubt">Was bleibt erlaubt?</h2>
        <p>Kunden nach dem Besuch um eine Bewertung zu bitten, ist ausdrücklich in Ordnung, solange jeder Kunde gefragt wird, es keine Gegenleistung gibt und der Kunde frei entscheidet, was er schreibt. Erlaubt sind der Bewertungslink, ein QR-Code auf Rechnung oder Karte, eine E-Mail nach dem Auftrag und die persönliche Bitte. Das Scannen eines QR-Codes am eigenen Handy des Kunden ist kein Kiosk.</p>
        <h2 id="was-tun">Was solltest du jetzt tun?</h2>
        <p>Bewertungsprozess prüfen und alles streichen, was in die fünf Punkte oben fällt. Google gab an, 2025 rund 292 Millionen Bewertungen entfernt zu haben, und wertet seit 2024 Muster mit KI aus. Ein regelkonformer Sammelprozess bringt langfristig mehr Bewertungen, weil kein Block entfernt wird. Unser TapTag-System haben wir an die neue Richtlinie angepasst: Der Kunde scannt freiwillig am eigenen Handy, es gibt keine Quoten und keinen Anreiz für den Kunden.</p>`,
  impact: 'Sammelprozess auf Quoten, Tablets, Anreize und Namensvorgaben prüfen und streichen, sonst droht die Entfernung ganzer Bewertungsblöcke.',
  sources: [
    { label: 'SOCi: Googles Rating-Manipulation-Richtlinie', url: 'https://www.soci.ai/blog/googles-rating-manipulation-policy-what-it-means-for-your-reputation-strategy/' },
    { label: 'Birdeye: Google Review Policy Update', url: 'https://birdeye.com/blog/google-review-policy/' },
    { label: 'Launchcodex: Review Policy Update 2026', url: 'https://launchcodex.com/blog/seo-geo-ai/google-business-profile-review-policy-update/' }
  ],
  keywords: ['Google Bewertungsrichtlinie', 'Rating Manipulation', 'Bewertungen sammeln', 'Anreize', 'Bewertungs-Tablet'],
  related: [R.mehrBew, R.bewMgmt, R.loeschen]
}

];
