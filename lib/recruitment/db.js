/**
 * Database access for the recruitment system.
 *
 * WHY POSTGRES AND NOT SQLITE
 * ---------------------------
 * RECRUITMENT-SPEC.md asks for "SQLite via better-sqlite3 unless I say
 * otherwise". Alif said otherwise on 2026-08-22, because the spec was written
 * assuming a VPS and this site is hosted on Vercel, where:
 *
 *   - the filesystem is read-only apart from /tmp, and /tmp is per-invocation
 *     and ephemeral, so a SQLite file would be lost between requests;
 *   - better-sqlite3 is a native module needing a build script, and pnpm's
 *     ignored-builds behaviour has already broken this site's production
 *     deploy once (see CLAUDE.md).
 *
 * This is the same class of bug that was removed from this codebase earlier:
 * three API routes wrote JSON files that never persisted in production.
 *
 * So: hosted Postgres (Neon or Supabase) in production, over DATABASE_URL.
 *
 * LOCAL DEVELOPMENT
 * -----------------
 * With no DATABASE_URL set, this falls back to PGlite — real Postgres compiled
 * to WebAssembly, running in-process against a gitignored .pgdata directory.
 * That means local development and the Phase 7 end-to-end passes run against
 * genuine Postgres SQL rather than a lookalike, with nothing to install.
 *
 * PGlite is a devDependency. If DATABASE_URL is missing in production the
 * import fails loudly, which is correct: a recruitment system that cannot
 * store an application must refuse the submission, never accept and drop it.
 */

let pool = null;
let pglite = null;

const hasUrl = () => Boolean(process.env.DATABASE_URL?.trim());

/** True when a real, persistent database is configured. */
export function isDatabaseConfigured() {
  return hasUrl();
}

/** Which backend is in use. Never logs the connection string. */
export function databaseKind() {
  if (hasUrl()) return "postgres";
  return process.env.NODE_ENV === "production" ? "none" : "pglite (local only)";
}

async function getPglite() {
  if (pglite) return pglite;
  // Dynamic import so the WASM build is never pulled into a production bundle.
  const { PGlite } = await import("@electric-sql/pglite");
  // Gitignored. See the recruitment block in .gitignore.
  pglite = await PGlite.create("./.pgdata");
  return pglite;
}

async function getPool() {
  if (pool) return pool;
  const pg = await import("pg");
  const Pool = pg.default?.Pool || pg.Pool;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon and Supabase both require TLS. `rejectUnauthorized: false` is what
    // their own connection snippets use, because the certificate chain is not
    // in Node's default store.
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
    max: 3, // serverless: keep the pool small so connections are not exhausted
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
  return pool;
}

/**
 * Run a parameterised query.
 *
 * Always pass values as `params` — never interpolate into `sql`. Every caller
 * in this subsystem handles applicant personal data, so SQL injection here
 * would be a personal data breach, not just a bug.
 */
export async function query(sql, params = []) {
  if (hasUrl()) {
    const p = await getPool();
    return p.query(sql, params);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is not set. The recruitment system cannot store applications.",
    );
  }

  const db = await getPglite();
  return db.query(sql, params);
}

/** Run several statements as one unit. Used by the migration. */
export async function exec(sql) {
  if (hasUrl()) {
    const p = await getPool();
    return p.query(sql);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is not set.");
  }
  const db = await getPglite();
  return db.exec(sql);
}
