import { exec, query } from "./db";

/**
 * Schema for the recruitment system.
 *
 * Deliberately few tables. The application's answers live in a JSONB column
 * rather than eighty typed columns, because the form's shape is still moving
 * and a migration per field change would be a tax on every future edit. The
 * things that need querying — status, email, dates, retention — are real
 * columns.
 *
 * RETENTION. `delete_after` is set on every application row at creation, not
 * calculated later by whatever job happens to run. That way the deletion
 * deadline is a property of the record itself and survives any change to the
 * job that enforces it. Default 6 months per RECRUITMENT-SPEC.md.
 * TODO: Alif to confirm 6 months is the right retention period (spec, "Ask me").
 */
const DDL = `
CREATE TABLE IF NOT EXISTS applications (
  id              TEXT PRIMARY KEY,
  reference       TEXT UNIQUE NOT NULL,
  email           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft',
  current_step    INTEGER NOT NULL DEFAULT 0,
  answers         TEXT NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at    TIMESTAMPTZ,
  delete_after    TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS applications_email_idx  ON applications (email);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status);
CREATE INDEX IF NOT EXISTS applications_delete_idx ON applications (delete_after);

-- Resume links. Only a hash of the token is stored, so a leak of this table
-- does not hand anyone access to a half-finished application.
CREATE TABLE IF NOT EXISTS resume_tokens (
  token_hash      TEXT PRIMARY KEY,
  application_id  TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  used_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS resume_tokens_app_idx ON resume_tokens (application_id);

-- Uploaded certificates and CVs. The file itself lives in object storage; this
-- row is only metadata. stored_key is a random server-generated key, never
-- the applicant's filename.
CREATE TABLE IF NOT EXISTS application_files (
  id              TEXT PRIMARY KEY,
  application_id  TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  kind            TEXT NOT NULL,
  original_name   TEXT NOT NULL,
  stored_key      TEXT NOT NULL,
  mime_type       TEXT NOT NULL,
  size_bytes      INTEGER NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS application_files_app_idx ON application_files (application_id);
`;

let migrated = false;

/**
 * Apply the schema. Safe to call on every request — the DDL is idempotent and
 * the in-process guard means it only runs once per instance.
 */
export async function ensureSchema() {
  if (migrated) return;
  await exec(DDL);
  migrated = true;
}

/** Retention window for an unsuccessful application. */
export const RETENTION_MONTHS = 6;

export function retentionDate(from = new Date()) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + RETENTION_MONTHS);
  return d;
}

/** For the Phase 7 checks: prove the tables exist and are queryable. */
export async function schemaReport() {
  await ensureSchema();
  const { rows } = await query(
    `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name`,
  );
  return rows.map((r) => r.table_name);
}
