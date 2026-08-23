"use client";

import Field from "@components/ui/Field";
import { isFreeEmail } from "@lib/recruitment/validation";

/**
 * Three referees: two professional, one character.
 *
 * Schedule 3 of the 2014 Regulations requires satisfactory evidence of conduct
 * in previous health or social care employment. That is why the most recent
 * employer is required as a referee, and why a professional referee cannot use
 * a personal email address — a reference that cannot be tied to an
 * organisation is not evidence of anything.
 *
 * The free-email message is deliberately not accusatory. Most people give a
 * personal address because it is the one they know, not because they are
 * fabricating a reference, and treating them as a suspect loses good
 * candidates.
 */

export const blankReferee = (kind) => ({
  id: `ref-${Math.random().toString(36).slice(2, 9)}`,
  kind,
  name: "",
  jobTitle: "",
  organisation: "",
  email: "",
  phone: "",
  relationship: "",
  datesWorkedTogether: "",
  howKnown: "",
  howLongKnown: "",
  notFamily: false,
});

export const emptyReferees = () => [
  blankReferee("professional"),
  blankReferee("professional"),
  blankReferee("character"),
];

const References = ({
  referees = [],
  onChange,
  errors = {},
  mostRecentCareEmployer,
  cannotObtain = "",
  onCannotObtainChange,
}) => {
  const list = referees.length === 3 ? referees : emptyReferees();
  const update = (id, patch) =>
    onChange(list.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const professional = list.filter((r) => r.kind === "professional");
  const character = list.find((r) => r.kind === "character");

  return (
    <div className="space-y-8">
      <div className="rounded-card border border-primary-200 bg-primary-50 p-5">
        <p className="text-base leading-relaxed text-text">
          We need <strong>three referees</strong>: two professional and one
          character. We will not contact any of them until you have told us we
          can, on the next step.
        </p>
        {mostRecentCareEmployer && (
          <p className="mt-2 text-base leading-relaxed text-text">
            Because your most recent job at{" "}
            <strong>{mostRecentCareEmployer}</strong> was in health or social
            care, one of your professional referees has to be from there. That
            is a legal requirement for care roles — we cannot employ you without
            evidence of your conduct in that job.
          </p>
        )}
      </div>

      {professional.map((r, i) => {
        const freeEmail = r.email && isFreeEmail(r.email);
        return (
          <fieldset key={r.id} className="rounded-card border border-border bg-white p-5 shadow-card">
            <legend className="px-2 text-base font-bold text-primary-950">
              Professional referee {i + 1}
              {i === 0 ? " — your current or most recent employer" : ""}
            </legend>

            <div className="mt-2 grid gap-5 sm:grid-cols-2">
              <Field id={`${r.id}-name`} label="Their full name" required
                value={r.name} onChange={(e) => update(r.id, { name: e.target.value })}
                error={errors[`${r.id}-name`]} />
              <Field id={`${r.id}-jobTitle`} label="Their job title" required
                value={r.jobTitle} onChange={(e) => update(r.id, { jobTitle: e.target.value })}
                error={errors[`${r.id}-jobTitle`]} />
              <Field id={`${r.id}-organisation`} label="Organisation" required
                value={r.organisation} onChange={(e) => update(r.id, { organisation: e.target.value })}
                error={errors[`${r.id}-organisation`]} />
              <Field id={`${r.id}-phone`} label="Their phone number" type="tel" required
                value={r.phone} onChange={(e) => update(r.id, { phone: e.target.value })}
                error={errors[`${r.id}-phone`]} />
            </div>

            <div className="mt-5">
              <Field
                id={`${r.id}-email`}
                type="email"
                label="Their work email address"
                required
                hint="It needs to be a work address — see below."
                value={r.email}
                onChange={(e) => update(r.id, { email: e.target.value })}
                error={
                  errors[`${r.id}-email`] ||
                  (freeEmail
                    ? "This looks like a personal email address. We need a work one so we can verify the reference is genuine — a personal address does not let us do that. If they truly have no work address, call us on 01788 422422 and we will sort it out."
                    : undefined)
                }
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field id={`${r.id}-relationship`} label="Their relationship to you" required
                hint="For example: my line manager, my supervisor."
                value={r.relationship} onChange={(e) => update(r.id, { relationship: e.target.value })}
                error={errors[`${r.id}-relationship`]} />
              <Field id={`${r.id}-dates`} label="When you worked together" required
                hint="For example: March 2022 to June 2024."
                value={r.datesWorkedTogether} onChange={(e) => update(r.id, { datesWorkedTogether: e.target.value })}
                error={errors[`${r.id}-dates`]} />
            </div>
          </fieldset>
        );
      })}

      {character && (
        <fieldset className="rounded-card border border-border bg-white p-5 shadow-card">
          <legend className="px-2 text-base font-bold text-primary-950">
            Character referee
          </legend>

          <p className="mt-2 text-base leading-relaxed text-textMuted">
            Someone who knows you in a responsible capacity — a tutor, a
            volunteer coordinator, a former colleague, a community or faith
            leader. It cannot be a friend or a family member.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id={`${character.id}-name`} label="Their full name" required
              value={character.name} onChange={(e) => update(character.id, { name: e.target.value })}
              error={errors[`${character.id}-name`]} />
            <Field id={`${character.id}-email`} type="email" label="Their email address" required
              value={character.email} onChange={(e) => update(character.id, { email: e.target.value })}
              error={errors[`${character.id}-email`]} />
            <Field id={`${character.id}-phone`} label="Their phone number" type="tel" required
              value={character.phone} onChange={(e) => update(character.id, { phone: e.target.value })}
              error={errors[`${character.id}-phone`]} />
            <Field id={`${character.id}-howLong`} label="How long have they known you?" required
              hint="For example: 4 years."
              value={character.howLongKnown} onChange={(e) => update(character.id, { howLongKnown: e.target.value })}
              error={errors[`${character.id}-howLong`]} />
          </div>

          <div className="mt-5">
            <Field id={`${character.id}-howKnown`} as="textarea" rows={2}
              label="How do they know you?" required
              hint="For example: they were my tutor at college, or I volunteered with them."
              value={character.howKnown} onChange={(e) => update(character.id, { howKnown: e.target.value })}
              error={errors[`${character.id}-howKnown`]} />
          </div>

          <div className="mt-5">
            <div className="flex items-start gap-3">
              <input
                id={`${character.id}-notFamily`}
                type="checkbox"
                checked={character.notFamily}
                onChange={(e) => update(character.id, { notFamily: e.target.checked })}
                aria-invalid={errors[`${character.id}-notFamily`] ? "true" : undefined}
                className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
              />
              <label htmlFor={`${character.id}-notFamily`} className="text-base leading-relaxed text-text">
                I confirm this person is not a friend or family member.
                <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
                <span className="sr-only"> (required)</span>
              </label>
            </div>
            {errors[`${character.id}-notFamily`] && (
              <p role="alert" className="mt-1.5 text-base font-medium text-danger">
                <span aria-hidden="true">⚠ </span>{errors[`${character.id}-notFamily`]}
              </p>
            )}
          </div>
        </fieldset>
      )}

      {errors.referenceCoverage && (
        <div role="alert" className="rounded-card border-2 border-danger/50 bg-dangerBg p-5">
          <p className="text-base font-medium text-text">
            <span aria-hidden="true">⚠ </span>{errors.referenceCoverage}
          </p>
        </div>
      )}

      {/*
        The escape hatch. Added after reading this as someone returning to care
        after time out: if their last care employer has closed or will not
        respond, a hard block would end the application there. Saying why turns
        it into something the recruiter resolves rather than a wall.
      */}
      {mostRecentCareEmployer && (
        <div className="rounded-card border border-border bg-surface p-5">
          <h3 className="text-base font-bold text-primary-950">
            Cannot get a reference from {mostRecentCareEmployer}?
          </h3>
          <p className="mt-2 text-base leading-relaxed text-textMuted">
            It happens — businesses close, managers move on, and some employers
            simply do not reply. Tell us what the situation is and we will work
            it out with you. It will not end your application.
          </p>
          <div className="mt-4">
            <Field
              id="cannotObtainCareReference"
              as="textarea"
              rows={3}
              label={`Why you cannot get a reference from ${mostRecentCareEmployer}`}
              hint="A sentence or two. For example: the home closed in 2024 and I have no contact for my old manager."
              value={cannotObtain}
              onChange={(e) => onCannotObtainChange?.(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default References;
