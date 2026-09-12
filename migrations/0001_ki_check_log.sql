-- Protokoll fuer den KI-Sichtbarkeits-Check und alle Website-Anfragen.
-- Ausfuehren: npx wrangler d1 execute lokalbesucher-ki-check --remote --file=migrations/0001_ki_check_log.sql

CREATE TABLE IF NOT EXISTS checks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  status        TEXT    NOT NULL,              -- ok | ip-limit | daily-budget | turnstile | engines-down
  cached        INTEGER NOT NULL DEFAULT 0,    -- 1 = Ergebnis kam aus dem 7-Tage-Cache (0 ct)
  company       TEXT    NOT NULL,
  city          TEXT    NOT NULL,
  industry      TEXT,
  website       TEXT,
  score         INTEGER,                       -- 0-100, NULL wenn kein Ergebnis
  chatgpt       TEXT,                          -- zitiert | erwaehnt | nicht | fehler
  claude        TEXT,
  gemini        TEXT,
  competitor_sources TEXT,                     -- JSON-Array der Wettbewerber-Domains
  engine_errors TEXT,                          -- JSON-Array {engine, code}
  ip_hash       TEXT,                          -- gekuerzter SHA-256 (IP + Tag), keine Klartext-IP
  country       TEXT,
  referer       TEXT
);
CREATE INDEX IF NOT EXISTS idx_checks_created ON checks(created_at);

CREATE TABLE IF NOT EXISTS leads (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  source        TEXT    NOT NULL,              -- ki-check | homepage | meta-ads | ...
  name          TEXT,
  phone         TEXT,
  email         TEXT,
  company       TEXT,
  website       TEXT,
  branche       TEXT,
  ki_score      INTEGER,                       -- nur bei source = ki-check
  page          TEXT,                          -- Referer
  payload       TEXT    NOT NULL,              -- komplettes JSON, falls ein Feld fehlt
  delivered     INTEGER NOT NULL DEFAULT 0,    -- 1 = Webhook (GHL/Zapier) hat 2xx geantwortet
  delivery_target TEXT,                        -- Ziel-Schluessel aus TARGETS (functions/api/lead.js)
  delivery_reason TEXT,                        -- Fehlergrund bei delivered = 0
  ip_hash       TEXT,
  country       TEXT
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_source  ON leads(source);
