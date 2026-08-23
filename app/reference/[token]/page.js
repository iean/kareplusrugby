import { resolveRefereeToken } from "@lib/recruitment/referees";
import ReferenceForm from "@layouts/careers/reference/ReferenceForm";
import { Container } from "@components/ui/Section";
import site from "@config/site.json";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Give a reference",
  // Never indexed. These URLs are single-use and contain a credential.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The referee-facing reference form. RECRUITMENT-SPEC.md Phase 4.
 *
 * No login: the token in the URL is the authentication. A ward manager giving
 * a reference between shifts will not create an account, and a reference
 * nobody completes is worse than security theatre that stops them.
 *
 * The token is resolved server-side. If it is unknown, expired, already used
 * or already answered, the same neutral message is shown for all four — a
 * probe learns nothing from the difference.
 *
 * Only what the referee legitimately needs is passed to the client: the
 * applicant's name, the role, and (for a professional referee) what the
 * applicant said about working there, so they can confirm or correct it.
 * Never the rest of the application.
 */
const ReferencePage = async ({ params }) => {
  const resolved = await resolveRefereeToken(params.token);

  if (!resolved) {
    return (
      <Container width="narrow" className="py-16 md:py-24">
        <h1 className="text-3xl font-bold text-primary-950">This link is no longer valid</h1>
        <p className="mt-4 text-lg leading-relaxed text-textMuted">
          Reference links work once and expire after 30 days. This one has
          either been used already, expired, or is not one of ours.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-textMuted">
          If you still need to give a reference, call us on{" "}
          <a href={site.business.phone_href} className="font-semibold text-primary-700 underline underline-offset-4">
            {site.business.phone}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${site.business.email}`} className="font-semibold text-primary-700 underline underline-offset-4">
            {site.business.email}
          </a>{" "}
          and we will send you a fresh link.
        </p>
      </Container>
    );
  }

  const { referee, applicant, applicationReference } = resolved;

  // What the applicant told us about this employer, so a professional referee
  // can confirm or correct it rather than recall it from memory.
  const claimed =
    referee.kind === "professional"
      ? (applicant.jobs || []).find(
          (j) =>
            String(j.employer || "").trim().toLowerCase() ===
            String(referee.organisation || "").trim().toLowerCase(),
        ) || null
      : null;

  return (
    <Container width="narrow" className="py-12 md:py-16">
      <ReferenceForm
        token={params.token}
        referee={{
          name: referee.name,
          kind: referee.kind,
          position: referee.position,
          organisation: referee.organisation,
          jobTitle: referee.job_title,
          details: referee.details,
        }}
        applicant={{ fullName: applicant.fullName, role: applicant.role }}
        claimed={
          claimed
            ? {
                jobTitle: claimed.title || "",
                start: claimed.start || "",
                end: claimed.current ? "" : claimed.end || "",
                current: Boolean(claimed.current),
                reasonForLeaving: claimed.reasonForLeaving || "",
              }
            : null
        }
        applicationReference={applicationReference}
      />
    </Container>
  );
};

export default ReferencePage;
