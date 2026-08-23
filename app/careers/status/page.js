import { applicationsAwaitingReferences } from "@lib/recruitment/referees";
import { isDatabaseConfigured, databaseKind } from "@lib/recruitment/db";
import { Container } from "@components/ui/Section";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recruitment status",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Reference progress for the recruitment team. RECRUITMENT-SPEC.md Phase 4.
 *
 * PROTECTION. This page lists applicant names, so it is behind HTTP Basic auth
 * in middleware.js using RECRUITMENT_ADMIN_PASSWORD, which fails closed when
 * unset. The spec says "Basic HTTP auth or a single shared password in an
 * environment variable is acceptable for now" and asks to be told if that is
 * not enough.
 *
 * IT IS NOT ENOUGH LONG TERM, and this is recorded in OVERNIGHT-NOTES.md
 * rather than over-engineered now: one shared password cannot be attributed to
 * a person, cannot be revoked for one leaver without changing it for everyone,
 * and produces no audit trail of who looked at whose application. For a page
 * showing candidates' names alongside safeguarding flags, per-user accounts
 * with an access log is where this needs to end up.
 *
 * TODO (Alif): set RECRUITMENT_ADMIN_PASSWORD to something long and random,
 * and change it whenever anyone with access leaves.
 */
const StatusPage = async () => {
  if (!isDatabaseConfigured() && process.env.NODE_ENV === "production") {
    return (
      <Container width="narrow" className="py-16">
        <h1 className="text-3xl font-bold text-primary-950">Recruitment status</h1>
        <p className="mt-4 text-lg text-textMuted">
          No database is configured ({databaseKind()}), so there is nothing to
          show. Set DATABASE_URL in the hosting environment.
        </p>
      </Container>
    );
  }

  let rows = [];
  let error = null;
  try {
    rows = await applicationsAwaitingReferences();
  } catch (err) {
    error = err.message;
  }

  const waiting = rows.filter((r) => r.pending > 0);
  const complete = rows.filter((r) => r.pending === 0);

  const Table = ({ items, caption }) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse text-base">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b-2 border-border text-left">
            <th scope="col" className="py-2 pr-4 font-semibold text-primary-950">Applicant</th>
            <th scope="col" className="py-2 pr-4 font-semibold text-primary-950">Reference</th>
            <th scope="col" className="py-2 pr-4 font-semibold text-primary-950">Role</th>
            <th scope="col" className="py-2 pr-4 font-semibold text-primary-950">References</th>
            <th scope="col" className="py-2 pr-4 font-semibold text-primary-950">Waiting</th>
            <th scope="col" className="py-2 font-semibold text-primary-950">Review needed</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="border-b border-border align-top">
              <td className="py-2.5 pr-4 font-medium text-text">{r.applicantName || "—"}</td>
              <td className="py-2.5 pr-4 text-textMuted">{r.reference}</td>
              <td className="py-2.5 pr-4 text-textMuted">{r.role || "—"}</td>
              <td className="py-2.5 pr-4 text-textMuted">
                {r.completed}/{r.total}
                {r.declined > 0 && (
                  <span className="ml-1 font-semibold text-warning">
                    ({r.declined} declined)
                  </span>
                )}
              </td>
              <td className="py-2.5 pr-4 text-textMuted">
                {r.waitingDays} day{r.waitingDays === 1 ? "" : "s"}
              </td>
              <td className="py-2.5">
                {/* A word, not a colour - this must not be lost on a
                    colour-blind reader or in a printout. */}
                {r.anyFlagged ? (
                  <span className="font-bold text-danger">YES — read before any offer</span>
                ) : (
                  <span className="text-textMuted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Container className="py-12 md:py-16">
      <h1 className="text-3xl font-bold text-primary-950">Recruitment status</h1>
      <p className="mt-3 text-base leading-relaxed text-textMuted">
        Submitted applications and how their references are going. Referees are
        chased automatically after 5 and 10 days, then not again — anything
        older than that needs a phone call.
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-card border-2 border-danger/50 bg-dangerBg p-5 text-base text-text">
          Could not load applications: {error}
        </p>
      )}

      <section className="mt-10" aria-labelledby="waiting-heading">
        <h2 id="waiting-heading" className="mb-4 text-2xl font-bold text-primary-950">
          Waiting on references ({waiting.length})
        </h2>
        {waiting.length === 0 ? (
          <p className="text-base text-textMuted">Nothing outstanding.</p>
        ) : (
          <Table items={waiting} caption="Applications still waiting on one or more references" />
        )}
      </section>

      <section className="mt-12" aria-labelledby="complete-heading">
        <h2 id="complete-heading" className="mb-4 text-2xl font-bold text-primary-950">
          All references in ({complete.length})
        </h2>
        {complete.length === 0 ? (
          <p className="text-base text-textMuted">None yet.</p>
        ) : (
          <Table items={complete} caption="Applications with every reference returned" />
        )}
      </section>

      <p className="mt-12 rounded-card border border-border bg-surface p-4 text-base leading-relaxed text-textMuted">
        This page contains personal data. It is behind a single shared password,
        which is adequate for now but cannot tell you <em>who</em> viewed an
        application. See OVERNIGHT-NOTES.md for what that would take.
      </p>
    </Container>
  );
};

export default StatusPage;
