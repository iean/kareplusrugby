"use client";

import { useMemo } from "react";
import Field from "@components/ui/Field";
import { findEmploymentGaps, GAP_DAYS } from "@lib/recruitment/validation";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

/**
 * Employment history for the last five years, newest first.
 *
 * WHY THIS IS STRICT. Schedule 3 of the Health and Social Care Act 2008
 * (Regulated Activities) Regulations 2014 requires a full employment history
 * with a written explanation of any gaps. Kare Plus Rugby cannot lawfully
 * employ a care worker without it. That is why an unexplained gap blocks
 * submission, and why the explanation is attached to the specific gap rather
 * than collected as one vague box at the end — "explain any gaps" produces
 * nothing useful; "you left Tesco in January 2024 and started at Sunrise in
 * September 2024, what were you doing?" produces an answer.
 *
 * TONE MATTERS HERE. A four-month gap is not suspicious. It is a person who
 * was caring for a relative, unwell, studying, raising a child, or looking for
 * work. The wording below says so, because a form that reads like an
 * interrogation loses exactly the candidates this employer wants — the spec's
 * Phase 7 pass 7 names "a 50-year-old returning to work after 3 years caring
 * for a relative" as a reader to test against.
 */

const blankJob = () => ({
  id: `job-${Math.random().toString(36).slice(2, 9)}`,
  employer: "",
  title: "",
  start: "",
  end: "",
  current: false,
  careRole: false,
  reasonForLeaving: "",
  gapExplanationAfter: "",
});

/** A month input renders a native picker on mobile and is keyboard friendly. */
const MonthField = ({ id, label, value, onChange, disabled, required, error }) => (
  <Field
    id={id}
    type="month"
    label={label}
    required={required}
    disabled={disabled}
    value={value || ""}
    onChange={onChange}
    error={error}
  />
);

const EmploymentHistory = ({ jobs = [], onChange, errors = {} }) => {
  const list = jobs.length ? jobs : [blankJob()];

  const gaps = useMemo(() => findEmploymentGaps(list), [list]);

  const update = (id, patch) =>
    onChange(list.map((j) => (j.id === id ? { ...j, ...patch } : j)));

  const add = () => onChange([...list, blankJob()]);
  const remove = (id) =>
    onChange(list.length > 1 ? list.filter((j) => j.id !== id) : [blankJob()]);

  // A gap is stored against the job that came BEFORE it, so the explanation
  // sits directly under the role the applicant left.
  const gapAfter = (jobId) => gaps.find((g) => g.afterId === jobId);

  return (
    <div className="space-y-8">
      <div className="rounded-card border border-primary-200 bg-primary-50 p-5">
        <p className="text-base leading-relaxed text-text">
          Please list the last <strong>five years</strong>, starting with your
          most recent job. Include part-time and voluntary work.
        </p>
        <p className="mt-2 text-base leading-relaxed text-text">
          If there are breaks between jobs, we will ask what you were doing.
          That is a legal requirement for care work — it is not us being
          suspicious. Time out to raise children, care for a relative, study,
          recover from illness or look for work are all perfectly normal
          answers.
        </p>
      </div>

      {list.map((job, index) => {
        const g = gapAfter(job.id);
        return (
          <div key={job.id}>
            <fieldset className="rounded-card border border-border bg-white p-5 shadow-card">
              <legend className="px-2 text-base font-bold text-primary-950">
                {index === 0 ? "Most recent job" : `Previous job ${index}`}
              </legend>

              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                <Field
                  id={`${job.id}-employer`}
                  label="Employer"
                  required
                  value={job.employer}
                  onChange={(e) => update(job.id, { employer: e.target.value })}
                  error={errors[`${job.id}-employer`]}
                />
                <Field
                  id={`${job.id}-title`}
                  label="Your job title"
                  required
                  value={job.title}
                  onChange={(e) => update(job.id, { title: e.target.value })}
                  error={errors[`${job.id}-title`]}
                />
                <MonthField
                  id={`${job.id}-start`}
                  label="Start date"
                  required
                  value={job.start}
                  onChange={(e) => update(job.id, { start: e.target.value })}
                  error={errors[`${job.id}-start`]}
                />
                <MonthField
                  id={`${job.id}-end`}
                  label="End date"
                  required={!job.current}
                  disabled={job.current}
                  value={job.current ? "" : job.end}
                  onChange={(e) => update(job.id, { end: e.target.value })}
                  error={errors[`${job.id}-end`]}
                />
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    id={`${job.id}-current`}
                    type="checkbox"
                    checked={job.current}
                    onChange={(e) =>
                      update(job.id, {
                        current: e.target.checked,
                        end: e.target.checked ? "" : job.end,
                      })
                    }
                    className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
                  />
                  <label htmlFor={`${job.id}-current`} className="text-base leading-relaxed text-text">
                    I still work here
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id={`${job.id}-care`}
                    type="checkbox"
                    checked={job.careRole}
                    onChange={(e) => update(job.id, { careRole: e.target.checked })}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
                  />
                  <label htmlFor={`${job.id}-care`} className="text-base leading-relaxed text-text">
                    This was a health or social care role
                    <span className="mt-0.5 block text-base text-textMuted">
                      If it was, we have to ask this employer for a reference —
                      that is a legal requirement for care work.
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-5">
                <Field
                  id={`${job.id}-reason`}
                  as="textarea"
                  rows={2}
                  label="Reason for leaving"
                  required={!job.current}
                  hint={job.current ? "Not needed while you are still there." : undefined}
                  disabled={job.current}
                  value={job.current ? "" : job.reasonForLeaving}
                  onChange={(e) => update(job.id, { reasonForLeaving: e.target.value })}
                  error={errors[`${job.id}-reason`]}
                />
              </div>

              {list.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(job.id)}
                  className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-btn px-3 text-base font-semibold text-danger hover:bg-dangerBg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                  Remove this job
                  <span className="sr-only">
                    : {job.employer || `entry ${index + 1}`}
                  </span>
                </button>
              )}
            </fieldset>

            {/* The gap explanation sits directly beneath the job it follows. */}
            {g && (
              <div className="mt-3 rounded-card border-2 border-warning/50 bg-warningBg p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                  <div className="w-full">
                    <h4 className="text-base font-bold text-text">
                      There is a {Math.round(g.days / 7)}-week gap here
                    </h4>
                    <p className="mt-1 text-base leading-relaxed text-text">
                      We need a short note about the time {g.label}. Anything
                      over {Math.round(GAP_DAYS / 7)} weeks has to be explained
                      for care roles.
                    </p>
                    <div className="mt-3">
                      <Field
                        id={`${job.id}-gap`}
                        as="textarea"
                        rows={3}
                        label="What were you doing during this time?"
                        required
                        hint="A sentence is plenty. For example: caring for my mother, travelling, studying, or looking for work."
                        value={job.gapExplanationAfter}
                        onChange={(e) => update(job.id, { gapExplanationAfter: e.target.value })}
                        error={errors[`${job.id}-gap`]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-btn border-2 border-primary-700 px-6 py-3 text-base font-semibold text-primary-800 transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
      >
        <Plus aria-hidden="true" className="h-5 w-5" />
        Add another job
      </button>

      <p aria-live="polite" className="sr-only">
        {gaps.length === 0
          ? "No employment gaps need explaining."
          : `${gaps.length} employment ${gaps.length === 1 ? "gap needs" : "gaps need"} an explanation.`}
      </p>
    </div>
  );
};

export default EmploymentHistory;
