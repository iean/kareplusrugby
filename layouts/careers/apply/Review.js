"use client";

import { STEPS } from "./steps";
import { LOCATIONS, locationLabel } from "@lib/locations";
import { DAYS, SHIFTS } from "./AvailabilityGrid";
import { formatMonth, findEmploymentGaps } from "@lib/recruitment/validation";

/**
 * Section 9: show everything back before submitting.
 *
 * The spec calls this "the main defence against errors in a form this long",
 * and it is not optional. Every section has its own edit link that jumps
 * straight to that step rather than making someone page back through eight
 * screens.
 */

const Row = ({ label, children }) =>
  children === "" || children == null || (Array.isArray(children) && !children.length) ? null : (
    <div className="grid gap-1 py-2 sm:grid-cols-[14rem_1fr] sm:gap-4">
      <dt className="text-base font-semibold text-text">{label}</dt>
      <dd className="text-base text-textMuted">{children}</dd>
    </div>
  );

const Section = ({ title, stepIndex, onEdit, children }) => (
  <section className="rounded-card border border-border bg-white p-5 shadow-card">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-lg font-bold text-primary-950">{title}</h3>
      <button
        type="button"
        onClick={() => onEdit(stepIndex)}
        className="inline-flex min-h-[44px] items-center rounded-btn px-3 text-base font-semibold text-primary-700 underline underline-offset-4 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
      >
        Change
        <span className="sr-only"> your {title.toLowerCase()}</span>
      </button>
    </div>
    <dl className="divide-y divide-border">{children}</dl>
  </section>
);

const Review = ({ answers, onEdit, reference }) => {
  const availability = (answers.availability || []).map((id) => {
    const [d, s] = id.split(":");
    return `${DAYS.find((x) => x.id === d)?.label ?? d} ${SHIFTS.find((x) => x.id === s)?.label.toLowerCase() ?? s}`;
  });

  const gaps = findEmploymentGaps(answers.jobs || []);

  return (
    <div className="space-y-5">
      <div className="rounded-card border border-primary-200 bg-primary-50 p-5">
        <p className="text-base leading-relaxed text-text">
          Please check everything below before you send it. Use{" "}
          <strong>Change</strong> beside any section to go back and fix it.
        </p>
        {reference && (
          <p className="mt-2 text-base text-text">
            Your reference is <strong>{reference}</strong> — quote it if you
            call us.
          </p>
        )}
      </div>

      <Section title="About you" stepIndex={0} onEdit={onEdit}>
        <Row label="Full name">{answers.fullName}</Row>
        <Row label="Preferred name">{answers.preferredName}</Row>
        <Row label="Email">{answers.email}</Row>
        <Row label="Mobile">{answers.mobile}</Row>
        <Row label="Town or city">{answers.town}</Row>
        <Row label="Postcode">{answers.postcode}</Row>
      </Section>

      <Section title="The role" stepIndex={1} onEdit={onEdit}>
        <Row label="Locations">
          {(answers.locations || []).map(locationLabel).join(", ")}
        </Row>
        <Row label="Role">{answers.role}</Row>
        <Row label="Contract">{answers.contract}</Row>
        <Row label="Hours wanted">{answers.hoursWanted}</Row>
        <Row label="Driving licence">{answers.drivingLicence}</Row>
        <Row label="Own vehicle">{answers.ownVehicle}</Row>
      </Section>

      <Section title="Eligibility" stepIndex={2} onEdit={onEdit}>
        <Row label="Right to work in the UK">{answers.rightToWork}</Row>
        <Row label="Enhanced DBS certificate">{answers.dbsHeld}</Row>
        <Row label="On the Update Service">{answers.dbsUpdateService}</Row>
        <Row label="Willing to undergo a DBS check">{answers.willingDbs}</Row>
      </Section>

      <Section title="Availability" stepIndex={3} onEdit={onEdit}>
        <Row label="Slots you can work">
          {availability.length ? `${availability.length} selected — ${availability.join("; ")}` : ""}
        </Row>
        <Row label="How far ahead you can confirm">{answers.noticePattern}</Row>
        <Row label="Fixed commitments">{answers.fixedCommitments}</Row>
        <Row label="Earliest start date">{answers.earliestStart}</Row>
      </Section>

      <Section title="Employment history" stepIndex={4} onEdit={onEdit}>
        {(answers.jobs || []).map((j) => (
          <Row key={j.id} label={j.employer || "Job"}>
            {j.title}
            {j.start ? `, ${formatMonth(j.start)} to ${j.current ? "present" : formatMonth(j.end)}` : ""}
            {j.careRole ? " · health or social care role" : ""}
            {j.reasonForLeaving ? ` · left because: ${j.reasonForLeaving}` : ""}
          </Row>
        ))}
        {gaps.map((g) => (
          <Row key={g.id} label={`Gap (${Math.round(g.days / 7)} weeks)`}>
            {g.explanation || "Not yet explained"}
          </Row>
        ))}
      </Section>

      <Section title="Qualifications" stepIndex={5} onEdit={onEdit}>
        <Row label="Qualifications">{answers.qualifications}</Row>
      </Section>

      <Section title="References" stepIndex={6} onEdit={onEdit}>
        {(answers.referees || []).map((r, i) => (
          <Row
            key={r.id}
            label={r.kind === "professional" ? `Professional referee ${i + 1}` : "Character referee"}
          >
            {[r.name, r.jobTitle, r.organisation, r.email, r.phone].filter(Boolean).join(" · ")}
          </Row>
        ))}
      </Section>

      <Section title="Declarations" stepIndex={7} onEdit={onEdit}>
        <Row label="Information is true and complete">{answers.confirmTrue ? "Confirmed" : "Not confirmed"}</Row>
        <Row label="Consent to contact referees">{answers.consentReferees ? "Given" : "Not given"}</Row>
      </Section>

      {/*
        Submission itself is Phase 3 of RECRUITMENT-SPEC.md: saving the final
        record, generating the PDF, emailing the office and the applicant, and
        triggering the reference loop. The spec says not to build phases 3 and
        4 until phase 2 works end to end, so this deliberately stops here.
      */}
      <div className="rounded-card border-2 border-dashed border-borderStrong bg-surface p-5">
        <h3 className="text-lg font-bold text-primary-950">Ready to submit</h3>
        <p className="mt-2 text-base leading-relaxed text-textMuted">
          Everything above is saved against your reference. Submission,
          certificate uploads and contacting your referees are built in the next
          phase of this system.
        </p>
      </div>
    </div>
  );
};

export default Review;
