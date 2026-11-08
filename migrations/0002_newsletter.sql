-- Newsletter mit Double-Opt-in (Tobias, 08.11.2026).
-- Ausfuehren: npx wrangler d1 execute lokalbesucher-ki-check --remote --file=migrations/0002_newsletter.sql
-- status: offen (Mail verschickt, noch nicht bestaetigt) | bestaetigt | abgemeldet
-- IP und Zeitpunkt von Anmeldung und Bestaetigung werden als Nachweis der Einwilligung gespeichert (Art. 7 Abs. 1 DSGVO).
CREATE TABLE IF NOT EXISTS newsletter (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  email           TEXT    NOT NULL UNIQUE,
  status          TEXT    NOT NULL DEFAULT 'offen',
  token           TEXT    NOT NULL,
  quelle          TEXT,
  einwilligung    TEXT,
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  created_ip      TEXT,
  mail_at         TEXT,
  confirmed_at    TEXT,
  confirmed_ip    TEXT,
  unsub_at        TEXT
);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_token ON newsletter(token);
