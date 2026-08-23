"use client";

import { useState } from "react";
import Field from "@components/ui/Field";
import Button from "@components/ui/Button";
import RadioGroup from "@layouts/careers/apply/RadioGroup";
import site from "@config/site.json";
import { ShieldAlert, Check } from "lucide-react";

/**
 * The reference form a referee fills in.
 *
 * DESIGNED TO BE FINISHED. The spec's Phase 7 pass 7 names "a busy ward
 * manager giving a reference in 3 minutes between shifts" as a reader to test
 * against, and warns that "a long form gets abandoned and you get no
 * reference". So: one screen, no login, no account, the employment details
 * pre-filled from what the applicant told us so they confirm rather than
 * recall, and everything optional except the handful of answers that are
 * legally required.
 *
 * DECLINING IS A FIRST-CLASS OPTION. A referee with no way out either ignores
 * the email — which stalls the application silently — or replies crossly to a
 * business inbox. It is offered plainly at the bottom.
 *
 * The safeguarding question is the one that must not be skipped, so it is
 * required, visually distinct, and its follow-up box appears and becomes
 * required the moment "Yes" is chosen.
 */

const RE_EMPLOY = ["Yes", "No", "With reservations"];
const RATING = ["Excellent", "Good", "Satisfactory", "Poor"];
const YES_NO = ["Yes", "No"];

const ReferenceForm = ({ token, referee, applicant, claimed, applicationReference }) => {
  const isCharacter = referee.kind === "character";

  const [v, setV] = useState({
    // professional
    jobTitle: claimed?.jobTitle || "",
    employmentDates:
      claimed?.start
        ? `${claimed.start} to ${claimed.current ? "present" : claimed.end || ""}`
        : "",
    reasonForLeaving: claimed?.reasonForLeaving || "",
    detailsMatch: "",
    wouldReEmploy: "",
    reliability: "",
    reliabilityComment: "",
    safeguardingConcerns: "",
    safeguardingDetail: "",
    refereeJobTitle: referee.jobTitle || "",
    authorised: false,
    // character
    howLongKnown: referee.details?.howLongKnown || "",
    capacity: referee.details?.howKnown || "",
    notFamily: false,
    suitability: "",
    anyReasonNotToWork: "",
    anyReasonDetail: "",
    // both
    comments: "",
  });

  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | done | declined | error
  const [serverError, setServerError] = useState("");
  const [declining, setDeclining] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const set = (patch) => setV((p) => ({ ...p, ...patch }));

  const validate = () => {
    const e = {};
    if (isCharacter) {
      if (!v.howLongKnown.trim()) e.howLongKnown = "Please tell us how long you have known them.";
      if (!v.capacity.trim()) e.capacity = "Please tell us in what capacity.";
      if (!v.notFamily) e.notFamily = "Please confirm you are not a friend or family member.";
      if (!v.anyReasonNotToWork) e.anyReasonNotToWork = "Please answer this — it is the one we cannot leave blank.";
      if (v.anyReasonNotToWork === "Yes" && v.anyReasonDetail.trim().length < 5)
        e.anyReasonDetail = "Please tell us what the concern is.";
    } else {
      if (!v.detailsMatch) e.detailsMatch = "Please confirm or correct the employment details.";
      if (!v.wouldReEmploy) e.wouldReEmploy = "Please answer this.";
      if (!v.reliability) e.reliability = "Please give a rating.";
      if (!v.safeguardingConcerns) e.safeguardingConcerns = "Please answer this — it is the one we cannot leave blank.";
      if (v.safeguardingConcerns === "Yes" && v.safeguardingDetail.trim().length < 5)
        e.safeguardingDetail = "Please tell us what the concern is.";
      if (!v.refereeJobTitle.trim()) e.refereeJobTitle = "Please give your job title.";
      if (!v.authorised) e.authorised = "Please confirm you are authorised to give this reference.";
    }
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => document.getElementById("reference-errors")?.focus());
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/careers/reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, response: v }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setServerError("We could not send that. Please check your connection and try again.");
      setState("error");
    }
  };

  const decline = async () => {
    setState("sending");
    try {
      const res = await fetch("/api/careers/reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, decline: true, reason: declineReason }),
      });
      if (!res.ok) throw new Error();
      setState("declined");
    } catch {
      setServerError("We could not record that. Please email us instead.");
      setState("error");
    }
  };

  /* ------------------------------------------------------------------ */
  if (state === "done") {
    return (
      <div role="status" className="rounded-card border border-success/30 bg-successBg p-6 md:p-8">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-success">
          <Check aria-hidden="true" className="h-7 w-7" /> Thank you
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-text">
          Your reference for {applicant.fullName} has been sent to our
          recruitment team. There is nothing else you need to do, and we will
          not email you about this again.
        </p>
        <p className="mt-3 text-base leading-relaxed text-textMuted">
          If you gave this reference by mistake, or want to change something,
          call us on {site.business.phone} and quote {applicationReference}.
        </p>
      </div>
    );
  }

  if (state === "declined") {
    return (
      <div role="status" className="rounded-card border border-border bg-surface p-6 md:p-8">
        <h1 className="text-2xl font-bold text-primary-950">That is fine — thank you for telling us</h1>
        <p className="mt-3 text-lg leading-relaxed text-text">
          We have recorded that you would rather not give a reference for{" "}
          {applicant.fullName}. We will not email you about it again, and you do
          not need to do anything else.
        </p>
      </div>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-3xl font-bold text-primary-950">
        {isCharacter ? "Character reference" : "Reference request"}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-text">
        <strong>{applicant.fullName}</strong> has applied to work with{" "}
        {site.business.trading_name} as{" "}
        <strong>{applicant.role || "a care worker"}</strong> and named you as a
        referee.
      </p>

      <div className="mt-5 rounded-card border border-primary-200 bg-primary-50 p-5">
        <p className="text-base leading-relaxed text-text">
          This takes about three minutes. We are a CQC-registered care provider
          and the law requires us to take up references before someone can start
          work in care.
        </p>
        <p className="mt-2 text-base leading-relaxed text-text">
          We were given your details by {applicant.fullName} and use them only
          for this request.{" "}
          <a href="/privacy-policy" className="font-semibold text-primary-700 underline underline-offset-4">
            Read our privacy notice
          </a>
          .
        </p>
      </div>

      {errorList.length > 0 && (
        <div
          id="reference-errors"
          tabIndex={-1}
          role="alert"
          className="mt-6 rounded-card border-2 border-danger/50 bg-dangerBg p-5 focus:outline-none"
        >
          <h2 className="text-base font-bold text-danger">
            There {errorList.length === 1 ? "is 1 thing" : `are ${errorList.length} things`} to fix
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-text">
            {errorList.map(([k, m]) => <li key={k}>{m}</li>)}
          </ul>
        </div>
      )}

      {state === "error" && (
        <div role="alert" className="mt-6 rounded-card border-2 border-danger/50 bg-dangerBg p-5 text-base text-text">
          {serverError} You can also email us at {site.business.email}.
        </div>
      )}

      <div className="mt-8 space-y-7">
        {!isCharacter && (
          <>
            <fieldset className="rounded-card border border-border bg-white p-5 shadow-card">
              <legend className="px-2 text-base font-bold text-primary-950">
                What {applicant.fullName} told us
              </legend>
              <p className="mt-2 text-base leading-relaxed text-textMuted">
                Pre-filled from their application. Correct anything that is
                wrong — you do not need to remember the dates yourself.
              </p>
              <div className="mt-4 space-y-5">
                <Field id="jobTitle" label="Their job title"
                  value={v.jobTitle} onChange={(e) => set({ jobTitle: e.target.value })} />
                <Field id="employmentDates" label="Employment dates"
                  hint="For example: March 2025 to January 2026."
                  value={v.employmentDates} onChange={(e) => set({ employmentDates: e.target.value })} />
                <Field id="reasonForLeaving" label="Reason for leaving"
                  value={v.reasonForLeaving} onChange={(e) => set({ reasonForLeaving: e.target.value })} />
                <RadioGroup name="detailsMatch" legend="Are those details correct?" required
                  options={["Yes, that is right", "I have corrected them above", "I cannot confirm these"]}
                  columns value={v.detailsMatch} onChange={(val) => set({ detailsMatch: val })}
                  error={errors.detailsMatch} />
              </div>
            </fieldset>

            <RadioGroup name="wouldReEmploy" legend="Would you re-employ this person?" required
              options={RE_EMPLOY} value={v.wouldReEmploy} onChange={(val) => set({ wouldReEmploy: val })}
              error={errors.wouldReEmploy} />

            <RadioGroup name="reliability" legend="Reliability and attendance" required
              options={RATING} value={v.reliability} onChange={(val) => set({ reliability: val })}
              error={errors.reliability} />
            <Field id="reliabilityComment" as="textarea" rows={2}
              label="Anything to add about reliability?" hint="Optional."
              value={v.reliabilityComment} onChange={(e) => set({ reliabilityComment: e.target.value })} />
          </>
        )}

        {isCharacter && (
          <>
            <Field id="howLongKnown" label="How long have you known them?" required
              hint="For example: 6 years."
              value={v.howLongKnown} onChange={(e) => set({ howLongKnown: e.target.value })}
              error={errors.howLongKnown} />
            <Field id="capacity" label="In what capacity do you know them?" required
              hint="For example: I was their tutor, or they volunteered with me."
              value={v.capacity} onChange={(e) => set({ capacity: e.target.value })}
              error={errors.capacity} />

            <div>
              <div className="flex items-start gap-3">
                <input id="notFamily" type="checkbox" checked={v.notFamily}
                  onChange={(e) => set({ notFamily: e.target.checked })}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600" />
                <label htmlFor="notFamily" className="text-base leading-relaxed text-text">
                  I confirm I am not a friend or family member.
                  <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
              </div>
              {errors.notFamily && (
                <p role="alert" className="mt-1.5 text-base font-medium text-danger">
                  <span aria-hidden="true">⚠ </span>{errors.notFamily}
                </p>
              )}
            </div>

            <Field id="suitability" as="textarea" rows={4}
              label="Their honesty, reliability and suitability for care work"
              hint="A few sentences is plenty."
              value={v.suitability} onChange={(e) => set({ suitability: e.target.value })} />
          </>
        )}

        {/* The safeguarding question — the one that must not be skipped. */}
        <div className="rounded-card border-2 border-warning/50 bg-warningBg p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-warning" />
            <div className="w-full">
              <RadioGroup
                name={isCharacter ? "anyReasonNotToWork" : "safeguardingConcerns"}
                legend={
                  isCharacter
                    ? "Do you know of any reason this person should not work with vulnerable adults?"
                    : "Are you aware of any safeguarding concerns, disciplinary action, or any reason this person should not work with vulnerable adults?"
                }
                hint="We have to ask this of every referee. Answering yes does not automatically stop an application — it means we look into it properly."
                required
                options={YES_NO}
                value={isCharacter ? v.anyReasonNotToWork : v.safeguardingConcerns}
                onChange={(val) =>
                  set(isCharacter ? { anyReasonNotToWork: val } : { safeguardingConcerns: val })
                }
                error={isCharacter ? errors.anyReasonNotToWork : errors.safeguardingConcerns}
              />

              {(isCharacter ? v.anyReasonNotToWork : v.safeguardingConcerns) === "Yes" && (
                <div className="mt-4">
                  <Field
                    id={isCharacter ? "anyReasonDetail" : "safeguardingDetail"}
                    as="textarea"
                    rows={4}
                    required
                    label="Please tell us what the concern is"
                    hint="This goes only to our recruitment team. If you would rather say it on the phone, call us on 01788 422422."
                    value={isCharacter ? v.anyReasonDetail : v.safeguardingDetail}
                    onChange={(e) =>
                      set(isCharacter ? { anyReasonDetail: e.target.value } : { safeguardingDetail: e.target.value })
                    }
                    error={isCharacter ? errors.anyReasonDetail : errors.safeguardingDetail}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Field id="comments" as="textarea" rows={3}
          label="Anything else you would like to tell us?" hint="Optional."
          value={v.comments} onChange={(e) => set({ comments: e.target.value })} />

        {!isCharacter && (
          <>
            <Field id="refereeJobTitle" label="Your job title" required
              value={v.refereeJobTitle} onChange={(e) => set({ refereeJobTitle: e.target.value })}
              error={errors.refereeJobTitle} />
            <div>
              <div className="flex items-start gap-3">
                <input id="authorised" type="checkbox" checked={v.authorised}
                  onChange={(e) => set({ authorised: e.target.checked })}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600" />
                <label htmlFor="authorised" className="text-base leading-relaxed text-text">
                  I confirm I am authorised to give this reference on behalf of{" "}
                  {referee.organisation || "my organisation"}.
                  <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
              </div>
              {errors.authorised && (
                <p role="alert" className="mt-1.5 text-base font-medium text-danger">
                  <span aria-hidden="true">⚠ </span>{errors.authorised}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button type="submit" size="lg" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send this reference"}
        </Button>
      </div>

      {/* Declining, offered plainly. */}
      <div className="mt-8 rounded-card border border-border bg-surface p-5">
        {!declining ? (
          <p className="text-base leading-relaxed text-textMuted">
            Would rather not give a reference?{" "}
            <button type="button" onClick={() => setDeclining(true)}
              className="min-h-[44px] font-semibold text-primary-700 underline underline-offset-4">
              Tell us and we will stop asking
            </button>
            .
          </p>
        ) : (
          <div>
            <h2 className="text-base font-bold text-primary-950">
              You would rather not give a reference
            </h2>
            <p className="mt-2 text-base leading-relaxed text-textMuted">
              That is completely fine and you do not have to give a reason. We
              will stop emailing you about it.
            </p>
            <div className="mt-4">
              <Field id="declineReason" as="textarea" rows={2}
                label="Reason (optional)"
                value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={decline} disabled={state === "sending"}>
                Confirm — I would rather not
              </Button>
              <Button type="button" variant="ghost" onClick={() => setDeclining(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default ReferenceForm;
