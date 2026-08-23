/**
 * Server-side validation for the job application.
 *
 * Everything here runs on the server and is the authority. The client runs the
 * same rules for a fast, kind experience, but the client can be bypassed
 * entirely, so nothing is trusted from it.
 *
 * Two sections carry regulatory weight and must NOT be relaxed. Schedule 3 of
 * the Health and Social Care Act 2008 (Regulated Activities) Regulations 2014
 * requires, for each care worker, a full employment history together with a
 * written explanation of any gaps, and satisfactory evidence of conduct in
 * previous health or social care employment. That is why gap detection is
 * mandatory and why the most recent care employer must be a referee.
 */

/* ------------------------------------------------------------------ *
 * Employment gaps
 * ------------------------------------------------------------------ */

/** Any break longer than this needs a written explanation. */
export const GAP_DAYS = 28; // 4 weeks, per the spec

const MS_DAY = 24 * 60 * 60 * 1000;

/** "2024-03" -> first moment of that month. */
function monthStart(value) {
  if (!value) return null;
  const m = /^(\d{4})-(\d{1,2})$/.exec(String(value).trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 1));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "2024-03" -> last moment of that month. */
function monthEnd(value) {
  const start = monthStart(value);
  if (!start) return null;
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0, 23, 59, 59));
}

export function formatMonth(value) {
  const d = monthStart(value);
  if (!d) return value || "";
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

/**
 * Find every unexplained gap in an employment history.
 *
 * `jobs` arrive newest first, as the form collects them. Each is
 * { employer, title, start: "YYYY-MM", end: "YYYY-MM" | "", current: bool,
 *   careRole: bool, gapExplanation?: string }.
 *
 * Returns one entry per gap over GAP_DAYS, each identifying which pair of roles
 * it sits between so the form can attach the explanation to that specific gap
 * rather than asking one vague question at the end.
 */
export function findEmploymentGaps(jobs = [], now = new Date()) {
  const gaps = [];
  const valid = jobs.filter((j) => j && monthStart(j.start));

  // Work oldest-first so "the next job" reads naturally.
  const ordered = [...valid].sort((a, b) => monthStart(a.start) - monthStart(b.start));

  for (let i = 0; i < ordered.length - 1; i++) {
    const earlier = ordered[i];
    const later = ordered[i + 1];
    if (earlier.current) continue; // an open-ended role cannot precede a gap

    const end = monthEnd(earlier.end);
    const start = monthStart(later.start);
    if (!end || !start) continue;

    const days = Math.round((start - end) / MS_DAY);
    if (days > GAP_DAYS) {
      gaps.push({
        id: `gap-${earlier.id ?? i}-${later.id ?? i + 1}`,
        afterId: earlier.id ?? null,
        beforeId: later.id ?? null,
        days,
        from: earlier.end,
        to: later.start,
        label: `between leaving ${earlier.employer || "your previous role"} in ${formatMonth(earlier.end)} and starting at ${later.employer || "your next role"} in ${formatMonth(later.start)}`,
        explanation: earlier.gapExplanationAfter || "",
      });
    }
  }

  // A gap between the most recent role ending and today counts too.
  const mostRecent = ordered[ordered.length - 1];
  if (mostRecent && !mostRecent.current) {
    const end = monthEnd(mostRecent.end);
    if (end) {
      const days = Math.round((now - end) / MS_DAY);
      if (days > GAP_DAYS) {
        gaps.push({
          id: "gap-present",
          afterId: mostRecent.id ?? null,
          beforeId: null,
          days,
          from: mostRecent.end,
          to: "present",
          label: `between leaving ${mostRecent.employer || "your most recent role"} in ${formatMonth(mostRecent.end)} and today`,
          explanation: mostRecent.gapExplanationAfter || "",
        });
      }
    }
  }

  return gaps;
}

/** Gaps that still have no written explanation. */
export function unexplainedGaps(jobs, now = new Date()) {
  return findEmploymentGaps(jobs, now).filter(
    (g) => !g.explanation || g.explanation.trim().length < 10,
  );
}

/* ------------------------------------------------------------------ *
 * Referees
 * ------------------------------------------------------------------ */

/**
 * Free/consumer email providers, rejected for PROFESSIONAL referees only.
 *
 * A reference is only worth having if it can be tied to an organisation. A
 * personal address proves nothing about who sent it. The list is from the
 * spec; the message shown to the applicant is deliberately not accusatory —
 * most people supply a personal address because it is the one they know, not
 * because they are faking a reference.
 */
export const FREE_EMAIL_DOMAINS = [
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.co.uk",
  "outlook.com", "outlook.co.uk", "live.com", "live.co.uk", "msn.com",
  "yahoo.com", "yahoo.co.uk", "ymail.com", "icloud.com", "me.com", "mac.com",
  "aol.com", "gmx.com", "gmx.co.uk", "mail.com", "proton.me", "protonmail.com",
  "zoho.com", "yandex.com", "yandex.ru",
];

export const emailDomain = (email) =>
  String(email || "").trim().toLowerCase().split("@")[1] || "";

export const isFreeEmail = (email) => FREE_EMAIL_DOMAINS.includes(emailDomain(email));

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Cross-checks across all three referees plus the applicant.
 *
 * Returns { errors, warnings }. A warning does not block submission — a shared
 * domain is usually just two colleagues at the same employer, which is normal
 * and often desirable, so it is surfaced to the recruiter rather than thrown
 * back at the applicant.
 */
export function validateReferees({
  referees = [],
  applicantEmail = "",
  jobs = [],
  cannotObtainCareReference = "",
} = {}) {
  const errors = {};
  const warnings = [];

  const seen = new Map();
  referees.forEach((r, i) => {
    const key = `referee${i + 1}`;
    const email = String(r?.email || "").trim().toLowerCase();
    if (!email) return;

    if (!EMAIL_RE.test(email)) {
      errors[key] = "Enter an email address in the format name@example.com";
      return;
    }

    if (applicantEmail && email === String(applicantEmail).trim().toLowerCase()) {
      errors[key] = "A referee cannot be you. Please give their own email address.";
      return;
    }

    if (seen.has(email)) {
      errors[key] = "Each referee needs a different email address.";
      return;
    }
    seen.set(email, i);

    if (r.kind === "professional" && isFreeEmail(email)) {
      errors[key] =
        "Please give a work email address for this referee. We need one we can tie to their organisation in order to verify the reference — a personal address does not let us do that. If they genuinely have no work address, call us and we will sort it out.";
      return;
    }

    if (applicantEmail && emailDomain(email) && emailDomain(email) === emailDomain(applicantEmail)) {
      warnings.push(
        `Referee ${i + 1}'s email is at the same domain as the applicant's (${emailDomain(email)}).`,
      );
    }
  });

  /**
   * Schedule 3: conduct evidence must come from the most recent health or
   * social care employer. If the applicant's most recent role was in care,
   * one professional referee must be at that employer.
   */
  const ordered = [...jobs]
    .filter((j) => j && j.start)
    .sort((a, b) => monthStart(b.start) - monthStart(a.start));
  const mostRecent = ordered[0];

  if (mostRecent?.careRole) {
    const employer = String(mostRecent.employer || "").trim().toLowerCase();
    const matched = referees.some(
      (r) =>
        r?.kind === "professional" &&
        String(r.organisation || "").trim().toLowerCase() === employer,
    );
    if (employer && !matched) {
      /**
       * The escape hatch, added after Phase 7 pass 7.
       *
       * Reading this as "a 50-year-old returning to work after 3 years caring
       * for a relative" — the reader the spec names — surfaced a hard block:
       * if their last care employer has closed, been taken over, or simply
       * will not respond, they could not submit at all. That loses exactly the
       * candidate this employer wants, and it is not what the regulation asks
       * for either. Schedule 3 requires the employer to obtain conduct
       * evidence; CQC guidance accepts a documented explanation where a
       * reference genuinely cannot be obtained.
       *
       * So the requirement stands, but saying WHY it cannot be met turns the
       * block into a flag the recruiter has to resolve, rather than a wall.
       */
      const explained = String(cannotObtainCareReference || "").trim();
      if (explained.length >= 15) {
        warnings.push(
          `No referee from ${mostRecent.employer}, the most recent care employer. Applicant's explanation: "${explained}". Conduct evidence for that role still has to be obtained or the reason documented before any offer.`,
        );
      } else {
        errors.referenceCoverage =
          `Your most recent role at ${mostRecent.employer} was in health or social care, so one of your professional referees should be from there. This is a legal requirement for care roles, not a preference — we need evidence of your conduct in that job. If you cannot get a reference from them (for example the business has closed, or they will not respond), tick the box below and tell us why, and we will work it out with you.`;
      }
    }
  }

  return { errors, warnings };
}
