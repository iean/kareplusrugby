"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Field from "@components/ui/Field";
import Button from "@components/ui/Button";
import { ChevronLeft, ChevronRight, Save, Check } from "lucide-react";
import site from "@config/site.json";
import { LOCATIONS } from "@lib/locations";
import { unexplainedGaps, validateReferees, EMAIL_RE } from "@lib/recruitment/validation";
import { STEPS, HOURS, CONTRACT, NOTICE, YES_NO, RTW, DBS_HELD, DBS_UPDATE } from "./steps";
import RadioGroup from "./RadioGroup";
import CheckboxGroup from "./CheckboxGroup";
import AvailabilityGrid from "./AvailabilityGrid";
import EmploymentHistory from "./EmploymentHistory";
import References, { emptyReferees } from "./References";
import Review from "./Review";

/**
 * The job application, one section per screen.
 *
 * SAVE AND RESUME. Progress is written to the server after every step, keyed
 * to the applicant's email (RECRUITMENT-SPEC.md makes this mandatory). The
 * form is long and most applicants are on a phone; losing a half-finished
 * application loses the candidate.
 *
 * Uploaded files are the one thing that cannot be resumed — a browser cannot
 * repopulate a file input for security reasons — so the qualifications step
 * says so plainly rather than letting someone believe their certificates were
 * saved.
 *
 * VALIDATION runs here for speed and kindness, and again on the server, which
 * is the authority. The client can be bypassed entirely.
 */

const initialAnswers = () => ({
  fullName: "", preferredName: "", email: "", mobile: "", town: "", postcode: "",
  locations: [], role: "", contract: "", hoursWanted: "",
  drivingLicence: "", ownVehicle: "",
  rightToWork: "", dbsHeld: "", dbsUpdateService: "", willingDbs: "",
  availability: [], noticePattern: "", fixedCommitments: "", earliestStart: "",
  jobs: [],
  qualifications: "",
  referees: emptyReferees(),
  confirmTrue: false, consentReferees: false,
});

const ApplicationWizard = ({ vacancies = [], resumeToken = null }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [errors, setErrors] = useState({});
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [reference, setReference] = useState(null);
  const [resumeSent, setResumeSent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const headingRef = useRef(null);

  const set = (patch) => setAnswers((a) => ({ ...a, ...patch }));

  /* ---------------------------------------------------------------- *
   * Resume an existing application from a link
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (!resumeToken) return;
    (async () => {
      try {
        const res = await fetch("/api/careers/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: resumeToken }),
        });
        const data = await res.json();
        if (res.ok && data.answers) {
          setAnswers((a) => ({ ...a, ...data.answers, email: data.email }));
          setReference(data.reference);
          setStep(Math.min(data.step, STEPS.length - 1));
        } else {
          setErrors({ resume: data.error || "That link could not be opened." });
        }
      } catch {
        setErrors({ resume: "We could not open that link. Please check your connection." });
      }
    })();
  }, [resumeToken]);

  const focusHeading = () =>
    requestAnimationFrame(() => headingRef.current?.focus());

  /* ---------------------------------------------------------------- *
   * Per-step validation
   * ---------------------------------------------------------------- */
  const validateStep = useCallback(
    (i) => {
      const e = {};
      const need = (k, msg) => {
        if (!String(answers[k] ?? "").trim()) e[k] = msg;
      };

      if (i === 0) {
        need("fullName", "Please give your full name.");
        need("mobile", "Please give a mobile number.");
        need("town", "Please give your town or city.");
        need("postcode", "Please give your postcode.");
        if (!EMAIL_RE.test(String(answers.email || "").trim())) {
          e.email = "Enter an email address in the format name@example.com";
        }
      }

      if (i === 1) {
        if (!answers.locations?.length) e.locations = "Choose at least one location.";
        need("role", "Please choose the role you are applying for.");
        need("contract", "Please choose the kind of contract you want.");
        need("hoursWanted", "Please choose roughly how many hours you want.");
        need("drivingLicence", "Please answer this.");
        need("ownVehicle", "Please answer this.");
      }

      if (i === 2) {
        need("rightToWork", "Please answer this.");
        need("dbsHeld", "Please answer this.");
        if (answers.dbsHeld === "Yes") need("dbsUpdateService", "Please answer this.");
        need("willingDbs", "Please answer this.");
      }

      if (i === 3) {
        if (!answers.availability?.length) {
          e.availability = "Please tick at least one slot you could work.";
        }
        need("noticePattern", "Please answer this.");
        need("earliestStart", "Please give your earliest start date.");
      }

      if (i === 4) {
        const jobs = answers.jobs || [];
        if (!jobs.length || !jobs.some((j) => j.employer?.trim())) {
          e.jobs = "Please add at least one job. If you have never worked, add your most recent education instead and say so in the reason field.";
        }
        jobs.forEach((j) => {
          if (!j.employer?.trim()) e[`${j.id}-employer`] = "Required.";
          if (!j.title?.trim()) e[`${j.id}-title`] = "Required.";
          if (!j.start?.trim()) e[`${j.id}-start`] = "Required.";
          if (!j.current && !j.end?.trim()) e[`${j.id}-end`] = "Required, unless you still work here.";
          if (!j.current && !j.reasonForLeaving?.trim()) e[`${j.id}-reason`] = "Required.";
        });
        // Schedule 3: every gap over 4 weeks needs a written explanation.
        unexplainedGaps(jobs).forEach((g) => {
          if (g.afterId) e[`${g.afterId}-gap`] = "Please tell us what you were doing during this time.";
        });
      }

      if (i === 6) {
        const refs = answers.referees || [];
        refs.forEach((r) => {
          if (!r.name?.trim()) e[`${r.id}-name`] = "Required.";
          if (!r.email?.trim()) e[`${r.id}-email`] = "Required.";
          if (!r.phone?.trim()) e[`${r.id}-phone`] = "Required.";
          if (r.kind === "professional") {
            if (!r.jobTitle?.trim()) e[`${r.id}-jobTitle`] = "Required.";
            if (!r.organisation?.trim()) e[`${r.id}-organisation`] = "Required.";
            if (!r.relationship?.trim()) e[`${r.id}-relationship`] = "Required.";
            if (!r.datesWorkedTogether?.trim()) e[`${r.id}-dates`] = "Required.";
          } else {
            if (!r.howKnown?.trim()) e[`${r.id}-howKnown`] = "Required.";
            if (!r.howLongKnown?.trim()) e[`${r.id}-howLong`] = "Required.";
            if (!r.notFamily) e[`${r.id}-notFamily`] = "Please confirm this.";
          }
        });
        const cross = validateReferees({
          referees: refs,
          applicantEmail: answers.email,
          jobs: answers.jobs || [],
          cannotObtainCareReference: answers.cannotObtainCareReference,
        });
        Object.entries(cross.errors).forEach(([k, v]) => {
          // Map the generic keys onto the specific referee they concern.
          if (k.startsWith("referee")) {
            const idx = Number(k.replace("referee", "")) - 1;
            if (refs[idx]) e[`${refs[idx].id}-email`] = v;
          } else {
            e[k] = v;
          }
        });
      }

      if (i === 7) {
        if (!answers.confirmTrue) e.confirmTrue = "Please confirm your answers are true and complete.";
        if (!answers.consentReferees) e.consentReferees = "We cannot contact your referees without your consent.";
      }

      return e;
    },
    [answers],
  );

  /* ---------------------------------------------------------------- *
   * Saving
   * ---------------------------------------------------------------- */
  const save = useCallback(
    async (nextStep, { issueResumeLink = false } = {}) => {
      if (!EMAIL_RE.test(String(answers.email || "").trim())) return null;
      setSaveState("saving");
      try {
        const res = await fetch("/api/careers/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: answers.email,
            step: nextStep,
            answers,
            website,
            issueResumeLink,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setSaveState("error");
          setErrors((p) => ({ ...p, save: data.error }));
          return null;
        }
        setReference(data.reference);
        setSaveState("saved");
        return data;
      } catch {
        setSaveState("error");
        setErrors((p) => ({
          ...p,
          save: "We could not save your progress. Check your connection and try again.",
        }));
        return null;
      }
    },
    [answers, website],
  );

  const next = async () => {
    const found = validateStep(step);
    setErrors(found);
    if (Object.keys(found).length) {
      focusHeading();
      return;
    }
    const target = Math.min(step + 1, STEPS.length - 1);
    await save(target);
    setStep(target);
    focusHeading();
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    focusHeading();
  };

  const emailMeALink = async () => {
    const data = await save(step, { issueResumeLink: true });
    if (data) setResumeSent(true);
  };

  const stepErrors = Object.entries(errors).filter(([k]) => k !== "save" && k !== "resume");

  /* ---------------------------------------------------------------- */
  return (
    <div>
      {/* Progress */}
      <nav aria-label="Application progress" className="mb-8">
        <p className="mb-2 text-base font-semibold text-primary-950">
          Step {step + 1} of {STEPS.length}: {STEPS[step].title}
        </p>
        <ol className="flex flex-wrap gap-1.5">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex-1">
              <span
                aria-current={i === step ? "step" : undefined}
                className={`block h-2 rounded-full ${
                  i < step ? "bg-primary-700" : i === step ? "bg-primary-500" : "bg-border"
                }`}
              >
                <span className="sr-only">
                  {s.title}
                  {i < step ? " (completed)" : i === step ? " (current)" : ""}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-primary-950 focus:outline-none md:text-3xl"
      >
        {STEPS[step].title}
      </h2>

      {/* Honeypot */}
      <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="apply-website">Leave this field empty</label>
        <input id="apply-website" name="website" type="text" tabIndex={-1}
          autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {stepErrors.length > 0 && (
        <div role="alert" className="mt-6 rounded-card border-2 border-danger/50 bg-dangerBg p-5">
          <h3 className="text-base font-bold text-danger">
            There {stepErrors.length === 1 ? "is 1 thing" : `are ${stepErrors.length} things`} to fix
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-text">
            {stepErrors.slice(0, 8).map(([k, v]) => <li key={k}>{v}</li>)}
          </ul>
        </div>
      )}

      {errors.resume && (
        <div role="alert" className="mt-6 rounded-card border-2 border-danger/50 bg-dangerBg p-5 text-base text-text">
          {errors.resume}
        </div>
      )}

      <div className="mt-8 space-y-7">
        {step === 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="fullName" label="Full name" required autoComplete="name"
                value={answers.fullName} onChange={(e) => set({ fullName: e.target.value })} error={errors.fullName} />
              <Field id="preferredName" label="Preferred name"
                hint="Optional. What we should call you."
                value={answers.preferredName} onChange={(e) => set({ preferredName: e.target.value })} />
              <Field id="email" type="email" label="Email address" required autoComplete="email"
                hint="We save your progress against this, and send your resume link here."
                value={answers.email} onChange={(e) => set({ email: e.target.value })} error={errors.email} />
              <Field id="mobile" type="tel" label="Mobile number" required autoComplete="tel"
                value={answers.mobile} onChange={(e) => set({ mobile: e.target.value })} error={errors.mobile} />
              <Field id="town" label="Town or city" required
                value={answers.town} onChange={(e) => set({ town: e.target.value })} error={errors.town} />
              <Field id="postcode" label="Postcode" required autoComplete="postal-code"
                value={answers.postcode} onChange={(e) => set({ postcode: e.target.value })} error={errors.postcode} />
            </div>
            <p className="text-base leading-relaxed text-textMuted">
              We only need your town and postcode at this stage, not your full
              address.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <CheckboxGroup name="locations" legend="Where could you work?" required
              hint="Choose every area that works for you." options={LOCATIONS}
              value={answers.locations} onChange={(v) => set({ locations: v })} error={errors.locations} />
            <Field id="role" as="select" label="Which role are you applying for?" required
              value={answers.role} onChange={(e) => set({ role: e.target.value })} error={errors.role}>
              <option value="">Please choose…</option>
              {vacancies.map((v) => (
                <option key={v.slug} value={v.title}>{v.title}</option>
              ))}
              <option value="General application">
                General application — no specific vacancy
              </option>
            </Field>
            <RadioGroup name="contract" legend="What kind of work are you looking for?" required
              options={CONTRACT} value={answers.contract} onChange={(v) => set({ contract: v })} error={errors.contract} />
            <RadioGroup name="hoursWanted" legend="Roughly how many hours a week?" required columns
              options={HOURS} value={answers.hoursWanted} onChange={(v) => set({ hoursWanted: v })} error={errors.hoursWanted} />
            <RadioGroup name="drivingLicence" legend="Do you have a full UK driving licence?" required
              options={YES_NO} value={answers.drivingLicence} onChange={(v) => set({ drivingLicence: v })} error={errors.drivingLicence} />
            <RadioGroup name="ownVehicle" legend="Do you have access to your own vehicle?" required
              options={YES_NO} value={answers.ownVehicle} onChange={(v) => set({ ownVehicle: v })} error={errors.ownVehicle} />
          </>
        )}

        {step === 2 && (
          <>
            <RadioGroup name="rightToWork" legend="Do you have the right to work in the UK?" required
              options={RTW} value={answers.rightToWork} onChange={(v) => set({ rightToWork: v })} error={errors.rightToWork}
              hint="This is a declaration only — it is not a right to work check. If we offer you a job, we will carry out a full Home Office right to work check before you start. Nothing here is recorded as a completed check." />
            <RadioGroup name="dbsHeld" legend="Do you have an enhanced DBS certificate?" required
              options={DBS_HELD} value={answers.dbsHeld} onChange={(v) => set({ dbsHeld: v, dbsUpdateService: v === "Yes" ? answers.dbsUpdateService : "" })} error={errors.dbsHeld} />
            {answers.dbsHeld === "Yes" && (
              <RadioGroup name="dbsUpdateService" legend="Is it registered on the DBS Update Service?" required
                hint="If you are not sure, say so — plenty of people hold a DBS without knowing. We can check for you."
                options={DBS_UPDATE} value={answers.dbsUpdateService} onChange={(v) => set({ dbsUpdateService: v })} error={errors.dbsUpdateService} />
            )}
            <RadioGroup name="willingDbs" legend="Are you willing to undergo an enhanced DBS check?" required
              options={YES_NO} value={answers.willingDbs} onChange={(v) => set({ willingDbs: v })} error={errors.willingDbs} />
            <p className="rounded-card border border-border bg-surface p-4 text-base leading-relaxed text-textMuted">
              We do not ask for your DBS certificate number, National Insurance
              number, date of birth or any document here. If we offer you a job
              we will collect those securely then — not through a web form.
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <AvailabilityGrid value={answers.availability} onChange={(v) => set({ availability: v })} />
            {errors.availability && (
              <p role="alert" className="text-base font-medium text-danger">
                <span aria-hidden="true">⚠ </span>{errors.availability}
              </p>
            )}
            <RadioGroup name="noticePattern" legend="How far ahead can you confirm your availability?" required columns
              options={NOTICE} value={answers.noticePattern} onChange={(v) => set({ noticePattern: v })} error={errors.noticePattern} />
            <Field id="fixedCommitments" as="textarea" rows={3}
              label="Any fixed commitments we should know about?"
              hint="Optional. For example: school runs, a study day, or a regular appointment."
              value={answers.fixedCommitments} onChange={(e) => set({ fixedCommitments: e.target.value })} />
            <Field id="earliestStart" type="date" label="Earliest start date" required
              className="sm:max-w-xs"
              value={answers.earliestStart} onChange={(e) => set({ earliestStart: e.target.value })} error={errors.earliestStart} />
          </>
        )}

        {step === 4 && (
          <>
            <EmploymentHistory jobs={answers.jobs} onChange={(jobs) => set({ jobs })} errors={errors} />
            {errors.jobs && (
              <p role="alert" className="text-base font-medium text-danger">
                <span aria-hidden="true">⚠ </span>{errors.jobs}
              </p>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <Field id="qualifications" as="textarea" rows={5}
              label="Your qualifications and certificates"
              hint="List anything relevant — the Care Certificate, NVQ Level 2 or 3, manual handling, medication training, first aid. If you have none yet, say so; we train people new to care."
              value={answers.qualifications} onChange={(e) => set({ qualifications: e.target.value })} />
            <div className="rounded-card border border-border bg-surface p-5">
              <h3 className="text-base font-bold text-primary-950">
                Certificates and CV
              </h3>
              <p className="mt-2 text-base leading-relaxed text-textMuted">
                You will be able to attach your certificates and CV on the final
                step, just before you submit.
              </p>
              <p className="mt-2 text-base leading-relaxed text-textMuted">
                We cannot save attachments with your progress — browsers do not
                allow it — so please have them to hand when you finish. You can
                also email them to us afterwards.
              </p>
            </div>
          </>
        )}

        {step === 6 && (
          <References
            referees={answers.referees}
            onChange={(referees) => set({ referees })}
            errors={errors}
            cannotObtain={answers.cannotObtainCareReference}
            onCannotObtainChange={(v) => set({ cannotObtainCareReference: v })}
            mostRecentCareEmployer={
              [...(answers.jobs || [])]
                .filter((j) => j.start)
                .sort((a, b) => (a.start < b.start ? 1 : -1))[0]?.careRole
                ? [...(answers.jobs || [])].filter((j) => j.start).sort((a, b) => (a.start < b.start ? 1 : -1))[0].employer
                : null
            }
          />
        )}

        {step === 7 && (
          <>
            <div className="space-y-5">
              <div>
                <div className="flex items-start gap-3">
                  <input id="confirmTrue" type="checkbox" checked={answers.confirmTrue}
                    onChange={(e) => set({ confirmTrue: e.target.checked })}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600" />
                  <label htmlFor="confirmTrue" className="text-base leading-relaxed text-text">
                    I confirm the information I have given is true and complete.
                    <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
                    <span className="sr-only"> (required)</span>
                  </label>
                </div>
                {errors.confirmTrue && (
                  <p role="alert" className="mt-1.5 text-base font-medium text-danger">
                    <span aria-hidden="true">⚠ </span>{errors.confirmTrue}
                  </p>
                )}
              </div>

              {/* Separate from the confirmation above, deliberately. Consent
                  must be a distinct, freely given act, not bundled. */}
              <div>
                <div className="flex items-start gap-3">
                  <input id="consentReferees" type="checkbox" checked={answers.consentReferees}
                    onChange={(e) => set({ consentReferees: e.target.checked })}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600" />
                  <label htmlFor="consentReferees" className="text-base leading-relaxed text-text">
                    I consent to Kare Plus Rugby contacting the three referees I
                    have named.
                    <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
                    <span className="sr-only"> (required)</span>
                  </label>
                </div>
                {errors.consentReferees && (
                  <p role="alert" className="mt-1.5 text-base font-medium text-danger">
                    <span aria-hidden="true">⚠ </span>{errors.consentReferees}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-card border border-border bg-surface p-5">
              <h3 className="text-base font-bold text-primary-950">
                What happens to what you have told us
              </h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base leading-relaxed text-textMuted">
                <li>It is stored securely and used only to consider you for work.</li>
                <li>Your three referees will be emailed and asked for a reference.</li>
                <li>
                  If you are not offered a role, it is deleted automatically
                  after six months.
                </li>
                <li>You can ask us to delete it at any time.</li>
              </ul>
              <a href="/privacy-policy" className="mt-3 inline-block text-base font-semibold text-primary-700 underline underline-offset-4">
                Read the privacy notice
              </a>
            </div>
          </>
        )}

        {step === 8 && (
          <Review answers={answers} vacancies={vacancies} onEdit={(i) => { setStep(i); focusHeading(); }} reference={reference} />
        )}
      </div>

      {/* Save state + resume link */}
      <div className="mt-8 rounded-card border border-border bg-surface p-4">
        <p className="text-base text-textMuted" aria-live="polite">
          {saveState === "saving" && "Saving your progress…"}
          {saveState === "saved" && reference && (
            <>
              <Check aria-hidden="true" className="mr-1 inline h-4 w-4 text-success" />
              Progress saved. Your reference is <strong>{reference}</strong>.
            </>
          )}
          {saveState === "error" && (errors.save || "We could not save your progress.")}
          {saveState === "idle" && "Your progress is saved each time you move to the next step."}
        </p>
        {EMAIL_RE.test(String(answers.email || "").trim()) && (
          <button type="button" onClick={emailMeALink}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-btn border-2 border-primary-700 px-5 py-2 text-base font-semibold text-primary-800 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
            <Save aria-hidden="true" className="h-4 w-4" />
            {resumeSent ? "Send me the link again" : "Email me a link to finish later"}
          </button>
        )}
        {resumeSent && (
          <p className="mt-2 text-base text-success" role="status">
            We have saved your place. Check your email for a link back to this
            application.
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={back}>
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            Back
          </Button>
        ) : <span />}

        {step < STEPS.length - 1 && (
          <Button type="button" onClick={next} size="lg">
            Continue
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </Button>
        )}
      </div>

      <p className="mt-6 text-base leading-relaxed text-textMuted">
        Stuck, or would rather talk to a person? Call us on{" "}
        <a href={site.business.phone_href} className="font-semibold text-primary-700 underline underline-offset-4">
          {site.business.phone}
        </a>
        .
      </p>
    </div>
  );
};

export default ApplicationWizard;
